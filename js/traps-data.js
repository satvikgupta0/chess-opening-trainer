/**
 * Curated, verified opening traps, common beginner blunders, and tactical motifs.
 * All move sequences are 100% legal according to standard FIDE rules.
 */

export const TRAPS = [
  {
    id: 'blackburne-shilling',
    name: 'Blackburne Shilling Gambit Trap',
    opening: 'Italian Game',
    eco: 'C50',
    theme: 'Greedy pawn grab & Queen counter-attack',
    summary: 'White greedily snaps up Black’s "free" e5 pawn, walking straight into a queen double-attack and smothered checkmate.',
    setupMoves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nd4'],
    blunderMove: 'Nxe5?',
    blunderExplanation: 'White sees an undefended pawn on e5 and thinks Black just blundered, failing to foresee Black’s ferocious 4... Qg5.',
    refutationMoves: ['Qg5', 'Nxf7', 'Qxg2', 'Rf1', 'Qxe4+', 'Be2', 'Nf3#'],
    tacticalExplanation: 'After 4. Nxe5? Qg5!, Black attacks the knight on e5 and the g2 pawn. White plays 5. Nxf7 forking queen and rook, but Black plays 5... Qxg2! threatening the h1 rook. If White defends with 6. Rf1, Black delivers 6... Qxe4+ 7. Be2 Nf3#—a stunning smothered mate in just 7 moves.',
    keyTakeaway: 'Never snatch central pawns when the opponent can launch a multi-piece queen double attack against your uncastled king.'
  },
  {
    id: 'legals-trap',
    name: 'Légal’s Pseudo-Sacrifice',
    opening: 'Italian / Philidor Defense',
    eco: 'C41',
    theme: 'Queen sacrifice leading to minor piece mate',
    summary: 'White sacrifices the queen to deliver an unstoppable minor-piece checkmate on Black’s uncastled king.',
    setupMoves: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4', 'Nc3', 'g6', 'Nxe5'],
    blunderMove: 'Bxd1??',
    blunderExplanation: 'Black greedily grabs White’s unprotected queen on d1, blinded to the rapid checkmating net being woven by White’s minor pieces.',
    refutationMoves: ['Bxf7+', 'Ke7', 'Nd5#'],
    tacticalExplanation: 'With 5. Nxe5!, White leaves the queen on d1 hanging. If Black blunders with 5... Bxd1??, White executes 6. Bxf7+ Ke7 7. Nd5#—checkmate by two knights and a bishop with White’s king never leaving home!',
    keyTakeaway: 'Material is subordinate to king safety and piece coordination. Never capture a queen on autopilot without checking king safety.'
  },
  {
    id: 'fried-liver-attack',
    name: 'Fried Liver Attack',
    opening: 'Two Knights Defense / Italian Game',
    eco: 'C57',
    theme: 'Sacrificial assault on the exposed king',
    summary: 'Black recaptures the d5 pawn with the knight instead of playing 5... Na5, allowing White to sacrifice on f7 and drag the king into the open.',
    setupMoves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5'],
    blunderMove: 'Nxd5?!',
    blunderExplanation: 'Recapturing with the knight seems natural to beginners, but it leaves f7 insufficiently defended against White’s knight sacrifice.',
    refutationMoves: ['Nxf7!', 'Kxf7', 'Qf3+', 'Ke6', 'Nc3'],
    tacticalExplanation: 'After 5... Nxd5?!, White plays 6. Nxf7! sacrificing the piece to rip the black king off e8. After 6... Kxf7 7. Qf3+ Ke6 8. Nc3, the black king is pinned and paralyzed in the center while White relentlessly adds attackers against d5.',
    keyTakeaway: 'In the Two Knights Defense, Black must play 5... Na5! to counterattack White’s bishop, rather than passively recapturing with 5... Nxd5.'
  },
  {
    id: 'noahs-ark-trap',
    name: 'Noah’s Ark Trap',
    opening: 'Ruy Lopez',
    eco: 'C71',
    theme: 'Pawn storm trapping the Spanish Bishop',
    summary: 'White brings the queen out prematurely to regain a pawn, allowing Black’s queenside pawns to completely trap the bishop on b3.',
    setupMoves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'd6', 'd4', 'b5', 'Bb3', 'Nxd4', 'Nxd4', 'exd4'],
    blunderMove: 'Qxd4?',
    blunderExplanation: 'White rushes to grab the d4 pawn with the queen, failing to notice that Black’s pawns will march forward and box the bishop in.',
    refutationMoves: ['c5', 'Qd5', 'Be6', 'Qc6+', 'Bd7', 'Qd5', 'c4!'],
    tacticalExplanation: 'After 8. Qxd4? c5! 9. Qd5 Be6 10. Qc6+ Bd7 11. Qd5 c4!, Black completely boxes White’s light-squared bishop in on b3. With no squares to escape to, White loses a whole piece.',
    keyTakeaway: 'Watch out for pawn avalanches trapping proud bishops on the b3 and b6 squares.'
  }
];

export function getAllTraps() {
  return TRAPS;
}

export function getTrapById(id) {
  return TRAPS.find(t => t.id === id) || null;
}
