# 🎯 Goal Quest Tracker – Gamified Productivity App (Frontend-Only)

Build a **React-based, gamified task tracker** where users add mini "quests" (goals), track their progress, and earn XP. The app is frontend-only, uses `localStorage`, and should feel fun, clean, and responsive.

This demo showcases **creativity, modern UI**, and **gamification logic** — part of a portfolio site.

---

## 🧱 Tech Stack

- React (Vite)
- Bootstrap 5 (CDN or npm)
- Plain CSS (no Tailwind)
- localStorage

---

## 🗂 Features

### ✅ 1. New Quest Form
- Inputs:
  - Quest title
  - XP reward
  - Deadline (date input)
- Submit button: “Add Quest”
- Form should validate all fields

### 🧾 2. Quest Cards (List/Grid View)
Each quest displays:
- Title
- XP reward
- Deadline (formatted)
- Status: "In Progress" or "Completed"
- Button to mark as complete
- Delete icon (🗑️)

Use Bootstrap cards and grid for layout.

### 📊 3. XP Progress Bar (Gamification)
- Top of the screen: show total earned XP
- Progress bar fills as user completes quests
- Display XP as text: `You’ve earned 320 XP`

### 💾 4. localStorage Sync
- Store quests in localStorage:
  - On page load, restore saved quests
  - On add/update/delete, sync to localStorage

### 🌐 5. Responsive Design
- Bootstrap 5 grid for mobile/tablet/desktop support
- Optional: use offcanvas or sticky navbar for mobile


---

## 📤 Data Structure Example

```json
{
  id: "uuid",
  title: "Build React Portfolio",
  xp: 100,
  deadline: "2025-07-30",
  completed: false
}


🧪 Features 

    Filter quests: All / In Progress / Completed

    Sort by XP or deadline

    XP streak tracker (XP this week)

    Sound effect or animation on completion

✅ Completion Criteria

    Fully responsive UI

    Quests managed in localStorage

    XP progress updates correctly

    Clean Bootstrap layout, no Tailwind
