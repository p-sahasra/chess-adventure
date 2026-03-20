import { useState, useEffect, useRef } from "react";

// ─── Mini Board Renderer ────────────────────────────────
const PIECE_CHARS = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

function MiniBoard({ pieces = {}, highlights = [], size = 300 }) {
  const sq = size / 8;
  const lightSq = "#F0D9B5";
  const darkSq = "#B58863";

  return (
    <div style={{ display: "inline-block", borderRadius: 10, overflow: "hidden", boxShadow: "0 3px 16px rgba(0,0,0,0.12)" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {Array.from({ length: 8 }).map((_, r) =>
          Array.from({ length: 8 }).map((_, c) => (
            <rect key={`${r},${c}`} x={c * sq} y={r * sq} width={sq} height={sq} fill={(r + c) % 2 === 0 ? lightSq : darkSq} />
          ))
        )}
        {highlights.map((h, i) => (
          <g key={`h${i}`}>
            <rect x={h.c * sq} y={h.r * sq} width={sq} height={sq} fill={h.color || "#FFEB3B55"} />
            {h.label && (
              <text x={h.c * sq + sq / 2} y={h.r * sq + sq / 2 + 5} textAnchor="middle"
                fontSize={sq * 0.32} fontWeight="700" fill="#333" fontFamily="'Fredoka', sans-serif">
                {h.label}
              </text>
            )}
          </g>
        ))}
        {Object.entries(pieces).map(([pos, piece]) => {
          const [r, c] = pos.split(",").map(Number);
          return (
            <text key={pos} x={c * sq + sq / 2} y={r * sq + sq * 0.75} textAnchor="middle"
              fontSize={sq * 0.78} style={{ filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.15))" }}>
              {PIECE_CHARS[piece] || ""}
            </text>
          );
        })}
        {["a","b","c","d","e","f","g","h"].map((f, i) => (
          <text key={`f${i}`} x={i * sq + sq / 2} y={size - 3} textAnchor="middle"
            fontSize={8} fill="#8D6E63" fontFamily="'Fredoka', sans-serif" opacity={0.5}>{f}</text>
        ))}
        {[8,7,6,5,4,3,2,1].map((rank, i) => (
          <text key={`r${i}`} x={4} y={i * sq + sq / 2 + 3} fontSize={8}
            fill="#8D6E63" fontFamily="'Fredoka', sans-serif" opacity={0.5}>{rank}</text>
        ))}
      </svg>
    </div>
  );
}

const SQ = (name) => {
  const c = name.charCodeAt(0) - 97;
  const r = 8 - parseInt(name[1]);
  return `${r},${c}`;
};

// ─── Lesson Data ────────────────────────────────────────
const LESSONS = [
  {
    id: 1, title: "Piece Confidence", subtitle: "Can you move every piece without mistakes?",
    emoji: "🐴", color: "#66BB6A", colorLight: "#E8F5E9",
    objective: "Move every piece accurately and confidently — especially the knight.",
    readyWhen: "She can complete the Knight Chase in under 2 minutes and the Bishop Sweep without any illegal moves.",
    exercises: [
      {
        name: "Knight Chase", icon: "🐴",
        goal: "The knight must land on every target square. Count your moves!",
        howTo: [
          "Place a White Knight on a1 (bottom-left corner).",
          "Place a coin on each of these squares: c3, e4, f6, d7, b5.",
          "Move the knight to collect each coin using legal L-shaped moves.",
          "Count your total moves. Try to beat your record each day!",
        ],
        board: {
          pieces: { [SQ("a1")]: "N" },
          highlights: [
            { r: 5, c: 2, color: "#66BB6A55", label: "🪙" }, { r: 4, c: 4, color: "#66BB6A55", label: "🪙" },
            { r: 2, c: 5, color: "#66BB6A55", label: "🪙" }, { r: 1, c: 3, color: "#66BB6A55", label: "🪙" },
            { r: 3, c: 1, color: "#66BB6A55", label: "🪙" },
          ],
        },
        successTarget: "Collect all 5 coins in under 10 moves.",
        parentNote: "If she's struggling with the L-shape, count together out loud: '1-2-turn' while moving the knight. Physical counting helps.",
      },
      {
        name: "Bishop Sweep", icon: "⛪",
        goal: "Use a bishop to capture every enemy pawn — no illegal moves!",
        howTo: [
          "Place a White Bishop on c1.",
          "Place Black pawns on: e3, g5, f6, d4, b6.",
          "Capture all 5 pawns using only diagonal moves.",
          "The bishop STAYS on one colour the whole time — that's the key constraint!",
        ],
        board: {
          pieces: { [SQ("c1")]: "B", [SQ("e3")]: "p", [SQ("g5")]: "p", [SQ("f6")]: "p", [SQ("d4")]: "p", [SQ("b6")]: "p" },
          highlights: [
            { r: 5, c: 4, color: "#FF6B6B33" }, { r: 3, c: 6, color: "#FF6B6B33" },
            { r: 2, c: 5, color: "#FF6B6B33" }, { r: 4, c: 3, color: "#FF6B6B33" }, { r: 2, c: 1, color: "#FF6B6B33" },
          ],
        },
        successTarget: "All 5 pawns captured, zero illegal moves.",
        parentNote: "Watch that she keeps the bishop on the same colour throughout. If she slips, ask 'What colour is your bishop standing on right now?'",
      },
      {
        name: "Rook Maze", icon: "🏰",
        goal: "Navigate the rook from a1 to h8 while avoiding knight-controlled squares.",
        howTo: [
          "Place a White Rook on a1.",
          "Place Black Knights on: a5, d1, d8, h4, e5. They don't move — they're obstacles.",
          "Get the rook to h8 using only horizontal/vertical moves.",
          "You CANNOT land on any square that a Black Knight attacks. Plan your route!",
        ],
        board: {
          pieces: { [SQ("a1")]: "R", [SQ("a5")]: "n", [SQ("d1")]: "n", [SQ("d8")]: "n", [SQ("h4")]: "n", [SQ("e5")]: "n" },
          highlights: [{ r: 0, c: 7, color: "#4ECDC455", label: "🏁" }],
        },
        successTarget: "Rook reaches h8 without landing on any attacked square.",
        parentNote: "This is harder than it looks. Work through it together first, marking knight-attacked squares with coins. Then she tries solo.",
      },
    ],
    dailyPractice: {
      title: "10-Minute Piece Drill",
      steps: [
        "Knight Chase — beat yesterday's move count (3 min)",
        "Bishop Sweep — go for zero mistakes (3 min)",
        "Mini game: each player has only a King + Knight. Try to control the centre! (4 min)",
      ],
    },
  },
  {
    id: 2, title: "Capturing & Trading", subtitle: "When to take, when to wait",
    emoji: "⚖️", color: "#F59E0B", colorLight: "#FFF8E1",
    objective: "Know piece values by heart and decide whether a trade is good, bad, or even.",
    readyWhen: "She can answer 5 'good trade or bad trade?' questions in a row correctly and can spot the free piece in each puzzle.",
    exercises: [
      {
        name: "Piece Value Rapid Fire", icon: "💰",
        goal: "Know every piece's value instantly — no hesitation.",
        howTo: [
          "Hold up (or point at) a piece. She says the value. Go fast!",
          "Pawn = 1, Knight = 3, Bishop = 3, Rook = 5, Queen = 9.",
          "Then ask trade questions: 'I give my Rook for your Knight — good deal for who?'",
          "Try: Bishop for Knight? (Even.) Rook for Bishop? (Bad for Rook side — lose 2 points.) Queen for Rook + Bishop? (Bad for Queen side — 9 vs 8.)",
          "Use real pieces on the board. Hold up two groups: 'Which pile is worth more?'",
        ],
        successTarget: "10 out of 10 trade questions correct, under 5 seconds each.",
        parentNote: "Make it physical — hold two groups of pieces and ask 'which pile wins?' Handling the pieces makes values stick faster than just saying numbers.",
      },
      {
        name: "Hanging Pieces", icon: "🎯",
        goal: "Find the piece that's undefended and take it for free!",
        howTo: [
          "Set up each position on the board. White moves first.",
          "Find the piece that's 'hanging' — no defender.",
          "After capturing, check: 'Can Black take back?' If no — free piece!",
        ],
        positions: [
          {
            label: "Puzzle 1: Find the free piece",
            pieces: { [SQ("e4")]: "N", [SQ("d5")]: "p", [SQ("f7")]: "r" },
            highlights: [{ r: 1, c: 5, color: "#FF6B6B44", label: "?" }],
            answer: "Knight takes rook on f7 — the rook is undefended! White wins a whole rook (5 points) for free.",
          },
          {
            label: "Puzzle 2: Which capture is better?",
            pieces: { [SQ("c3")]: "B", [SQ("e5")]: "n", [SQ("a5")]: "r" },
            highlights: [{ r: 3, c: 4, color: "#F59E0B33", label: "?" }, { r: 3, c: 0, color: "#F59E0B33", label: "?" }],
            answer: "Bishop can take the knight on e5 (3 for 3, even) or... wait, can anything reach the rook on a5? Check all your pieces! Always find the BEST capture, not just the first one.",
          },
          {
            label: "Puzzle 3: It's a trap!",
            pieces: { [SQ("d4")]: "Q", [SQ("e5")]: "p", [SQ("f6")]: "n", [SQ("g1")]: "K" },
            highlights: [{ r: 3, c: 4, color: "#E5393544", label: "⚠️" }],
            answer: "The pawn on e5 looks free, but if the Queen takes on e5, the knight on f6 can capture the Queen! Always ask: 'What happens AFTER I take?'",
          },
        ],
        successTarget: "Solve all 3 puzzles and explain WHY each capture is good or bad.",
        parentNote: "Puzzle 3 introduces looking one move ahead. If she grabs the pawn, don't say 'wrong' — play out the next move and let her see what happens.",
      },
      {
        name: "The Counting Game", icon: "🔢",
        goal: "Count attackers and defenders on a contested square.",
        howTo: [
          "Set up: White Bishop c4, White Pawn d3. Black Knight e5, Black Pawn d6.",
          "Should the Bishop capture the Knight on e5?",
          "Count: Bishop takes knight (White spends 3, gains 3). Then d6 pawn takes back (Black spends 1, gains 3).",
          "Result: White traded a Bishop (3) for a Knight (3) = EVEN. But Black got to recapture with a pawn, improving their centre.",
          "Now try: What if a White Rook on e1 was also eyeing e5? Then after Bxe5, dxe5, Rxe5 — White wins material!",
        ],
        board: {
          pieces: { [SQ("c4")]: "B", [SQ("d3")]: "P", [SQ("e5")]: "n", [SQ("d6")]: "p" },
          highlights: [{ r: 3, c: 4, color: "#F59E0B44", label: "⚔️" }],
        },
        successTarget: "She can count attackers vs defenders on a square and say if the trade is good, bad, or even.",
        parentNote: "This is the foundation of ALL chess calculation. Spend extra time here. Physically move through each capture in sequence on the board.",
      },
    ],
    dailyPractice: {
      title: "10-Minute Trading Drill",
      steps: [
        "Piece value quiz — rapid fire, 10 questions (2 min)",
        "Set up a random position with 6-8 pieces. Find every capture. Rank them best to worst. (4 min)",
        "'Capture-only' game: regular rules but you MUST capture if you can. First to run out loses. (4 min)",
      ],
    },
  },
  {
    id: 3, title: "Check & Escape", subtitle: "The most important rule in chess",
    emoji: "⚠️", color: "#E53935", colorLight: "#FFEBEE",
    objective: "Recognize check instantly and find all escape methods: Move, Block, or Capture.",
    readyWhen: "She can look at any position and say whether the King is in check within 5 seconds, and name all legal escapes within 15 seconds.",
    exercises: [
      {
        name: "Is It Check? — Speed Round", icon: "❓",
        goal: "5 seconds per position: 'Check!' or 'Safe!'",
        howTo: [
          "Set up each position. She has 5 seconds to answer.",
          "After answering, she must say WHICH piece is giving check (or why it's safe).",
          "Do 8-10 positions. Aim for 8 out of 10 correct.",
          "Make your own: randomly place a King and one enemy piece. Check or safe?",
        ],
        positions: [
          {
            label: "Check or Safe?",
            pieces: { [SQ("e8")]: "k", [SQ("e1")]: "R" },
            highlights: [{ r: 0, c: 4, color: "#E5393544" }],
            answer: "CHECK! The rook attacks straight up the e-file.",
          },
          {
            label: "Check or Safe?",
            pieces: { [SQ("g8")]: "k", [SQ("c4")]: "B" },
            highlights: [{ r: 0, c: 6, color: "#66BB6A33" }],
            answer: "Safe! The bishop on c4 doesn't reach g8 on its diagonals.",
          },
          {
            label: "Check or Safe?",
            pieces: { [SQ("f6")]: "k", [SQ("e4")]: "N" },
            highlights: [{ r: 2, c: 5, color: "#E5393544" }],
            answer: "CHECK! The knight on e4 attacks f6 — count the L: e4→f6 is 1 right, 2 up.",
          },
        ],
        successTarget: "8 out of 10 correct with under 5 seconds each.",
        parentNote: "Speed matters — she needs to recognize check like recognizing a word, not sounding it out. Start slow, then gradually speed up.",
      },
      {
        name: "Find ALL the Escapes", icon: "🏃",
        goal: "King is in check. Find EVERY way out: Move, Block, or Capture.",
        howTo: [
          "Set up each position. The King is in check.",
          "She must find EVERY legal escape — not just the first one.",
          "For each position, work through the checklist together:",
          "MOVE — Can the King step to a safe square? List each option.",
          "BLOCK — Can any friendly piece jump in the way?",
          "CAPTURE — Can any friendly piece take the attacker?",
        ],
        positions: [
          {
            label: "Find all escapes!",
            pieces: { [SQ("e1")]: "K", [SQ("e8")]: "r", [SQ("d2")]: "B" },
            highlights: [{ r: 7, c: 4, color: "#E5393544", label: "!" }],
            answer: "Rook checks on e-file. MOVE: Kd1, Kf1, Kf2 (check if safe!). BLOCK: Can the Bishop reach a square on the e-file between e1 and e8? Yes — Be4 blocks! CAPTURE: Nothing reaches e8. Multiple escapes available!",
          },
          {
            label: "Only one way out!",
            pieces: { [SQ("h1")]: "K", [SQ("a1")]: "r", [SQ("g2")]: "P" },
            highlights: [{ r: 7, c: 7, color: "#E5393544", label: "!" }],
            answer: "Rook checks along rank 1. MOVE: Kh2 is the only option (g2 has our own pawn, g1 is still on rank 1 and attacked). BLOCK: Nothing can block. CAPTURE: Nothing reaches a1. Only escape: Kh2!",
          },
        ],
        successTarget: "List ALL escapes for each position — not just the first one she sees.",
        parentNote: "Don't rush. Talk through each option: 'Can he go here? No because...' The systematic process matters more than speed at this stage.",
      },
      {
        name: "Checkmate in One!", icon: "🏆",
        goal: "Find the ONE move that delivers checkmate — no escape possible.",
        howTo: [
          "White moves and checkmates in ONE move.",
          "Before moving, she must verify: 'After my move — can the King move? Can anything block? Can anything capture my piece?'",
          "If ALL answers are no → checkmate!",
        ],
        positions: [
          {
            label: "Mate in 1 — Back Rank",
            pieces: { [SQ("a1")]: "R", [SQ("g1")]: "K", [SQ("f8")]: "k", [SQ("f7")]: "p", [SQ("g7")]: "p", [SQ("h7")]: "p" },
            highlights: [],
            answer: "Ra8#! The rook delivers check on rank 8. The King can't escape — his own pawns block every exit. This is the 'back rank mate' — the #1 most common pattern!",
          },
          {
            label: "Mate in 1 — Queen Delivery",
            pieces: { [SQ("f6")]: "K", [SQ("d1")]: "Q", [SQ("f8")]: "k" },
            highlights: [],
            answer: "Qd8#! The Queen checks on d8, and the White King on f6 covers e7, f7, g7 — every escape square.",
          },
          {
            label: "Mate in 1 — Find It!",
            pieces: { [SQ("h1")]: "K", [SQ("b3")]: "Q", [SQ("a8")]: "k", [SQ("a7")]: "p", [SQ("b8")]: "r" },
            highlights: [],
            answer: "Qa3#! (or Qa4#) The Queen checks the King. a7 is blocked by its own pawn, b8 has its own rook, and the Queen covers b7. No escape!",
          },
        ],
        successTarget: "Find checkmate in all 3 AND prove it's checkmate by checking every escape.",
        parentNote: "The proving step is crucial. Finding the move is half the work — verifying it's actually mate builds the habit of double-checking.",
      },
    ],
    dailyPractice: {
      title: "10-Minute Check Drill",
      steps: [
        "'Is it check?' — set up 5 random King + attacker positions (3 min)",
        "Pick one 'Find the Escape' position, list every option (3 min)",
        "Lichess Mate-in-1 puzzles: lichess.org/training/mateIn1 (4 min)",
      ],
    },
  },
  {
    id: 4, title: "Checkmate Patterns", subtitle: "Learn the shapes that end games",
    emoji: "💀", color: "#78909C", colorLight: "#ECEFF1",
    objective: "Recognize and deliver the three most common checkmate patterns.",
    readyWhen: "She can deliver King+Queen vs lone King checkmate in under 20 moves, and names the back rank mate on sight.",
    exercises: [
      {
        name: "Back Rank Mate", icon: "🧱",
        goal: "Spot when a King is trapped behind its own pawns.",
        howTo: [
          "Set up: Black King g8, Black pawns f7 g7 h7. White Rook a1, White King g1.",
          "White plays Ra8. Why is this checkmate?",
          "The rook checks on the back rank. The pawns block EVERY escape square.",
          "Key lesson: this is why you should sometimes play h3 or a3 — creating a 'luft' (escape hatch) for your King!",
          "Reset and try it from different rook positions. Can she deliver it from b2? From d1?",
        ],
        board: {
          pieces: { [SQ("g8")]: "k", [SQ("f7")]: "p", [SQ("g7")]: "p", [SQ("h7")]: "p", [SQ("a1")]: "R", [SQ("g1")]: "K" },
          highlights: [{ r: 0, c: 0, color: "#78909C44", label: "Ra8#" }],
        },
        successTarget: "She can set this up, deliver it, and explain WHY the King is trapped — in under 30 seconds.",
        parentNote: "This is the single most common checkmate in real games. Once she spots it, she'll see it everywhere. Point it out in any online games you watch together.",
      },
      {
        name: "Two-Rook Ladder", icon: "🏰🏰",
        goal: "Use two rooks in a 'ladder' to push the King to the edge.",
        howTo: [
          "Set up: White Rooks a1 and b1, Black King e5, White King g1.",
          "The rooks take turns cutting off rows: Ra6 (King can't go below rank 6), then Rb7 (can't go below rank 7), then Ra8# — checkmate!",
          "If the King attacks a rook, slide that rook FAR away along the same row, then continue the ladder with the other rook.",
          "Play it out against each other — she delivers the ladder, you defend the lone King.",
        ],
        board: {
          pieces: { [SQ("a1")]: "R", [SQ("b1")]: "R", [SQ("e5")]: "k", [SQ("g1")]: "K" },
          highlights: [],
        },
        successTarget: "Deliver the two-rook ladder checkmate in under 10 moves. Do it 3 times.",
        parentNote: "This is the EASIEST checkmate technique and a great confidence builder. If the Queen+King mate below feels hard, spend more time on this one first.",
      },
      {
        name: "Queen + King vs Lone King", icon: "👸👑",
        goal: "Force a lone King to the edge and deliver checkmate.",
        howTo: [
          "Set up: White King e1, White Queen d1, Black King e5 (alone).",
          "The method has two phases:",
          "Phase 1 — SHRINK THE BOX: Use the Queen to cut off the King. Qd4 creates a wall the Black King can't cross. Keep shrinking.",
          "Phase 2 — BRING THE KING: Once the enemy King is near the edge, bring your King closer to support the Queen.",
          "Deliver checkmate on the edge with your King supporting the Queen.",
          "DANGER: Watch out for stalemate! Always make sure the enemy King has at least one legal move until you're ready to mate.",
        ],
        board: {
          pieces: { [SQ("e1")]: "K", [SQ("d1")]: "Q", [SQ("e5")]: "k" },
          highlights: [{ r: 4, c: 3, color: "#A78BFA44", label: "Qd4" }],
        },
        successTarget: "Deliver checkmate in under 20 moves. Take turns attacking and defending. Repeat 3 times each.",
        parentNote: "This is THE essential endgame skill. If she accidentally stalemates, celebrate that she noticed! 'Great — now you know what to watch for.' It's a very common mistake even for experienced players.",
      },
    ],
    dailyPractice: {
      title: "10-Minute Checkmate Drill",
      steps: [
        "Set up a back rank position — deliver it, explain why it works (2 min)",
        "King + Queen vs King — play it out, aim for under 20 moves (5 min)",
        "Two-Rook Ladder from a random starting position (3 min)",
      ],
    },
  },
  {
    id: 5, title: "Opening Principles", subtitle: "Win the first 10 moves",
    emoji: "🚀", color: "#2196F3", colorLight: "#E3F2FD",
    objective: "Follow three rules every opening: Control the Centre, Develop pieces, Castle.",
    readyWhen: "She can play the first 8 moves following all three rules, and spots when her opponent breaks them.",
    exercises: [
      {
        name: "The Three Golden Rules", icon: "📜",
        goal: "Memorize and apply: CENTRE — DEVELOP — CASTLE.",
        howTo: [
          "Say together: CENTRE — DEVELOP — CASTLE. That's the whole opening strategy.",
          "CENTRE: Push pawns to e4/d4 (White) or e5/d5 (Black). Control the middle!",
          "DEVELOP: Get knights and bishops OFF the back row into the game. Knights first is a safe default.",
          "CASTLE: Tuck your King away safely, usually kingside. Do it within the first 8 moves.",
          "Play the first 6 moves of a game following these rules. Then stop and check: did you follow all three?",
        ],
        board: {
          pieces: { [SQ("e4")]: "P", [SQ("d4")]: "P", [SQ("f3")]: "N", [SQ("c3")]: "N", [SQ("c4")]: "B", [SQ("g1")]: "K", [SQ("f1")]: "R" },
          highlights: [{ r: 4, c: 3, color: "#2196F333" }, { r: 4, c: 4, color: "#2196F333" }],
        },
        successTarget: "She recites the three rules from memory and explains each in her own words.",
        parentNote: "Just these three rules will make her opening stronger than most beginners. Don't add complexity yet — let these become automatic first.",
      },
      {
        name: "Opening Scorecard", icon: "⚖️",
        goal: "Score your opening out of 6 after the first 5 moves.",
        howTo: [
          "Play the first 5 moves as White. Then pause and score yourself:",
          "+1 for each pawn in the centre (e4, d4, e5, d5)",
          "+1 for each knight or bishop that's moved off the back row",
          "+1 if you've castled or can castle next move",
          "Max score = 6. Aim for 4+ each time.",
          "Now score Black. Who followed the rules better?",
        ],
        successTarget: "Score both sides after the first 5 moves in 3 different games. Average 4+ for her side.",
        parentNote: "Write scores down so she can track improvement over days. The scorecard makes the abstract rules concrete and measurable.",
      },
      {
        name: "Spot the Bad Move", icon: "🚫",
        goal: "Catch the parent making intentional opening mistakes!",
        howTo: [
          "Play a game where the parent DELIBERATELY makes bad moves:",
          "Bring the Queen out on move 2",
          "Move the same knight 3 times in a row",
          "Push edge pawns (a4, h4) instead of centre pawns",
          "Leave the King in the centre for 15 moves",
          "After each bad move, she says: 'Bad move! You broke the [rule name] rule!'",
        ],
        successTarget: "She catches 3 out of 4 intentional mistakes and names which rule was broken.",
        parentNote: "Ham it up! 'My Queen just wants to explore the board!' 'But she'll get chased around!' — that conversation IS the learning.",
      },
    ],
    dailyPractice: {
      title: "10-Minute Opening Drill",
      steps: [
        "Recite the three rules (30 sec)",
        "Play first 8 moves, then score both sides (4 min)",
        "Parent makes 2 intentional mistakes in the opening — she spots them (4 min)",
        "'What's ONE thing I'll do better next time?' (1 min)",
      ],
    },
  },
  {
    id: 6, title: "Forks", subtitle: "Attack two things at once!",
    emoji: "🍴", color: "#FF6B6B", colorLight: "#FFF1F0",
    objective: "Spot and execute fork opportunities — especially knight forks.",
    readyWhen: "She finds the fork in 5 out of 6 puzzles and successfully forks you in a real game.",
    exercises: [
      {
        name: "What's a Fork?", icon: "🍴",
        goal: "One piece attacks two enemies simultaneously — they can only save one!",
        howTo: [
          "Set up: White Knight d5, Black Queen c7, Black Rook f6.",
          "The knight attacks BOTH pieces at the same time! Count the L-shapes.",
          "Black must save one — the other gets captured. White wins no matter what.",
          "Any piece can fork, but knights are best because they attack in unusual directions.",
        ],
        board: {
          pieces: { [SQ("d5")]: "N", [SQ("c7")]: "q", [SQ("f6")]: "r" },
          highlights: [{ r: 1, c: 2, color: "#FF6B6B55", label: "!" }, { r: 2, c: 5, color: "#FF6B6B55", label: "!" }],
        },
        successTarget: "She explains what a fork is in her own words and why the opponent can't save both pieces.",
      },
      {
        name: "Find the Fork!", icon: "🔍",
        goal: "Find the square where a piece can fork two enemies.",
        positions: [
          {
            label: "Fork Puzzle 1 — Knight Fork",
            pieces: { [SQ("g1")]: "N", [SQ("d7")]: "k", [SQ("f7")]: "r" },
            highlights: [],
            answer: "Ne2, then Ne2 can go to... wait, think from scratch. What square attacks BOTH d7 and f7? Count L-shapes. e5! Knight to e5 forks King and Rook! (e5→d7: 1 left 2 up ✓, e5→f7: 1 right 2 up ✓)",
          },
          {
            label: "Fork Puzzle 2 — Pawn Fork",
            pieces: { [SQ("d4")]: "P", [SQ("c5")]: "n", [SQ("e5")]: "b", [SQ("g1")]: "K" },
            highlights: [],
            answer: "d5! The pawn advances and attacks BOTH the knight (diagonal left) and the bishop (diagonal right). Pawns can fork too!",
          },
          {
            label: "Fork Puzzle 3 — Queen Fork",
            pieces: { [SQ("a1")]: "Q", [SQ("h1")]: "K", [SQ("e8")]: "k", [SQ("a8")]: "r" },
            highlights: [],
            answer: "Qa4+! Or Qa2, threatening the rook. Look for Queen moves that check the King AND attack another piece — that's the deadliest fork because check forces a response!",
          },
        ],
        successTarget: "Find the correct fork in all 3 puzzles and explain both attacks.",
        parentNote: "If stuck, try: 'List every square the knight can jump to. Now — does any of those squares attack two targets?' Systematic search beats guessing.",
      },
      {
        name: "Fork Hunt — Real Game", icon: "🎮",
        goal: "Play a real game with one goal: execute a fork!",
        howTo: [
          "Play a full game. Winning doesn't matter — the ONLY goal is to land one fork.",
          "After the game, review together: were there fork opportunities either player missed?",
          "If she landed a fork, celebrate! If she missed one, set up that exact position and let her find it.",
        ],
        successTarget: "Execute at least one fork in a real game. Bonus: find a missed fork in review.",
        parentNote: "Play slightly loosely to create fork opportunities. If she misses one during the game, don't point it out — save it for the post-game review.",
      },
    ],
    dailyPractice: {
      title: "10-Minute Tactics Drill",
      steps: [
        "Set up a fork puzzle, solve it (2 min)",
        "Lichess fork puzzles: lichess.org/training/fork (4 min)",
        "Play a quick game — hunt for forks! (4 min)",
      ],
    },
  },
  {
    id: 7, title: "Pins & Skewers", subtitle: "Straight-line attacks that win material",
    emoji: "📌", color: "#A78BFA", colorLight: "#F5F0FF",
    objective: "Recognize pins and skewers, explain the difference, and use them to win pieces.",
    readyWhen: "She correctly identifies pin vs skewer in 5 out of 5 positions and explains why each works.",
    exercises: [
      {
        name: "What's a Pin?", icon: "📌",
        goal: "A piece CAN'T move because something more valuable is behind it.",
        howTo: [
          "Set up: White Bishop b5, Black Knight c6, Black King e8.",
          "The knight is PINNED. Try moving it — the Bishop would capture the King! It's stuck.",
          "Analogy: the knight is 'pinned to the wall' — it can't move without disaster.",
          "A pin only works when the piece behind is more valuable (especially the King).",
        ],
        board: {
          pieces: { [SQ("b5")]: "B", [SQ("c6")]: "n", [SQ("e8")]: "k" },
          highlights: [{ r: 2, c: 2, color: "#A78BFA44", label: "📌" }],
        },
        successTarget: "She explains why the knight can't move using the word 'pin.'",
      },
      {
        name: "What's a Skewer?", icon: "🍡",
        goal: "Attack a valuable piece — when it runs, capture what's behind it.",
        howTo: [
          "Set up: White Rook a1, Black King a4, Black Rook a8.",
          "White plays Ra1 — check! The King MUST move. Then White captures the Rook on a8!",
          "Analogy: like a kebab — you poke through the first piece to get the second.",
          "Key difference from pin: in a skewer the valuable piece is in FRONT (it moves away). In a pin the valuable piece is BEHIND (the front piece is stuck).",
        ],
        board: {
          pieces: { [SQ("a1")]: "R", [SQ("a4")]: "k", [SQ("a8")]: "r" },
          highlights: [{ r: 4, c: 0, color: "#A78BFA44", label: "!" }, { r: 0, c: 0, color: "#FF6B6B33" }],
        },
        successTarget: "She explains the difference between pin and skewer in her own words.",
        parentNote: "The memory trick: PIN = piece is STUCK (pinned to a wall). SKEWER = piece RUNS (kebab, the first piece slides off).",
      },
      {
        name: "Pin, Skewer, or Fork?", icon: "🧩",
        goal: "Name the tactic in each position.",
        positions: [
          {
            label: "What tactic?",
            pieces: { [SQ("d1")]: "R", [SQ("d5")]: "b", [SQ("d8")]: "q" },
            highlights: [{ r: 3, c: 3, color: "#A78BFA33" }],
            answer: "PIN! The bishop on d5 can't move — if it does, the rook takes the queen behind it.",
          },
          {
            label: "What tactic?",
            pieces: { [SQ("c1")]: "B", [SQ("e3")]: "k", [SQ("h6")]: "r" },
            highlights: [],
            answer: "SKEWER! The bishop attacks the King (valuable piece in front). King must move, then bishop takes the rook behind it.",
          },
          {
            label: "What tactic?",
            pieces: { [SQ("e4")]: "N", [SQ("d2")]: "r", [SQ("f2")]: "q", [SQ("g1")]: "K" },
            highlights: [],
            answer: "FORK! The knight attacks both the rook AND the queen simultaneously.",
          },
        ],
        successTarget: "Correctly name all 3 tactics and explain the reasoning.",
        parentNote: "If she mixes up pin and skewer, ask: 'Is the stuck piece in front or behind? Front = skewer, behind = pin.'",
      },
    ],
    dailyPractice: {
      title: "10-Minute Tactics Drill",
      steps: [
        "Set up 1 pin + 1 skewer. She identifies and solves both. (3 min)",
        "Lichess puzzles — pin and skewer themes (4 min)",
        "Play a game — try to create a pin or skewer. Review after. (3 min)",
      ],
    },
  },
  {
    id: 8, title: "Play Real Games", subtitle: "Put it all together!",
    emoji: "🏆", color: "#FF9800", colorLight: "#FFF3E0",
    objective: "Play full games using a thinking routine and learn from every game through review.",
    readyWhen: "She uses the three questions before every move and identifies at least one tactic in post-game review.",
    exercises: [
      {
        name: "The Three Questions", icon: "🧠",
        goal: "Build a thinking habit for EVERY move.",
        howTo: [
          "Before EVERY move, say out loud:",
          "1. 'Is my King safe?'",
          "2. 'What is my opponent threatening?'",
          "3. 'What's my best move — and why?'",
          "Play a full game where BOTH players say all three questions out loud.",
          "Yes, it feels slow. Yes, it's supposed to. This is how good habits form.",
        ],
        successTarget: "Play a full game using the questions on every single move. It will take a long time — that's the point!",
        parentNote: "Model this yourself. Say your three questions out loud even when the answer seems obvious. She'll absorb the rhythm from watching you.",
      },
      {
        name: "Post-Game Review", icon: "🔍",
        goal: "Learn more from the game you just played than from the next one.",
        howTo: [
          "After every game, before playing another:",
          "1. Find the TURNING POINT — the move where things shifted.",
          "2. Were there any missed tactics? (Forks, pins, skewers?)",
          "3. Did both sides follow opening rules? (Centre, Develop, Castle?)",
          "4. Each player names ONE thing they'll do better next game.",
          "You don't need to review every move. Just the 2-3 most interesting moments.",
        ],
        successTarget: "Complete a review after every game this week. She names one strength and one improvement.",
        parentNote: "Ask 'What was the most interesting moment?' not 'What went wrong?' Frame review as curiosity, not correction.",
      },
      {
        name: "Secret Missions", icon: "🎯",
        goal: "Play games with specific skill goals — winning is optional!",
        howTo: [
          "Before each game, pick a secret mission:",
          "Mission 1: Castle within the first 8 moves.",
          "Mission 2: Land a fork at some point in the game.",
          "Mission 3: Never move the same piece twice in the opening.",
          "Mission 4: Only trade when you're getting equal or better value.",
          "Mission 5: Win by checkmate (not resignation).",
          "Complete your mission = you WIN, even if you lost the actual game!",
        ],
        successTarget: "Complete all 5 missions across 5 different games.",
        parentNote: "Missions reframe everything away from winning/losing and toward skill-building. She can 'win' her mission even against a stronger opponent.",
      },
    ],
    dailyPractice: {
      title: "15-Minute Game Session",
      steps: [
        "Pick today's secret mission (30 sec)",
        "Play a full game — three questions every move! (8-10 min)",
        "Post-game review: turning point + one missed tactic (3-4 min)",
        "Name one thing to improve tomorrow (30 sec)",
      ],
    },
  },
];

// ─── Exercise Component ─────────────────────────────────
function Exercise({ ex, lessonColor }) {
  const [showAnswer, setShowAnswer] = useState({});
  const toggleAnswer = (i) => setShowAnswer(p => ({ ...p, [i]: !p[i] }));

  return (
    <div style={{
      background: "white", borderRadius: 24, padding: "24px 24px 20px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)", borderLeft: `5px solid ${lessonColor}`, marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{
          fontSize: 30, minWidth: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center",
          background: lessonColor + "15", borderRadius: 16,
        }}>{ex.icon}</div>
        <div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700, color: "#2D3436" }}>{ex.name}</div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 17, color: "#666" }}>{ex.goal}</div>
        </div>
      </div>

      {ex.howTo && (
        <div style={{ marginBottom: 16 }}>
          {ex.howTo.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "5px 0" }}>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 15, fontWeight: 700, color: lessonColor, minWidth: 26, textAlign: "right" }}>{i + 1}.</div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 17, color: "#444", lineHeight: 1.55 }}>{step}</div>
            </div>
          ))}
        </div>
      )}

      {ex.board && (
        <div style={{ textAlign: "center", margin: "16px 0" }}>
          <MiniBoard pieces={ex.board.pieces} highlights={ex.board.highlights || []} size={280} />
        </div>
      )}

      {ex.positions && ex.positions.map((pos, i) => (
        <div key={i} style={{ background: "#FAFAFA", borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 17, fontWeight: 600, color: "#555", marginBottom: 10 }}>{pos.label}</div>
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <MiniBoard pieces={pos.pieces} highlights={pos.highlights || []} size={240} />
          </div>
          <button onClick={() => toggleAnswer(i)} style={{
            fontFamily: "'Fredoka', sans-serif", fontSize: 15, fontWeight: 600, color: lessonColor,
            background: lessonColor + "15", border: "none", borderRadius: 12, padding: "8px 18px",
            cursor: "pointer", display: "block", margin: "0 auto",
          }}>{showAnswer[i] ? "Hide Answer ▴" : "Show Answer ▾"}</button>
          {showAnswer[i] && (
            <div style={{
              fontFamily: "'Nunito', sans-serif", fontSize: 16, color: "#555", lineHeight: 1.5,
              background: lessonColor + "10", borderRadius: 12, padding: "12px 16px", marginTop: 10,
            }}>{pos.answer}</div>
          )}
        </div>
      ))}

      {ex.successTarget && (
        <div style={{ background: "#E8F5E9", borderRadius: 14, padding: "12px 16px", marginTop: 12, border: "2px dashed #66BB6A44" }}>
          <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, fontWeight: 700, color: "#43A047" }}>✅ Goal: </span>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 17, color: "#444" }}>{ex.successTarget}</span>
        </div>
      )}

      {ex.parentNote && (
        <div style={{ background: "#FFF8E1", borderRadius: 14, padding: "12px 16px", marginTop: 8, border: "2px dashed #F59E0B33" }}>
          <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, fontWeight: 700, color: "#F59E0B" }}>👩‍👧 Parent Note: </span>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, color: "#666" }}>{ex.parentNote}</span>
        </div>
      )}
    </div>
  );
}

