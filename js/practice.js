import { ChessEngine } from './chess-engine.js';
import { ChessboardUI } from './board.js';
import { getAllOpenings, getOpeningById } from './opening-data.js';
import { storage } from './storage.js';
import { sound } from './sound.js';
import { calculateAccuracy } from './progress.js';

/**
 * Controller for interactive opening drills, move validation,
 * prompt feedback, hints, and session tracking.
 */
export class PracticeController {
  constructor(containerEl) {
    this.container = containerEl;
    this.engine = new ChessEngine();
    this.opening = null;
    this.currentPlyIndex = 0;
    this.awaitingUserMove = false;
    this.hintLevel = 0;
    this.sessionStats = {
      attempts: 0,
      correct: 0,
      completed: false
    };

    // History snapshots for stepping back/forward
    this.historySnapshots = [];
    this.viewingHistoryIndex = -1;

    this.initBoard();
    this.initUIListeners();
  }

  initBoard() {
    const boardContainer = document.getElementById('practice-board-container');
    if (!boardContainer) return;

    this.board = new ChessboardUI(boardContainer, {
      orientation: 'white',
      interactive: true,
      showCoordinates: true,
      showLegalDots: storage.getSettings().showLegalDots,
      getLegalMoves: (square) => {
        if (!this.awaitingUserMove || this.viewingHistoryIndex !== -1) return [];
        return this.engine.getLegalMoves(square);
      },
      onMoveAttempt: (from, to, promotion) => {
        return this.handleUserMove(from, to, promotion);
      }
    });
  }

