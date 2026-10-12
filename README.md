# Chess Opening Trainer

An interactive, responsive web application designed for beginner and intermediate chess players to master opening principles, drill next-move recall, study tactical traps, and build a personalized opening repertoire.

Inspired by physical chess clubs, tournament vinyl boards, and classic chess literature, the interface is styled in warm ivory tones, deep forest green accents, and typography crafted for study and focus.

---

## Features

### 1. Interactive Chess Practice
- **Real-Time Board Engine**: Powered by `chess.js` for legal move generation, check detection, and position validation.
- **Move Recall Drills**: Select an opening line and drill the expected repertoire moves. Opponent responses are played automatically after brief pauses.
- **Legal vs. Repertoire Move Distinction**: Legal moves that diverge from the opening syllabus are gently flagged with strategic explanations without penalizing standard chess legality.
- **Progressive Clues & Solutions**:
  - **Hint (Level 1)**: Displays a strategic and conceptual objective.
  - **Hint (Level 2)**: Highlights the specific piece to move on the board.
  - **Show Solution**: Explains the rationale and plays the expected move.
- **Move History Inspection**: Full SAN notation list. Click any previous move to review past board positions in read-only mode, with a 1-click return to active practice.
- **Web Audio Sound Effects**: Organic wooden piece clicks, captures, check chimes, and positive feedback tones synthesized in real time via the Web Audio API without external audio files.

### 2. Comprehensive Opening Library
Includes verified opening lines with in-depth move commentary, core strategic ideas, and common beginner mistakes:
- **Italian Game** (C50) — *Giuoco Piano Classical Variation* (White)
- **King’s Indian Defense** (E61) — *Classical Setup* (Black)
- **Pirc Defense** (B07) — *Mainline System* (Black)
- **Queen’s Gambit Declined** (D35) — *Orthodox Defense* (White)
- **Sicilian Defense** (B90) — *Open Sicilian Classical / Najdorf Setup* (Black)
- **Ruy Lopez** (C70) — *Morphy Defense* (White)

### 3. Common Opening Traps & Mistakes
Study tactical pitfalls with move-by-move interactive board replays:
- **Blackburne Shilling Gambit Trap** (Italian Game): Punishing greedy pawn grabs with queen double-attacks.
- **Légal’s Pseudo-Sacrifice** (Italian / Philidor): Queen sacrifice leading to minor piece smothered mate.
- **Fried Liver Attack** (Two Knights Defense): Knight sacrifice on f7 exposing the enemy king.
- **Noah’s Ark Trap** (Ruy Lopez): Entombing the Spanish bishop on b3 with advancing pawns.

### 4. My Repertoire
- Save preferred openings to your personalized training syllabus.
- Filter by playing as White or Black.
- Review move sequences and track accuracy per repertoire item.
- Persisted safely across browser reloads using `localStorage`.

### 5. Progress Tracking & Analytics
- Calculates real-time statistics: Total Attempts, Correct Moves, Mistake Retries, and Overall Accuracy percentage.
- Per-opening mastery breakdown with visual progress meters.
- Practice session history log.
- **Safe Reset Protection**: Reset practice statistics with a confirmation dialog while keeping your saved repertoire intact (or optionally reset everything).

---

## Project Structure

```
chess-opening-trainer/
├── index.html            # Semantic HTML5 layout and view containers
├── styles.css            # Classic forest green & ivory design system
├── js/
│   ├── app.js            # Main coordinator and view router
│   ├── chess-engine.js   # Wrapper around chess.js for position and move validation
│   ├── board.js          # Responsive SVG chessboard (click-to-move, drag & drop)
│   ├── pieces.js         # Scalable vector SVG chess pieces (Staunton style)
│   ├── opening-data.js   # Curated opening lines, explanations, and beginner tips
│   ├── traps-data.js     # Tactical opening traps and verified move sequences
│   ├── practice.js       # Interactive drill controller, hints, and session loop
│   ├── storage.js        # LocalStorage persistence and reset safeguards
│   ├── sound.js          # Web Audio API synthesized acoustic sound engine
│   └── progress.js       # Statistics, accuracy calculations, and dashboard views
├── test/
│   └── app.test.js       # Automated test suite for moves, traps, engine, and storage
├── package.json          # Dependencies and script definitions
└── README.md             # Documentation and usage guide
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
Clone or navigate to the project directory:
```bash
npm install
```

### Development Server
Start the local Vite development server:
```bash
npm run dev
# or
npm start
```
Open your browser and navigate to the local server URL (typically `http://localhost:5173`).

### Production Build & Preview
To build optimized static assets:
```bash
npm run build
npm run preview
```

### Running the Test Suite
Run the automated verification suite:
```bash
npm test
```

---

## Technical Notes

- **Zero External Graphic Dependencies**: Chess pieces are rendered directly as embedded SVG vectors, ensuring instant crisp display on all screen densities and mobile devices.
- **Sound without Network Latency**: Audio effects utilize the browser's Web Audio API with synthesized oscillators and gain envelopes.
- **Resilient Offline Architecture**: Progress and repertoire are maintained in browser `localStorage` with fail-safes for private browsing or disabled cookies.
