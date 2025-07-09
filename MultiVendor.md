# 💳 Multi-Vendor Split Payment Demo UI (Frontend-Only Portfolio Concept)

Build a **React-based demo UI** to simulate a multi-vendor checkout with payment splitting. This preview mimics how a system like Flutterwave might split payments between a vendor, the platform, and VAT — all in the frontend using **Bootstrap**, **localStorage**, and **React state**.

This is part of a concept portfolio showcasing business logic, dynamic form handling, and frontend accounting UX.

---

## 🎯 Objective

- Add multiple products to a checkout cart, each tied to a vendor and price
- On “Checkout”, calculate and display:
  - Vendor share
  - Platform fee
  - VAT
- Store recent checkout sessions in `localStorage`
- Build a clean, responsive UI using Bootstrap 5

---

## ⚙️ Tech Stack

- React (via Vite)
- Bootstrap 5 (CDN or npm)
- Vanilla CSS (no Tailwind)
- `localStorage` for session persistence

---

🧾 App Features
🛒 Product Entry

    Form inputs:

        Product Name

        Vendor Name

        Product Price (₦)

    On “Add Product”:

        Append to checkout table

        Store in products state array

📋 Checkout Table (Bootstrap)

    Show each product as row:

        Product Name

        Vendor

        Price

        Delete icon

💰 Checkout Summary (Calculated Breakdown)

On “Checkout”, display:
Label	Formula
Subtotal	Sum of all product prices
Platform Fee	5% of subtotal
VAT (e.g., 7.5%)	7.5% of subtotal
Total Payable	subtotal + VAT
Vendor Payouts	Price per product – platform fee/VAT cut

    Round to 2 decimal places

    Display with Bootstrap card UI

💾 LocalStorage

    Store past checkouts (as arrays of product sessions)

    Show “Last 3 Sessions” (summary view or toggle dropdown)

    useEffect() + JSON.stringify/parse() for persistence

📤 User Flow

    User adds multiple products

    Hits “Checkout”

    Summary is shown (splits, VAT, fees)

    Session is stored in localStorage

    Option to reset cart or view past sessions

🧠 What This Demonstrates

    Dynamic form handling

    Business logic (payment splits)

    Local persistence with localStorage

    Responsive Bootstrap tables and card layouts

    UX clarity for accounting dashboards

