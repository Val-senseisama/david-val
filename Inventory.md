# 🧮 Inventory Dashboard (Frontend-Only Concept)

Build a **responsive, React-based inventory dashboard UI** as part of a portfolio site. The app mimics a real ERP inventory module and stores data in `localStorage`. The focus is UI structure, form logic, local persistence, and responsiveness — not backend.

---

## 🎯 Goal

Create a fully responsive dashboard using **React + Bootstrap 5 + plain CSS**, with a working **Products** page:

- Add/edit/delete products
- Store all data in **localStorage**
- Filter/search products
- Sidebar + Topbar layout
- Bootstrap grid for layout & responsiveness

---

## ⚙️ Tech Stack

- React (with Vite)
- Bootstrap 5 (CDN or NPM)
- Custom CSS (no Tailwind)
- `localStorage` for persistence

---

## 📁 Pages & Components

### 🧭 Layout

- **Sidebar** (vertical on desktop, collapsible on mobile)
- **Topbar** (title, nav buttons)
- **Main area** renders selected page

### 📦 Products Page

- Product table with:
  - Name
  - Category
  - Quantity
  - Price
  - Edit/Delete buttons
- Add/Edit modal form with validation
- LocalStorage sync logic
- Filter/search box at top
- Optional: sort by price, name

---

## 🗃 Data Schema

```js
{
  id: string, // UUID
  name: string,
  category: string,
  quantity: number,
  price: number
}

🧠 State & Persistence

    Use useState + useEffect to sync product list to/from localStorage

    Separate helper functions for:

        getProducts()

        addProduct(product)

        updateProduct(id, updatedData)

        deleteProduct(id)

📱 Responsiveness

    Use Bootstrap Grid and utility classes (col-md, row, d-flex, etc.)

    Sidebar collapses on mobile (offcanvas or hidden)

    Table is scrollable on small screens

🧪 Bonus (Optional)

    Toast alerts on success

    Form validation (Bootstrap's built-in)

    Dark mode toggle

    Export to CSV button