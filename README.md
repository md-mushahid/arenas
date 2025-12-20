## 📋 Project Overview

Built with **Next.js 14**, **Firebase**, and **Stripe**, this project addresses the core needs of the sports community:
- **For Players:** Seamless discovery of arenas, interactive availability checking, and instant secure checkout.
- **For Coaches/Owners:** A powerful dashboard to monetize facilities, manage schedules, and track revenue.

---

## 🎯 Core Functionality

### 1. Advanced Booking & Scheduling
- **Conflict-Free Engine:** Custom logic ensures zero double-bookings with server-side validation.
- **Interactive Calendar:** Visual, intuitive interface using `react-big-calendar`.
- **Smart Visibility:** 
  - **Public View:** Anyone can browse arena availability.
  - **Private Booking:** Authentication required to secure reservations.

### 2. Payment & Financial Infrastructure
- **Stripe Integration:** Secure end-to-end checkout flow with automated session expirations.
- **Webhook Architecture:** Secure backend listeners handle `checkout.session.completed` events to automatically finalize bookings.
- **Dynamic Pricing:** Server-side validation ensures users are charged the correct, up-to-date hourly rate for every booking.
- **Revenue Tracking:** Owners can monitor earnings and booking volume directly from their dashboard.

### 3. Dual-Role Management
- **Coach/Owner Dashboard:** 
  - Create and edit arena listings with rich details.
  - Set hourly rates and manage facility information.
  - Upload cover images and manage visual presentation.
- **Player/User Dashboard:** 
  - Centralized hub for booking history.
  - Booking cancellation with status tracking.
- **Location Intelligence:** Integrated **Photon API** for smart address autocomplete with precise GPS coordinate mapping.

---

## 🏆 Technical Achievements

### 🛡️ Security & Architecture
- **Dual-Layer Auth:** Firebase Admin SDK + Custom JWT Middleware to protect sensitive API routes.
- **Type-Safe Codebase:** 100% **TypeScript** coverage ensures predictable data flow and reduces runtime errors.
- **Clean Data Design:** Relational-style Firestore schema optimized for high-speed queries.

### ⚡ User Experience (UX) Highlights
- **Robust Form Validation:** 
  - Real-time feedback on all inputs (email, phone, pricing).
  - Address selection enforcement guarantees valid GPS data.
- **Progressive Feedback:** Smart loading states (e.g., "Creating Account...", "Redirecting...") keep users informed.
- **Auto-Login Flow:** Frictionless signup process that immediately logs the user in.

### 🔧 Asset & Data Management
- **Automated Image Uploads:** Seamless integration with Firebase Storage.
- **Smart Fallbacks:** Default map views and placeholders when assets are missing.

---

## 🔮 Roadmap & Future Improvements

To evolve this MVP into a commercial product:
1.  **Notification System:** Email confirmations via SendGrid/AWS SES.
2.  **Admin Super-Panel:** Platform-wide oversight for administrators.
3.  **Social Features:** User profiles, reviews, and ratings.
4.  **Native Mobile App:** React Native version for on-the-go management.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Ant Design
- **Backend:** Next.js API Routes, Firebase Admin SDK
- **Database:** Cloud Firestore (NoSQL)
- **Payments:** Stripe
- **Maps/Location:** Photon API, Leaflet (React-Leaflet)

---

## 🚀 Getting Started

1.  **Clone the repository**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Environment Variables:**
    Create a `.env.local` file with your Firebase and Stripe credentials.
4.  **Run Dev Server:**
    ```bash
    npm run dev
    ```