// ─── Lesson Page ────────────────────────────────────────
function LessonPage({ lesson, progress, setProgress }) {
  const key = `lesson${lesson.id}`;
  const done = progress[key] || false;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 40px" }}>
      <div style={{
        textAlign: "center", padding: "28px 20px 20px",
        background: `linear-gradient(135deg, ${lesson.color}15, ${lesson.color}05)`,
        borderRadius: 28, marginBottom: 20, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, fontSize: 100, opacity: 0.06 }}>{lesson.emoji}</div>
        <div style={{ fontSize: 50, marginBottom: 6 }}>{lesson.emoji}</div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, color: lesson.color, opacity: 0.6 }}>Lesson {lesson.id} of {LESSONS.length}</div>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 32, fontWeight: 700, color: lesson.color, margin: "2px 0 6px" }}>{lesson.title}</h2>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 19, color: "#666", margin: 0 }}>{lesson.subtitle}</p>
      </div>

      <div style={{ background: lesson.color + "12", borderRadius: 20, padding: "18px 22px", marginBottom: 14, border: `2px solid ${lesson.color}33` }}>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, fontWeight: 700, color: lesson.color, marginBottom: 6 }}>🎯 Objective</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 18, color: "#444", lineHeight: 1.5 }}>{lesson.objective}</div>
      </div>

      <div style={{ background: "#E8F5E9", borderRadius: 20, padding: "18px 22px", marginBottom: 22, border: "2px solid #66BB6A33" }}>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, fontWeight: 700, color: "#43A047", marginBottom: 6 }}>✅ Move On When...</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 18, color: "#444", lineHeight: 1.5 }}>{lesson.readyWhen}</div>
      </div>

      <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 24, fontWeight: 700, color: "#2D3436", marginBottom: 14 }}>Exercises</h3>
      {lesson.exercises.map((ex, i) => <Exercise key={i} ex={ex} lessonColor={lesson.color} />)}

      {lesson.dailyPractice && (
        <div style={{ background: "linear-gradient(135deg, #F5F5F5, #FAFAFA)", borderRadius: 24, padding: "22px 24px", marginTop: 20, border: "2px solid #E0E0E0" }}>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 21, fontWeight: 700, color: "#2D3436", marginBottom: 12 }}>📋 {lesson.dailyPractice.title}</div>
          {lesson.dailyPractice.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, border: "2px solid #CCC",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: "#CCC", fontFamily: "'Fredoka', sans-serif", fontWeight: 700, flexShrink: 0, marginTop: 2,
              }}>{i + 1}</div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 17, color: "#555", lineHeight: 1.5 }}>{step}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 28 }}>
        <button onClick={() => setProgress({ ...progress, [key]: !done })} style={{
          fontFamily: "'Fredoka', sans-serif", fontSize: 20, fontWeight: 700,
          padding: "14px 36px", borderRadius: 20, border: "none", cursor: "pointer",
          background: done ? "#66BB6A" : lesson.color, color: "white",
          boxShadow: `0 4px 16px ${(done ? "#66BB6A" : lesson.color)}33`,
        }}>{done ? "✅ Lesson Complete!" : "Mark as Done ✓"}</button>
      </div>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────
