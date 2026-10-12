/**
 * Curated opening library containing verified move sequences, strategic explanations,
 * beginner tips, and practice drill definitions.
 */

export const OPENINGS = [
  {
    id: 'italian-game',
    name: 'Italian Game',
    subtitle: 'Giuoco Piano Classical Variation',
    eco: 'C50',
    side: 'w',
    difficulty: 'Beginner',
    movesCount: 12, // 6 full moves (12 half-moves / plies)
    description: 'One of the oldest and most principled chess openings. White develops rapidly towards the center and aims the light-squared bishop at Black’s sensitive f7 weakness.',
    mainIdeas: [
      'Rapid development of kingside pieces (Nf3, Bc4) to prepare early castling.',
      'Direct diagonal pressure on f7, the only square defended solely by Black’s king.',
      'Controlling the critical central d5 square.',
      'Building a broad pawn center with c3 and d4 after piece coordination.'
    ],
    commonMistakes: [
      {
        mistake: 'Pushing 3. d4 too hastily',
        explanation: 'Advancing d4 before developing the light-squared bishop reduces White’s piece pressure on f7 and often liquidates the central tension prematurely.'
      },
      {
        mistake: 'Neglecting kingside castling',
        explanation: 'Leaving the king on e1 while launching early tactical skirmishes leaves White vulnerable to counter-attacks along the open e-file.'
      },
      {
        mistake: 'Falling for the Blackburne Shilling Gambit (3... Nd4)',
        explanation: 'Grabbing the free e5 pawn with 4. Nxe5? allows Black’s devastating 4... Qg5!, attacking the knight and g2 pawn.'
      }
    ],
    moves: [
      {
        ply: 1,
        san: 'e4',
        from: 'e2',
        to: 'e4',
        side: 'w',
        commentary: 'White stakes an immediate claim in the center, staking out d5 and f5 while opening diagonals for both the queen and the light-squared bishop.',
        hint: 'Establish your presence in the center by advancing your king pawn two squares.'
      },
      {
        ply: 2,
        san: 'e5',
        from: 'e7',
        to: 'e5',
        side: 'b',
        commentary: 'Black mirrors White’s central advance, halting White’s pawn from claiming more territory and opening routes for Black’s pieces.',
        hint: 'Opponent mirrors central control.'
      },
      {
        ply: 3,
        san: 'Nf3',
        from: 'g1',
        to: 'f3',
        side: 'w',
        commentary: 'A textbook developing move: White activates the kingside knight toward the center, pressures Black’s undefended e5 pawn, and clears kingside castling.',
        hint: 'Develop a minor piece toward the center while directly attacking Black’s undefended e5 pawn.'
      },
      {
        ply: 4,
        san: 'Nc6',
        from: 'b8',
        to: 'c6',
        side: 'b',
        commentary: 'Black naturally develops the queenside knight to guard the e5 pawn while exerting control over d4 and e5.',
        hint: 'Opponent defends the attacked e5 pawn.'
      },
      {
        ply: 5,
        san: 'Bc4',
        from: 'f1',
        to: 'c4',
        side: 'w',
        commentary: 'The hallmark of the Italian Game! The bishop occupies a menacing diagonal, taking direct aim at Black’s vulnerable f7 pawn and controlling the central d5 outpost.',
        hint: 'Activate your light-squared bishop to a square targeting Black’s weakest kingside point (f7).'
      },
      {
        ply: 6,
        san: 'Bc5',
        from: 'f8',
        to: 'c5',
        side: 'b',
        commentary: 'Black chooses the Classical Giuoco Piano, developing the dark-squared bishop to an active outpost that challenges d4 and pins nothing.',
        hint: 'Opponent mirrors development with their dark-squared bishop.'
      },
      {
        ply: 7,
        san: 'c3',
        from: 'c2',
        to: 'c3',
        side: 'w',
        commentary: 'A strategic, classical preparation. White lays the groundwork to build a full pawn center with d4, while denying Black’s knight access to the d4 square.',
        hint: 'Prepare to seize the full center with d4 by supporting it with a queenside pawn.'
      },
      {
        ply: 8,
        san: 'Nf6',
        from: 'g8',
        to: 'f6',
        side: 'b',
        commentary: 'Black counter-attacks White’s e4 pawn while preparing kingside castling.',
        hint: 'Opponent attacks your e4 pawn with their knight.'
      },
      {
        ply: 9,
        san: 'd3',
        from: 'd2',
        to: 'd3',
        side: 'w',
        commentary: 'The solid Giuoco Pianissimo ("Quiet Game"). White securely protects e4, solidifies the pawn structure, and opens the diagonal for the dark-squared bishop.',
        hint: 'Solidify your central e4 pawn with a quiet pawn move that frees your c1 bishop.'
      },
      {
        ply: 10,
        san: 'd6',
        from: 'd7',
        to: 'd6',
        side: 'b',
        commentary: 'Black reciprocates by supporting e5 and freeing the c8 bishop.',
        hint: 'Opponent solidifies their pawn chain.'
      },
      {
        ply: 11,
        san: 'O-O',
        from: 'e1',
        to: 'g1',
        side: 'w',
        commentary: 'Castling secures the white king behind a wall of pawns and activates the f1 rook toward the central battle.',
        hint: 'Tuck your king into safety on the kingside and activate your rook.'
      },
      {
        ply: 12,
        san: 'O-O',
        from: 'e8',
        to: 'g8',
        side: 'b',
        commentary: 'Black also castles kingside. Both sides have achieved harmonious, classical development.',
        hint: 'Opponent completes kingside castling.'
      }
    ]
  },
  {
    id: 'kings-indian-defense',
    name: 'King’s Indian Defense',
    subtitle: 'Classical Variation Setup',
    eco: 'E61',
    side: 'b',
    difficulty: 'Intermediate',
    movesCount: 12,
    description: 'A dynamic hypermodern weapon against 1. d4. Black invites White to occupy the center with pawns, fianchettoes the dark-squared bishop to g7, and prepares a sharp central counter-strike.',
    mainIdeas: [
      'Allowing White full central pawn presence (d4, c4, e4) to later counter-attack it.',
      'Kingside fianchetto (...g6, ...Bg7) providing immense diagonal pressure along the long dark diagonal.',
      'Executing a timely pawn lever with ...e5 (or ...c5) to challenge White’s center.',
      'Flexible, asymmetrical pawn structures leading to rich attacking opportunities.'
    ],
    commonMistakes: [
      {
        mistake: 'Prematurely opening the center before castling',
        explanation: 'Pushing ...e5 before completing ...Bg7 and ...O-O exposes Black’s king to queenside and central pin tactics.'
      },
      {
        mistake: 'Failing to contest White’s space advantage',
        explanation: 'Playing too passively without executing the ...e5 or ...c5 pawn break allows White to completely suffocate Black’s pieces.'
      },
      {
        mistake: 'Blocking the g7 bishop with ...e6',
        explanation: 'Pawn on e6 blunts Black’s own dragon bishop on g7 and creates dark-square weaknesses on the kingside.'
      }
    ],
    moves: [
      {
        ply: 1,
        san: 'd4',
        from: 'd2',
        to: 'd4',
        side: 'w',
        commentary: 'White stakes claim in the center with the queen pawn.',
        hint: 'White opens with the queen pawn.'
      },
      {
        ply: 2,
        san: 'Nf6',
        from: 'g8',
        to: 'f6',
        side: 'b',
        commentary: 'Black prevents White from playing an immediate 2. e4, while flexibly developing a kingside piece.',
        hint: 'Develop your kingside knight to stop White from easily playing e4.'
      },
      {
        ply: 3,
        san: 'c4',
        from: 'c2',
        to: 'c4',
        side: 'w',
        commentary: 'White claims additional queenside space and controls the d5 square.',
        hint: 'White claims space with the c-pawn.'
      },
      {
        ply: 4,
        san: 'g6',
        from: 'g7',
        to: 'g6',
        side: 'b',
        commentary: 'The foundation of the King’s Indian. Black prepares to fianchetto the bishop on g7 to control the vital long diagonal (h8–a1).',
        hint: 'Prepare the kingside fianchetto by moving your g-pawn one square.'
      },
      {
        ply: 5,
        san: 'Nc3',
        from: 'b1',
        to: 'c3',
        side: 'w',
        commentary: 'White develops the queenside knight and prepares e4.',
        hint: 'White develops a knight to prepare e4.'
      },
      {
        ply: 6,
        san: 'Bg7',
        from: 'f8',
        to: 'g7',
        side: 'b',
        commentary: 'The "King’s Indian Bishop" takes its post on g7. From here, it exerts laser-like pressure down the long diagonal across the entire board.',
        hint: 'Complete the fianchetto by posting your bishop onto the long dark diagonal.'
      },
      {
        ply: 7,
        san: 'e4',
        from: 'e2',
        to: 'e4',
        side: 'w',
        commentary: 'White takes full classical pawn dominance in the center with pawns on c4, d4, and e4.',
        hint: 'White seizes the full pawn center.'
      },
      {
        ply: 8,
        san: 'd6',
        from: 'd7',
        to: 'd6',
        side: 'b',
        commentary: 'Crucial restraint. Black stops White’s e4 pawn from marching forward to e5, while preparing the future ...e5 counter-strike.',
        hint: 'Prevent White’s e-pawn from advancing to e5 with a solid queen-pawn step.'
      },
      {
        ply: 9,
        san: 'Nf3',
        from: 'g1',
        to: 'f3',
        side: 'w',
        commentary: 'White develops the knight naturally and prepares kingside castling.',
        hint: 'White develops the kingside knight.'
      },
      {
        ply: 10,
        san: 'O-O',
        from: 'e8',
        to: 'g8',
        side: 'b',
        commentary: 'Black safeguards the king before initiating central warfare.',
        hint: 'Bring your king to safety behind the fianchettoed pawn shield.'
      },
      {
        ply: 11,
        san: 'Be2',
        from: 'f1',
        to: 'e2',
        side: 'w',
        commentary: 'The classical deployment. White develops the bishop calmly and readies castling.',
        hint: 'White develops the light-squared bishop.'
      },
      {
        ply: 12,
        san: 'e5',
        from: 'e7',
        to: 'e5',
        side: 'b',
        commentary: 'The thematic King’s Indian central strike! Black directly attacks White’s d4 pawn, challenging White’s central space.',
        hint: 'Strike at the heart of White’s center by advancing your e-pawn to challenge d4.'
      }
    ]
  },
  {
    id: 'pirc-defense',
    name: 'Pirc Defense',
    subtitle: 'Mainline Classical System',
    eco: 'B07',
    side: 'b',
    difficulty: 'Intermediate',
    movesCount: 12,
    description: 'A flexible, counterattacking defense against 1. e4. Black adopts a hypermodern setup with an early ...d6, ...Nf6, and ...g6, planning to counterattack White’s broad center from the flanks.',
    mainIdeas: [
      'Allowing White to establish pawns on e4 and d4, then attacking the central overextension.',
      'Fianchettoing the dark-squared bishop to g7 to anchor the kingside and pressure d4.',
      'Provoking White into overextending with moves like e5 or f4, then finding tactical levers.',
      'Flexible options for counterplay: ...c6 followed by ...b5, or central thrusts with ...c5 or ...e5.'
    ],
    commonMistakes: [
      {
        mistake: 'Playing passively without central counterplay',
        explanation: 'Without a concrete plan to challenge d4 or e4, White will comfortably establish commanding space and launch a kingside pawn storm.'
      },
      {
        mistake: 'Allowing an unchecked Austrian Attack pawn avalanche',
        explanation: 'When White plays 4. f4, Black must handle central defense with precision, avoiding hasty piece moves that walk into e5 pawn forks.'
      },
      {
        mistake: 'Prematurely trading dark-squared bishops',
        explanation: 'Allowing White to trade Black’s g7 bishop with Qd2 and Bh6 leaves gaping dark-square holes around Black’s king.'
      }
    ],
    moves: [
      {
        ply: 1,
        san: 'e4',
        from: 'e2',
        to: 'e4',
        side: 'w',
        commentary: 'White opens with the king pawn.',
        hint: 'White begins with 1. e4.'
      },
      {
        ply: 2,
        san: 'd6',
        from: 'd7',
        to: 'd6',
        side: 'b',
        commentary: 'The defining first step of the Pirc Defense. Black controls c5 and e5, stopping White’s pawn from rolling forward.',
        hint: 'Control key central squares with a flexible queen pawn move.'
      },
      {
        ply: 3,
        san: 'd4',
        from: 'd2',
        to: 'd4',
        side: 'w',
        commentary: 'White eagerly occupies the full center with both pawns.',
        hint: 'White establishes pawns on e4 and d4.'
      },
      {
        ply: 4,
        san: 'Nf6',
        from: 'g8',
        to: 'f6',
        side: 'b',
        commentary: 'Black develops the knight with tempo, immediately attacking White’s undefended pawn on e4.',
        hint: 'Develop your kingside knight to attack White’s e4 pawn.'
      },
      {
        ply: 5,
        san: 'Nc3',
        from: 'b1',
        to: 'c3',
        side: 'w',
        commentary: 'White defends the e4 pawn with the knight.',
        hint: 'White protects e4 by developing the queenside knight.'
      },
      {
        ply: 6,
        san: 'g6',
        from: 'g7',
        to: 'g6',
        side: 'b',
        commentary: 'Black prepares the characteristic kingside fianchetto to place the bishop on the long dark diagonal.',
        hint: 'Prepare your bishop fianchetto with a g-pawn step.'
      },
      {
        ply: 7,
        san: 'Nf3',
        from: 'g1',
        to: 'f3',
        side: 'w',
        commentary: 'White chooses classical piece harmony, developing the kingside knight.',
        hint: 'White develops the knight towards the center.'
      },
      {
        ply: 8,
        san: 'Bg7',
        from: 'f8',
        to: 'g7',
        side: 'b',
        commentary: 'The bishop reaches g7, eyeing the central dark squares d4 and e5.',
        hint: 'Fianchetto your bishop onto g7.'
      },
      {
        ply: 9,
        san: 'Be2',
        from: 'f1',
        to: 'e2',
        side: 'w',
        commentary: 'White develops calmly, preparing kingside castling.',
        hint: 'White develops the bishop.'
      },
      {
        ply: 10,
        san: 'O-O',
        from: 'e8',
        to: 'g8',
        side: 'b',
        commentary: 'Black completes kingside castling, securing the king.',
        hint: 'Castle your king to safety on the kingside.'
      },
      {
        ply: 11,
        san: 'O-O',
        from: 'e1',
        to: 'g1',
        side: 'w',
        commentary: 'White also castles kingside.',
        hint: 'White castles.'
      },
      {
        ply: 12,
        san: 'c6',
        from: 'c7',
        to: 'c6',
        side: 'b',
        commentary: 'A classic Pirc maneuver. Black controls the b5 and d5 squares, and prepares queenside counterplay with ...b5 or ...Qa5.',
        hint: 'Support queenside expansion and restrict White’s knights with a pawn move to c6.'
      }
    ]
  },
  {
    id: 'queens-gambit-declined',
    name: 'Queen’s Gambit Declined',
    subtitle: 'Orthodox Defense',
    eco: 'D35',
    side: 'w',
    difficulty: 'Beginner',
    movesCount: 12,
    description: 'The bedrock of classical chess strategy. White offers the c4 pawn to pull Black away from the center; Black declines, maintaining a rock-solid stronghold on d5.',
    mainIdeas: [
      'Challenging Black’s d5 anchor with the c4 pawn.',
      'Rapid piece coordination with Nc3, Nf3, and active bishop placement.',
      'Exerting central pressure along the c-file and d-file.',
      'Black’s main challenge is liberating the passive light-squared bishop on c8.'
    ],
    commonMistakes: [
      {
        mistake: 'Black trying to hold the gambit pawn with ...b5',
        explanation: 'If Black accepts 2... dxc4 and tries to cling to the pawn with ...b5, White quickly shatters Black’s queenside with a4 and dominates development.'
      },
      {
        mistake: 'White neglecting kingside development',
        explanation: 'Spending too many tempi on queenside operations before castling leaves the white king exposed to central counterplay.'
      }
    ],
    moves: [
      {
        ply: 1,
        san: 'd4',
        from: 'd2',
        to: 'd4',
        side: 'w',
        commentary: 'White claims the center with the queen pawn.',
        hint: 'Stake your claim in the center with the queen pawn.'
      },
      {
        ply: 2,
        san: 'd5',
        from: 'd7',
        to: 'd5',
        side: 'b',
        commentary: 'Black meets White head-on in the center.',
        hint: 'Opponent matches your central pawn.'
      },
      {
        ply: 3,
        san: 'c4',
        from: 'c2',
        to: 'c4',
        side: 'w',
        commentary: 'The Queen’s Gambit! White attacks Black’s d5 pawn from the flank, aiming to trade a flank pawn for a central pawn.',
        hint: 'Offer the flank c-pawn to challenge Black’s central foothold.'
      },
      {
        ply: 4,
        san: 'e6',
        from: 'e7',
        to: 'e6',
        side: 'b',
        commentary: 'Black declines the gambit and reinforces d5 with the e-pawn, creating a solid pawn chain.',
        hint: 'Black reinforces the d5 pawn.'
      },
      {
        ply: 5,
        san: 'Nc3',
        from: 'b1',
        to: 'c3',
        side: 'w',
        commentary: 'White develops the knight to put direct pressure on Black’s d5 pawn and fight for e4.',
        hint: 'Develop your queenside knight to increase pressure on d5.'
      },
      {
        ply: 6,
        san: 'Nf6',
        from: 'g8',
        to: 'f6',
        side: 'b',
        commentary: 'Black naturally reinforces d5 and prepares kingside development.',
        hint: 'Black develops the knight to guard d5.'
      },
      {
        ply: 7,
        san: 'Bg5',
        from: 'c1',
        to: 'g5',
        side: 'w',
        commentary: 'An active pin! White pins Black’s knight to the queen, indirectly undermining the defense of d5.',
        hint: 'Develop your dark-squared bishop to pin Black’s knight against the queen.'
      },
      {
        ply: 8,
        san: 'Be7',
        from: 'f8',
        to: 'e7',
        side: 'b',
        commentary: 'Black breaks the pin on the knight and prepares kingside castling.',
        hint: 'Black unpins the knight.'
      },
      {
        ply: 9,
        san: 'e3',
        from: 'e2',
        to: 'e3',
        side: 'w',
        commentary: 'White solidifies the c4 pawn, supports the d4 center, and opens a path for the f1 bishop.',
        hint: 'Support your c4 pawn and open the diagonal for your light-squared bishop.'
      },
      {
        ply: 10,
        san: 'O-O',
        from: 'e8',
        to: 'g8',
        side: 'b',
        commentary: 'Black castles kingside into safety.',
        hint: 'Black castles.'
      },
      {
        ply: 11,
        san: 'Nf3',
        from: 'g1',
        to: 'f3',
        side: 'w',
        commentary: 'Harmonious development. White develops the kingside knight to control e5 and d4.',
        hint: 'Develop your kingside knight to complete minor piece development.'
      },
      {
        ply: 12,
        san: 'Nbd7',
        from: 'b8',
        to: 'd7',
        side: 'b',
        commentary: 'Black develops the remaining knight to support c5 or e5 pawn breaks.',
        hint: 'Black connects their knights.'
      }
    ]
  },
  {
    id: 'sicilian-defense',
    name: 'Sicilian Defense',
    subtitle: 'Open Sicilian Classical / Najdorf Setup',
    eco: 'B90',
    side: 'b',
    difficulty: 'Intermediate',
    movesCount: 12,
    description: 'The most popular and aggressive response to 1. e4. Black fights asymmetrically for the center by challenging d4 from the c-file, leading to rich, unbalanced tactical battles.',
    mainIdeas: [
      'Creating an asymmetric pawn structure from move one.',
      'Trading Black’s flank c-pawn for White’s central d-pawn to gain a central pawn majority.',
      'Control of the half-open c-file for queenside pressure.',
      'Controlling the key b5 and d5 squares with ...a6.'
    ],
    commonMistakes: [
      {
        mistake: 'Allowing White an uncontested d5 outpost',
        explanation: 'Failing to contest the d5 square allows White’s pieces to dominate the center with impunity.'
      },
      {
        mistake: 'Lagging behind in kingside development',
        explanation: 'Over-focusing on queenside pawn pushes while White mounts a fierce kingside attack is a frequent cause of quick miniatures.'
      }
    ],
    moves: [
      {
        ply: 1,
        san: 'e4',
        from: 'e2',
        to: 'e4',
        side: 'w',
        commentary: 'White begins with 1. e4.',
        hint: 'White opens with the king pawn.'
      },
      {
        ply: 2,
        san: 'c5',
        from: 'c7',
        to: 'c5',
        side: 'b',
        commentary: 'The Sicilian Defense! Black contests the d4 square without creating a symmetrical mirror position.',
        hint: 'Fight for the d4 square from the flank with your c-pawn.'
      },
      {
        ply: 3,
        san: 'Nf3',
        from: 'g1',
        to: 'f3',
        side: 'w',
        commentary: 'White prepares the thematic 3. d4 pawn thrust.',
        hint: 'White prepares to open the center.'
      },
      {
        ply: 4,
        san: 'd6',
        from: 'd7',
        to: 'd6',
        side: 'b',
        commentary: 'Black controls e5 and c5, stopping White from advancing e4-e5 in the future.',
        hint: 'Control central squares and prevent e5 with your d-pawn.'
      },
      {
        ply: 5,
        san: 'd4',
        from: 'd2',
        to: 'd4',
        side: 'w',
        commentary: 'White blows the center open with the Open Sicilian strike.',
        hint: 'White advances d4.'
      },
      {
        ply: 6,
        san: 'cxd4',
        from: 'c5',
        to: 'd4',
        side: 'b',
        commentary: 'The core transaction of the Sicilian: Black swaps a flank pawn for White’s central d-pawn.',
        hint: 'Capture White’s central pawn on d4.'
      },
      {
        ply: 7,
        san: 'Nxd4',
        from: 'f3',
        to: 'd4',
        side: 'w',
        commentary: 'White recaptures with the knight.',
        hint: 'White recaptures on d4.'
      },
      {
        ply: 8,
        san: 'Nf6',
        from: 'g8',
        to: 'f6',
        side: 'b',
        commentary: 'Black develops with tempo, attacking White’s e4 pawn.',
        hint: 'Develop your kingside knight while attacking White’s undefended e4 pawn.'
      },
      {
        ply: 9,
        san: 'Nc3',
        from: 'b1',
        to: 'c3',
        side: 'w',
        commentary: 'White protects the e4 pawn with the knight.',
        hint: 'White defends e4.'
      },
      {
        ply: 10,
        san: 'a6',
        from: 'a7',
        to: 'a6',
        side: 'b',
        commentary: 'The hallmark move of the Najdorf Variation! Black guards b5 against both white knights and the light-squared bishop, preparing queenside expansion with ...b5.',
        hint: 'Deny White’s knights and bishop access to b5 with a subtle queenside pawn push.'
      },
      {
        ply: 11,
        san: 'Be3',
        from: 'c1',
        to: 'e3',
        side: 'w',
        commentary: 'The English Attack setup. White prepares Qd2 and kingside pawn storming.',
        hint: 'White develops the dark-squared bishop.'
      },
      {
        ply: 12,
        san: 'e5',
        from: 'e7',
        to: 'e5',
        side: 'b',
        commentary: 'The daring Najdorf counter-strike! Black kicks the d4 knight and claims space, accepting a backward d6 pawn in exchange for dynamic piece play.',
        hint: 'Dislodge White’s central knight by thrusting your e-pawn forward.'
      }
    ]
  },
  {
    id: 'ruy-lopez',
    name: 'Ruy Lopez',
    subtitle: 'Spanish Opening — Morphy Defense',
    eco: 'C70',
    side: 'w',
    difficulty: 'Intermediate',
    movesCount: 14,
    description: 'One of the most deeply studied and respected openings in chess history. White develops the bishop to b5 to indirectly pressure Black’s e5 pawn by pinning the defending c6 knight.',
    mainIdeas: [
      'Indirect pressure on e5 by attacking the knight that protects it.',
      'Slow, strategic maneuvering to control the center.',
      'Preserving the Spanish bishop on b3 to target Black’s kingside.',
      'Building towards the c3 and d4 pawn center.'
    ],
    commonMistakes: [
      {
        mistake: 'Panic trading on c6 too early',
        explanation: 'Playing 4. Bxc6 (Exchange Variation) surrenders the bishop pair without concrete positional justification.'
      },
      {
        mistake: 'Allowing the Noah’s Ark Trap',
        explanation: 'Letting Black trap the b3 bishop with ...c5 and ...c4 when the d4 pawn is prematurely liquidated.'
      }
    ],
    moves: [
      {
        ply: 1,
        san: 'e4',
        from: 'e2',
        to: 'e4',
        side: 'w',
        commentary: 'White stakes an early central claim.',
        hint: 'Advance your king pawn two squares.'
      },
      {
        ply: 2,
        san: 'e5',
        from: 'e7',
        to: 'e5',
        side: 'b',
        commentary: 'Black mirrors White’s pawn.',
        hint: 'Black mirrors the central advance.'
      },
      {
        ply: 3,
        san: 'Nf3',
        from: 'g1',
        to: 'f3',
        side: 'w',
        commentary: 'Developing while attacking e5.',
        hint: 'Develop your kingside knight to attack e5.'
      },
      {
        ply: 4,
        san: 'Nc6',
        from: 'b8',
        to: 'c6',
        side: 'b',
        commentary: 'Black defends the e5 pawn.',
        hint: 'Black protects e5.'
      },
      {
        ply: 5,
        san: 'Bb5',
        from: 'f1',
        to: 'b5',
        side: 'w',
        commentary: 'The Ruy Lopez! White develops the bishop to pin and pressure Black’s knight defending e5.',
        hint: 'Develop your bishop to b5 to put pressure on the defender of e5.'
      },
      {
        ply: 6,
        san: 'a6',
        from: 'a7',
        to: 'a6',
        side: 'b',
        commentary: 'Morphy’s Defense: Black questions the bishop’s intentions.',
        hint: 'Black questions your bishop with ...a6.'
      },
      {
        ply: 7,
        san: 'Ba4',
        from: 'b5',
        to: 'a4',
        side: 'w',
        commentary: 'White preserves the bishop, maintaining the pressure along the diagonal.',
        hint: 'Retreat your bishop along the diagonal to keep the pin intact.'
      },
      {
        ply: 8,
        san: 'Nf6',
        from: 'g8',
        to: 'f6',
        side: 'b',
        commentary: 'Black develops the knight and counter-attacks e4.',
        hint: 'Black attacks your e4 pawn.'
      },
      {
        ply: 9,
        san: 'O-O',
        from: 'e1',
        to: 'g1',
        side: 'w',
        commentary: 'White castles safely, willing to gambit e4 temporarily because Re1 will pin Black’s knight.',
        hint: 'Safeguard your king with kingside castling.'
      },
      {
        ply: 10,
        san: 'Be7',
        from: 'f8',
        to: 'e7',
        side: 'b',
        commentary: 'Black plays the solid Closed Defense, unpinning the knight.',
        hint: 'Black prepares to castle.'
      },
      {
        ply: 11,
        san: 'Re1',
        from: 'f1',
        to: 'e1',
        side: 'w',
        commentary: 'White defends e4 and prepares the thematic c3 and d4 push.',
        hint: 'Protect your e4 pawn by placing your rook on the open e-file.'
      },
      {
        ply: 12,
        san: 'b5',
        from: 'b7',
        to: 'b5',
        side: 'b',
        commentary: 'Black drives the bishop further back.',
        hint: 'Black pushes the bishop back.'
      },
      {
        ply: 13,
        san: 'Bb3',
        from: 'a4',
        to: 'b3',
        side: 'w',
        commentary: 'The Spanish bishop settles onto its ideal attacking diagonal targeting f7.',
        hint: 'Tuck your bishop back onto the powerful a2-g8 diagonal.'
      },
      {
        ply: 14,
        san: 'd6',
        from: 'd7',
        to: 'd6',
        side: 'b',
        commentary: 'Black solidifies the center and frees the c8 bishop.',
        hint: 'Black solidifies the e5 pawn.'
      }
    ]
  }
];

export function getAllOpenings() {
  return OPENINGS;
}

export function getOpeningById(id) {
  return OPENINGS.find(op => op.id === id) || null;
}
