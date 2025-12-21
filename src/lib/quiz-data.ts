/**
 * 4H Personality Quiz Data
 * Archetypes: Hustler, Hacker, Hipster, Hound
 */

export type ArchetypeKey = "Hustler" | "Hacker" | "Hipster" | "Hound";

export interface Choice {
  choice: string;
  weight: Record<ArchetypeKey, number>;
}

export interface Question {
  question: string;
  choices: Choice[];
}

export const questions: Question[] = [
  {
    question: "When starting a project, what excites you most?",
    choices: [
      {
        choice: "Sharing the idea and getting others excited",
        weight: { Hustler: 2, Hacker: 1, Hipster: 0, Hound: 0 },
      },
      {
        choice: "Planning and building the system",
        weight: { Hustler: 0, Hacker: 2, Hipster: 1, Hound: 0 },
      },
      {
        choice: "Coming up with new creative ideas",
        weight: { Hustler: 0, Hacker: 0, Hipster: 2, Hound: 1 },
      },
      {
        choice: "Researching and checking facts",
        weight: { Hustler: 1, Hacker: 0, Hipster: 0, Hound: 2 },
      },
    ],
  },
  {
    question: "How do you deal with unclear situations?",
    choices: [
      {
        choice: "Make a clear plan and guide people",
        weight: { Hustler: 2, Hacker: 0, Hipster: 1, Hound: 0 },
      },
      {
        choice: "Test ideas and try different scenarios",
        weight: { Hustler: 0, Hacker: 2, Hipster: 0, Hound: 1 },
      },
      {
        choice: "Look at it creatively to find new options",
        weight: { Hustler: 1, Hacker: 0, Hipster: 2, Hound: 0 },
      },
      {
        choice: "Collect more information before deciding",
        weight: { Hustler: 0, Hacker: 1, Hipster: 0, Hound: 2 },
      },
    ],
  },
  {
    question: "On a new team, which role do you take first?",
    choices: [
      {
        choice: "Bring people together and get agreement",
        weight: { Hustler: 2, Hacker: 0, Hipster: 0, Hound: 1 },
      },
      {
        choice: "Plan the technical approach",
        weight: { Hustler: 1, Hacker: 2, Hipster: 0, Hound: 0 },
      },
      {
        choice: "Lead creative ideas and prototypes",
        weight: { Hustler: 0, Hacker: 1, Hipster: 2, Hound: 0 },
      },
      {
        choice: "Check details and make sure everything is accurate",
        weight: { Hustler: 0, Hacker: 0, Hipster: 1, Hound: 2 },
      },
    ],
  },
  {
    question: "What gives you the most energy to move forward?",
    choices: [
      {
        choice: "A story that inspires others",
        weight: { Hustler: 2, Hacker: 1, Hipster: 0, Hound: 0 },
      },
      {
        choice: "A working prototype or model",
        weight: { Hustler: 0, Hacker: 2, Hipster: 1, Hound: 0 },
      },
      {
        choice: "A bold, creative idea",
        weight: { Hustler: 0, Hacker: 0, Hipster: 2, Hound: 1 },
      },
      {
        choice: "Clear facts and reliable references",
        weight: { Hustler: 1, Hacker: 0, Hipster: 0, Hound: 2 },
      },
    ],
  },
  {
    question: "When time is tight, what do you focus on?",
    choices: [
      {
        choice: "Communicate clearly and motivate action",
        weight: { Hustler: 2, Hacker: 0, Hipster: 1, Hound: 0 },
      },
      {
        choice: "Deliver a simple, working version",
        weight: { Hustler: 0, Hacker: 2, Hipster: 0, Hound: 1 },
      },
      {
        choice: "Find smart shortcuts that still look good",
        weight: { Hustler: 1, Hacker: 0, Hipster: 2, Hound: 0 },
      },
      {
        choice: "Double-check important details before finishing",
        weight: { Hustler: 0, Hacker: 1, Hipster: 0, Hound: 2 },
      },
    ],
  },
  {
    question: "Which compliment means the most to you?",
    choices: [
      {
        choice: "You inspired everyone to take action",
        weight: { Hustler: 2, Hacker: 0, Hipster: 0, Hound: 1 },
      },
      {
        choice: "Your work is neat and reliable",
        weight: { Hustler: 1, Hacker: 2, Hipster: 0, Hound: 0 },
      },
      {
        choice: "Your ideas are creative and original",
        weight: { Hustler: 0, Hacker: 1, Hipster: 2, Hound: 0 },
      },
      {
        choice: "Your work is thorough and well-documented",
        weight: { Hustler: 0, Hacker: 0, Hipster: 1, Hound: 2 },
      },
    ],
  },
  {
    question: "Which stage of a project do you enjoy most?",
    choices: [
      {
        choice: "Early planning and pitching ideas",
        weight: { Hustler: 2, Hacker: 1, Hipster: 0, Hound: 0 },
      },
      {
        choice: "Solving the main technical problems",
        weight: { Hustler: 0, Hacker: 2, Hipster: 1, Hound: 0 },
      },
      {
        choice: "Improving designs and user experience",
        weight: { Hustler: 0, Hacker: 0, Hipster: 2, Hound: 1 },
      },
      {
        choice: "Checking results carefully and verifying",
        weight: { Hustler: 1, Hacker: 0, Hipster: 0, Hound: 2 },
      },
    ],
  },
  {
    question: "Which tool do you rely on most for your work?",
    choices: [
      {
        choice: "Pitch deck",
        weight: { Hustler: 2, Hacker: 0, Hipster: 1, Hound: 0 },
      },
      {
        choice: "Code editor",
        weight: { Hustler: 0, Hacker: 2, Hipster: 0, Hound: 1 },
      },
      {
        choice: "Sketchpad",
        weight: { Hustler: 1, Hacker: 0, Hipster: 2, Hound: 0 },
      },
      {
        choice: "Data sources",
        weight: { Hustler: 0, Hacker: 1, Hipster: 0, Hound: 2 },
      },
    ],
  },
  {
    question: "How do you resolve a team disagreement?",
    choices: [
      {
        choice: "Present the idea in a way that convinces others",
        weight: { Hustler: 2, Hacker: 0, Hipster: 0, Hound: 1 },
      },
      {
        choice: "Test ideas and run experiments",
        weight: { Hustler: 1, Hacker: 2, Hipster: 0, Hound: 0 },
      },
      {
        choice: "Suggest a creative alternative solution",
        weight: { Hustler: 0, Hacker: 1, Hipster: 2, Hound: 0 },
      },
      {
        choice: "Provide evidence and verified facts",
        weight: { Hustler: 0, Hacker: 0, Hipster: 1, Hound: 2 },
      },
    ],
  },
  {
    question: "Which weekend activity would you prefer?",
    choices: [
      {
        choice: "Networking or sharing ideas",
        weight: { Hustler: 2, Hacker: 1, Hipster: 0, Hound: 0 },
      },
      {
        choice: "Building or working on a project",
        weight: { Hustler: 0, Hacker: 2, Hipster: 1, Hound: 0 },
      },
      {
        choice: "Creative collaboration with others",
        weight: { Hustler: 0, Hacker: 0, Hipster: 2, Hound: 1 },
      },
      {
        choice: "Catching up on reading or research",
        weight: { Hustler: 1, Hacker: 0, Hipster: 0, Hound: 2 },
      },
    ],
  },
  {
    question: "What makes a project feel finished to you?",
    choices: [
      {
        choice: "A story the team is proud to share",
        weight: { Hustler: 2, Hacker: 0, Hipster: 1, Hound: 0 },
      },
      {
        choice: "A solid, working implementation",
        weight: { Hustler: 0, Hacker: 2, Hipster: 0, Hound: 1 },
      },
      {
        choice: "A design that surprises and delights",
        weight: { Hustler: 1, Hacker: 0, Hipster: 2, Hound: 0 },
      },
      {
        choice: "Well-documented and reproducible results",
        weight: { Hustler: 0, Hacker: 1, Hipster: 0, Hound: 2 },
      },
    ],
  },
  {
    question: "How do you recognize a good opportunity?",
    choices: [
      {
        choice: "People get excited and want to join",
        weight: { Hustler: 2, Hacker: 0, Hipster: 0, Hound: 1 },
      },
      {
        choice: "The data clearly shows it's promising",
        weight: { Hustler: 1, Hacker: 2, Hipster: 0, Hound: 0 },
      },
      {
        choice: "It's something new that changes how people think",
        weight: { Hustler: 0, Hacker: 1, Hipster: 2, Hound: 0 },
      },
      {
        choice: "You can back it up with reliable evidence",
        weight: { Hustler: 0, Hacker: 0, Hipster: 1, Hound: 2 },
      },
    ],
  },
  {
    question: "If something breaks, what do you do first?",
    choices: [
      {
        choice: "Calm everyone and decide what's most important",
        weight: { Hustler: 2, Hacker: 1, Hipster: 0, Hound: 0 },
      },
      {
        choice: "Test and find the problem",
        weight: { Hustler: 0, Hacker: 2, Hipster: 1, Hound: 0 },
      },
      {
        choice: "Think of a quick fix to keep things going",
        weight: { Hustler: 0, Hacker: 0, Hipster: 2, Hound: 1 },
      },
      {
        choice: "Check details to understand what went wrong",
        weight: { Hustler: 1, Hacker: 0, Hipster: 0, Hound: 2 },
      },
    ],
  },
  {
    question: "Which contribution do you enjoy most during a project review?",
    choices: [
      {
        choice: "Highlighting team wins",
        weight: { Hustler: 2, Hacker: 0, Hipster: 1, Hound: 0 },
      },
      {
        choice: "Sharing technical lessons learned",
        weight: { Hustler: 0, Hacker: 2, Hipster: 0, Hound: 1 },
      },
      {
        choice: "Suggesting creative next steps",
        weight: { Hustler: 1, Hacker: 0, Hipster: 2, Hound: 0 },
      },
      {
        choice: "Organizing documentation and tests",
        weight: { Hustler: 0, Hacker: 1, Hipster: 0, Hound: 2 },
      },
    ],
  },
  {
    question:
      "How do you make sure your work can be used after the team moves on?",
    choices: [
      {
        choice: "Make the story or explanation clear for others",
        weight: { Hustler: 2, Hacker: 0, Hipster: 0, Hound: 1 },
      },
      {
        choice: "Build code or systems that are easy to integrate",
        weight: { Hustler: 1, Hacker: 2, Hipster: 0, Hound: 0 },
      },
      {
        choice: "Document decisions and examples clearly",
        weight: { Hustler: 0, Hacker: 1, Hipster: 2, Hound: 0 },
      },
      {
        choice: "Save references and reproducible data",
        weight: { Hustler: 0, Hacker: 0, Hipster: 1, Hound: 2 },
      },
    ],
  },
  {
    question: "Which small task gives you the most energy?",
    choices: [
      {
        choice: "Leading short demos or telling the story",
        weight: { Hustler: 2, Hacker: 1, Hipster: 0, Hound: 0 },
      },
      {
        choice: "Fixing a tricky bug",
        weight: { Hustler: 0, Hacker: 2, Hipster: 1, Hound: 0 },
      },
      {
        choice: "Redesigning a small feature or interaction",
        weight: { Hustler: 0, Hacker: 0, Hipster: 2, Hound: 1 },
      },
      {
        choice: "Cleaning and checking data",
        weight: { Hustler: 1, Hacker: 0, Hipster: 0, Hound: 2 },
      },
    ],
  },
  {
    question: "What do you focus on when starting a meeting?",
    choices: [
      {
        choice: "Set a clear goal and energize everyone",
        weight: { Hustler: 2, Hacker: 0, Hipster: 1, Hound: 0 },
      },
      {
        choice: "Go over the technical agenda and expected outcomes",
        weight: { Hustler: 0, Hacker: 2, Hipster: 0, Hound: 1 },
      },
      {
        choice: "Show examples or visual references",
        weight: { Hustler: 1, Hacker: 0, Hipster: 2, Hound: 0 },
      },
      {
        choice: "Provide references and verify facts",
        weight: { Hustler: 0, Hacker: 1, Hipster: 0, Hound: 2 },
      },
    ],
  },
  {
    question: "Which type of outcome is most satisfying to you?",
    choices: [
      {
        choice: "A message that inspires and motivates people",
        weight: { Hustler: 2, Hacker: 0, Hipster: 0, Hound: 1 },
      },
      {
        choice: "A reliable system that works well at scale",
        weight: { Hustler: 1, Hacker: 2, Hipster: 0, Hound: 0 },
      },
      {
        choice: "A design that surprises and delights",
        weight: { Hustler: 0, Hacker: 1, Hipster: 2, Hound: 0 },
      },
      {
        choice: "Clear and trustworthy documentation or records",
        weight: { Hustler: 0, Hacker: 0, Hipster: 1, Hound: 2 },
      },
    ],
  },
];

