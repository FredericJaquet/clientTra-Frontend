# ClientTra Frontend

**ClientTra** Frontend is the user interface of the ClientTra SaaS system, designed for freelance translators and small businesses.
It connects to the Spring Boot backend via REST API and provides a clean, multilingual interface for managing clients, providers, orders, invoices, quotes, purchase orders, and financial reports.

Built with **React 18**, **TailwindCSS**, and **Axios**, the frontend focuses on usability, role-based access, and a responsive, modern design.

## ✨ Features

✅ Authentication & Registration

 - Login with email + password (toggle visibility)

 - Two-step registration: Demo Mode (with auto-generated sample data) or Real Company (with fiscal/company data)

 - Banner in Demo Mode with option to switch to a real company

 - JWT authentication with role-based permissions

## ✅ Dashboard

 - Sidebar navigation (always visible)

 - Cards with: Balance, Users, Pending Payments, Pending Collections, Pending Orders, Pending Quotes

 - Global search bar for clients & providers

 - Demo warning banner

## ✅ User & Company Management

 - "My Account": update profile, language, theme (light/dark), email, and password

 - User management (Admin only): add, activate/deactivate, change roles

 - Company profile: commercial name, legal name, VAT number, email, web, addresses, phones, bank accounts, logo

## ✅ Clients & Providers

 - Full CRUD with soft delete (active/inactive filter)

 - Details with tabs: addresses, phones, contacts, bank accounts, billing schemes

## ✅ Orders & Documents

 - Customer and provider orders (linked to billing schemes)

 - Invoices, quotes, and purchase orders

 - Select pending orders to generate invoices (ensures uniqueness)

 - Invoice view with options: mark as paid, edit, delete, export to PDF

## ✅ Reports & Charts

 - Income and expense reports (with client/provider breakdowns and totals)

 - Pending payments and pending collections reports

 - Toggle to include “fake invoices” from pending orders

 - Interactive charts with averages (Recharts)

## ✅ Multilingual support

 - English, French, Spanish (ready for more via react-i18next)

## 📁 Project Structure
clienttra-frontend/

├── public/              # Static assets

├── src/

│   ├── componentes/     # Reusable UI components

│   ├── assets/          # CSS and img

│   ├── context/         # Theme, language.

│   ├── utils/           # Validators

│   ├── api/        # Axios config and API calls

├── package.json

└── vite.config.js

## 🧭 Architecture Overview

The frontend follows a modular **SPA architecture** with clear separation of concerns:

Pages → Top-level routes mapped with react-router-dom

Components → Reusable UI blocks (forms, tables, modals, etc.)

Services → Axios-based API calls, centralized error handling

i18n → Language switch via react-i18next

PDF → Export documents using react-pdf

This structure improves maintainability, scalability, and reusability of UI components.

## 🧪 Tech Stack

 - Frontend: React 18, Vite
 - UI/Styling: TailwindCSS, Lucide-react (icons)
 - Internationalization: react-i18next
 - PDF Export: react-pdf
 - Charts: Recharts
 - Routing: react-router-dom
 - HTTP Client: Axios

## 🚀 Getting Started
 - Prerequisites: 
    * Node.js (>=18)
    * npm

## Setup

 - Clone the repo:
 
  git clone https://github.com/FredericJaquet/clientTra-Frontend.git

  - cd clienttra-frontend
 
 - Install main dependencies:
 
  npm install react react-dom react-router-dom axios react-i18next i18next react-pdf lucide-react recharts

 - Install dev/build tools:

  npm install -D tailwindcss postcss autoprefixer vite

 - Initialize TailwindCSS (if not already configured):

  npx tailwindcss init -p

 - Configure backend URL in:

  src/services/axios.js
 
 - Run the app:

  npm run dev

 - Access at:

  http://localhost:5173

## 📌 Project Status

✅ Demo Mode implemented (auto data load, switch to real company)

✅ Multicompany, multiuser, multilingual ready

✅ Full CRUD for clients, providers, orders, invoices, quotes, POs

✅ Reports & charts implemented

✅ Role-based access (Admin, Accounting, User)

⚠️ Freemium/Premium prepared, but not active yet

⚠️ Local deployment only (production deployment in progress)

## 📒 License

This project is currently under private development by Frédéric Jaquet
 and is not yet licensed for public or commercial use.

## 🧠 Important:
The author explicitly prohibits the use of this codebase for AI model training or data extraction, whether partial or full, without written consent.

## 📢 Contact

If you're interested in collaborating or have any questions, feel free to reach out!

**"Learning by building. Professionalism by care." 🚀**
