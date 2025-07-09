# 🧠 Mind Map Creator – Portfolio Concept App (Frontend-Only)

Create a **React-based frontend-only Mind Map Creator** that allows users to add ideas as draggable cards (nodes) and organize them using a grid or flex-based layout — no canvas/SVG involved.

This project demonstrates **UI creativity**, **dynamic layout thinking**, and **local persistence** using `localStorage`.

---

## 🎯 Objective

Build an interactive interface for visualizing thought organization and idea mapping. The focus is on:
- Grid/flex-based node arrangement
- Local storage of layout state
- Smooth, intuitive UI using **React + Bootstrap + CSS**

---

## ⚙️ Tech Stack

- React (Vite)
- Bootstrap 5 (CDN or npm)
- Custom CSS (no Tailwind)
- `localStorage` for persistence

---


---

## ✅ Features

### ➕ 1. Add Node Form
- Text input for node content
- Optional tag or category
- Submit button: “Add Idea”
- On submit:
  - Add new node to layout
  - Save to `localStorage`

### 🧩 2. Node Display (Grid/Flex Layout)
- Display nodes as **Bootstrap cards**
- Arrange in a **responsive grid** (e.g. 3 columns desktop, 1–2 on mobile)
- Each card shows:
  - Title/text
  - Drag icon (↕)
  - Delete icon (🗑️)

### 🖱️ 3. Drag-and-Drop (Optional but Preferred)
- Allow reordering via drag-and-drop
- Use:
  - HTML5 Drag and Drop API **or**
  - A lightweight library like `react-beautiful-dnd` *(optional)*

### 💾 4. LocalStorage Sync
- Store node list (and order if using drag/drop)
- On page load, restore saved node state

---

## 🗃️ Data Model

```js
{
  id: "uuid",
  text: "Build AI Portfolio",
  createdAt: "2025-07-07T12:00:00Z"
}





🧪 Features

    Color-coded categories

    Search/filter bar at top

    Auto-resize cards on content change

    Export node list as JSON