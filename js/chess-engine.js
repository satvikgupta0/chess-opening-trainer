import { Chess } from 'chess.js';

/**
 * ChessEngine wraps chess.js to provide safe, consistent chess rules validation,
 * state representation, and notation helpers for the Chess Opening Trainer.
 */
export class ChessEngine {
  constructor(fen) {
    this.game = new Chess(fen);
  }

  /**
   * Resets the game to the standard starting position.
   */
  reset() {
    this.game.reset();
  }

  /**
   * Loads a specific FEN string. Returns boolean success.
   */
  loadFen(fen) {
    try {
      this.game.load(fen);
      return true;
    } catch (e) {
      console.error('Invalid FEN loaded:', fen, e);
      return false;
    }
  }

  /**
   * Current FEN position string.
   */
  fen() {
    return this.game.fen();
  }

  /**
   * Current side to move ('w' or 'b').
   */
  turn() {
    return this.game.turn();
  }

  /**
   * Full move number (e.g. 1, 2, 3...).
   */
  moveNumber() {
    return Math.floor(this.game.history().length / 2) + 1;
  }

  /**
   * Returns piece at the given square (e.g. 'e4'), or null.
   * Returns { type: 'p'|'n'|'b'|'r'|'q'|'k', color: 'w'|'b' }
   */
  get(square) {
    return this.game.get(square);
  }

  /**
   * Returns full 8x8 board representation.
   */
  board() {
    return this.game.board();
  }

  /**
   * Returns all legal moves from a given square (or all legal moves on board if square is omitted).
   */
  getLegalMoves(square = null) {
    try {
      if (square) {
        return this.game.moves({ square, verbose: true });
      }
      return this.game.moves({ verbose: true });
    } catch {
      return [];
    }
  }

  /**
   * Checks if moving from square to square is legal according to chess rules.
   */
  isValidMove(from, to, promotion = 'q') {
    const legalMoves = this.getLegalMoves(from);
    return legalMoves.some(m => m.from === from && m.to === to && (!m.promotion || m.promotion === promotion));
  }

  /**
   * Attempts to execute a move.
   * Accepts a SAN string (e.g. "Nf3") or a move object ({ from: 'g1', to: 'f3', promotion: 'q' }).
   * Returns the Move object if legal, or null if illegal.
   */
  move(moveInput) {
    try {
      return this.game.move(moveInput);
    } catch {
      return null;
    }
  }

  /**
   * Undoes the last move played.
   */
  undo() {
    return this.game.undo();
  }

  /**
   * Move history as SAN strings or verbose objects.
   */
  history(verbose = false) {
    return this.game.history({ verbose });
  }

  /**
   * Checks if current side is in check.
   */
  inCheck() {
    return this.game.inCheck();
  }

  /**
   * Checks if position is checkmate.
   */
  isCheckmate() {
    return this.game.isCheckmate();
  }

  /**
   * Checks if position is draw.
   */
  isDraw() {
    return this.game.isDraw();
  }

  /**
   * Checks if game has ended.
   */
  isGameOver() {
    return this.game.isGameOver();
  }

  /**
   * Creates an independent clone of the current engine state.
   */
  clone() {
    return new ChessEngine(this.fen());
  }
}