  initUIListeners() {
    // Opening dropdown selector
    const openingSelect = document.getElementById('practice-opening-select');
    if (openingSelect) {
      openingSelect.addEventListener('change', (e) => {
        this.startSession(e.target.value);
      });
    }

    // Hint button
    const hintBtn = document.getElementById('practice-hint-btn');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => this.handleHint());
    }

    // Show Solution button
    const solutionBtn = document.getElementById('practice-solution-btn');
    if (solutionBtn) {
      solutionBtn.addEventListener('click', () => this.handleShowSolution());
    }

    // Restart button
    const restartBtn = document.getElementById('practice-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        if (this.opening) this.startSession(this.opening.id);
      });
    }

    // Flip Board button
    const flipBtn = document.getElementById('practice-flip-btn');
    if (flipBtn) {
      flipBtn.addEventListener('click', () => {
        const newColor = this.board.orientation === 'white' ? 'black' : 'white';
        this.board.setOrientation(newColor);
      });
    }

    // Return to current move button (when viewing history)
    const returnBtn = document.getElementById('practice-return-btn');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => this.resumeCurrentMove());
    }
  }

  populateOpeningsDropdown() {
    const openingSelect = document.getElementById('practice-opening-select');
    if (!openingSelect) return;

    const openings = getAllOpenings();
    openingSelect.innerHTML = openings.map(op => {
      const selected = this.opening && this.opening.id === op.id ? 'selected' : '';
      return `<option value="${op.id}" ${selected}>${op.name} (${op.eco})</option>`;
    }).join('');
  }

  /**
   * Starts a new practice session for a given opening ID.
   */
  startSession(openingId) {
    const op = getOpeningById(openingId) || getAllOpenings()[0];
    this.opening = op;
    storage.setLastOpeningId(op.id);

    this.engine.reset();
    this.currentPlyIndex = 0;
    this.hintLevel = 0;
    this.awaitingUserMove = false;
    this.viewingHistoryIndex = -1;
    this.historySnapshots = [{
      ply: 0,
      san: 'Start',
      fen: this.engine.fen(),
      commentary: 'Initial starting position'
    }];

    this.sessionStats = {
      attempts: 0,
      correct: 0,
      completed: false
    };

    // Update board orientation to match player's side
    const playerOrientation = op.side === 'w' ? 'white' : 'black';
    this.board.setOrientation(playerOrientation);
    this.board.setPosition(this.engine);
    this.board.setLastMove(null, null);
    this.board.setHintSquare(null);
    this.board.setCheckSquare(null);

    // Sync UI elements
    this.populateOpeningsDropdown();
    this.updateOpeningHeader();
    this.updateScoreDisplay();
    this.renderMoveHistory();
    this.hideHistoryBanner();
    this.clearFeedback();

    // Begin practice step
    this.processNextStep();
  }

  updateOpeningHeader() {
    const titleEl = document.getElementById('practice-opening-title');
    const badgeEl = document.getElementById('practice-side-badge');
    const diffEl = document.getElementById('practice-difficulty-badge');

    if (titleEl && this.opening) {
      titleEl.textContent = `${this.opening.name} — ${this.opening.subtitle}`;
    }
    if (badgeEl && this.opening) {
      const isWhite = this.opening.side === 'w';
      badgeEl.textContent = isWhite ? 'Playing as White' : 'Playing as Black';
      badgeEl.className = `badge ${isWhite ? 'badge-white' : 'badge-black'}`;
    }
    if (diffEl && this.opening) {
      diffEl.textContent = this.opening.difficulty;
    }
  }

  updateScoreDisplay() {
    const scoreEl = document.getElementById('practice-session-score');
    if (!scoreEl) return;

    const { attempts, correct } = this.sessionStats;
    if (attempts === 0) {
      scoreEl.textContent = 'Session score: —';
    } else {
      const acc = calculateAccuracy(correct, attempts);
      scoreEl.textContent = `Score: ${correct}/${attempts} (${acc}%)`;
    }
  }

  clearFeedback() {
    const banner = document.getElementById('practice-feedback-banner');
    if (banner) {
      banner.className = 'feedback-banner feedback-neutral';
      banner.innerHTML = `<p class="feedback-text">Make your move on the board to practice.</p>`;
    }
  }

  setFeedback(type, title, message) {
    const banner = document.getElementById('practice-feedback-banner');
    if (!banner) return;

    banner.className = `feedback-banner feedback-${type}`;
    banner.innerHTML = `
      <div class="feedback-content">
        <h4 class="feedback-title">${title}</h4>
        <p class="feedback-text">${message}</p>
      </div>
    `;
  }

  /**
   * Advances the line: plays opponent moves automatically or prompts user.
   */
  processNextStep() {
    this.board.setHintSquare(null);
    this.hintLevel = 0;

    // Check if entire line has been completed
    if (this.currentPlyIndex >= this.opening.moves.length) {
      this.completeSession();
      return;
    }

    const currentMove = this.opening.moves[this.currentPlyIndex];
    const isUserTurn = currentMove.side === this.opening.side;

    if (isUserTurn) {
      // User's turn
      this.awaitingUserMove = true;
      this.board.setInteractive(true);
      this.updatePromptBanner(currentMove);
    } else {
      // Opponent's turn: play automatically after brief, natural pause
      this.awaitingUserMove = false;
      this.board.setInteractive(false);
      this.showOpponentThinkingBanner(currentMove);

      setTimeout(() => {
        this.playOpponentMove(currentMove);
      }, 700);
    }
  }

  showOpponentThinkingBanner(move) {
    const banner = document.getElementById('practice-feedback-banner');
    if (!banner) return;
    const opponentName = this.opening.side === 'w' ? 'Black' : 'White';
    banner.className = 'feedback-banner feedback-waiting';
    banner.innerHTML = `<p class="feedback-text">${opponentName} is responding...</p>`;
  }

  playOpponentMove(move) {
    const res = this.engine.move(move.san);
    if (!res) {
      console.error('Failed to make opponent move:', move);
      return;
    }

    // Play move sound
    if (res.captured) {
      sound.playCapture();
    } else {
      sound.playMove();
    }

    this.board.setPosition(this.engine);
    this.board.setLastMove(res.from, res.to);

    if (this.engine.inCheck()) {
      sound.playCheck();
    }

    // Add to history snapshots
    this.historySnapshots.push({
      ply: this.currentPlyIndex + 1,
      san: res.san,
      fen: this.engine.fen(),
      commentary: move.commentary
    });

    this.renderMoveHistory();
    this.currentPlyIndex++;

    // Advance to next move (which will be user's turn)
    this.processNextStep();
  }

  updatePromptBanner(move) {
    const moveNum = Math.floor(move.ply / 2) + (move.ply % 2 !== 0 ? 1 : 0);
    const sideName = move.side === 'w' ? 'White' : 'Black';

    this.setFeedback('prompt', `Move ${moveNum} • ${sideName} to Move`, `Find the next repertoire move for ${sideName}.`);
  }

  /**
   * Handles user's attempted move on the board.
   */
  handleUserMove(from, to, promotion = 'q') {
    if (!this.awaitingUserMove || this.viewingHistoryIndex !== -1) {
      return false;
    }

    const targetMove = this.opening.moves[this.currentPlyIndex];
    if (!targetMove) return false;

    // 1. Validate if move is legally valid in standard chess
    const isLegalInChess = this.engine.isValidMove(from, to, promotion);
    if (!isLegalInChess) {
      sound.playIncorrect();
      this.board.shakeSquare(from);
      this.setFeedback('warning', 'Illegal Chess Move', 'That move is not legal according to standard chess rules. Select a valid legal square.');
      return false;
    }

    // 2. Clone engine to test the SAN of the user's move
    const testEngine = this.engine.clone();
    const playedMove = testEngine.move({ from, to, promotion });
    if (!playedMove) return false;

    // 3. Compare with expected repertoire move
    const isCorrectOpeningMove = playedMove.san === targetMove.san ||
      (targetMove.acceptableAlternatives && targetMove.acceptableAlternatives.includes(playedMove.san));

    if (isCorrectOpeningMove) {
      // CORRECT MOVE!
      this.engine.move({ from, to, promotion });

      if (playedMove.captured) {
        sound.playCapture();
      } else {
        sound.playMove();
      }
      sound.playCorrect();

      this.board.setPosition(this.engine);
      this.board.setLastMove(playedMove.from, playedMove.to);
      this.board.flashSuccess(playedMove.to);

      // Record statistics
      storage.recordAttempt(this.opening.id, true);
      this.sessionStats.attempts++;
      this.sessionStats.correct++;
      this.updateScoreDisplay();

      // Push history
      this.historySnapshots.push({
        ply: this.currentPlyIndex + 1,
        san: playedMove.san,
        fen: this.engine.fen(),
        commentary: targetMove.commentary
      });
      this.renderMoveHistory();

      // Show positive reinforcement with tactical/strategic commentary
      this.setFeedback('success', `Correct! ${playedMove.san}`, targetMove.commentary);

      this.awaitingUserMove = false;
      this.currentPlyIndex++;

      // Check auto-advance setting
      const settings = storage.getSettings();
      const delay = settings.autoAdvance ? 1200 : 2500;
      setTimeout(() => {
        this.processNextStep();
      }, delay);

      return true;
    } else {
      // INCORRECT OPENING MOVE (Legal, but does not match repertoire)
      sound.playIncorrect();
      this.board.flashError(to);
      this.board.shakeSquare(to);

      storage.recordAttempt(this.opening.id, false);
      this.sessionStats.attempts++;
      this.updateScoreDisplay();

      this.setFeedback(
        'error',
        `${playedMove.san} is a legal move, but not the repertoire choice`,
        `In this line, another move is preferred. ${targetMove.hint} Try again or click "Hint".`
      );

      return false;
    }
  }

  /**
   * Provides progressive hints: first text clue, then square highlight.
   */
  handleHint() {
    if (!this.awaitingUserMove || this.currentPlyIndex >= this.opening.moves.length) {
      return;
    }

    const currentMove = this.opening.moves[this.currentPlyIndex];
    if (this.hintLevel === 0) {
      this.hintLevel = 1;
      this.setFeedback('hint', 'Strategic Clue', currentMove.hint);
    } else {
      this.hintLevel = 2;
      this.board.setHintSquare(currentMove.from);
      this.setFeedback(
        'hint',
        'Piece Highlighted',
        `Look closely at the piece highlighted on <strong>${currentMove.from}</strong>. ${currentMove.hint}`
      );
    }
  }

  /**
   * Shows the solution, plays it on the board, and lets the user advance.
   */
  handleShowSolution() {
    if (!this.awaitingUserMove || this.currentPlyIndex >= this.opening.moves.length) {
      return;
    }

    const targetMove = this.opening.moves[this.currentPlyIndex];

    // Play expected move
    const res = this.engine.move(targetMove.san);
    if (!res) return;

    sound.playMove();
    this.board.setPosition(this.engine);
    this.board.setLastMove(res.from, res.to);

    // Record as attempt without marking correct
    storage.recordAttempt(this.opening.id, false);
    this.sessionStats.attempts++;
    this.updateScoreDisplay();

    this.historySnapshots.push({
      ply: this.currentPlyIndex + 1,
      san: res.san,
      fen: this.engine.fen(),
      commentary: targetMove.commentary
    });
    this.renderMoveHistory();

    this.setFeedback(
      'solution',
      `Solution: ${targetMove.san}`,
      `${targetMove.commentary}`
    );

    this.awaitingUserMove = false;
    this.currentPlyIndex++;

    setTimeout(() => {
      this.processNextStep();
    }, 2000);
  }

  /**
   * Concludes practice session with summary.
   */
  completeSession() {
    this.sessionStats.completed = true;
    const { attempts, correct } = this.sessionStats;
    const acc = calculateAccuracy(correct, attempts);

    // Save session record
    storage.recordSession({
      openingId: this.opening.id,
      openingName: this.opening.name,
      totalMoves: attempts,
      correctMoves: correct,
      accuracy: acc
    });

    sound.playCorrect();

    this.setFeedback(
      'complete',
      'Opening Line Mastered! 🏁',
      `You completed all moves for the <strong>${this.opening.name}</strong> line with <strong>${acc}% accuracy</strong> (${correct}/${attempts} moves). Click "Restart Line" to drill again or choose another opening.`
    );

    const banner = document.getElementById('practice-feedback-banner');
    if (banner) {
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'complete-actions';
      actionsDiv.innerHTML = `
        <button class="btn btn-primary" id="btn-session-repeat">Drill Again</button>
        <button class="btn btn-outline" id="btn-session-library">Browse Library</button>
      `;
      banner.appendChild(actionsDiv);

      actionsDiv.querySelector('#btn-session-repeat').onclick = () => {
        this.startSession(this.opening.id);
      };
      actionsDiv.querySelector('#btn-session-library').onclick = () => {
        const libraryTab = document.getElementById('nav-library');
        if (libraryTab) libraryTab.click();
      };
    }
  }

  /**
   * Move history panel rendering and interactive inspection.
   */
  renderMoveHistory() {
    const listEl = document.getElementById('practice-history-list');
    if (!listEl) return;

    if (this.historySnapshots.length <= 1) {
      listEl.innerHTML = `<span class="history-empty">Game at starting position</span>`;
      return;
    }

    let html = '';
    for (let i = 1; i < this.historySnapshots.length; i += 2) {
      const moveNum = Math.floor(i / 2) + 1;
      const whiteMove = this.historySnapshots[i];
      const blackMove = this.historySnapshots[i + 1];

      const whiteActive = this.viewingHistoryIndex === i ? 'active-history-move' : '';
      const blackActive = this.viewingHistoryIndex === (i + 1) ? 'active-history-move' : '';

      html += `
        <div class="history-move-pair">
          <span class="history-num">${moveNum}.</span>
          <button class="history-san ${whiteActive}" data-hist-idx="${i}">${whiteMove ? whiteMove.san : ''}</button>
          ${blackMove ? `<button class="history-san ${blackActive}" data-hist-idx="${i + 1}">${blackMove.san}</button>` : ''}
        </div>
      `;
    }

    listEl.innerHTML = html;
    listEl.scrollTop = listEl.scrollHeight;

    listEl.querySelectorAll('.history-san').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.histIdx, 10);
        this.inspectHistorySnapshot(idx);
      });
    });
  }

  inspectHistorySnapshot(index) {
    if (index < 0 || index >= this.historySnapshots.length) return;
    this.viewingHistoryIndex = index;
    const snap = this.historySnapshots[index];

    const tempEngine = new ChessEngine(snap.fen);
    this.board.setPosition(tempEngine);
    this.board.clearSelection();
    this.showHistoryBanner(snap);
    this.renderMoveHistory();
  }

  showHistoryBanner(snap) {
    const banner = document.getElementById('practice-history-banner');
    if (banner) {
      banner.classList.remove('hidden');
      const textEl = document.getElementById('practice-history-banner-text');
      if (textEl) {
        textEl.innerHTML = `Viewing move <strong>${snap.san}</strong> (Read-only)`;
      }
    }
  }

  hideHistoryBanner() {
    const banner = document.getElementById('practice-history-banner');
    if (banner) {
      banner.classList.add('hidden');
    }
  }

  resumeCurrentMove() {
    this.viewingHistoryIndex = -1;
    this.board.setPosition(this.engine);
    this.hideHistoryBanner();
    this.renderMoveHistory();
  }
}
