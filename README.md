# 🧾 ApniBilling (Universal Billing, POS & Business Management ERP)

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20GitHub%20Pages-success?style=for-the-badge&logo=github)](https://anshulrajput63060-cell.github.io/billing-project/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)

**ApniBilling** ek modern, fast aur professional Indian GST Billing, POS (Point of Sale) aur Inventory Management System hai. Ye small, medium aur enterprise retail/wholesale businesses ke liye designed hai.

---

## 🌐 Live Access (Online Demo)
Direct browser me open karne ke liye yahan click karein:
👉 **[ApniBilling Live Demo](https://anshulrajput63060-cell.github.io/billing-project/)**

---

## ✨ Key Features (Mukhy Visheshatayein)

- ⚡ **High-Speed POS Counter**: Barcode scanner support, quick keyboard shortcuts (F2: Pay, F4: Search, Esc: Clear).
- 🧾 **GST & Tax Compliance**: Automatic CGST, SGST, IGST calculations, HSN code support.
- 🖨️ **Thermal Receipt & A4 Invoices**: 80mm/58mm thermal print layout with printable barcodes and business branding.
- 💳 **Multiple Payment Modes**: Cash, UPI / QR, Card, aur Credit (Udhar / Khata).
- 📦 **Smart Inventory Tracking**: Low stock alerts, category filtering, instant stock updates.
- 👥 **Customer & Ledger Management**: Balance tracking, transaction history, customer loyalty credits.
- 🌓 **Dark & Light Mode**: Premium sleek UI with custom themes.
- 💾 **Offline-Ready & Cloud Compatible**: Instant browser `localStorage` fallback + Spring Boot REST API integration.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Design System
- **Icons**: Lucide React
- **Routing**: React Router (HashRouter for zero-config static hosting)
- **State Management**: React Context API + LocalStorage sync

### Backend
- **Framework**: Spring Boot 3.3.4 (Java 21)
- **Security**: Spring Security 6 + JWT Authentication + Stateless Filters
- **Database**: H2 (Zero-setup in-memory database for instant local run) / PostgreSQL support
- **ORM**: Spring Data JPA / Hibernate

---

## 🚀 How to Run Locally (Apne System Par Kaise Run Karein)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Java JDK 21](https://adoptium.net/) (Only required if running the Java backend)
- [Git](https://git-scm.com/)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/anshulrajput63060-cell/billing-project.git
cd billing-project
```

---

### Step 2: Run Frontend (Web App)
```bash
cd ApniBilling/frontend
npm install
npm run dev
```
Ab browser me open karein: `http://localhost:5173/`

#### Production Build:
```bash
npm run build
```

---

### Step 3: Run Backend (Optional - For Full ERP API & Database)
```bash
cd ../backend
mvn spring-boot:run
```
Backend API will start at: `http://localhost:8080/`
- H2 Database Console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:apnibilling`
- User: `sa` | Password: *(blank)*

---

## 📁 Project Directory Structure

```
billing-project/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD
├── ApniBilling/
│   ├── frontend/               # React + Vite POS & Dashboard Frontend
│   │   ├── src/
│   │   │   ├── components/     # UI, Layout, POS, Receipts
│   │   │   ├── context/        # Billing, Auth, Theme Contexts
│   │   │   ├── pages/          # POS, Invoices, Products, Customers, Reports
│   │   │   └── utils/          # GST & Formatting Helpers
│   │   └── package.json
│   └── backend/                # Spring Boot 3 Multi-tenant REST API
│       ├── src/main/java/      # Modules: Billing, Party, Product, Tenant
│       ├── src/main/resources/ # application.yml, DB migrations
│       └── pom.xml
└── README.md
```

---

## ⌨️ POS Keyboard Shortcuts
| Shortcut | Action |
|---|---|
| `F2` | Complete Sale & Open Payment Modal |
| `F4` | Focus Product Search Bar |
| `Esc` | Clear Cart / Close Dialogs |
| `Ctrl + P` | Print Thermal Receipt |

---

## 🤝 Contributing & License
Distributed under the MIT License. Contributions and feature suggestions are welcome!
