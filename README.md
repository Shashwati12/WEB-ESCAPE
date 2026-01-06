<div align="center">

# 🎮 Web-Escape

A thrilling horror-themed escape room game built with React and Node.js, featuring 10 challenging levels across three difficulty tiers. Players navigate through dark, atmospheric puzzles while racing against time to complete each challenge.

![React](https://img.shields.io/badge/React-19.1.0-61dafb.svg)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933.svg)

</div>

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Game Levels](#-game-levels)
- [API Documentation](#-api-documentation)
- [Authentication Flow](#-authentication-flow)
- [Key Features Implementation](#-key-features-implementation)
- [Contributing](#-contributing)
- [Future Enhancements](#-future-enhancements)
- [Acknowledgments](#-acknowledgments)

## ✨ Features

### 🎯 Game Features
- **10 Unique Levels**: Progressively challenging puzzles across Easy, Medium, and Hard difficulties
- **Attempt System**: Limited attempts per level with retry options (score penalty)
- **Score Tracking**: Real-time score updates with global leaderboard
- **Timer System**: Track your completion time across all levels
- **Level Progress**: Auto-save and resume functionality
- **Dark Theme**: Immersive horror-themed UI with glassmorphism effects

### 🔐 User Features
- **User Authentication**: Secure JWT-based login/signup system
- **Session Management**: Persistent sessions with cookie-based authentication
- **Profile Management**: Track your stats and achievements
- **Progress Tracking**: Save and resume your game at any time

### 🎨 UI/UX Features
- **Responsive Design**: Seamless experience across all devices
- **Smooth Animations**: Framer Motion powered transitions
- **Beautiful UI**: Modern design with Tailwind CSS
- **Toast Notifications**: Real-time feedback with Sonner
- **Interactive Elements**: Engaging hover effects and micro-animations

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.8
- **Animations**: Framer Motion 12.23.6
- **Routing**: React Router DOM 7.6.2
- **State Management**: Zustand 5.0.5
- **HTTP Client**: Axios 1.9.0 with interceptors
- **Form Validation**: Zod 3.25.67
- **Notifications**: Sonner 2.0.5
- **Icons**: Lucide React 0.525.0

### Backend
- **Runtime**: Node.js with Express 5.1.0
- **Database**: MongoDB with Mongoose 8.15.1
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 3.0.2
- **Environment Config**: dotenv 16.5.0
- **CORS**: cors 2.8.5
- **Validation**: Zod 3.25.67

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Git**

---

## 🚀 Installation

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/web-escape.git
cd web-escape
\`\`\`

### 2. Install Frontend Dependencies

\`\`\`bash
cd Web-Escape
npm install
\`\`\`

### 3. Install Backend Dependencies

\`\`\`bash
cd ../Web-Escape-Backend
npm install
\`\`\`

---

## ⚙️ Configuration

### Frontend Configuration

1. **Create Environment File** (Optional)

```bash
cd Web-Escape
cp .env.example .env
```

2. **Configure API URL** (in `.env`)

```text
# Default: http://localhost:3000
VITE_API_URL=http://localhost:3000
```

> **Note**: If you don't create a `.env` file, the app will default to  
> `http://localhost:3000`

---

### Backend Configuration

1. **Create Environment File**

```bash
cd Web-Escape-Backend
cp .env.example .env
```

2. **Configure Environment Variables** (in `.env`)

```text
# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/web-escape
# or use MongoDB Atlas
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/web-escape

# JWT Secret (use a strong random string)
SECRET_KEY=your-super-secret-jwt-key-change-this

# Server Port (optional, defaults to 3000)
PORT=3000
```

---

---

## 🎮 Running the Application

### Development Mode

#### 1. Start MongoDB

```bash
# If using local MongoDB
mongod
```

#### 2. Start Backend Server

```bash
cd Web-Escape-Backend
npm run dev
```

The backend will run on  
`http://localhost:3000`

#### 3. Start Frontend Development Server

```bash
cd Web-Escape
npm run dev
```

The frontend will run on  
`http://localhost:5173`

---

### Production Build

#### Frontend

```bash
cd Web-Escape
npm run build
npm run preview
```

#### Backend

```bash
cd Web-Escape-Backend
npm start
```
---

---

## 📁 Project Structure

### Frontend Structure

```text
Web-Escape/
├── public/              # Static assets
│   ├── sprites/         # Game sprites
│   └── sounds/          # Audio files
├── src/
│   ├── api/             # API configuration
│   │   └── axios.js     # Axios interceptors
│   ├── assets/          # Images and media
│   ├── components/      # Reusable components
│   │   ├── Auth/        # Login/Signup components
│   │   ├── Dashboard.jsx
│   │   ├── GameMenu.jsx
│   │   ├── LevelCompleteScreen.jsx
│   │   ├── LevelRouter.jsx
│   │   ├── Navbar.jsx
│   │   ├── Particle.jsx
│   │   ├── Score.jsx
│   │   └── Timer.jsx
│   ├── hooks/           # Custom React hooks
│   │   └── useAttempt.js
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Gameover.jsx
│   │   ├── Home.jsx
│   │   └── Leaderboard.jsx
│   ├── rooms/           # Game level components
│   │   ├── easy/        # 3 easy levels
│   │   │   ├── FindObjectGame.jsx
│   │   │   ├── MatchOuest.jsx
│   │   │   └── ShadowShape.jsx
│   │   ├── medium/      # 4 medium levels
│   │   │   ├── GuessTheLiar.jsx
│   │   │   ├── MazeEscape.jsx
│   │   │   ├── OutputPredictor.jsx
│   │   │   └── PatternBreaker.jsx
│   │   └── hard/        # 3 hard levels
│   │       ├── FinalEscape.jsx
│   │       ├── FlappyBird.jsx
│   │       └── WordleClone.jsx
│   ├── state/           # State management
│   │   └── gameStore.js # Zustand store
│   ├── utils/           # Utility functions
│   │   └── Apicall.js   # API endpoints
│   ├── App.jsx          # Main app component
│   └── main.jsx         # App entry point
└── package.json
```

### Backend Structure

```text
Web-Escape-Backend/
├── controllers/         # Route controllers
│   ├── authController.js
│   ├── gameController.js
│   └── levelController.js
├── middleware/          # Express middleware
│   └── isAuthenticated.js
├── models/              # Mongoose models
│   ├── Level.js
│   ├── Progress.js
│   └── User.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── gameRoutes.js
│   └── levelRoutes.js
├── uploads/             # Uploaded game assets
├── utils/               # Utility functions
│   ├── database.js      # MongoDB connection
│   └── generateToken.js # JWT helpers
├── validators/          # Input validation
│   └── authValidator.js
├── server.js            # Server entry point
└── package.json
```


---

---

## 🎯 Game Levels

### Easy Levels (1-3)

1. **Shadow Shape** - Identify shapes from shadows
2. **Match Quest** - Memory card matching game
3. **Find Object** - Hidden object finder

### Medium Levels (4-7)

4. **Guess the Liar** - Logic and deduction puzzle
5. **Maze Escape** - Navigate through a wall maze
6. **Output Predictor** - Predict code output
7. **Pattern Breaker** - Solve pattern sequences

### Hard Levels (8-10)

8. **Wordle Clone** - Word guessing game (6 attempts)
9. **Flappy Bird** - Skill-based flying game (score 20+)
10. **Final Escape** - Pac-Man style maze with enemies

## 📡 API Documentation

### Base URL

\`\`\`
Development: http://localhost:3000/api/v1
\`\`\`

### Authentication Endpoints

#### Register User
\`\`\`http
POST /user/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
\`\`\`

#### Login
\`\`\`http
POST /user/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
\`\`\`

### Game Progress Endpoints

#### Get User Progress
\`\`\`http
GET /game/progress
Authorization: Bearer {token}
\`\`\`

#### Reset Game
\`\`\`http
POST /game/progress/reset
Authorization: Bearer {token}
\`\`\`

#### Get Timer
\`\`\`http
GET /game/progress/getTime
Authorization: Bearer {token}
\`\`\`

#### Update Timer
\`\`\`http
PATCH /game/progress/time
Authorization: Bearer {token}
Content-Type: application/json

{
  "timer": number
}
\`\`\`

### Level Endpoints

#### Get Level Data
\`\`\`http
GET /level/:levelNumber
Authorization: Bearer {token}
\`\`\`

#### Submit Answer
\`\`\`http
POST /level/:levelNumber/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "answer": "string"
}
\`\`\`

#### Use Attempt
\`\`\`http
POST /game/level/:levelNumber/attempt-used
Authorization: Bearer {token}
\`\`\`

#### Retry Level
\`\`\`http
POST /game/level/:levelNumber/retry
Authorization: Bearer {token}
\`\`\`

---

## 🔒 Authentication Flow

1. User registers/logs in
2. Backend generates JWT token
3. Token stored in localStorage (frontend)
4. Axios interceptor automatically adds token to all requests
5. Backend middleware validates token
6. Protected routes accessible with valid token

---

## 🎨 Key Features Implementation

### API Interceptors

The app uses Axios interceptors for centralized API management:

\`\`\`javascript
// Automatic token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
    }
    return Promise.reject(error);
  }
);
\`\`\`

### State Management

Uses Zustand for lightweight, efficient state management:

\`\`\`javascript
const useGameStore = create((set) => ({
  currentLevel: 1,
  score: 0,
  completedLevels: [],
  updateScore: (points) => set((state) => ({ 
    score: state.score + points 
  })),
  // ... more actions
}));
\`\`\`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

### Code Style Guidelines

- Use ESLint for code linting
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes before submitting

---

## 🚀 Future Enhancements

- [ ] Multiplayer mode
- [ ] More levels and difficulty tiers
- [ ] Achievement system
- [ ] Social features (share scores)
- [ ] Mobile app version
- [ ] Sound effects and background music
- [ ] Accessibility improvements
- [ ] Dark/Light theme toggle

---

## 🙏 Acknowledgments

- Inspired by classic escape room games
- Built with modern web technologies
- Thanks to all contributors

---

<div align="center">

### **Happy Escaping! 🎮👻**

⭐ **Star this repo if you enjoyed the game!** ⭐

</div>
