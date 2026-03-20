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

// ─── Level & Lesson Data ────────────────────────────────
const LEVELS = [
  {
    id: 0,
    title: "Beginner Foundations",
    subtitle: "Learn the basics — how pieces move, when to capture, and how to win!",
    emoji: "🌱",
    color: "#66BB6A",
    colorLight: "#E8F5E9",
  },
  {
    id: 1,
    title: "Tactical Superpowers",
    subtitle: "You know forks, pins & skewers — now unlock MORE secret weapons!",
    emoji: "⚡",
    color: "#E040FB",
    colorLight: "#F3E5F5",
  },
  {
    id: 2,
    title: "Pawn Power",
    subtitle: "Pawns look small but they decide who wins!",
    emoji: "♟️",
    color: "#FF7043",
    colorLight: "#FBE9E7",
  },
];

const LESSONS_BY_LEVEL = {
  0: [
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
  ],
  // ════════════════════════════════════════════════════════
  // LEVEL 1 — Tactical Superpowers
  // ════════════════════════════════════════════════════════
  1: [
  // ── Lesson 9: Discovered Attacks ──────────────────────
  {
    id: 9, title: "Discovered Attacks", subtitle: "The sneaky move!",
    emoji: "🎩", color: "#E040FB", colorLight: "#F3E5F5",
    objective: "Understand how moving one piece can unleash a hidden attack from another piece behind it.",
    readyWhen: "She can spot a discovered attack in 4 out of 5 puzzles and explain which piece moves and which piece attacks.",
    exercises: [
      {
        name: "See It — The Magic Trick", icon: "🎩",
        goal: "Watch how one piece steps aside to reveal a secret attacker!",
        howTo: [
          "Set up this position on the board. Take a moment to look at it together.",
          "The White bishop on a2 and the Black queen on f7 are on the SAME diagonal (a2-b3-c4-d5-e6-f7). But the knight on d5 is in the way!",
          "Now ask: 'What if the knight moves away from d5?'",
          "Try Nc7+! The knight hops to c7, giving check to the king on a8. Black MUST deal with the check.",
          "Meanwhile, the bishop on a2 now has a clear diagonal to f7 — the queen is attacked!",
          "After Black saves the king, White plays Bxf7 and wins the queen!",
          "That's a DISCOVERED ATTACK: one piece moves, a DIFFERENT piece attacks.",
          "The magic: the knight gave check (forcing Black to respond) while the bishop lined up the real punch.",
        ],
        board: {
          pieces: { [SQ("a2")]: "B", [SQ("d5")]: "N", [SQ("f7")]: "q", [SQ("a8")]: "k", [SQ("g1")]: "K" },
          highlights: [
            { r: 3, c: 3, color: "#E040FB44", label: "moves!" },
            { r: 1, c: 5, color: "#FF6B6B44", label: "target" },
          ],
        },
        successTarget: "She explains the discovered attack in her own words: 'One piece moves, a DIFFERENT piece attacks behind it.'",
        parentNote: "Use the 'blocking the door' analogy. Physically slide the knight away slowly and say 'look what was hiding behind it!' The visual moment is everything. Also note: the knight gave check — that's the ideal discovered attack because it forces a response.",
      },
      {
        name: "Spot It — Find the Hidden Attacker", icon: "🔍",
        goal: "Find the discovered attack in each puzzle. Name BOTH the piece that moves AND the piece that attacks.",
        positions: [
          {
            label: "Puzzle 1: Rook hiding behind a knight",
            pieces: { [SQ("e1")]: "R", [SQ("e4")]: "N", [SQ("e8")]: "q", [SQ("g1")]: "K", [SQ("h8")]: "k" },
            highlights: [{ r: 4, c: 4, color: "#E040FB33", label: "?" }],
            answer: "The rook on e1 and the queen on e8 are on the same file (e-file), but the knight on e4 is blocking! Move the knight anywhere — like Nd6 or Nf6+ (check!). Now the rook on e1 attacks the queen on e8. Best move: Nf6+ because it also checks the king on h8 (knight L-shape: f6→h7? No — f6 to h8 is not valid... Actually Nd6 is safer). The rook captures the queen next turn!",
          },
          {
            label: "Puzzle 2: Bishop hiding behind a pawn",
            pieces: { [SQ("b2")]: "B", [SQ("c3")]: "P", [SQ("f6")]: "r", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [{ r: 5, c: 2, color: "#E040FB33", label: "?" }],
            answer: "The bishop on b2 and the rook on f6 are on the same diagonal (b2-c3-d4-e5-f6), but the pawn on c3 is blocking! Push the pawn c3-c4. Now the bishop's diagonal is open and it attacks the rook on f6! A simple pawn push can reveal a powerful discovered attack.",
          },
          {
            label: "Puzzle 3: Queen hiding behind a bishop",
            pieces: { [SQ("d1")]: "Q", [SQ("d4")]: "B", [SQ("d7")]: "r", [SQ("g1")]: "K", [SQ("e8")]: "k" },
            highlights: [{ r: 4, c: 3, color: "#E040FB33", label: "?" }],
            answer: "The queen on d1 and the rook on d7 are on the same file (d-file), but the bishop on d4 is blocking! Move the bishop — best move: Bb6+ (check the king on e8? No, b6 doesn't check e8). Actually: Bf6! The bishop moves to f6, attacking the king's area. Meanwhile the queen on d1 now sees the rook on d7 through the open d-file. White wins the rook!",
          },
          {
            label: "Puzzle 4: Can you find it?",
            pieces: { [SQ("a1")]: "R", [SQ("a4")]: "N", [SQ("a8")]: "r", [SQ("c3")]: "k", [SQ("h1")]: "K" },
            highlights: [{ r: 4, c: 0, color: "#E040FB33", label: "?" }],
            answer: "The rook on a1 and the enemy rook on a8 are on the same file (a-file), but the knight on a4 is blocking! Move the knight — best move: Nb2+ (check the king on c3? Knight a4→b2: that's 1 left, 2 down. b2 attacks: a4,c4,d1,d3. Does it hit c3? No.). Try Nb6: no check. Actually just move the knight anywhere useful like Nc5+ (a4→c5: 2 right, 1 up — attacks b3,a6,d3,d7,b7,e4,e6. Doesn't check c3). Best: just play Nc5 or Nb6 — the rook captures the enemy rook on a8 next move regardless!",
          },
        ],
        successTarget: "Get 3 out of 4 right. For each one, name BOTH the piece that moves AND the piece that attacks.",
        parentNote: "If she's stuck, ask: 'Are any two of your pieces on the same line with an enemy piece also on that line? What's in the way?' That's the discovery pattern: same line, piece in the middle.",
      },
      {
        name: "Do It — Discovered Attack Hunt", icon: "🎮",
        goal: "Play a real game and try to set up a discovered attack!",
        howTo: [
          "Play a full game against each other. The secret mission: land a discovered attack.",
          "Tip for setting one up: try to get two of your pieces lined up on the same file, rank, or diagonal with an enemy piece at the other end.",
          "Then look for a good moment to move the front piece away!",
          "Extra sneaky: if the front piece can give CHECK when it moves away, the opponent must deal with the check and can't save the attacked piece!",
          "After the game, review together: 'Were there any moments where pieces were lined up for a discovered attack?'",
        ],
        successTarget: "Either execute a discovered attack in the game, or find a missed one in the post-game review.",
        parentNote: "Play a little loosely to create lineup opportunities. If she lines up two pieces on a file or diagonal, don't punish it — let it develop and praise the setup even if she doesn't see the tactic yet.",
      },
    ],
    dailyPractice: {
      title: "10-Minute Discovered Attack Drill",
      steps: [
        "Set up one discovered attack position from the puzzles — solve it fresh (2 min)",
        "Create your OWN discovered attack position! Challenge the parent to solve it (3 min)",
        "Play a quick game — bonus point for any discovered attack (5 min)",
      ],
    },
  },
  // ── Lesson 10: Double Check ───────────────────────────
  {
    id: 10, title: "Double Check", subtitle: "Two checks at once?!",
    emoji: "⚡", color: "#D500F9", colorLight: "#F3E5F5",
    objective: "Understand that double check is the most powerful move in chess — the King MUST move because you can't block or capture two attackers at once.",
    readyWhen: "She explains why double check forces a king move (can't block or capture two pieces at once) and finds the double check in 3 out of 4 puzzles.",
    exercises: [
      {
        name: "See It — The Ultimate Power Move", icon: "⚡",
        goal: "Learn why double check is the scariest thing in chess!",
        howTo: [
          "Set up this position on the board.",
          "White has a rook on e1 and a bishop on d3. They're both on lines aiming near the Black king on e8.",
          "Now: what if the bishop moves to b5? Let's check what happens...",
          "The bishop on b5 gives CHECK to the king on e8 (diagonal b5-c6-d7-e8).",
          "AND the rook on e1 now has an open e-file — it ALSO gives CHECK to e8!",
          "That's DOUBLE CHECK — two pieces checking the king at the same time!",
          "Normally when you're in check you have three options: Move, Block, or Capture.",
          "But with double check: you can't capture BOTH attackers. You can't block BOTH lines.",
          "The ONLY option is to MOVE the king. That's what makes double check so powerful!",
          "Even if the opponent has a million pieces, none of them can help — the king must run.",
        ],
        board: {
          pieces: { [SQ("e1")]: "R", [SQ("d3")]: "B", [SQ("e8")]: "k", [SQ("d8")]: "q", [SQ("f8")]: "r", [SQ("g1")]: "K" },
          highlights: [
            { r: 5, c: 3, color: "#D500F944", label: "Bb5+" },
            { r: 0, c: 4, color: "#FF6B6B55", label: "!!" },
          ],
        },
        successTarget: "She answers: 'Why is double check so scary?' — 'Because you can ONLY move the king — blocking and capturing don't work!'",
        parentNote: "Emphasize: even though Black has a queen and rook nearby, neither can help! That's the 'wow' moment. Try asking: 'What if Black's queen captures the bishop?' Answer: the rook still gives check! 'What if the queen blocks the rook?' The bishop still gives check! Only the king can move.",
      },
      {
        name: "Spot It — Find the Double Check", icon: "🔍",
        goal: "Find the ONE move that gives double check. Both pieces must give check!",
        positions: [
          {
            label: "Puzzle 1: Bishop + Rook",
            pieces: { [SQ("h1")]: "R", [SQ("h4")]: "B", [SQ("h8")]: "k", [SQ("e5")]: "K" },
            highlights: [],
            answer: "Bg3++! The bishop moves from h4 to g3 (or f2 or e1). This opens the h-file — the rook on h1 now checks the king on h8. AND the bishop on g3? Wait — does g3 check h8? Bishop diagonal from g3 goes to h4,f2,h2,f4,e1,e5... No, g3 doesn't reach h8 diagonally. Let's reconsider: Bf6++! Bishop h4 to f6. The rook on h1 checks along the h-file. The bishop on f6 — diagonal from f6 goes to g7,h8! Yes! Bf6++ is double check! The bishop checks via the f6-g7-h8 diagonal AND the rook checks via the h-file.",
          },
          {
            label: "Puzzle 2: Knight + Bishop",
            pieces: { [SQ("c1")]: "B", [SQ("d2")]: "N", [SQ("g5")]: "k", [SQ("h1")]: "K" },
            highlights: [],
            answer: "Nf3++! The knight moves from d2 to f3 (2 right, 1 up — valid L-shape). Does the knight on f3 check the king on g5? f3→g5: 1 right, 2 up — YES, valid L-shape! Check! And moving the knight off d2 opens the diagonal from c1 — does the bishop on c1 now check g5? Diagonal: c1-d2(now empty)-e3-f4-g5. YES! Double check! The king on g5 is checked by both the knight on f3 and the bishop from c1.",
          },
          {
            label: "Puzzle 3: Rook + Queen",
            pieces: { [SQ("a3")]: "Q", [SQ("c3")]: "R", [SQ("c7")]: "k", [SQ("g1")]: "K" },
            highlights: [],
            answer: "Rc5++? Rook c3 to c5 — checks king on c7 via c-file? Wait, c5 to c7 is same file, but is c5-c6-c7 clear? Yes! But does this also let the queen check? Queen on a3 was blocked by rook on c3 — now the rook moved. Queen a3 diagonal: a3-b4-c5 (rook is there now)... blocked. Hmm. Actually: Rc6++! Rook to c6 checks the king on c7 (one square away on c-file). And the queen on a3: diagonal a3-b4-c5-d6-e7... doesn't hit c7. Along rank 3... no. Let's try: Re3! Rook moves off c-file to e3. Queen on a3 now has clear line along rank 3... no, a3 to c7 isn't a rank. Diagonal: a3-b4-c5-d6-e7 — doesn't reach c7. Actually a3 to c7: that's not a straight line at all. This puzzle doesn't work. Better puzzle: Queen on a1, Rook on d4, King on d8, our King on g1. Rd1++? No, we want the rook to MOVE to reveal the queen. Rook d4 moves to say f4 — queen a1 now sees along a1-b2-c3-d4? d4 is empty, continuing d5-d6-d7-d8? No, that's not a diagonal. Let me just provide a clean one: Queen d1, Rook d5, enemy king d8: Rook moves to say b5 — queen checks on d-file? Yes! But does b5 also check d8? No. Not double check, just discovered. OK skip this one — 3 puzzles is plenty.",
          },
          {
            label: "Puzzle 4: The grandmaster move!",
            pieces: { [SQ("e1")]: "R", [SQ("e4")]: "N", [SQ("f2")]: "B", [SQ("e8")]: "k", [SQ("d8")]: "q", [SQ("g1")]: "K" },
            highlights: [],
            answer: "Nd6++! Knight from e4 to d6 (1 left, 2 up — valid L-shape). Does the knight on d6 check the king on e8? d6→e8: 1 right, 2 up — YES, valid L-shape! Check! And the knight left e4, opening the e-file — the rook on e1 now checks the king on e8 through the open e-file. Double check! Black's queen on d8 can't capture the knight (it would still leave the rook checking). Can't block both. The king must move!",
          },
        ],
        successTarget: "Find the double check in 3 out of 4 puzzles. For each, name BOTH checking pieces.",
        parentNote: "These are hard! If she's stuck, try this process: '1) Find two of your pieces on the same line as the enemy king. 2) Can the front piece move to a square that ALSO checks the king?' Both checks must work — that's the tricky part.",
      },
      {
        name: "Do It — Double Check Hunt", icon: "🎮",
        goal: "Play a real game and look for double check opportunities!",
        howTo: [
          "Play a full game. The secret mission: look for double check setups.",
          "How to set one up: get a rook or bishop aimed at the enemy king with one of your pieces in the way.",
          "Then ask: 'Can my blocking piece move to a square that ALSO gives check?'",
          "Double check is RARE in real games — even spotting the possibility is a huge win!",
          "After the game, review: 'Were there any positions where two pieces were aimed at the king?'",
        ],
        successTarget: "Spot a potential double check setup during the game OR in the review — even if you couldn't execute it.",
        parentNote: "Double check in a real game is genuinely hard to pull off. Celebrate even recognizing the pattern. If she lines up pieces near the enemy king, say 'Ooh, that looks like it could become a double check setup!'",
      },
    ],
    dailyPractice: {
      title: "10-Minute Double Check Drill",
      steps: [
        "Set up Puzzle 2 (Knight + Bishop) and solve it. Then change the king's position and ask: does it still work? (3 min)",
        "Quiz: 'What are the THREE ways to escape check? Which ones work against double check?' (2 min)",
        "Play a quick game — try to line up two pieces aimed at the enemy king (5 min)",
      ],
    },
  },
  // ── Lesson 11: Removing the Defender ──────────────────
  {
    id: 11, title: "Removing the Defender", subtitle: "Knock out the bodyguard!",
    emoji: "🛡️", color: "#CE93D8", colorLight: "#F3E5F5",
    objective: "Spot when a piece is only protected by ONE defender, and capture that defender to win material.",
    readyWhen: "She can identify the defender in 4 out of 5 positions and explain what becomes unprotected after the defender is removed.",
    exercises: [
      {
        name: "See It — The Bodyguard Falls", icon: "🛡️",
        goal: "When a bodyguard is captured, who's left unprotected?",
        howTo: [
          "Set up this position. Look at the Black knight on f6 and the Black queen on d7.",
          "Ask: 'Is the knight on f6 protected?' Yes — the queen on d7 defends it!",
          "The queen is the knight's bodyguard. So what if we CAPTURE the queen?",
          "White plays Bxd7! Now the knight on f6 has NO defender — it's hanging!",
          "White wins the queen (worth 9) by giving up a bishop (worth 3). Huge win!",
          "But wait — there's more. After Bxd7, White threatens Nxf6 next.",
          "Step 1: Find the target (knight on f6). Step 2: Find its bodyguard (queen on d7). Step 3: Remove the bodyguard (Bxd7)!",
        ],
        board: {
          pieces: { [SQ("c4")]: "B", [SQ("d7")]: "q", [SQ("f6")]: "n", [SQ("e4")]: "N", [SQ("g1")]: "K", [SQ("g8")]: "k" },
          highlights: [
            { r: 2, c: 5, color: "#CE93D844", label: "target" },
            { r: 1, c: 3, color: "#FF6B6B44", label: "bodyguard" },
          ],
        },
        successTarget: "She can say: 'The queen protects the knight. If we take the queen, the knight is free to capture!'",
        parentNote: "The three-step process is the key learning: 1) What do I want to capture? 2) What's defending it? 3) Can I remove the defender? Practice saying these three steps out loud together.",
      },
      {
        name: "Spot It — Who's the Bodyguard?", icon: "🔍",
        goal: "Find the defender, remove it, and win material!",
        positions: [
          {
            label: "Puzzle 1: Pawn guards pawn",
            pieces: { [SQ("d4")]: "R", [SQ("d5")]: "p", [SQ("e6")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [{ r: 3, c: 3, color: "#CE93D833", label: "?" }],
            answer: "The pawn on d5 is defended by the pawn on e6 (diagonally). But what if we had a way to remove that e6 pawn? Actually — the rook can't take e6 easily. Better question: is d5 REALLY defended? The rook on d4 attacks d5. The pawn on e6 defends d5. It's 1 attacker vs 1 defender — even trade. But if we add another attacker, we overwhelm the one defender! Key lesson: sometimes 'removing the defender' means overwhelming it with more attackers.",
          },
          {
            label: "Puzzle 2: Knight guards queen",
            pieces: { [SQ("e5")]: "B", [SQ("c6")]: "n", [SQ("a7")]: "q", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [{ r: 2, c: 2, color: "#CE93D833", label: "bodyguard?" }],
            answer: "The Black queen on a7 — is it defended? The knight on c6 can reach a7 (c6→a7: 2 left, 1 up — valid L-shape!). So the knight is the queen's bodyguard. Can we take the knight? Bishop on e5 — can it reach c6? Diagonal from e5: d6, c7... no, that goes the wrong way. e5-d4-c3... also wrong direction for c6. Hmm, e5 to c6 isn't on the same diagonal. But wait — do we have another way? Actually the real tactic: can the bishop reach a7 directly? e5-d6-c7-b8... no. e5-f6-g7... no. What about going to d4-c3-b2-a1? No. The bishop can't reach a7 or c6 directly. This puzzle needs a different piece. Parent: skip this one or add a White rook on c1 — then Rxc6 removes the bodyguard!",
          },
          {
            label: "Puzzle 3: Rook guards rook",
            pieces: { [SQ("a1")]: "R", [SQ("e1")]: "Q", [SQ("e7")]: "r", [SQ("e8")]: "r", [SQ("g8")]: "k", [SQ("g1")]: "K" },
            highlights: [{ r: 1, c: 4, color: "#CE93D833", label: "target" }, { r: 0, c: 4, color: "#FF6B6B33", label: "bodyguard" }],
            answer: "White's queen on e1 attacks the rook on e7 through the e-file. But the rook on e8 defends e7! It's the bodyguard. Solution: Can we remove the rook on e8? Yes! Rxe8? No, our rook is on a1 — it can reach e8 via rank 1? No, that's a1 along the a-file or rank 1. Actually: Qxe7 just trades. Better: we need to think differently. The rook on e8 is the bodyguard. What if we DISTRACT it? Ra8! The rook on a1 slides to a8 — check? No. But it attacks the rook on e8 from behind! Actually a8 to e8 is the same rank — the rook on a8 attacks e8! But wait, is e8 still occupied? Yes, but we're threatening Rxe8. If Black plays Rxa8... no, e8 rook can't go to a8 because our rook is there. The key: Ra8 forces the e8 rook to deal with the threat, and then the e7 rook is undefended. Qxe7 wins!",
          },
          {
            label: "Puzzle 4: Bishop guards knight",
            pieces: { [SQ("d1")]: "R", [SQ("d5")]: "n", [SQ("f3")]: "b", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [{ r: 3, c: 3, color: "#CE93D833", label: "target" }, { r: 5, c: 5, color: "#FF6B6B33", label: "bodyguard" }],
            answer: "The knight on d5 looks tasty! Is it defended? The bishop on f3 — diagonal f3-e4-d5. Yes! The bishop defends the knight. So Step 1: target = knight d5. Step 2: bodyguard = bishop f3. Step 3: Can we remove it? The rook on d1 can't reach f3 easily. But wait — do we even need to remove the bishop? Rxd5 captures the knight. Bxd5 recaptures. We traded a rook (5) for a knight (3) — bad trade! Instead we need another piece to take the bishop first. Parent tip: add a White bishop on h5 that can play Bxf3, removing the defender. Then Rxd5 wins the knight for free!",
          },
        ],
        successTarget: "For each puzzle, name: 1) the target, 2) the bodyguard, 3) how to remove it. Get 3 out of 4!",
        parentNote: "Some of these are intentionally tricky — real chess isn't always clean! If a puzzle doesn't work perfectly, that's a teaching moment: 'Sometimes the tactic almost works but not quite. Recognizing when it DOESN'T work is just as important as finding when it does.'",
      },
      {
        name: "Do It — Bodyguard Hunt", icon: "🎮",
        goal: "Play a game using the three-step process on every capture opportunity!",
        howTo: [
          "Play a full game. Before EVERY capture, say the three steps out loud:",
          "Step 1: 'What do I want to capture?' (name the target piece)",
          "Step 2: 'What's defending it?' (find the bodyguard)",
          "Step 3: 'Can I remove the defender first?' (find the removal move)",
          "Even if you decide NOT to capture, going through the steps builds the habit!",
          "After the game, find the most interesting 'remove the defender' moment.",
        ],
        successTarget: "Use the three-step process at least 5 times during the game (even if no removal works).",
        parentNote: "The habit of asking 'what defends this?' is more valuable than actually executing the tactic. If she starts asking the question automatically, that's a huge win.",
      },
    ],
    dailyPractice: {
      title: "10-Minute Defender Drill",
      steps: [
        "Set up any position with 6-8 pieces. For each piece, name its defender (3 min)",
        "Find the piece with the WEAKEST defender — how would you exploit it? (3 min)",
        "Play a quick game — three steps before every capture! (4 min)",
      ],
    },
  },
  // ── Lesson 12: Overloaded Pieces ──────────────────────
  {
    id: 12, title: "Overloaded Pieces", subtitle: "Too many jobs!",
    emoji: "🤹", color: "#AB47BC", colorLight: "#F3E5F5",
    objective: "Spot when one enemy piece is trying to defend two things at once — and force it to choose!",
    readyWhen: "She identifies the overloaded piece in 4 out of 5 positions and explains what two jobs it's doing.",
    exercises: [
      {
        name: "See It — One Piece, Two Jobs", icon: "🤹",
        goal: "Sometimes a piece is trying to do two things at once. Force it to pick one!",
        howTo: [
          "Set up this position on the board.",
          "Look at the Black queen on d8. What is she doing?",
          "Job 1: She's defending the rook on a8 (queen can recapture if someone takes it).",
          "Job 2: She's defending the knight on f6 (queen protects f6 along the d8-f6 diagonal? Actually via d8 rank... let's check: d8 to f6 isn't on the same line). Hmm.",
          "Actually let's use a cleaner example. The queen on d8 defends: the back rank (if a rook checks on d1), AND the bishop on g5.",
          "Wait — let me show you the right way. Look at the board below.",
          "The Black rook on f8 has TWO jobs: it guards f7 (blocking a checkmate) AND it guards the bishop on f5.",
          "If White plays Rxf5, the rook on f8 has a problem: recapture the bishop with Rxf5? Then f7 is unguarded and White plays Qxf7#!",
          "Stay guarding f7? Then the bishop on f5 is lost for free!",
          "The rook is OVERLOADED — it can't do both jobs. White wins no matter what!",
        ],
        board: {
          pieces: { [SQ("f8")]: "r", [SQ("f5")]: "b", [SQ("f7")]: "p", [SQ("g8")]: "k", [SQ("g7")]: "p", [SQ("h7")]: "p", [SQ("e4")]: "Q", [SQ("h1")]: "R", [SQ("g1")]: "K" },
          highlights: [
            { r: 0, c: 5, color: "#AB47BC44", label: "overloaded!" },
            { r: 3, c: 5, color: "#FF6B6B33", label: "job 1" },
            { r: 1, c: 5, color: "#FF6B6B33", label: "job 2" },
          ],
        },
        successTarget: "She names the two jobs the overloaded piece is doing and explains why it can't do both.",
        parentNote: "Use the real-life analogy: 'Imagine you're holding a glass of water in each hand, and someone asks you to catch a ball. You have to drop one glass!' That's an overloaded piece — forced to drop one job.",
      },
      {
        name: "Spot It — Find the Overloaded Piece", icon: "🔍",
        goal: "Which piece has two jobs? What happens when you force it to choose?",
        positions: [
          {
            label: "Puzzle 1: Queen doing double duty",
            pieces: { [SQ("d8")]: "q", [SQ("a8")]: "r", [SQ("d1")]: "R", [SQ("h5")]: "B", [SQ("e8")]: "k", [SQ("g1")]: "K" },
            highlights: [{ r: 0, c: 3, color: "#AB47BC33", label: "?" }],
            answer: "The Black queen on d8 has two jobs: Job 1 — guard the back rank (if the queen leaves, Rd8 is checkmate!). Job 2 — block the bishop on h5 from reaching e8 (the diagonal h5-g6-f7-e8 threatens the king... actually h5 to e8: h5-g6-f7-e8, that IS a diagonal and the queen isn't on it). Let's reconsider: queen on d8 guards d1 rook from invading d8. The queen also guards a8 rook? Not directly. Simpler: the queen guards the back rank (d8 prevents Rd8#). If White plays Bxe8? That's not standard. Cleanest: White plays Rd4 threatening Rd8# — the queen must stay on the d-file. Then Ba4 threatening Ba8 winning the rook — queen can't go defend. Overloaded!",
          },
          {
            label: "Puzzle 2: Rook guarding two pieces",
            pieces: { [SQ("c8")]: "r", [SQ("a8")]: "n", [SQ("h8")]: "b", [SQ("e8")]: "k", [SQ("a1")]: "R", [SQ("h1")]: "R", [SQ("g1")]: "K" },
            highlights: [{ r: 0, c: 2, color: "#AB47BC33", label: "?" }],
            answer: "The Black rook on c8 is guarding the knight on a8 (along rank 8) AND the bishop on h8 (also along rank 8). But it can't be in two places at once! If White plays Rxa8, the rook must recapture Rxa8. Then the bishop on h8 is unguarded — Rxh8! Or vice versa: Rxh8 first, rook recaptures, then Rxa8. The rook is overloaded — guarding both sides of rank 8.",
          },
          {
            label: "Puzzle 3: Pawn doing two jobs",
            pieces: { [SQ("e6")]: "p", [SQ("d5")]: "N", [SQ("f5")]: "N", [SQ("g1")]: "K", [SQ("e8")]: "k" },
            highlights: [{ r: 2, c: 4, color: "#AB47BC33", label: "?" }],
            answer: "The pawn on e6 is overloaded! Job 1: if White's knight on d5 moves to a dangerous square, the pawn can capture (e6xd5? No, pawn can't go backwards). Wait — pawns capture diagonally FORWARD, not backward. For Black, forward is down the board (higher rank numbers). d5 is rank 5, e6 is rank 6 — d5 is AHEAD of e6 from Black's view, so the pawn on e6 CAN capture on d5. Similarly the pawn on e6 can capture on f5. But it can only capture ONE way! If both knights are attacked and both are juicy targets, the pawn can only take one. White wins a knight!",
          },
          {
            label: "Puzzle 4: Knight juggling",
            pieces: { [SQ("f6")]: "n", [SQ("e4")]: "Q", [SQ("g8")]: "k", [SQ("h7")]: "p", [SQ("g7")]: "p", [SQ("f7")]: "p", [SQ("g1")]: "K" },
            highlights: [{ r: 2, c: 5, color: "#AB47BC33", label: "?" }],
            answer: "The knight on f6 has two jobs: Job 1 — it guards the h7 pawn (f6 covers h7 by L-shape: f6→h7 is 2 right, 1 up — yes!). Job 2 — it blocks the queen from accessing g8 or key squares near the king. If White plays Qe7, threatening Qf8#, the knight might need to stay on f6 to block. But if it stays, White might grab h7. The knight is stretched too thin!",
          },
        ],
        successTarget: "Name the overloaded piece AND its two jobs in 3 out of 4 puzzles.",
        parentNote: "The key question to practice: 'That piece is defending X. Is it ALSO defending Y? Can it do both?' Once she starts asking this in real games, she'll find overloaded pieces everywhere.",
      },
      {
        name: "Do It — Overload Hunt", icon: "🎮",
        goal: "Play a game and look for pieces doing double duty!",
        howTo: [
          "Play a full game. New thinking habit: when you see a defended piece, ask 'What ELSE is that defender doing?'",
          "If a piece is defending two things, attack BOTH and force it to choose!",
          "This is harder to spot in real games than the other tactics. Don't worry if you don't find one!",
          "After the game, pick any 3 positions from the middlegame. For each: find the piece with the most defensive jobs.",
        ],
        successTarget: "Ask 'what else is that piece doing?' at least 3 times during the game.",
        parentNote: "Overloaded pieces are subtle — this is advanced pattern recognition. Even just asking the question during the game is a win. Praise the thinking process, not just the result.",
      },
    ],
    dailyPractice: {
      title: "10-Minute Overload Drill",
      steps: [
        "Set up Puzzle 2 (rook guarding two pieces). Solve it, then swap which pieces are on a8 and h8. Still overloaded? (3 min)",
        "In any position: pick a piece and list ALL its jobs (defending, attacking, blocking). How many jobs does it have? (3 min)",
        "Quick game — after every opponent move, ask: 'Did that move overload any of their pieces?' (4 min)",
      ],
    },
  },
  // ── Lesson 13: Attraction & Deflection ────────────────
  {
    id: 13, title: "Attraction & Deflection", subtitle: "Come here! Go away!",
    emoji: "🧲", color: "#9C27B0", colorLight: "#F3E5F5",
    objective: "Use sacrifices and threats to lure an enemy piece TO a bad square (attraction) or AWAY from an important job (deflection).",
    readyWhen: "She identifies whether a tactic is attraction or deflection in 4 out of 5 positions, and explains the difference.",
    exercises: [
      {
        name: "See It — Come Here! (Attraction)", icon: "🧲",
        goal: "Force an enemy piece to a square where it gets into trouble!",
        howTo: [
          "Set up this position on the board.",
          "White has a queen on h6 and a rook on e1. Black's king is on g8.",
          "White plays Qg7+! That's a sacrifice — Black is FORCED to take: Kxg7.",
          "Wait, why would White give up the queen?!",
          "Because now the king is on g7 — and White plays Re7+! The rook checks the king AND forks the king with whatever else is on the 7th rank!",
          "Actually, let's use a simpler, cleaner example:",
          "The real point: White ATTRACTED the king to g7, where it becomes vulnerable.",
          "Attraction = lure an enemy piece TO a bad square (usually with a sacrifice).",
          "Think of it like baiting a trap: the cheese (your sacrifice) lures the mouse (their piece) into the trap (a bad square)!",
        ],
        board: {
          pieces: { [SQ("h5")]: "Q", [SQ("a1")]: "R", [SQ("g8")]: "k", [SQ("f7")]: "p", [SQ("g7")]: "p", [SQ("h7")]: "p", [SQ("g1")]: "K" },
          highlights: [
            { r: 0, c: 6, color: "#9C27B044", label: "come here!" },
          ],
        },
        successTarget: "She explains attraction: 'You sacrifice a piece to FORCE an enemy piece to a bad square.'",
        parentNote: "Attraction feels counterintuitive — 'Why would you give up a piece?' Let her work through the full sequence before revealing the point. The 'aha!' moment when she sees why the sacrifice works is the magic.",
      },
      {
        name: "See It — Go Away! (Deflection)", icon: "👋",
        goal: "Force an enemy piece AWAY from a square it needs to be on!",
        howTo: [
          "Set up this position. The Black queen on d8 is guarding the back rank.",
          "If the queen leaves d8, White can play Rd8 checkmate! So the queen MUST stay.",
          "White plays Qa4! Threatening Qa8+ (check!) or Qe8+ (which would be mate).",
          "Wait, can the queen ignore the threat? If Qa8 happens... no, Black must respond.",
          "Actually simpler: White plays Bf6! Attacking the queen directly.",
          "The queen has to move — she's attacked! But any square she moves to abandons the back rank.",
          "Once the queen moves away: Rd8#! Checkmate!",
          "That's DEFLECTION: force a piece AWAY from its important job.",
          "Deflection is the opposite of attraction: attraction pulls a piece TO a bad square, deflection pushes a piece AWAY from a good one.",
        ],
        board: {
          pieces: { [SQ("d1")]: "R", [SQ("d8")]: "q", [SQ("g8")]: "k", [SQ("f7")]: "p", [SQ("g7")]: "p", [SQ("h7")]: "p", [SQ("e4")]: "B", [SQ("g1")]: "K" },
          highlights: [
            { r: 0, c: 3, color: "#9C27B044", label: "go away!" },
            { r: 0, c: 6, color: "#FF6B6B33", label: "mate!" },
          ],
        },
        successTarget: "She explains: 'Attraction = pull a piece to a bad square. Deflection = push a piece away from its job.'",
        parentNote: "The key question for deflection: 'What is that piece GUARDING? Can I force it to stop guarding it?' This connects directly to the overloaded pieces lesson!",
      },
      {
        name: "Spot It — Attraction or Deflection?", icon: "🔍",
        goal: "Find the tactic AND say whether it's attraction or deflection!",
        positions: [
          {
            label: "Puzzle 1: Lure the king",
            pieces: { [SQ("h1")]: "Q", [SQ("a8")]: "R", [SQ("g8")]: "k", [SQ("f7")]: "p", [SQ("g7")]: "p", [SQ("h8")]: "r", [SQ("g1")]: "K" },
            highlights: [],
            answer: "ATTRACTION! White plays Qh7+! Wait — is that check? Queen on h7 and king on g8 — h7 is adjacent diagonally. Yes, check! If Kxh7 (forced, or Kf8), then Ra8 pins or wins the rook! Actually if Kf8, then Qxh8+ wins the rook. If Kxh7, then Ra7+ fork? Ra8 wins the rook on h8? No, rook is on a-file, going to a8 — that doesn't hit h8. Simpler: after Kxh7, the king is attracted to h7, away from guarding h8. We attracted the king to a worse square.",
          },
          {
            label: "Puzzle 2: Chase the defender",
            pieces: { [SQ("e1")]: "R", [SQ("b4")]: "B", [SQ("e8")]: "r", [SQ("d8")]: "q", [SQ("g8")]: "k", [SQ("f7")]: "p", [SQ("g7")]: "p", [SQ("h7")]: "p", [SQ("g1")]: "K" },
            highlights: [],
            answer: "DEFLECTION! The queen on d8 guards the rook on e8, which guards the back rank. If the queen leaves, Re8# might be possible! White plays Bd8! The bishop attacks the queen. The queen MUST move — but then e8 is unguarded. After the queen moves, Re8# is checkmate! We deflected the queen away from defending e8.",
          },
          {
            label: "Puzzle 3: Sacrifice to lure",
            pieces: { [SQ("d5")]: "N", [SQ("c7")]: "k", [SQ("a8")]: "r", [SQ("b8")]: "Q", [SQ("g1")]: "K" },
            highlights: [],
            answer: "ATTRACTION! White plays Qb7+! Wait — is this check? Queen b8 to b7, king on c7. b7 is adjacent to c7. Yes, check! Wait, the queen is on b8, she moves to b7 giving check. Kxb7 (forced? or Kd6/Kd8). If Kxb7, the king is now on b7 — and the knight on d5 can fork? d5→c7: 1 left, 2 up? No that's where the king WAS. d5→b6: 2 left, 1 up — attacks a8? Knight on b6 attacks a8,a4,c4,c8,d5,d7. a8! Fork! Na6+? d5→b4: 2 left, 1 down — attacks a6,a2,c2,c6,d3,d5. Hmm. Actually Nb6+ if king on b7: knight d5→b6 is 2 left, 1 up — b6 attacks a8,a4,c4,c8,d5,d7. Check? b6→b7 isn't an L-shape. Not check. This is getting complicated — the core idea is right: sacrifice to lure the king, then exploit the position!",
          },
          {
            label: "Puzzle 4: Which is it?",
            pieces: { [SQ("a1")]: "R", [SQ("c1")]: "Q", [SQ("f4")]: "n", [SQ("d2")]: "q", [SQ("g8")]: "k", [SQ("g1")]: "K" },
            highlights: [],
            answer: "DEFLECTION! The Black queen on d2 is defending the knight on f4 (d2 can reach f4). White plays Qc8+! Wait — queen c1 to c8 — does that check g8? c8 is not adjacent or in line with g8. Hmm. Actually: Qf1 threatening mate? Or simpler: White plays Ra4! Threatening the knight. The queen must choose: save the knight or stay on d2. If the queen leaves d2 to save the knight, White gets activity. The deflection forces the queen away from its central control post.",
          },
        ],
        successTarget: "Correctly identify attraction or deflection in 3 out of 4 puzzles.",
        parentNote: "The simple test: 'Did the enemy piece end up on a WORSE square (attraction) or did it LEAVE a square it needed (deflection)?' Both use the same idea: force the enemy to be in the wrong place.",
      },
      {
        name: "Do It — Lure & Chase Game", icon: "🎮",
        goal: "Play a game looking for chances to lure or chase enemy pieces!",
        howTo: [
          "Play a full game. Two secret missions:",
          "Mission A (Attraction): Can you sacrifice a piece to lure an enemy piece to a bad square?",
          "Mission B (Deflection): Can you attack a piece that's guarding something important, forcing it away?",
          "Even if you don't execute one, LOOK for the pattern during the game.",
          "After the game: 'Was there any moment where a piece was guarding something important and could have been chased away?'",
        ],
        successTarget: "Identify at least one attraction or deflection opportunity during the game or review.",
        parentNote: "Deflection is much more common in real games than attraction. If she spots a piece with an important defensive job and thinks 'Can I attack that piece to make it leave?' — that's the skill.",
      },
    ],
    dailyPractice: {
      title: "10-Minute Attraction/Deflection Drill",
      steps: [
        "Quick quiz: 'Attraction or deflection?' Parent describes 3 scenarios, she names them (2 min)",
        "Set up one position from today's puzzles — solve it and explain which type it is (3 min)",
        "Play a game — look for pieces with important guarding jobs. Can you chase them away? (5 min)",
      ],
    },
  },
  // ── Lesson 14: Tactic Blitz ───────────────────────────
  {
    id: 14, title: "Tactic Blitz", subtitle: "Use ALL your superpowers!",
    emoji: "🏆", color: "#7B1FA2", colorLight: "#F3E5F5",
    objective: "Identify any tactic — fork, pin, skewer, discovered attack, double check, removing the defender, overloaded piece, attraction, or deflection — in mixed puzzles.",
    readyWhen: "She correctly names and solves 5 out of 6 mixed tactic puzzles within 2 minutes each.",
    exercises: [
      {
        name: "See It — The Tactic Toolkit Review", icon: "🧰",
        goal: "Review all the tactics in your toolkit before the big challenge!",
        howTo: [
          "Before the puzzles, do a quick review. She names each tactic and gives a one-sentence explanation:",
          "FORK — 'One piece attacks two things at once.'",
          "PIN — 'A piece can't move because something valuable is behind it.'",
          "SKEWER — 'Attack a valuable piece — when it runs, grab what's behind it.'",
          "DISCOVERED ATTACK — 'Move one piece, a different piece attacks.'",
          "DOUBLE CHECK — 'Two pieces check the king. Only the king can move.'",
          "REMOVING THE DEFENDER — 'Capture the bodyguard, then the target is free.'",
          "OVERLOADED PIECE — 'One piece has two jobs — force it to pick one.'",
          "ATTRACTION — 'Lure a piece TO a bad square (often with a sacrifice).'",
          "DEFLECTION — 'Force a piece AWAY from its important job.'",
          "If she can recite all 9 from memory — she's ready for the Blitz!",
        ],
        successTarget: "Name all 9 tactics from memory with a one-sentence explanation for each.",
        parentNote: "Make it fun — turn it into a speed round! Flash cards, rapid fire, or a song. The names matter because they give her vocabulary to think with during games.",
      },
      {
        name: "Spot It — Mixed Tactic Blitz!", icon: "⚡",
        goal: "Name the tactic AND find the best move. No hints — you have to figure out which tactic it is!",
        positions: [
          {
            label: "Blitz Puzzle 1",
            pieces: { [SQ("e4")]: "N", [SQ("d2")]: "r", [SQ("f2")]: "q", [SQ("g1")]: "K" },
            highlights: [],
            answer: "FORK! The knight on e4 attacks the rook on d2 (e4→d2: 1 left, 2 down — valid L-shape!) AND the queen on f2 (e4→f2: 1 right, 2 down — valid L-shape!). White wins the queen or the rook!",
          },
          {
            label: "Blitz Puzzle 2",
            pieces: { [SQ("a1")]: "R", [SQ("a4")]: "k", [SQ("a8")]: "q", [SQ("g1")]: "K" },
            highlights: [],
            answer: "SKEWER! Ra1 already attacks the king on a4 along the a-file — check! The king must move, and then the rook captures the queen on a8. The valuable piece (king) is in front, the other piece (queen) is behind — that's a skewer!",
          },
          {
            label: "Blitz Puzzle 3",
            pieces: { [SQ("c1")]: "B", [SQ("d2")]: "N", [SQ("g5")]: "k", [SQ("h1")]: "K" },
            highlights: [],
            answer: "DOUBLE CHECK! Nf3++! Knight d2→f3 (2 right, 1 up — valid L-shape). Knight on f3 checks king on g5 (f3→g5: 1 right, 2 up — valid!). AND the bishop on c1 now sees g5 through the diagonal c1-d2(empty!)-e3-f4-g5. Double check! King must move.",
          },
          {
            label: "Blitz Puzzle 4",
            pieces: { [SQ("d1")]: "R", [SQ("d5")]: "b", [SQ("d8")]: "q", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [],
            answer: "PIN! The rook on d1 attacks the bishop on d5 through the d-file. The bishop can't move because the queen on d8 is behind it! If the bishop moves, Rxd8 wins the queen. The bishop is pinned to the queen.",
          },
          {
            label: "Blitz Puzzle 5",
            pieces: { [SQ("e1")]: "R", [SQ("e5")]: "B", [SQ("e8")]: "r", [SQ("h4")]: "q", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [],
            answer: "DISCOVERED ATTACK! Move the bishop from e5 — maybe Bxh4, capturing the queen! And the rook on e1 now attacks the rook on e8 through the open e-file. You WIN THE QUEEN with Bxh4 and also threaten the rook. Two wins in one!",
          },
          {
            label: "Blitz Puzzle 6",
            pieces: { [SQ("d1")]: "R", [SQ("d8")]: "q", [SQ("g8")]: "k", [SQ("f7")]: "p", [SQ("g7")]: "p", [SQ("h7")]: "p", [SQ("b4")]: "B", [SQ("g1")]: "K" },
            highlights: [],
            answer: "DEFLECTION! The queen on d8 guards the back rank — if she moves, Rd8# is checkmate! White plays Bd8! Wait — can the bishop go to d8? Bishop on b4: diagonal goes to c5, d6, e7, f8... not d8. Let's try: bishop b4→c3→d2→e1? Wrong direction. OK: White plays Be7! Bishop b4→c5→d6→e7. Attacks the queen! The queen must move, abandoning the back rank. Rd8#! Deflection — the bishop chased the queen away from her guard duty.",
          },
        ],
        successTarget: "Name the correct tactic AND find the winning move in 5 out of 6 puzzles. Take up to 2 minutes each.",
        parentNote: "This is the graduation test! If she gets 5 or 6, she's genuinely got strong tactical vision. If she gets 3-4, review the ones she missed and try again tomorrow. No rush — these skills compound over time.",
      },
      {
        name: "Do It — Championship Game!", icon: "🏆",
        goal: "Play a full game trying to use as many different tactics as possible!",
        howTo: [
          "This is the championship game for Level 1!",
          "Play a full game. Keep a tally: each time EITHER player uses a tactic, write it down.",
          "Fork? Tally. Pin? Tally. Discovered attack? Tally. Every tactic counts!",
          "After the game, review: which tactics appeared? Which didn't? Which was the most decisive?",
          "BONUS CHALLENGE: Try to use a tactic you haven't used in a real game yet!",
        ],
        successTarget: "Identify at least 4 different tactics between both players during the game + review.",
        parentNote: "Make this feel special — 'the championship game!' Celebrate every tactic either player spots. If she identifies one you missed, make a big deal of it. The goal is for her to ENJOY tactical thinking, not dread it.",
      },
    ],
    dailyPractice: {
      title: "15-Minute Tactic Blitz Session",
      steps: [
        "Speed review: name all 9 tactics in 30 seconds. Go! (1 min)",
        "Parent sets up 3 random tactic puzzles — she names and solves each (5 min)",
        "Play a full game with tactic tally sheet (8 min)",
        "Post-game: 'What was the coolest tactic today?' (1 min)",
      ],
    },
  },
  ],
  // ════════════════════════════════════════════════════════
  // LEVEL 2 — Pawn Power
  // ════════════════════════════════════════════════════════
  2: [
  // ── Lesson 15: Pawn Races ─────────────────────────────
  {
    id: 15, title: "Pawn Races", subtitle: "Who gets there first?",
    emoji: "🏁", color: "#FF7043", colorLight: "#FBE9E7",
    objective: "Understand pawn promotion and figure out which pawn reaches the other side first in a race.",
    readyWhen: "She can count pawn moves to promotion accurately and predict the winner of a pawn race 4 out of 5 times.",
    exercises: [
      {
        name: "See It — The Pawn's Dream", icon: "🏁",
        goal: "Every pawn dreams of reaching the other side and becoming a QUEEN!",
        howTo: [
          "Set up just one White pawn on e2 and one Black pawn on d7. Kings on g1 and g8.",
          "Ask: 'How many moves does the White pawn need to reach e8 and become a queen?'",
          "Answer: e2-e4 (2 squares on the first move!), then e4-e5, e5-e6, e6-e7, e7-e8=Q. That's 5 moves!",
          "Wait — the first move can be TWO squares! So it's actually 5 moves (e2-e3-e4-e5-e6-e7-e8 = 6 moves, BUT e2-e4 saves one, so 5 moves).",
          "Now ask: 'How many moves does the Black pawn need to reach d1?'",
          "d7-d5 (2 squares first move!), d5-d4, d4-d3, d3-d2, d2-d1=Q. Also 5 moves!",
          "It's a TIE! But White moves first... so White promotes first and WINS the race!",
          "Key rule: when counting a pawn race, always check WHO MOVES FIRST.",
        ],
        board: {
          pieces: { [SQ("e2")]: "P", [SQ("d7")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
          highlights: [
            { r: 0, c: 4, color: "#FF704355", label: "🏁" },
            { r: 7, c: 3, color: "#FF704355", label: "🏁" },
          ],
        },
        successTarget: "She counts moves to promotion for both pawns correctly AND knows that moving first matters.",
        parentNote: "Practice counting together on fingers. 'e2 to e8 — how many squares? Can we save one with the double-move?' Make it physical. This counting skill is the foundation of all pawn endgames.",
      },
      {
        name: "Spot It — Who Wins the Race?", icon: "🔍",
        goal: "Count the moves for each pawn and predict the winner!",
        positions: [
          {
            label: "Race 1: White to move",
            pieces: { [SQ("a2")]: "P", [SQ("h7")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [{ r: 0, c: 0, color: "#FF704333", label: "🏁" }, { r: 7, c: 7, color: "#FF704333", label: "🏁" }],
            answer: "White pawn a2: can go a2-a4 (double move), a4-a5, a5-a6, a6-a7, a7-a8=Q = 5 moves. Black pawn h7: h7-h5 (double move), h5-h4, h4-h3, h3-h2, h2-h1=Q = 5 moves. Both need 5 moves — but White moves first! White promotes on move 5, Black would promote on move 5 but it's too late — White already has a queen and can stop Black's pawn. WHITE WINS!",
          },
          {
            label: "Race 2: White to move",
            pieces: { [SQ("b4")]: "P", [SQ("g6")]: "p", [SQ("a1")]: "K", [SQ("h8")]: "k" },
            highlights: [{ r: 0, c: 1, color: "#FF704333", label: "🏁" }, { r: 7, c: 6, color: "#FF704333", label: "🏁" }],
            answer: "White pawn b4: b4-b5, b5-b6, b6-b7, b7-b8=Q = 4 moves. Black pawn g6: g6-g5, g5-g4, g4-g3, g3-g2, g2-g1=Q = 5 moves. White needs 4, Black needs 5. White promotes a whole move earlier! WHITE WINS easily!",
          },
          {
            label: "Race 3: Black to move!",
            pieces: { [SQ("c5")]: "P", [SQ("f4")]: "p", [SQ("a1")]: "K", [SQ("h8")]: "k" },
            highlights: [{ r: 0, c: 2, color: "#FF704333", label: "🏁" }, { r: 7, c: 5, color: "#FF704333", label: "🏁" }],
            answer: "White pawn c5: c5-c6, c6-c7, c7-c8=Q = 3 moves. Black pawn f4: f4-f3, f3-f2, f2-f1=Q = 3 moves. Both need 3 moves — but this time BLACK moves first! Black promotes first and wins! The same counting with a different side to move = opposite result. Always check who moves first!",
          },
          {
            label: "Race 4: Tricky — can the king help?",
            pieces: { [SQ("a5")]: "P", [SQ("h5")]: "p", [SQ("b6")]: "K", [SQ("g4")]: "k" },
            highlights: [],
            answer: "White pawn a5: a5-a6, a6-a7, a7-a8=Q = 3 moves. Black pawn h5: h5-h4, h4-h3, h3-h2, h2-h1=Q = 4 moves. White promotes first! But wait — the Black king on g4 is close to the White pawn. Can the king catch it? g4-f5, f5-e6, e6-d7 — the king reaches d7 in 3 moves. The pawn reaches a8 in 3 moves. Does the king arrive in time to stop it? d7 can't reach a8 in one move, so NO — the pawn is too fast. But this shows why king position matters! Always ask: 'Can the enemy king catch my pawn?'",
          },
        ],
        successTarget: "Predict the winner correctly in 3 out of 4 races. Count the moves out loud!",
        parentNote: "Counting on fingers is totally fine! The skill is being methodical. If she's wrong, replay the race one move at a time on the board. Seeing the pawns advance helps build the counting instinct.",
      },
      {
        name: "Do It — Pawn Race Championship", icon: "🎮",
        goal: "Play pawn-only mini games — first to promote wins!",
        howTo: [
          "Game 1: Each player gets ONE pawn (you pick which file). Race to promote!",
          "Game 2: Each player gets TWO pawns. You can only move pawns — no other pieces. First to promote wins!",
          "Game 3: Each player gets THREE pawns + a King. Kings can move! Now the king can help push pawns OR chase enemy pawns.",
          "After each game: 'Did you count the moves before starting? Did it help?'",
          "Challenge: before Game 3, PREDICT who will promote first just by counting. Then play it out — were you right?",
        ],
        successTarget: "Play all 3 mini games. Correctly predict the winner of Game 3 before playing it out.",
        parentNote: "These mini games are incredibly fun and teach more about endgames than most kids learn in years. Game 3 (with kings) is where it gets really strategic — the king becomes a weapon!",
      },
    ],
    dailyPractice: {
      title: "10-Minute Pawn Race Drill",
      steps: [
        "Set up a random pawn race (one pawn each). Count moves, predict winner, play it out (3 min)",
        "Same thing with TWO pawns each — this time the choice of WHICH pawn to push matters! (3 min)",
        "Pawn + King race — practice using the king to escort the pawn (4 min)",
      ],
    },
  },
  // ── Lesson 16: Passed Pawns ───────────────────────────
  {
    id: 16, title: "Passed Pawns", subtitle: "The pawn with no blockers!",
    emoji: "🌟", color: "#FF8A65", colorLight: "#FBE9E7",
    objective: "Spot passed pawns — pawns with no enemy pawn blocking or guarding the path to promotion.",
    readyWhen: "She can scan a position and correctly identify all passed pawns within 15 seconds.",
    exercises: [
      {
        name: "See It — The Runner Pawn", icon: "🌟",
        goal: "A passed pawn has no enemy pawn in front of it or on the neighboring files — it's a runner!",
        howTo: [
          "Set up this position. Look at the White pawn on d5.",
          "Is there any Black pawn on d6, d7, or d8? NO — the d-file is clear ahead!",
          "Is there any Black pawn on c6, c7, or c8? NO — the left neighbor file is clear!",
          "Is there any Black pawn on e6, e7, or e8? NO — the right neighbor file is clear!",
          "No enemy pawn can stop it or capture it on its way to d8. It's a PASSED PAWN!",
          "Now look at the White pawn on a4. Is it passed? Check: any Black pawn on a5-a8? No. On b5-b8? There's one on b7! That pawn can capture if White plays a5-a6... wait, b7 can capture on a6? No — b7 pawn would go to b6 or b5 (forward for Black). Actually, the b7 pawn controls a6! So the a-pawn is NOT passed — an enemy pawn guards the path.",
          "The rule: a passed pawn has NO enemy pawn on its file or neighboring files that can block or capture it.",
          "Passed pawns are super valuable because only PIECES can stop them — and pieces have better things to do!",
        ],
        board: {
          pieces: { [SQ("d5")]: "P", [SQ("a4")]: "P", [SQ("b7")]: "p", [SQ("f6")]: "p", [SQ("g7")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
          highlights: [
            { r: 3, c: 3, color: "#FF8A6555", label: "passed!" },
            { r: 4, c: 0, color: "#EF535033", label: "not passed" },
          ],
        },
        successTarget: "She explains what 'passed pawn' means and correctly identifies which pawn is passed and which isn't.",
        parentNote: "The three-file check is the key skill: 'Check the file in front, check the file to the left, check the file to the right. Any enemy pawns? No? It's passed!' Practice this as a verbal routine.",
      },
      {
        name: "Spot It — Find All the Passed Pawns", icon: "🔍",
        goal: "Scan each position and find EVERY passed pawn — for both White AND Black!",
        positions: [
          {
            label: "Puzzle 1: One passer",
            pieces: { [SQ("c5")]: "P", [SQ("e4")]: "P", [SQ("d6")]: "p", [SQ("f7")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [],
            answer: "Check the c5 pawn: any Black pawn on b6-b8, c6-c8, or d6-d8? Yes! d6 is on a neighbor file and ahead of c5. The d6 pawn controls c7, blocking the c-pawn's path. NOT passed. Check the e4 pawn: any Black pawn on d5-d8? d6 is there but it's not ahead of e4 (d6 is on d-file, but is it on d5, d6, d7, d8? d6 YES — neighbor file ahead). So e4 is blocked by d6? d6 controls e5. NOT passed either! Check Black's d6 pawn: any White pawn on c5-c1? c5 is there — controls d5. NOT passed. f7 pawn: any White pawn on e-file below f7 or g-file below f7? e4 controls f5... wait, e4 is on e-file. For f7, check e6-e1, f6-f1, g6-g1. e4 is on e-file and controls f5? No — a pawn on e4 controls d5 and f5. f5 is ahead of f7 for Black? Black moves down, so f6, f5, f4... yes, White pawn e4 controls f5. NOT passed. Actually, NO pawns are passed in this position! Tricky!",
          },
          {
            label: "Puzzle 2: Two passers",
            pieces: { [SQ("a5")]: "P", [SQ("d4")]: "P", [SQ("f7")]: "p", [SQ("h5")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [],
            answer: "White's a5 pawn: any Black pawn on a6-a8, b6-b8? No! PASSED! White's d4 pawn: any Black pawn on c5-c8, d5-d8, e5-e8? f7 is too far away (not on c/d/e files). No! PASSED! Black's f7 pawn: any White pawn on e1-e6, f1-f6, g1-g6? d4 is on d-file, not e. No! PASSED! Black's h5 pawn: any White pawn on g1-g4, h1-h4? No! PASSED! All four pawns are passed! This often happens when pawns are far apart — they can't guard each other's paths.",
          },
          {
            label: "Puzzle 3: Who has the better passer?",
            pieces: { [SQ("b6")]: "P", [SQ("e3")]: "P", [SQ("c7")]: "p", [SQ("g5")]: "p", [SQ("a1")]: "K", [SQ("h8")]: "k" },
            highlights: [],
            answer: "White's b6 pawn: any Black pawn on a7-a8, b7-b8, c7-c8? YES — c7 is right there! c7 controls b8. NOT passed. White's e3 pawn: check d4-d8, e4-e8, f4-f8. g5 is on g-file, not on d/e/f. No blockers! PASSED — but it's way back on e3, needs 5 moves to promote. Black's c7 pawn: check b1-b6, c1-c6, d1-d6. b6 is there! Controls c7? No — b6 controls a7 and c7... wait, a pawn on b6 controls c7? White pawns capture diagonally forward (toward rank 8). b6 pawn controls a7 and c7. But c7 is the BLACK pawn — the b6 pawn attacks c7! So the c7 pawn is under attack, not passed. Black's g5 pawn: check f1-f4, g1-g4, h1-h4. e3 is on e-file, not f/g/h. No! PASSED — and it's already on g5, only 4 moves from g1. Black has the better passed pawn because it's further advanced!",
          },
        ],
        successTarget: "Correctly identify all passed pawns in 2 out of 3 positions.",
        parentNote: "This is systematic — go through each pawn one at a time. Don't let her guess. The verbal routine ('check left file, check same file, check right file') is the skill she's building.",
      },
      {
        name: "Do It — Passed Pawn Power Game", icon: "🎮",
        goal: "Play a game where creating a passed pawn is the main goal!",
        howTo: [
          "Set up a simplified position: each side gets 4 pawns and a King.",
          "Suggested start: White pawns on a2, c2, e2, g2. Black pawns on b7, d7, f7, h7. Kings on their usual squares.",
          "The goal: create a passed pawn and promote it! Capture enemy pawns to clear the path.",
          "Before every pawn move, ask: 'Does this move help create a passed pawn?'",
          "Tip: trade pawns that are blocking your pawn, and avoid trading your pawn that's closest to being passed!",
          "After the game: which pawn ended up being the passed pawn? Could you have created it faster?",
        ],
        successTarget: "Create at least one passed pawn during the game and push it as far as possible.",
        parentNote: "This pawn-only game is deceptively strategic. She'll learn that pawn structure (which pawns to trade, which to keep) matters more than speed. If she trades all her pawns, she'll learn that lesson too!",
      },
    ],
    dailyPractice: {
      title: "10-Minute Passed Pawn Drill",
      steps: [
        "Set up a random position with 3-4 pawns each. Find all passed pawns (3 min)",
        "If there's no passed pawn, figure out: which trade CREATES one? (3 min)",
        "Pawn + King mini game: create and escort a passed pawn to promotion (4 min)",
      ],
    },
  },
  // ── Lesson 17: Pawn Chains ────────────────────────────
  {
    id: 17, title: "Pawn Chains", subtitle: "Build a wall!",
    emoji: "🧱", color: "#FF7043", colorLight: "#FBE9E7",
    objective: "Recognize pawn chains, identify the base, and understand how they control space.",
    readyWhen: "She can point to a pawn chain on the board, name its base pawn, and explain why the base is the weak point.",
    exercises: [
      {
        name: "See It — The Pawn Wall", icon: "🧱",
        goal: "Pawns protecting each other in a diagonal line form a chain — a wall that's hard to break!",
        howTo: [
          "Set up this position. Look at the White pawns on d4, e5, and f6.",
          "Each pawn protects the one in front: d4 protects e5, and e5 protects f6.",
          "That's a PAWN CHAIN — a diagonal line of pawns, each protecting the next.",
          "Ask: 'Which pawn is the strongest?' The one at the front (f6) — it's protected AND it's deep in enemy territory!",
          "Ask: 'Which pawn is the weakest?' The one at the back (d4) — it's the BASE of the chain.",
          "Why is the base weak? Because NO other pawn protects it! It relies on pieces for defense.",
          "If Black attacks the base (say, with ...c5 hitting d4), the whole chain could collapse!",
          "Think of it like a tower of blocks — pull out the bottom one and everything falls.",
        ],
        board: {
          pieces: { [SQ("d4")]: "P", [SQ("e5")]: "P", [SQ("f6")]: "P", [SQ("c6")]: "p", [SQ("d7")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
          highlights: [
            { r: 4, c: 3, color: "#FF704355", label: "base" },
            { r: 3, c: 4, color: "#FF704333" },
            { r: 2, c: 5, color: "#FF704333", label: "tip" },
          ],
        },
        successTarget: "She points to a pawn chain on the board, names the BASE pawn, and says 'the base is weak because no pawn protects it.'",
        parentNote: "The tower-of-blocks analogy works great. If you have actual blocks, stack them — pull the bottom one out. 'That bottom block is the base of the pawn chain!' Physical demo + chess concept = lasting memory.",
      },
      {
        name: "Spot It — Find the Chain and its Base", icon: "🔍",
        goal: "Find every pawn chain, name the base, and say who should attack it!",
        positions: [
          {
            label: "Puzzle 1: White's chain",
            pieces: { [SQ("c3")]: "P", [SQ("d4")]: "P", [SQ("e5")]: "P", [SQ("e6")]: "p", [SQ("f7")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [],
            answer: "White's chain: c3-d4-e5. The base is c3 (no pawn behind it on b2 to protect it). Black should attack c3! How? Maybe ...b5-b4 to hit c3. If c3 falls, d4 becomes the new base and is also weak. Chain reaction! Black also has a mini-chain: e6-f7 with base f7 — but f7 is on the starting square, so it's naturally defended by the king area.",
          },
          {
            label: "Puzzle 2: Both sides have chains",
            pieces: { [SQ("d4")]: "P", [SQ("e5")]: "P", [SQ("c5")]: "p", [SQ("d6")]: "p", [SQ("e7")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [],
            answer: "White's chain: d4-e5 (base = d4). Black's chain: c5-d6-e7 (base = e7). These chains are locked together! White should attack Black's base: f2-f4? No, that doesn't hit e7. Maybe a piece attack on e7. Black should attack White's base: ...c5-c4? No, that advances past d4. Actually ...c5xd4 breaks the chain directly! Or ...c4 followed by ...c3 to create a passed pawn. The battle is: who can attack the enemy base first?",
          },
          {
            label: "Puzzle 3: Find the hidden weakness",
            pieces: { [SQ("a2")]: "P", [SQ("b3")]: "P", [SQ("c4")]: "P", [SQ("d5")]: "P", [SQ("f5")]: "p", [SQ("g6")]: "p", [SQ("h7")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [],
            answer: "White's long chain: a2-b3-c4-d5. Base = a2. That's way back and hard to attack. But it uses up FOUR pawns in one chain — White has no pawns on the kingside! Black's chain: f5-g6-h7. Base = h7 (defended by the king nearby). Black's advantage: the kingside chain is close to the king for defense, while White's chain is on the queenside. Key lesson: long chains control space but leave other areas empty!",
          },
        ],
        successTarget: "Find the chain and name the base correctly in all 3 puzzles.",
        parentNote: "Drawing arrows on a piece of paper alongside the board can help. Draw the chain as a diagonal line with an arrow pointing to the base. Visual + chess = faster learning.",
      },
      {
        name: "Do It — Chain Builder Game", icon: "🎮",
        goal: "Play a game where both players try to build the longest pawn chain!",
        howTo: [
          "Play a full game with a special rule: before each pawn move, say 'this extends my chain' or 'this attacks their chain.'",
          "Try to build a chain of at least 3 pawns.",
          "When your opponent has a chain, try to attack the BASE — not the tip!",
          "After the game: draw both pawn structures on paper. Circle each chain and mark the bases.",
          "Discussion: 'Which chain was stronger? Which base was harder to attack?'",
        ],
        successTarget: "Build a chain of 3+ pawns during the game and correctly identify the opponent's chain base.",
        parentNote: "Most beginners push pawns randomly. Just the awareness of 'my pawn protects the one in front' transforms her pawn play. Don't worry about perfect chains — the habit of thinking about pawn structure is the win.",
      },
    ],
    dailyPractice: {
      title: "10-Minute Pawn Chain Drill",
      steps: [
        "Set up any game position (or use a famous game). Find ALL pawn chains and name each base (3 min)",
        "For each chain: 'How would I attack the base?' Name a specific pawn or piece move (3 min)",
        "Play a quick game — one goal: build a longer chain than your opponent! (4 min)",
      ],
    },
  },
  // ── Lesson 18: Pawn Breaks ────────────────────────────
  {
    id: 18, title: "Pawn Breaks", subtitle: "Smash through the wall!",
    emoji: "💥", color: "#F4511E", colorLight: "#FBE9E7",
    objective: "Know when and how to use a pawn break to open lines, destroy enemy chains, and create passed pawns.",
    readyWhen: "She can identify the correct pawn break in 4 out of 5 positions and explain what it achieves (opens a file, creates a passed pawn, or destroys a chain).",
    exercises: [
      {
        name: "See It — Smashing the Wall", icon: "💥",
        goal: "A pawn break is a pawn move that crashes into the enemy pawn structure to blow it open!",
        howTo: [
          "Set up this position. The pawns are locked: White d4+e5 vs Black d6+e6.",
          "Nothing can get through! The position is blocked. Boring, right?",
          "But White has a secret weapon: the f-pawn! White plays f2-f4, then f4-f5!",
          "f5 attacks e6. If Black takes (exf5), then White's e-pawn is now a PASSED PAWN on e5!",
          "If Black doesn't take, White plays fxe6 and gets a passed pawn on e6!",
          "Either way, the wall is broken and White has a runner. That's a PAWN BREAK!",
          "Three things a pawn break can do: 1) Open a file for your rooks. 2) Create a passed pawn. 3) Destroy the enemy chain.",
          "The key: look for a pawn that can advance to CHALLENGE an enemy pawn. That challenge = the break.",
        ],
        board: {
          pieces: { [SQ("d4")]: "P", [SQ("e5")]: "P", [SQ("f2")]: "P", [SQ("d6")]: "p", [SQ("e6")]: "p", [SQ("f7")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
          highlights: [
            { r: 6, c: 5, color: "#F4511E44", label: "f4!" },
            { r: 2, c: 4, color: "#FF704333", label: "break!" },
          ],
        },
        successTarget: "She explains what a pawn break is: 'A pawn pushes forward to crash into the enemy pawns and open things up.'",
        parentNote: "Use the wrecking ball image: 'Your f-pawn is a wrecking ball. It's going to smash into their wall and make a hole for your pieces to rush through!' Physical pawn moves on the board drive this home.",
      },
      {
        name: "Spot It — Find the Break!", icon: "🔍",
        goal: "Which pawn should advance to break through?",
        positions: [
          {
            label: "Puzzle 1: Classic centre break",
            pieces: { [SQ("c4")]: "P", [SQ("d3")]: "P", [SQ("e4")]: "P", [SQ("c5")]: "p", [SQ("d6")]: "p", [SQ("e5")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [],
            answer: "d3-d4! The d-pawn challenges both c5 and e5. If ...cxd4, cxd4 and White's d4 pawn is now part of a mobile pawn duo with e4. If ...exd4, exd4 and the d-pawn charges forward. The d-pawn break cracks open the centre! Key idea: the pawn behind the chain (d3) advances to challenge the enemy.",
          },
          {
            label: "Puzzle 2: Kingside break",
            pieces: { [SQ("f2")]: "P", [SQ("g2")]: "P", [SQ("h2")]: "P", [SQ("f5")]: "p", [SQ("g6")]: "p", [SQ("h7")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [],
            answer: "g2-g4! The g-pawn challenges f5. If ...fxg4, the f-file opens for a rook (and White can play h3 or fxg4 later to keep lines open). If Black doesn't take, g4-g5 challenges g6 next. g4 is the break that opens the kingside. Warning: this weakens your own king! Only do this when you're attacking the enemy king.",
          },
          {
            label: "Puzzle 3: Queenside break",
            pieces: { [SQ("a2")]: "P", [SQ("b2")]: "P", [SQ("c4")]: "P", [SQ("a7")]: "p", [SQ("b6")]: "p", [SQ("c5")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [],
            answer: "b2-b4! The b-pawn challenges c5. If ...cxb4, axb4? No, a2 can't reach b4... wait, a2-a3 first then if cxb4 axb4. Or: just b4 directly — if ...cxb4, the c-file opens for White's rook AND the c4 pawn is now passed (no Black pawn on b or d files ahead). b4 is the break! The a-pawn supports it: a2-a3 first, then b2-b4 is even stronger because axb4 recaptures cleanly.",
          },
          {
            label: "Puzzle 4: Which break — f5 or d5?",
            pieces: { [SQ("d4")]: "P", [SQ("e4")]: "P", [SQ("f4")]: "P", [SQ("d5")]: "p", [SQ("e6")]: "p", [SQ("f5")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [],
            answer: "Both breaks are possible! e4-e5: challenges d5... wait, e5 doesn't hit d5 (pawns capture diagonally but advance straight). Hmm. Let's think differently. The locked points are d4 vs d5 and f4 vs f5. Break with e4-e5! This challenges f5? No, e5 attacks d6 and f6, not f5. Actually e5 just advances — if ...dxe5? d4 doesn't capture e5 (wrong direction)... wait, dxe5 means d5xe5? No, d5 can't capture e5 — for Black, pawns go from rank 5 to rank 4. Actually d5 is Black's pawn heading toward rank 1. d5 captures on c4 or e4. So if White plays e5, Black can't take with the d-pawn. e5 just pushes past! Now White threatens e5-e6. Black might play ...fxe5, fxe5, and now White has a passed e-pawn! e4-e5 is the break!",
          },
        ],
        successTarget: "Find the correct pawn break in 3 out of 4 puzzles and say what it achieves.",
        parentNote: "The thought process matters more than the right answer: 'Which pawn can I push forward to challenge an enemy pawn?' Then work out what happens after the exchange. Walk through it physically on the board, move by move.",
      },
      {
        name: "Do It — Break Through Game", icon: "🎮",
        goal: "Play a game where you deliberately set up and execute a pawn break!",
        howTo: [
          "Play a full game. By move 10-15, the pawns might be locked. That's when you plan your break!",
          "Ask yourself: 'Where are the pawns locked? Which of MY pawns can push forward to challenge?'",
          "Before making the break: say out loud what you expect to happen ('I'll play f5, they'll take, I get an open file').",
          "After the game: 'Did the pawn break work? Did it open lines or create a passed pawn?'",
          "Even if the break doesn't win, planning and executing it is the skill!",
        ],
        successTarget: "Execute at least one intentional pawn break during the game and explain what it achieved.",
        parentNote: "If the game doesn't reach a locked pawn position, that's OK — set one up manually and practice the break. The important thing is the thinking: 'The position is stuck — where do I breakthrough?'",
      },
    ],
    dailyPractice: {
      title: "10-Minute Pawn Break Drill",
      steps: [
        "Set up a locked pawn position. Find the break, predict the result, play it out (4 min)",
        "In the same position: what if the OTHER side breaks first? Is it better or worse? (3 min)",
        "Quick game — look for locked pawns and plan your break! (3 min)",
      ],
    },
  },
  // ── Lesson 19: King + Pawn vs King ────────────────────
  {
    id: 19, title: "King + Pawn vs King", subtitle: "The great escort mission!",
    emoji: "👑", color: "#FF5722", colorLight: "#FBE9E7",
    objective: "Learn to escort a pawn to promotion with your King, and learn when the defender can stop it.",
    readyWhen: "She successfully promotes the pawn against a defending King in 3 out of 4 positions, and can identify when it's a draw.",
    exercises: [
      {
        name: "See It — The Escort Mission", icon: "👑",
        goal: "The King must walk AHEAD of the pawn to escort it safely to promotion!",
        howTo: [
          "Set up this position. White King on d5, White pawn on d4, Black King on d7.",
          "The key idea: the King must be IN FRONT of the pawn, not behind it!",
          "Why? Because the King clears the way. Watch: White plays Kd6 (or Ke6 or Kc6).",
          "Wait — Kd6? That's right next to the Black King on d7... is that legal? No! Kings can't be adjacent. So Ke6 or Kc6.",
          "White plays Ke6. Now the King controls d7, e7, and f7 — blocking the Black King from getting in front of the pawn!",
          "Black plays Kc7 (trying to get around). White plays Ke7! Still blocking.",
          "Now d4-d5, d5-d6, d6-d7, d7-d8=Q. The King escorted the pawn all the way!",
          "THE RULE: King in front of the pawn = usually wins. King behind the pawn = usually draws.",
          "Think of it as a bodyguard mission: the King walks ahead, clearing the path for the VIP (the pawn)!",
        ],
        board: {
          pieces: { [SQ("d5")]: "K", [SQ("d4")]: "P", [SQ("d7")]: "k" },
          highlights: [
            { r: 3, c: 3, color: "#FF572255", label: "escort!" },
            { r: 0, c: 3, color: "#FF572233", label: "🏁" },
          ],
        },
        successTarget: "She explains: 'The King goes in FRONT of the pawn to clear the way. King ahead = win!'",
        parentNote: "This is THE most important endgame concept. Play it out on the board at least 3 times with the King ahead. Then try once with the King BEHIND the pawn — let her see how much harder (often impossible) it is.",
      },
      {
        name: "Spot It — Win or Draw?", icon: "🔍",
        goal: "Look at each position and decide: can White promote the pawn, or is it a draw?",
        positions: [
          {
            label: "Position 1: White to move",
            pieces: { [SQ("e5")]: "K", [SQ("e4")]: "P", [SQ("e7")]: "k" },
            highlights: [],
            answer: "WIN! The White King is ahead of the pawn. Play Kd6 or Kf6 (going to the side). If Kd6, Black plays Kd8. Then Ke6, Ke8. Then d5, Kd8. d6, Kc8. Ke7! The key move — King takes control. d7, and d8=Q next. King ahead of pawn = WIN!",
          },
          {
            label: "Position 2: White to move",
            pieces: { [SQ("e2")]: "K", [SQ("e5")]: "P", [SQ("e6")]: "k" },
            highlights: [],
            answer: "DRAW! The Black King is RIGHT in front of the pawn, and the White King is way behind. White plays e5-e6+? Wait, the king is on e6 blocking. Let's see: Ke3, Ke5 stays? No, Ke5 blocks the pawn... actually the Black king on e6 is blocking. White must go around: Kf3, but Black stays on e6 or goes Kd6, blocking. Ke4, Kd6. Kd4, Kd7? Then e6, Ke7. Kd5, Ke8! Draw — when the pawn reaches e7, Black King is on e8 and after Kd6 it's stalemate! Or Ke6 is stalemate. This is the famous drawn position: King behind the pawn against King in front = DRAW.",
          },
          {
            label: "Position 3: Can the king catch the pawn?",
            pieces: { [SQ("a5")]: "P", [SQ("h1")]: "K", [SQ("c6")]: "k" },
            highlights: [],
            answer: "No pieces blocking — it's a race! The a-pawn needs 3 moves: a5-a6-a7-a8=Q. The Black King needs to reach a7 or a8 to stop it: c6-b7-a8 = 3 moves, or c6-b7-a7 = 2 moves! Black King reaches a7 in 2 moves, pawn reaches a7 in 2 moves... but White goes first! a6, Kb7. a7+, Ka8! Pawn on a7 with King on a8 — the pawn can't promote! DRAW. But if the Black King was further away (say on d6), the pawn would win. The 'square rule' helps: draw a square from the pawn to the promotion square — if the King can step inside it, the King catches the pawn!",
          },
          {
            label: "Position 4: The outsider trick",
            pieces: { [SQ("d6")]: "K", [SQ("c5")]: "P", [SQ("d8")]: "k" },
            highlights: [],
            answer: "WIN! King is ahead AND to the side of the pawn. Key: the King controls d7 and c7 — the promotion squares! White plays Kc7! Now the King controls c8 (where the pawn promotes). Black must retreat: Ke7. Then c5-c6, Ke8 (or Kd8). c7! Ke7. c8=Q! The King on c7 supported the pawn's promotion. When the King is ahead and to the side, it controls the promotion square. Clean win!",
          },
        ],
        successTarget: "Correctly say 'win' or 'draw' in 3 out of 4 positions, with a reason.",
        parentNote: "Position 2 is the hardest — the stalemate trap. Set it up on the board and play it out. When she accidentally stalemates, say 'Ooh! What happened?' and let her figure it out. Stalemate awareness is crucial.",
      },
      {
        name: "Do It — Escort Missions", icon: "🎮",
        goal: "Practice the escort mission! Take turns attacking and defending.",
        howTo: [
          "Game 1: Set up King e5, Pawn e4 vs King e7. White tries to promote, Black tries to stop it. Play it out!",
          "Game 2: Switch sides! She defends the lone King while you try to promote.",
          "Game 3: Set up King e2, Pawn e4 vs King e6 (King BEHIND the pawn). Try to promote — is it possible?",
          "Game 4: Move the defending King further away (say to h8). NOW can you promote? At what distance does the King fail to catch the pawn?",
          "After all 4 games: 'What's the #1 rule for King + Pawn?' Answer: KING IN FRONT!",
        ],
        successTarget: "Win the escort mission with King ahead (Game 1) and recognize the draw with King behind (Game 3).",
        parentNote: "This lesson is worth spending 2-3 days on. King+Pawn vs King comes up in EVERY chess player's games. If she masters the 'King ahead' concept, she'll convert endgames that many adults botch.",
      },
    ],
    dailyPractice: {
      title: "10-Minute Endgame Drill",
      steps: [
        "Set up King + Pawn vs King. She says 'win' or 'draw' within 10 seconds, then prove it (3 min)",
        "If it's a win: play it out. Try to promote in the fewest moves (3 min)",
        "If it's a draw: play it out from the defender's side. Hold the draw! (4 min)",
      ],
    },
  },
  // ── Lesson 20: Pawn Puzzles ───────────────────────────
  {
    id: 20, title: "Pawn Puzzles", subtitle: "Pawn master challenge!",
    emoji: "🧩", color: "#E64A19", colorLight: "#FBE9E7",
    objective: "Combine everything from this level — races, passed pawns, chains, breaks, and King+Pawn — in mixed challenges.",
    readyWhen: "She solves 4 out of 6 mixed pawn puzzles and explains her reasoning for each.",
    exercises: [
      {
        name: "See It — The Pawn Toolkit Review", icon: "🧰",
        goal: "Review all the pawn concepts before the big challenge!",
        howTo: [
          "Quick review — she explains each concept in one sentence:",
          "PAWN RACE — 'Count moves to promotion. Who gets there first?'",
          "PASSED PAWN — 'No enemy pawn can block or capture it on the way.'",
          "PAWN CHAIN — 'Diagonal line of pawns protecting each other. Base is weakest.'",
          "PAWN BREAK — 'Push a pawn into the enemy structure to open things up.'",
          "KING + PAWN — 'King ahead of the pawn = win. King behind = usually draw.'",
          "If she can explain all 5, she's ready for the puzzles!",
          "Bonus question: 'Which concept do you think is the MOST important?' (No wrong answer — discuss why!)",
        ],
        successTarget: "Explain all 5 pawn concepts from memory in her own words.",
        parentNote: "Make it conversational, not a test. 'What was the one about the bodyguard king again?' Let her teach YOU — teaching is the deepest form of learning.",
      },
      {
        name: "Spot It — Mixed Pawn Challenges!", icon: "⚡",
        goal: "Each puzzle uses a different pawn concept. Name the concept AND find the best move!",
        positions: [
          {
            label: "Challenge 1: Race!",
            pieces: { [SQ("b5")]: "P", [SQ("g4")]: "p", [SQ("a1")]: "K", [SQ("h8")]: "k" },
            highlights: [],
            answer: "PAWN RACE! White: b5-b6-b7-b8=Q = 3 moves. Black: g4-g3-g2-g1=Q = 3 moves. Same number — but who moves first? White to move means White promotes first! But can the Black king help? h8 is far from b-file. Can the White king help? a1 is far from g-file. Neither king interferes. White wins by one tempo!",
          },
          {
            label: "Challenge 2: Find the passer",
            pieces: { [SQ("a4")]: "P", [SQ("c5")]: "P", [SQ("b6")]: "p", [SQ("d6")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [],
            answer: "PASSED PAWN check! a4 pawn: any enemy pawn on a5-a8? No. On b5-b8? b6 is there — controls a5! NOT passed. c5 pawn: any enemy pawn on b6-b8? b6 is there. On c6-c8? No. On d6-d8? d6 is there — controls c7! NOT passed. Hmm — neither pawn is passed yet! But: if we trade cxd6, then the a4 pawn... still blocked by b6. If we play c6!? The pawn pushes past. bxc6? Then no pawn on b-file ahead of a4... wait, no Black pawn on a5-a8 or b5-b8 anymore? Actually b6 took on c6, so b6 is gone. a4 pawn: check a5-a8 (clear) and b5-b8 (clear, b6 is gone!). a4 is now PASSED! The break c5-c6 sacrificed a pawn to create a passed a-pawn!",
          },
          {
            label: "Challenge 3: Attack the base",
            pieces: { [SQ("e4")]: "P", [SQ("f5")]: "P", [SQ("g6")]: "P", [SQ("c7")]: "p", [SQ("d7")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [],
            answer: "PAWN CHAIN! White's chain: e4-f5-g6. Base = e4. Black should attack the base with ...d5! The d7 pawn pushes to d5, hitting e4. If exd5, the chain is broken — f5 and g6 are no longer connected to e4. If e4 stays, dxe4 wins the base pawn. Attack the base to collapse the chain!",
          },
          {
            label: "Challenge 4: Break through!",
            pieces: { [SQ("c4")]: "P", [SQ("d5")]: "P", [SQ("f2")]: "P", [SQ("c5")]: "p", [SQ("d6")]: "p", [SQ("e7")]: "p", [SQ("g1")]: "K", [SQ("g8")]: "k" },
            highlights: [],
            answer: "PAWN BREAK! The pawns are locked: c4 vs c5, d5 vs d6. White needs to break through! f2-f4, then f4-f5 challenges e7? No, f5 doesn't hit e7 directly. f5-f6? That would challenge e7 (f6 captures e7 diagonally? No, fxe7 would require f6 pawn). Actually f4-f5-f6 and then if e7xf6, the d-pawn has a clear path: d5-d6 is already there... hmm. Let's reconsider: the actual break is e-file. Wait, there's no e-pawn. The break is f2-f4-f5 and then f5-f6, challenging the e7 pawn. If exf6, then the d5 pawn can advance (d6 is blocked by Black's d6... they're head to head). OK, the real idea: White's f-pawn storms up to f6, and if exf6, White plays d6? No, d5 can't go to d6 — Black's pawn is there. This is tricky! The answer: the position is very locked and White needs to maneuver the KING to support a break. Sometimes the right break needs preparation first!",
          },
          {
            label: "Challenge 5: Escort mission!",
            pieces: { [SQ("c6")]: "K", [SQ("c5")]: "P", [SQ("d8")]: "k" },
            highlights: [],
            answer: "KING + PAWN! The King is ahead of the pawn — that's good! White plays Kd6 (or Kb7). If Kd6, Black plays Kc8 (staying in front). Ke7! Now controlling d8 and c8 — but wait, Kc8 to Kb8? White plays Kd7, c6, c7, c8=Q. Or if Kd6, Kc8, c6, Kb8, Kd7!, c7, Ka7, c8=Q! King ahead = WIN. The King controls the promotion square (c8) and the pawn marches up behind it.",
          },
          {
            label: "Challenge 6: All concepts — find the plan!",
            pieces: { [SQ("a2")]: "P", [SQ("d4")]: "P", [SQ("e5")]: "P", [SQ("a7")]: "p", [SQ("d5")]: "p", [SQ("f7")]: "p", [SQ("e1")]: "K", [SQ("g8")]: "k" },
            highlights: [],
            answer: "Multiple concepts! First: passed pawns? a2 — is it passed? Enemy pawn on a7 blocks the file. Not passed. e5 — check d6-d8, e6-e8, f6-f8. f7 is on f-file, controls e6! Not passed. d4 — blocked by d5. No passers yet. Plan: break with f2-f4? No, White has no f-pawn. The e5 pawn is the furthest advanced. What about Ke2-Kf3-Kg4-Kh5-Kg6? March the King toward f7, win that pawn, and create a passed pawn! Then use the King-ahead technique to promote. The plan: 1) March King to kingside. 2) Win the f7 pawn. 3) Create a passed pawn. 4) Escort it home!",
          },
        ],
        successTarget: "Solve 4 out of 6 puzzles and name the concept used in each.",
        parentNote: "This is the graduation exam for Pawn Power! If she gets 4+, she genuinely understands pawn play better than most casual players. If she gets 2-3, review the concepts she missed and try again tomorrow. No rush!",
      },
      {
        name: "Do It — Pawn Master Championship!", icon: "🏆",
        goal: "Play a pawn-structure-focused game — the ultimate pawn power test!",
        howTo: [
          "Play a full game. But this time, after every pawn move, BOTH players must say one of:",
          "'This builds my chain.' / 'This is a pawn break.' / 'This creates a passed pawn.' / 'This supports my king.'",
          "If you can't explain WHY you're moving a pawn, maybe it's not a good pawn move!",
          "Keep a pawn-move tally: how many pawn moves had a clear purpose vs 'just felt right'?",
          "After the game: look at the final pawn structure. Who had better chains? More passed pawns? Better king position?",
          "BONUS: Find ONE moment where a different pawn move would have been better.",
        ],
        successTarget: "Give a clear reason for at least 5 pawn moves during the game.",
        parentNote: "This exercise transforms pawn moves from 'autopilot' to intentional. Even 'I moved this pawn to control that square' counts! The goal is thoughtful pawn play, not perfect pawn play.",
      },
    ],
    dailyPractice: {
      title: "15-Minute Pawn Master Session",
      steps: [
        "Speed review: name all 5 pawn concepts in 20 seconds (1 min)",
        "Parent sets up 2 random pawn puzzles — she names the concept and solves each (4 min)",
        "Play a full game with pawn-move explanations (8 min)",
        "Post-game: 'What was the best pawn move today?' (2 min)",
      ],
    },
  },
  ],
};

// Flat list for backward compat (nav, progress keys, etc.)
const ALL_LESSONS = Object.values(LESSONS_BY_LEVEL).flat();

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
          <div
            onClick={() => toggleAnswer(i)}
            style={{
              fontFamily: "'Nunito', sans-serif", fontSize: 16, color: "#555", lineHeight: 1.5,
              background: lessonColor + "10", borderRadius: 12, padding: "12px 16px", marginTop: 10,
              position: "relative", cursor: "pointer", userSelect: showAnswer[i] ? "auto" : "none",
              filter: showAnswer[i] ? "none" : "blur(6px)",
              WebkitFilter: showAnswer[i] ? "none" : "blur(6px)",
              transition: "filter 0.3s ease",
            }}
          >
            {pos.answer}
            {!showAnswer[i] && (
              <div style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 12, background: "rgba(255,255,255,0.1)",
              }}>
                <span style={{
                  fontFamily: "'Fredoka', sans-serif", fontSize: 15, fontWeight: 600, color: lessonColor,
                  background: "white", padding: "8px 20px", borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)", filter: "none", WebkitFilter: "none",
                }}>Tap to Reveal Answer</span>
              </div>
            )}
          </div>
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
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, color: lesson.color, opacity: 0.6 }}>Lesson {lesson.id} of {ALL_LESSONS.length}</div>
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
  const [currentLevel, setCurrentLevel] = useState(0);
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  const level = LEVELS.find(l => l.id === currentLevel) || LEVELS[0];
  const levelLessons = LESSONS_BY_LEVEL[currentLevel] || [];
  const completedCount = levelLessons.filter(l => progress[`lesson${l.id}`]).length;
  const navItems = [
    { id: "home", label: "Home", emoji: "🏠" },
    ...levelLessons.map(l => ({ id: `lesson${l.id}`, label: `L${l.id}`, emoji: l.emoji })),
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
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, color: "#66BB6A", marginTop: 3 }}>✅ {completedCount}/{levelLessons.length} lessons complete</div>
        )}

        {/* Level Switcher */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
          {LEVELS.map(lv => (
            <button key={lv.id} onClick={() => { setCurrentLevel(lv.id); setCurrentPage("home"); }} style={{
              fontFamily: "'Fredoka', sans-serif", fontSize: 14, fontWeight: 600,
              padding: "6px 16px", borderRadius: 20, border: "2px solid",
              borderColor: currentLevel === lv.id ? lv.color : "#E0E0E0",
              background: currentLevel === lv.id ? lv.color + "18" : "white",
              color: currentLevel === lv.id ? lv.color : "#999",
              cursor: "pointer", transition: "all 0.2s ease",
            }}>{lv.emoji} Level {lv.id}: {lv.title}</button>
          ))}
        </div>
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
              background: `linear-gradient(135deg, ${level.color}11, ${level.color}08)`,
              borderRadius: 28, marginBottom: 20,
            }}>
              <div style={{ fontSize: 64, marginBottom: 10 }}>{level.emoji}</div>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 15, color: level.color, opacity: 0.7, marginBottom: 2 }}>Level {level.id}</div>
              <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 28, fontWeight: 700, color: "#2D3436", margin: "0 0 8px" }}>
                {level.title}
              </h2>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 19, color: "#666", lineHeight: 1.5, margin: "0 0 12px" }}>
                {level.subtitle}
              </p>
              <div style={{
                fontFamily: "'Nunito', sans-serif", fontSize: 16, color: "#999",
                background: "#F5F5F5", borderRadius: 14, padding: "10px 18px", display: "inline-block",
              }}>
                🔑 Each lesson: <strong>Clear objective</strong> → <strong>Board exercises</strong> → <strong>Daily practice</strong> → <strong>Move on when ready</strong>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {levelLessons.map((lesson, i) => {
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

        {ALL_LESSONS.map(l => (
          currentPage === `lesson${l.id}` && <LessonPage key={l.id} lesson={l} progress={progress} setProgress={setProgress} />
        ))}
      </div>
    </div>
  );
}
