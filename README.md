# 🧠 NeuroTrack: A Planner That Works With Your Brain

![NeuroTrack](/screenshot.png)

**NeuroTrack** is a web-based productivity app designed specifically for neurodiverse users (e.g., ADHD, autism). With a clean, distraction-free interface and accessible features, NeuroTrack supports daily focus and organization while adapting to individual needs.

---

## 🚀 Features

### ✅ Onboarding Flow
- Personalized experience based on 3 quick questions:
  - Do you prefer **voice** or **visual** reminders?
  - What's your primary goal? *(Focus, Routines, Distractions)*
  - Preferred routine style: **Rigid / Flexible / Mix**
- Dashboard and notifications are adapted based on answers.

### 🗓️ Daily Planner
- Visual timeline of the day (hour blocks).
- Add tasks with:
  - Name, duration, color code, and icon.
- Drag to reorder or reschedule tasks.
- “Start Focus Timer” for each task.

### ⏱️ Focus Timer
- Pomodoro-style (default 25/5) with customizable durations.
- Mood prompt after each session.
- Optionally read the task name aloud via ElevenLabs API (if voice reminders are on).

### 🔁 Routine Templates
- Starter templates: **Morning Routine**, **Work Day**, **Wind-down**.
- Users can duplicate and edit templates.
- Premium users unlock more routines.

### 🔊 Voice Reminders (Optional)
- Task name is spoken aloud when it begins.
- Integrates with ElevenLabs API (or placeholder).

### 📒 Mood & Distraction Tracker
- End-of-session prompts:
  - “How focused were you?”
  - “Any distractions?”
- Mood journal with filters for reflection and pattern recognition.

### ⚙️ Settings
- Toggle between:
  - **Light**, **Dark**, and **Low-Stimulation** modes (dyslexia-friendly).
- Enable/disable voice reminders.

### 💎 Subscription Integration
- RevenueCat (or mock paywall):
  - Locks advanced features: unlimited templates, voice reminders, visual analytics.
  - Prompts upgrade when needed.

### 🌐 Public Deployment
- Branded welcome screen with the tagline:  
  _"NeuroTrack: A Planner That Works With Your Brain"_
- Social share buttons for:
  - Twitter (X)
  - LinkedIn
  - Reddit

---

## 🛠️ Tech Stack

| Layer      | Technology      |
|------------|-----------------|
| Frontend   | ReactJS + TypeScript |
| Backend    | Supabase (auth, database) |
| Voice API  | ElevenLabs (optional) |
| Hosting    | Netlify |

---

## ♿ Accessibility & UX

- Fully keyboard-navigable  
- Screen reader-friendly labels  
- Mobile responsive  
- Low-stimulation theme for sensitive users

---

## 🔧 Setup & Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/neurotrack.git
   cd neurotrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   Create a .env file:
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```


## 📜 License

- This project is licensed under the MIT LICENSE.