export const tieBreakers: Question[] = [
  {
    question: "In a sudden team crisis, what's your instinct?",
    choices: [
      {
        choice: "Boost morale with encouragement",
        weight: { Hustler: 2, Hacker: 1, Hipster: 0, Hound: 0 },
      },
      {
        choice: "Debug the mess and patch it fast",
        weight: { Hustler: 0, Hacker: 2, Hipster: 0, Hound: 1 },
      },
      {
        choice: "Sketch a clever workaround",
        weight: { Hustler: 1, Hacker: 0, Hipster: 2, Hound: 0 },
      },
      {
        choice: "Hunt for overlooked details",
        weight: { Hustler: 0, Hacker: 0, Hipster: 1, Hound: 2 },
      },
    ],
  },
  {
    question: "You're on a deserted island. What's your first move?",
    choices: [
      {
        choice: "Rally the group to stay positive",
        weight: { Hustler: 2, Hacker: 0, Hipster: 1, Hound: 0 },
      },
      {
        choice: "Figure out tools from scraps",
        weight: { Hustler: 0, Hacker: 2, Hipster: 0, Hound: 1 },
      },
      {
        choice: "Draw a crazy but possible escape plan",
        weight: { Hustler: 1, Hacker: 0, Hipster: 2, Hound: 0 },
      },
      {
        choice: "Search for clues and useful resources",
        weight: { Hustler: 0, Hacker: 1, Hipster: 0, Hound: 2 },
      },
    ],
  },
  {
    question: "It's game night. How do you win?",
    choices: [
      {
        choice: "Convince everyone of your strategy",
        weight: { Hustler: 2, Hacker: 0, Hipster: 0, Hound: 1 },
      },
      {
        choice: "Crunch the rules and optimize moves",
        weight: { Hustler: 0, Hacker: 2, Hipster: 1, Hound: 0 },
      },
      {
        choice: "Come up with a creative trick play",
        weight: { Hustler: 1, Hacker: 0, Hipster: 2, Hound: 0 },
      },
      {
        choice: "Track every detail others miss",
        weight: { Hustler: 0, Hacker: 1, Hipster: 0, Hound: 2 },
      },
    ],
  },
];

