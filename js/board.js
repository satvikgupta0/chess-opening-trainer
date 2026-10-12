import { getPieceSvg } from './pieces.js';
import { sound } from './sound.js';

/**
 * Responsive, accessible SVG chessboard component.
 * Supports click-to-move, drag-and-drop, touch controls, board flipping,
 * legal move indicators, hints, and custom animations.
 */
export class ChessboardUI {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.orientation = options.orientation || 'white';
    this.interactive = options.interactive !== false;
    this.showCoordinates = options.showCoordinates !== false;
    this.showLegalDots = options.showLegalDots !== false;
    this.onMoveAttempt = options.onMoveAttempt || (() => false);
    this.getLegalMoves = options.getLegalMoves || (() => []);
    this.getPieceAt = options.getPieceAt || (() => null);

    this.selectedSquare = null;
    this.legalDestinations = [];
    this.lastMove = null; // { from, to }
    this.hintSquare = null;
    this.checkSquare = null;
    this.currentPosition = {}; // map of 'e4' -> { type, color }

    // Drag state
    this.draggedSquare = null;
    this.dragGhost = null;

    this.initDOM();
    this.attachEventListeners();
  }

  initDOM() {
    this.container.innerHTML = '';
    this.container.classList.add('chessboard-wrapper');

    this.boardEl = document.createElement('div');
    this.boardEl.className = 'chessboard-grid';
    this.boardEl.setAttribute('role', 'grid');
    this.boardEl.setAttribute('aria-label', 'Chessboard');

    this.container.appendChild(this.boardEl);
  }

  setOrientation(color) {
    const newOrientation = color === 'black' ? 'black' : 'white';
    if (this.orientation !== newOrientation) {
      this.orientation = newOrientation;
      this.render();
    }
  }

  setInteractive(val) {
    this.interactive = !!val;
    if (!this.interactive) {
      this.clearSelection();
    }
  }

  setShowLegalDots(val) {
    this.showLegalDots = !!val;
    this.renderLegalDots();
  }

  /**
   * Set the board state from a map of square -> { type, color }
   * or extract it from a ChessEngine instance.
   */
  setPosition(pieceMapOrEngine) {
    if (pieceMapOrEngine && typeof pieceMapOrEngine.board === 'function') {
      const pieceMap = {};
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const boardArr = pieceMapOrEngine.board();
      for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
          const piece = boardArr[r][f];
          if (piece) {
            const sq = files[f] + (8 - r);
            pieceMap[sq] = { type: piece.type, color: piece.color };
          }
        }
      }
      this.currentPosition = pieceMap;
    } else {
      this.currentPosition = pieceMapOrEngine || {};
    }
    this.render();
  }

  setLastMove(from, to) {
    this.lastMove = (from && to) ? { from, to } : null;
    this.updateSquareClasses();
  }

  setCheckSquare(square) {
    this.checkSquare = square || null;
    this.updateSquareClasses();
  }

  setHintSquare(square) {
    this.hintSquare = square || null;
    this.updateSquareClasses();
  }

  clearSelection() {
    this.selectedSquare = null;
    this.legalDestinations = [];
    this.renderLegalDots();
    this.updateSquareClasses();
  }

  /**
   * Renders the 64 squares with pieces and coordinate labels.
   */
  render() {
    this.boardEl.innerHTML = '';

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

    const renderRanks = this.orientation === 'white'
      ? ranks.slice().reverse() // 8 to 1
      : ranks.slice(); // 1 to 8

    const renderFiles = this.orientation === 'white'
      ? files.slice() // a to h
      : files.slice().reverse(); // h to a

    renderRanks.forEach((rank, rIdx) => {
      renderFiles.forEach((file, fIdx) => {
        const squareName = file + rank;
        const fileNum = files.indexOf(file);
        const rankNum = ranks.indexOf(rank);
        const isDark = (fileNum + rankNum) % 2 === 0;

        const squareEl = document.createElement('div');
        squareEl.className = `chess-square ${isDark ? 'square-dark' : 'square-light'}`;
        squareEl.dataset.square = squareName;
        squareEl.setAttribute('role', 'gridcell');
        squareEl.setAttribute('aria-label', squareName);

        // Coordinate labels
        if (this.showCoordinates) {
          // Rank label on the first column of the row
          if (fIdx === 0) {
            const rankLabel = document.createElement('span');
            rankLabel.className = 'coord coord-rank';
            rankLabel.textContent = rank;
            squareEl.appendChild(rankLabel);
          }
          // File label on the bottom row
          if (rIdx === 7) {
            const fileLabel = document.createElement('span');
            fileLabel.className = 'coord coord-file';
            fileLabel.textContent = file;
            squareEl.appendChild(fileLabel);
          }
        }

        // Piece
        const piece = this.currentPosition[squareName];
        if (piece) {
          const pieceEl = document.createElement('div');
          pieceEl.className = 'chess-piece';
          pieceEl.dataset.piece = `${piece.color}${piece.type}`;
          pieceEl.innerHTML = getPieceSvg(piece.type, piece.color);
          pieceEl.setAttribute('aria-label', `${piece.color === 'w' ? 'White' : 'Black'} ${piece.type.toUpperCase()}`);
          squareEl.appendChild(pieceEl);
        }

        this.boardEl.appendChild(squareEl);
      });
    });

    this.updateSquareClasses();
    this.renderLegalDots();
  }

  updateSquareClasses() {
    const squares = this.boardEl.querySelectorAll('.chess-square');
    squares.forEach(sq => {
      const name = sq.dataset.square;
      sq.classList.toggle('is-selected', name === this.selectedSquare);
      sq.classList.toggle('is-last-from', this.lastMove && this.lastMove.from === name);
      sq.classList.toggle('is-last-to', this.lastMove && this.lastMove.to === name);
      sq.classList.toggle('is-hint', name === this.hintSquare);
      sq.classList.toggle('is-in-check', name === this.checkSquare);
    });
  }

  renderLegalDots() {
    // Clear old dots
    this.boardEl.querySelectorAll('.legal-target-dot, .legal-target-ring').forEach(el => el.remove());

    if (!this.showLegalDots || !this.selectedSquare || this.legalDestinations.length === 0) {
      return;
    }

    this.legalDestinations.forEach(dest => {
      const squareEl = this.boardEl.querySelector(`[data-square="${dest}"]`);
      if (!squareEl) return;

      const hasEnemyPiece = !!this.currentPosition[dest];
      const indicator = document.createElement('div');
      indicator.className = hasEnemyPiece ? 'legal-target-ring' : 'legal-target-dot';
      squareEl.appendChild(indicator);
    });
  }

  shakeSquare(square) {
    const squareEl = this.boardEl.querySelector(`[data-square="${square}"]`);
    if (squareEl) {
      squareEl.classList.add('square-shake');
      setTimeout(() => squareEl.classList.remove('square-shake'), 450);
    }
  }

  flashSuccess(square) {
    const squareEl = this.boardEl.querySelector(`[data-square="${square}"]`);
    if (squareEl) {
      squareEl.classList.add('square-success-flash');
      setTimeout(() => squareEl.classList.remove('square-success-flash'), 600);
    }
  }

  flashError(square) {
    const squareEl = this.boardEl.querySelector(`[data-square="${square}"]`);
    if (squareEl) {
      squareEl.classList.add('square-error-flash');
      setTimeout(() => squareEl.classList.remove('square-error-flash'), 600);
    }
  }

  /**
   * Selection and Move Handlers
   */
  handleSquareClick(square) {
    if (!this.interactive) return;

    const piece = this.currentPosition[square];

    // If already have a selected square
    if (this.selectedSquare) {
      // Clicking the same square deselects
      if (this.selectedSquare === square) {
        this.clearSelection();
        return;
      }

      // If clicked square is a legal destination
      if (this.legalDestinations.includes(square)) {
        const from = this.selectedSquare;
        const to = square;
        this.clearSelection();
        this.attemptMove(from, to);
        return;
      }

      // If clicked another own piece, select that instead
      const selectedPiece = this.currentPosition[this.selectedSquare];
      if (piece && selectedPiece && piece.color === selectedPiece.color) {
        this.selectSquare(square);
        return;
      }

      // Otherwise clear selection
      this.clearSelection();
      return;
    }

    // No square selected yet: select if piece exists
    if (piece) {
      this.selectSquare(square);
    }
  }

  selectSquare(square) {
    this.selectedSquare = square;
    const moves = this.getLegalMoves(square);
    this.legalDestinations = moves.map(m => m.to);
    this.updateSquareClasses();
    this.renderLegalDots();
  }

  attemptMove(from, to, promotion = 'q') {
    // Check if move is pawn promotion
    const piece = this.currentPosition[from];
    if (piece && piece.type === 'p') {
      const isWhitePromoting = piece.color === 'w' && to.endsWith('8');
      const isBlackPromoting = piece.color === 'b' && to.endsWith('1');
      if (isWhitePromoting || isBlackPromoting) {
        // Trigger promotion handler (defaults to Queen if not specified)
        promotion = 'q';
      }
    }

    const accepted = this.onMoveAttempt(from, to, promotion);
    return accepted;
  }

  /**
   * Event Listeners: Click & Drag-and-Drop (Pointer Events)
   */
  attachEventListeners() {
    // Square click handler
    this.boardEl.addEventListener('click', (e) => {
      const squareEl = e.target.closest('.chess-square');
      if (!squareEl) return;
      const square = squareEl.dataset.square;
      this.handleSquareClick(square);
    });

    // Pointer-based Drag & Drop
    this.boardEl.addEventListener('pointerdown', (e) => {
      if (!this.interactive || e.button !== 0) return;
      const pieceEl = e.target.closest('.chess-piece');
      if (!pieceEl) return;

      const squareEl = pieceEl.closest('.chess-square');
      if (!squareEl) return;

      const square = squareEl.dataset.square;
      const piece = this.currentPosition[square];
      if (!piece) return;

      this.draggedSquare = square;
      this.selectSquare(square);

      // Create ghost piece
      this.createDragGhost(piece, e.clientX, e.clientY);

      pieceEl.style.opacity = '0.35';

      const onPointerMove = (moveEvent) => {
        if (!this.dragGhost) return;
        this.dragGhost.style.left = `${moveEvent.clientX}px`;
        this.dragGhost.style.top = `${moveEvent.clientY}px`;
      };

      const onPointerUp = (upEvent) => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);

        if (pieceEl) {
          pieceEl.style.opacity = '';
        }
        this.removeDragGhost();

        if (!this.draggedSquare) return;

        // Find element under pointer
        const dropTarget = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
        const targetSquareEl = dropTarget ? dropTarget.closest('.chess-square') : null;

        if (targetSquareEl) {
          const targetSquare = targetSquareEl.dataset.square;
          if (targetSquare && targetSquare !== this.draggedSquare) {
            if (this.legalDestinations.includes(targetSquare)) {
              const from = this.draggedSquare;
              this.clearSelection();
              this.attemptMove(from, targetSquare);
              this.draggedSquare = null;
              return;
            }
          }
        }

        this.draggedSquare = null;
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    });
  }

  createDragGhost(piece, x, y) {
    this.removeDragGhost();
    this.dragGhost = document.createElement('div');
    this.dragGhost.className = 'chess-piece chess-drag-ghost';
    this.dragGhost.innerHTML = getPieceSvg(piece.type, piece.color);
    this.dragGhost.style.position = 'fixed';
    this.dragGhost.style.left = `${x}px`;
    this.dragGhost.style.top = `${y}px`;
    this.dragGhost.style.transform = 'translate(-50%, -50%) scale(1.1)';
    this.dragGhost.style.pointerEvents = 'none';
    this.dragGhost.style.zIndex = '9999';
    document.body.appendChild(this.dragGhost);
  }

  removeDragGhost() {
    if (this.dragGhost) {
      this.dragGhost.remove();
      this.dragGhost = null;
    }
  }

  destroy() {
    this.removeDragGhost();
    this.container.innerHTML = '';
  }
}
