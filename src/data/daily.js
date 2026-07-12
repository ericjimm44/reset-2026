// The daily list. Simple enough to complete on your hardest days.
export const GROUPS = [
  {
    "key": "mind",
    "label": "Mind",
    "items": [
      {
        "id": "pray",
        "text": "Pray"
      },
      {
        "id": "journal",
        "text": "Journal"
      },
      {
        "id": "read",
        "text": "Read 10 pages",
        "note": "or 15–20 min of an audiobook"
      },
      {
        "id": "gratitude",
        "text": "Write 3 things I'm grateful for",
        "kind": "gratitude"
      }
    ]
  },
  {
    "key": "body",
    "label": "Body",
    "items": [
      {
        "id": "workout",
        "text": "Today's workout",
        "note": "or active recovery"
      },
      {
        "id": "protein",
        "text": "Hit my protein goal"
      },
      {
        "id": "water",
        "text": "Drink enough water"
      },
      {
        "id": "outside",
        "text": "Get outside for 15 minutes"
      }
    ]
  },
  {
    "key": "home",
    "label": "Home",
    "items": [
      {
        "id": "cook",
        "text": "Cook one meal",
        "note": "or learn one cooking skill"
      },
      {
        "id": "tidy",
        "text": "Clean or organize",
        "note": "10–15 minutes"
      }
    ]
  },
  {
    "key": "growth",
    "label": "Growth",
    "items": [
      {
        "id": "learn",
        "text": "30 minutes of AI or coding"
      },
      {
        "id": "project",
        "text": "Progress on one project",
        "note": "even 15 minutes counts"
      }
    ]
  },
  {
    "key": "rel",
    "label": "Relationships",
    "items": [
      {
        "id": "kids",
        "text": "Be fully present with Ana & Adriel",
        "withKids": true
      },
      {
        "id": "kidstext",
        "text": "Send them a loving text or call",
        "note": "if appropriate",
        "withKids": false
      },
      {
        "id": "friend",
        "text": "Reach out to a friend or family member",
        "note": "because relationships matter — not out of loneliness"
      }
    ]
  }
];

export const REFLECT = [
  [
    "well",
    "What did I do well today?"
  ],
  [
    "challenged",
    "What challenged me today?"
  ],
  [
    "improve",
    "What will I improve tomorrow?"
  ]
];

export const RATINGS = [
  [
    "regulation",
    "Emotional regulation"
  ],
  [
    "anxiety",
    "Anxiety"
  ],
  [
    "selfrespect",
    "Self-respect"
  ],
  [
    "discipline",
    "Discipline"
  ],
  [
    "peace",
    "Peace"
  ],
  [
    "presence",
    "Presence as father"
  ]
];

export const SEAL_Q = "Did my actions today reflect the man I'm becoming — not the anxiety I was feeling?";

export const ONE_RULE =
  "Don't try to solve your entire life. Just ask: what's the next box I can check?";

// Items tagged withKids only appear when hasKids matches.
export const visibleItems = (hasKids) =>
  GROUPS.flatMap((g) =>
    g.items
      .filter((i) => i.withKids === undefined || i.withKids === hasKids)
      .map((i) => ({ ...i, group: g.label }))
  );
