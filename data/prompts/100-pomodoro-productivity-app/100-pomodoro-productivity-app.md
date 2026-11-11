# Focus - Pomodoro Timer App

## 1. Overview
### 1.1 Product Vision
Focus is a minimalist productivity app that helps users maintain concentration and manage their time effectively using the Pomodoro technique. The app provides a clean, distraction-free interface with multiple modes to suit different working styles.

### 1.2 Target Users
- Students
- Remote workers
- Freelancers
- Anyone seeking to improve their focus and productivity

## 2. Technical Stack
### 2.1 Core Technologies
- **Frontend Framework**: Next.js (Latest App Router)
- **Backend & Database**: Supabase with Prisma ORM
- **State Management**: Zustand
- **UI Components**: Shadcn UI
- **Runtime**: Bun and Bunx

### 2.2 Infrastructure
- Authentication: Supabase Auth with Google OAuth
- Database: Supabase PostgreSQL
- Hosting: Vercel (for Next.js deployment)

## 3. Features
### 3.1 Application Modes
1. **Home Mode**
   - Current time display
   - Motivational quotes
   - Quick access to other modes

2. **Ambient Mode**
   - Super minimalist interface
   - Focus timer widget
   - Distraction-free environment

3. **Focus Mode** [succes]
   - Pomodoro timer with three modes:
     - Pomodoro (default: 25 minutes)
     - Short Break (default: 5 minutes)
     - Long Break (default: 15 minutes)
   - Tab-based interface for mode selection
   - Timer display with start/pause functionality
   - Skip button (appears when timer is running)
   - Full-screen mode support

### 3.2 Settings & Customization
- Timer duration settings:
  - Pomodoro time
  - Short break time
  - Long break time
- Automation settings:
  - Auto Start Breaks
  - Auto Start Pomodoros
  - Long break interval
- User preferences stored in database

## 4. Development Tasks
### 4.1 Completed
- [x] Supabase OAuth with Google integration
- [x] Basic project setup with Next.js and Shadcn UI
- [x] Pomodoro timer implementation with Zustand
- [x] Timer settings UI and functionality
- [x] Database schema and api for settings and timer
- [x] Database integration for settings and timer
- [x] Full-screen mode implementation

### 4.2 In Progress

## 5. Technical Implementation Details
### 5.1 Authentication
```typescript
// Example: Get user data
const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
      redirect('/login')
    }

```

### 5.2 Database Schema
```prisma
model Settings {
  id                String @id @default(uuid())
  userId            String @unique
  pomodoroTime      Int    @default(25)
  shortBreakTime    Int    @default(5)
  longBreakTime     Int    @default(15)
  autoStartBreaks   Boolean @default(false)
  autoStartPomodoros Boolean @default(false)
  longBreakInterval Int    @default(4)
}

model Stats {
  id String @id @default(uuid())
  userId String
  focusTime Int @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 5.3 State Management
```typescript
// Example: Timer store with Zustand
const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      mode: 'pomodoro',
      isRunning: false,
      timeLeft: defaultSettings.pomodoroTime * 60,
      settings: defaultSettings,
      setMode: (mode) => { /* ... */ },
      toggleTimer: () => { /* ... */ },
      resetTimer: () => { /* ... */ },
      updateSettings: (settings) => { /* ... */ },
    }),
    {
      name: 'timer-storage',
    }
  )
)
```

## 6. User Interface Requirements
### 6.1 Design Principles
- Minimalist and distraction-free
- High contrast for readability
- Smooth transitions between modes
- Responsive design for all screen sizes

### 6.2 Accessibility
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus indicators for interactive elements

## 7. Performance Requirements
- Initial load time < 2 seconds
- Smooth timer transitions
- Real-time sync for settings

## 8. Future Enhancements
- Statistics and analytics
- Custom sound notifications
- Theme customization