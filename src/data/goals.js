// 2026 milestones. Some auto-complete from the Log or workout adherence.
export const YEAR = [
  {
    "label": "Father",
    "goals": [
      {
        "text": "One adventure with the kids each month"
      },
      {
        "text": "Teach each child a new skill each month"
      },
      {
        "text": "Bedtime prayers whenever they're with me"
      },
      {
        "text": "Create one new family tradition this year"
      }
    ]
  },
  {
    "label": "Health & Fitness",
    "goals": [
      {
        "text": "Complete 90% of scheduled workouts",
        "workout": true
      },
      {
        "text": "Reach target physique / body-fat goal"
      },
      {
        "text": "Hit protein goal consistently"
      },
      {
        "text": "Improve flexibility & mobility"
      },
      {
        "text": "Stay active — tennis, pickleball, hiking"
      }
    ]
  },
  {
    "label": "Cooking",
    "goals": [
      {
        "text": "Learn 25 new recipes",
        "track": "recipes",
        "target": 25
      },
      {
        "text": "Master breakfast, lunch, dinner + a dessert"
      },
      {
        "text": "Cook for friends or family at least once"
      }
    ]
  },
  {
    "label": "Learning",
    "goals": [
      {
        "text": "Read at least 10 books",
        "track": "books",
        "target": 10
      },
      {
        "text": "Finish one AI / coding project"
      },
      {
        "text": "Learn a coding concept each week",
        "track": "concepts",
        "target": 25
      }
    ]
  },
  {
    "label": "Financial",
    "goals": [
      {
        "text": "Build my emergency fund"
      },
      {
        "text": "Create & follow a monthly budget"
      },
      {
        "text": "Add an income stream"
      }
    ]
  },
  {
    "label": "Emotional Growth",
    "goals": [
      {
        "text": "Continue therapy"
      },
      {
        "text": "Journal consistently"
      },
      {
        "text": "Regulate instead of ruminate"
      },
      {
        "text": "Respect Karen's boundaries without seeking reassurance"
      },
      {
        "text": "Build a life regardless of the outcome"
      }
    ]
  },
  {
    "label": "Personal Life",
    "goals": [
      {
        "text": "Keep my space clean & organized"
      },
      {
        "text": "Explore one new place each month"
      },
      {
        "text": "Finish the projects I start"
      }
    ]
  }
];

export const YEAR_TOTAL = YEAR.reduce((n, c) => n + c.goals.length, 0);

export const TRACKERS = [
  {
    "key": "books",
    "label": "Books read",
    "target": 10,
    "ph": "Title finished…"
  },
  {
    "key": "recipes",
    "label": "New recipes learned",
    "target": 25,
    "ph": "Recipe…"
  },
  {
    "key": "concepts",
    "label": "New coding concepts",
    "target": 25,
    "ph": "Concept learned…"
  }
];
