# 🎬 LiveFrame: Virtual Presence Invitations

**LiveFrame** is a premium, interactive web experience designed to bridge the physical gap for ceremonies, weddings, and live events. It transforms a standard invitation into a cinematic countdown and live-streaming hub.

## ✨ Features

- **Cinematic Experience**: Immersive UI with background particles, custom typography, and fluid Framer Motion animations.
- **Smart Countdown**: Real-time countdown that automatically flips to the Live Stream once the event begins.
- **Integrated Live Player**: Custom-styled YouTube/Live embed player with "External Player" fallback.
- **Dynamic Theming**: Support for custom primary/secondary colors and background images (via `EventData`).
- **Web Preview Thumbnails**: Intelligent thumbnail selection between YouTube defaults and custom high-res backgrounds.
- **Guest Interactions**: "Leave a Blessing" guestbook (mock) and social share integration.
- **Utility Tools**: "Add to Calendar" support for Google, iCal, and Outlook.
- **Ambient Audio**: Built-in audio player for mood-setting background music.

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Vanilla CSS + Tailwind-ish tokens
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Design**: Premium glassmorphism and cinematic layering

## 🚀 Recent Accomplishments

- **Live Stream Player Migration**: Successfully implemented a production-ready YouTube embed system that handles URL normalization and autoplay.
- **Countdown-to-Live Logic**: Engineered a seamless state transition that replaces the timer with the video player at the exact millisecond of the event start.
- **UI Refinement**: Implemented a responsive, mobile-first invitation layout with interactive elements like the social share and guestbook sections.
- **Dynamic Content Engine**: Created the infrastructure for `EventData` presets (wedding, birthdays, etc.) with custom color palettes and visual effects like flower petals.
- **Event Metadata Integration**: SEO-ready page titles and meta-information that update based on the specific event being viewed.

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