export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [progress, setProgress] = useState({});
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  const completedCount = LESSONS.filter(l => progress[`lesson${l.id}`]).length;
  const navItems = [
    { id: "home", label: "Home", emoji: "🏠" },
    ...LESSONS.map(l => ({ id: `lesson${l.id}`, label: `L${l.id}`, emoji: l.emoji })),
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #FFFDF5 0%, #F5F0FF 40%, #F0F8FF 100%)", fontFamily: "'Nunito', sans-serif", paddingBottom: 80 }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
      <div ref={topRef} />

      <div style={{ textAlign: "center", padding: "22px 20px 10px" }}>
        <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 34, fontWeight: 700, color: "#2D3436" }}>♟️ Our Chess Adventure</h1>
        {completedCount > 0 && (
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, color: "#66BB6A", marginTop: 3 }}>✅ {completedCount}/{LESSONS.length} lessons complete</div>
        )}
      </div>

      <div style={{ display: "flex", gap: 4, padding: "6px 10px", overflowX: "auto", justifyContent: "center", flexWrap: "wrap" }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setCurrentPage(item.id)} style={{
            fontFamily: "'Fredoka', sans-serif", fontSize: 14, fontWeight: 600,
            padding: "7px 12px", borderRadius: 12, border: "none", cursor: "pointer",
            background: currentPage === item.id ? "#2D3436" : "white",
            color: currentPage === item.id ? "white" : "#AAA",
            boxShadow: currentPage === item.id ? "0 3px 10px rgba(0,0,0,0.15)" : "0 1px 3px rgba(0,0,0,0.06)",
            transition: "all 0.2s ease", whiteSpace: "nowrap",
          }}>{item.emoji} {item.label}</button>
        ))}
      </div>

      <div style={{ animation: "fadeIn 0.3s ease", marginTop: 14 }}>
        {currentPage === "home" && (
          <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
            <div style={{
              textAlign: "center", padding: "36px 20px 28px",
              background: "linear-gradient(135deg, #78909C11, #A78BFA11)",
              borderRadius: 28, marginBottom: 20,
            }}>
              <div style={{ fontSize: 64, marginBottom: 10 }}>♟️</div>
              <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 28, fontWeight: 700, color: "#2D3436", margin: "0 0 8px" }}>
                Chess Exercises — Together!
              </h2>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 19, color: "#666", lineHeight: 1.5, margin: "0 0 12px" }}>
                She knows how the pieces move. Now let's build real skills — at the board, side by side.
              </p>
              <div style={{
                fontFamily: "'Nunito', sans-serif", fontSize: 16, color: "#999",
                background: "#F5F5F5", borderRadius: 14, padding: "10px 18px", display: "inline-block",
              }}>
                🔑 Each lesson: <strong>Clear objective</strong> → <strong>Board exercises</strong> → <strong>Daily practice</strong> → <strong>Move on when ready</strong>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {LESSONS.map((lesson, i) => {
                const done = progress[`lesson${lesson.id}`];
                return (
                  <div key={lesson.id} onClick={() => setCurrentPage(`lesson${lesson.id}`)} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: "white", borderRadius: 20, padding: "16px 20px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.04)", cursor: "pointer",
                    border: `2px solid ${done ? "#66BB6A33" : lesson.color + "22"}`,
                    animation: "fadeSlideUp 0.4s ease-out both", animationDelay: `${i * 0.05}s`,
                  }}>
                    <div style={{
                      fontSize: 30, minWidth: 52, height: 52,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: done ? "#E8F5E9" : lesson.colorLight, borderRadius: 16,
                    }}>{done ? "✅" : lesson.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 19, fontWeight: 600, color: "#2D3436" }}>
                        <span style={{ color: lesson.color, opacity: 0.5 }}>{lesson.id}.</span> {lesson.title}
                      </div>
                      <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: "#999" }}>
                        {lesson.subtitle}
                      </div>
                    </div>
                    <div style={{ fontSize: 20, color: "#CCC" }}>→</div>
                  </div>
                );
              })}
            </div>

            {/* What you need */}
            <div style={{
              background: "#F0FFFE", borderRadius: 22, padding: "20px 24px",
              border: "2px solid #4ECDC433",
            }}>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 20, fontWeight: 700, color: "#4ECDC4", marginBottom: 10 }}>
                🛒 What You Need
              </div>
              {[
                { label: "REQUIRED", item: "A physical chess board and pieces", color: "#E53935" },
                { label: "FREE", item: "Lichess.org for puzzles — lichess.org/training", color: "#66BB6A" },
                { label: "HELPFUL", item: "Coins or small objects for board exercises", color: "#F59E0B" },
                { label: "OPTIONAL", item: "A notebook to track scores and missions", color: "#2196F3" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                  <span style={{
                    fontFamily: "'Fredoka', sans-serif", fontSize: 12, fontWeight: 700, color: row.color,
                    background: row.color + "15", padding: "3px 10px", borderRadius: 8, minWidth: 70, textAlign: "center",
                  }}>{row.label}</span>
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 17, color: "#555" }}>{row.item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {LESSONS.map(l => (
          currentPage === `lesson${l.id}` && <LessonPage key={l.id} lesson={l} progress={progress} setProgress={setProgress} />
        ))}
      </div>
    </div>
  );
}
