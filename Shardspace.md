# 🔮 ShardSpace – Visual Goal Map (Gamified Portfolio Concept)

Build a **frontend-only goal visualization tool** where users break a large life goal ("Shard") into structured milestones and mini-quests. The app visualizes progress through **interactive cards**, **XP bars**, and **tiered tree layout** — all stored in `localStorage`.

This is your most complex portfolio app — blending creative UX, visual hierarchy, state modeling, and frontend gamification.

---

## 🎯 Objective

Create an interactive experience for managing a large goal by:
- Defining a **Shard** (major goal)
- Breaking it into **Milestones**
- Filling Milestones with **Mini-Quests**
- Tracking XP progress visually

---

## ⚙️ Tech Stack

- React (via Vite)
- Bootstrap 5 (CDN or npm)
- Plain CSS (no Tailwind)
- UUID for unique IDs
- `localStorage` for all state

---

## 🧱 App Structure & Features

### 🧩 1. Create a “Shard”

* Form inputs:

  * Shard name (goal)
  * Category (health, finance, career, etc.)
  * Target XP (e.g. 500 XP)
* After creation → move to detail view (`/shard/:id`)

### 🧱 2. Milestone Management

* Each shard has 3–5 **milestones**
* For each milestone:

  * Title
  * XP goal
  * Add/edit/delete milestones

### 🎯 3. Mini-Quests Inside Each Milestone

* Each milestone contains quests with:

  * Title
  * XP reward
  * Status (Pending, In Progress, Completed)
  * Action buttons: \[Mark Complete], \[Delete]

### 📊 4. XP Progress Tracking

* XP bars:

  * Per quest: show individual reward
  * Per milestone: progress toward milestone XP
  * Per shard: total XP earned vs goal
* Use Bootstrap progress bar components

### 🗃 5. localStorage Integration

* Store shards, milestones, quests in localStorage
* Structure:

```json
[
  {
    "id": "shard-1",
    "title": "Launch My Startup",
    "category": "Career",
    "targetXP": 1000,
    "milestones": [
      {
        "id": "ms-1",
        "title": "Build MVP",
        "xpTarget": 300,
        "quests": [
          {
            "id": "q1",
            "title": "Finish UI",
            "xp": 50,
            "status": "Completed"
          }
        ]
      }
    ]
  }
]
```

Use `uuid` to generate unique IDs.

---

## 🖼 Layout Design

### 🧭 Main Pages

1. `/` → All Shards (overview)
2. `/shard/:id` → Tree view (Shard → Milestones → Quests)

### 🖌 UI Blocks

```
[ Shard Name + Category ]
[ XP Progress Bar ]

[ Milestone Card ]
    └─ Quest Card 1
    └─ Quest Card 2
```

Use Bootstrap Cards + nested divs (no canvas or SVG).

---

## ✨ Bonus Features (Optional)

* 🎮 Badges: earn one when reaching 100, 250, 500 XP
* 📁 Archive old shards
* 🌗 Dark mode toggle
* 🔁 Reorder quests via drag-and-drop (`react-beautiful-dnd`)
* 📤 Export shard as JSON

---

## ✅ Completion Criteria

* Fully functional, visual goal breakdown
* All state synced to `localStorage`
* XP progress visualized per level
* Clean and responsive Bootstrap layout
* Deployed to `/shardspace` route on portfolio

---


