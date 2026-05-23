# 🎬 LiveFrame: Virtual Presence Invitations

**LiveFrame** is a premium, interactive web experience designed to bridge the physical gap for ceremonies, weddings, and live events. It transforms a standard invitation into a cinematic countdown [...]

## ✨ Features

| Feature | Description |
| :--- | :--- |
| **Cinematic Experience** | Immersive UI with background particles, custom typography, and fluid Framer Motion animations. |
| **Smart Countdown** | Real-time countdown that automatically flips to the Live Stream once the event begins. |
| **Integrated Live Player** | Custom-styled YouTube player with **robust URL normalization** (handles watch links, live streams, and mobile shares). |
| **Admin Dashboard** | Centralized event management with **Invitation Link sharing** and clipboard integration. |
| **Dynamic Theming** | Support for custom primary/secondary colors and background images. |
| **Utility Tools** | "Add to Calendar" support for Google, iCal, and Outlook. |
| **Ambient Audio** | Built-in audio player for mood-setting background music. |

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Vanilla CSS + Tailwind-ish tokens
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Design**: Premium glassmorphism and cinematic layering

## 🚀 Recent Accomplishments

- **Live Stream Player Migration**: Successfully implemented a production-ready YouTube embed system that handles URL normalization (watch, live, share) and autoplay.
- **Centralized Event Management**: Integrated invitation link sharing into the admin dashboard while maintaining a clean, guest-facing interface.
- **Canonical Routing**: Implemented `/events/[slug]` canonical routes for reliable sharing and SEO.
- **Tailwind CSS Modernization**: Updated entire codebase to use modern Tailwind CSS class names (e.g., `bg-linear-to-r`, `shrink-0`) and resolved all linter warnings.
- **Countdown-to-Live Logic**: Engineered a seamless state transition that replaces the timer with the video player at the exact millisecond of the event start.

---

## 🛠️ Installation & Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

---

*Built with ❤️ for special moments.*