export const adjectives: Record<ArchetypeKey, string> = {
  Hustler: "Bold",
  Hacker: "Ingenious",
  Hipster: "Creative",
  Hound: "Analytical",
};

export const archetypeColors: Record<ArchetypeKey, string> = {
  Hustler: "#F59E0B", // Amber
  Hacker: "#3B82F6", // Blue
  Hipster: "#EC4899", // Pink
  Hound: "#10B981", // Emerald
};

export const archetypeGradients: Record<ArchetypeKey, string> = {
  Hustler: "from-amber-500 to-orange-600",
  Hacker: "from-blue-500 to-indigo-600",
  Hipster: "from-pink-500 to-purple-600",
  Hound: "from-emerald-500 to-teal-600",
};

export const archetypeIcons: Record<ArchetypeKey, string> = {
  Hustler: "/assets/decorations/hustler.png",
  Hacker: "/assets/decorations/hacker.png",
  Hipster: "/assets/decorations/hipster.png",
  Hound: "/assets/decorations/hound.png",
};

export const archetypes: Record<string, string> = {
  "True Hustler":
    "You're the natural deal-maker and motivator. Always spotting opportunities, hyping the vision, and keeping the crew's energy high. When others hesitate, you charge forward.",
  "Ingenious Hustler":
    "You thrive on momentum and clever moves. Quick to code, quicker to pitch, you turn scrappy ideas into contagious energy.",
  "Creative Hustler":
    "You sell ideas with flair and confidence. Part showman, part innovator, you make people want what's next before it even exists.",
  "Analytical Hustler":
    "You rally the team with both drive and discipline. Big goals stay on track because you balance ambition with a steady grip.",

  "True Hacker":
    "You're the builder and problem-solver. Where others see walls, you see systems ready to be cracked. You make the impossible work.",
  "Bold Hacker":
    "You dream big and execute fast. While others talk, you're already prototyping, pitching, and proving it can be done.",
  "Creative Hacker":
    "You blend logic with imagination. When clever code meets clever design, you bring fresh ideas to life.",
  "Analytical Hacker":
    "You're precise, methodical, and sharp. You love building things that don't just work today, but last tomorrow.",

  "True Hipster":
    "You're the creative spark. With an eye for design and originality, you make things not just function but shine. Aesthetics are your playground.",
  "Bold Hipster":
    "You spin bold visions and make them look irresistible. Part storyteller, part trendsetter, you lead with vibes and persuasion.",
  "Ingenious Hipster":
    "You blend artistry with logic. Equal parts flair and function, your work is clever, stylish, and smart.",
  "Analytical Hipster":
    "You bring structure to style. Bold designs, but every detail double-checked. Nothing sloppy makes it past you.",

  "True Hound":
    "You're the relentless tracker. Detail-driven and disciplined, you catch the fine print, sniff out risks, and never miss what matters.",
  "Bold Hound":
    "You balance charm with caution. Confident when pushing forward, careful when pulling back, you keep the team steady.",
  "Ingenious Hound":
    "You're the safeguard and fixer. No bug, flaw, or loophole gets past you, and your solutions make systems bulletproof.",
  "Creative Hound":
    "You pair curiosity with creativity. Behind every detail, there's a touch of artistry. Your ideas are as practical as they are unique.",

  Generalist:
    "You're the ultimate jack-of-all-traits. Instead of sticking to one lane, you adapt, balance, and connect the dots across roles. You're the glue that makes every mix stronger.",
};

export const SCORE_THRESHOLD = 5;
