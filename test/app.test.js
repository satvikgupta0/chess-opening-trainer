import assert from 'node:assert';
import { ChessEngine } from '../js/chess-engine.js';
import { OPENINGS, getAllOpenings, getOpeningById } from '../js/opening-data.js';
import { TRAPS, getAllTraps } from '../js/traps-data.js';
import { calculateAccuracy } from '../js/progress.js';
import { PIECE_SVGS, getPieceSvg } from '../js/pieces.js';

console.log('🧪 Starting Chess Opening Trainer Test Suite...\n');

// 1. Piece SVGs
console.log('Test 1: Piece SVG Graphics');
['P', 'p', 'N', 'n', 'B', 'b', 'R', 'r', 'Q', 'q', 'K', 'k'].forEach(p => {
  const svg = PIECE_SVGS[p];
  assert(svg && svg.includes('<svg'), `Missing or invalid SVG for piece: ${p}`);
});
assert.strictEqual(getPieceSvg('p', 'w'), PIECE_SVGS['P']);
assert.strictEqual(getPieceSvg('n', 'b'), PIECE_SVGS['n']);
console.log('  ✓ Piece SVGs verified for all 12 piece types.\n');

// 2. ChessEngine Legal & Illegal Moves
console.log('Test 2: ChessEngine move validation');
const engine = new ChessEngine();
assert.strictEqual(engine.turn(), 'w');
assert.strictEqual(engine.isValidMove('e2', 'e4'), true);
assert.strictEqual(engine.isValidMove('e2', 'e5'), false); // Illegal pawn leap
assert.strictEqual(engine.isValidMove('e1', 'e8'), false); // Illegal king move

// Test making a legal move
const m1 = engine.move('e4');
assert(m1 !== null, 'Legal move e4 should succeed');
assert.strictEqual(engine.turn(), 'b');
assert.strictEqual(engine.fen(), 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1');

// Test illegal move rejection without state corruption (Black cannot jump queen through pawns)
const mIllegal = engine.move('Qh5');
assert.strictEqual(mIllegal, null, 'Illegal move should return null');
assert.strictEqual(engine.turn(), 'b', 'Turn must remain Black after illegal move');

// Test undo
engine.undo();
assert.strictEqual(engine.turn(), 'w', 'Turn must return to White after undo');
console.log('  ✓ ChessEngine legal/illegal move checking and undo verified.\n');

// 3. Opening Lines Legality & Flow
console.log('Test 3: Opening lines integrity');
const openings = getAllOpenings();
assert.strictEqual(openings.length, 6, 'Should have 6 curated openings');

const requiredOpenings = ['italian-game', 'kings-indian-defense', 'pirc-defense'];
requiredOpenings.forEach(id => {
  const op = getOpeningById(id);
  assert(op !== null, `Required opening ${id} must exist`);
  assert(op.moves.length >= 6, `Opening ${id} must have at least 6 moves`);
  assert(op.mainIdeas.length >= 3, `Opening ${id} must have main ideas`);
  assert(op.commonMistakes.length >= 1, `Opening ${id} must have common mistakes`);
});

openings.forEach(op => {
  const opEngine = new ChessEngine();
  op.moves.forEach((step, idx) => {
    assert(step.san, `Step ${idx} in ${op.name} missing SAN`);
    assert(step.commentary, `Step ${idx} in ${op.name} missing commentary`);
    assert(step.hint, `Step ${idx} in ${op.name} missing hint`);

    const res = opEngine.move(step.san);
    assert(res !== null, `Move ${step.san} (ply ${step.ply}) in ${op.name} is illegal!`);
  });
  console.log(`  ✓ ${op.name} (${op.eco}) verified: all ${op.moves.length} moves 100% legal.`);
});
console.log('');

// 4. Common Traps Legality
console.log('Test 4: Common Traps verification');
const traps = getAllTraps();
assert(traps.length >= 4, 'Must have at least 4 common traps');

traps.forEach(trap => {
  const tEngine = new ChessEngine();
  // Setup moves
  trap.setupMoves.forEach(m => {
    const res = tEngine.move(m);
    assert(res !== null, `Trap setup move ${m} in ${trap.name} failed`);
  });
  // Blunder move
  const cleanBlunder = trap.blunderMove.replace(/[?!]/g, '');
  const blunderRes = tEngine.move(cleanBlunder);
  assert(blunderRes !== null, `Trap blunder move ${cleanBlunder} in ${trap.name} failed`);

  // Refutation moves
  trap.refutationMoves.forEach(m => {
    const cleanRef = m.replace(/[#!]/g, '');
    const refRes = tEngine.move(cleanRef);
    assert(refRes !== null, `Trap refutation move ${cleanRef} in ${trap.name} failed`);
  });

  assert(trap.tacticalExplanation, `Trap ${trap.name} missing tactical explanation`);
  assert(trap.keyTakeaway, `Trap ${trap.name} missing key takeaway`);
  console.log(`  ✓ ${trap.name} verified: full tactical sequence legal.`);
});
console.log('');

// 5. Accuracy Calculation Handling Zero Attempts & Division
console.log('Test 5: Accuracy & Progress calculations');
assert.strictEqual(calculateAccuracy(0, 0), 0, '0 attempts must return 0%');
assert.strictEqual(calculateAccuracy(null, null), 0, 'null must return 0%');
assert.strictEqual(calculateAccuracy(5, 10), 50, '5/10 must return 50%');
assert.strictEqual(calculateAccuracy(1, 3), 33, '1/3 must round to 33%');
assert.strictEqual(calculateAccuracy(10, 10), 100, '10/10 must return 100%');
console.log('  ✓ Accuracy calculations handle edge cases and zero division correctly.\n');

// 6. Storage Module Persistence & Reset Safety
console.log('Test 6: Storage module logic');
// Provide mock localStorage for Node environment
global.window = {
  localStorage: (() => {
    let store = {};
    return {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { store = {}; }
    };
  })()
};

const { storage } = await import('../js/storage.js');
// Default repertoire
assert.deepStrictEqual(storage.getRepertoire(), ['italian-game']);

// Add to repertoire
storage.addToRepertoire('kings-indian-defense');
assert.strictEqual(storage.isInRepertoire('kings-indian-defense'), true);

// Prevent duplicate
storage.addToRepertoire('kings-indian-defense');
assert.strictEqual(storage.getRepertoire().filter(id => id === 'kings-indian-defense').length, 1);

// Record attempt
storage.recordAttempt('italian-game', true);
storage.recordAttempt('italian-game', false);
const st = storage.getStats();
assert.strictEqual(st.totalAttempts, 2);
assert.strictEqual(st.correctAttempts, 1);
assert.strictEqual(st.incorrectAttempts, 1);

// Reset practice stats: MUST KEEP REPERTOIRE!
storage.resetPracticeStats();
const resetSt = storage.getStats();
assert.strictEqual(resetSt.totalAttempts, 0);
assert.strictEqual(storage.isInRepertoire('kings-indian-defense'), true, 'Repertoire MUST be preserved on resetPracticeStats');

// Reset everything: Clears repertoire back to default
storage.resetEverything();
assert.deepStrictEqual(storage.getRepertoire(), ['italian-game']);
console.log('  ✓ Storage operations, duplicate prevention, and separate reset safety verified.\n');

console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
