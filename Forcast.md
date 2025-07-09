# 📈 AI Sales Forecast Preview UI (Portfolio Concept)

Build a **responsive, frontend-only sales forecasting dashboard** as a concept demo. This preview simulates an AI-powered sales forecast system using **React**, **Bootstrap**, **Chart.js**, and **localStorage**.

The app showcases dashboard layout, charting integration, user interaction, and local data persistence — without a backend.

---

## 🎯 Goal

Create a **single-page UI** showing a chart-based sales forecast preview:

- Simulate sales input (CSV or manual)
- Display forecast chart using Chart.js
- Store and reuse forecast data from `localStorage`

---

## ⚙️ Tech Stack

- React (via Vite)
- Bootstrap 5 (CDN or NPM)
- Chart.js (via `react-chartjs-2`)
- Custom CSS (no Tailwind)
- `localStorage` for persistence

---

## 🗂️ Functional Areas

### 🧮 1. Input Panel

- Two buttons:
  - 📥 “Upload CSV” (accepts a CSV file)
  - ⚙️ “Import Demo Data” (fills sample values)

- Manual form input for sales trend data:
  - Month (dropdown or input)
  - Sales value

- Add/Reset buttons

### 📊 2. Forecast Visualization

- Line chart displaying:
  - Time (months) on X-axis
  - Sales value on Y-axis
- Chart updates in real-time as data changes
- Use `react-chartjs-2` with Chart.js v4

### 💾 3. Persistence

- Save forecast data to `localStorage`
- On load: check for existing forecast and load if present
- Clear/reset button clears data and chart

---

## 💡 Demo Data Example

```json
[
  { "month": "Jan", "sales": 12000 },
  { "month": "Feb", "sales": 14500 },
  { "month": "Mar", "sales": 9800 }
]

🧠 Learning Focus

    Visual dashboard composition

    React form state management

    Chart rendering with external libraries

    Local persistence using localStorage


Other Features

Toast alert after upload/import

Download forecast as CSV

Dark mode toggle

Predictive tooltip showing sales growth %