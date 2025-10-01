# Cycling Challenge

A web application for managing a cycling challenge where participants find hidden passcodes throughout the city and submit them along with their Instagram usernames to earn points.

## Features

- Passcode validation system
- User score tracking
- Real-time leaderboard
- Challenge countdown timer

## Tech Stack

- Node.js
- Express
- HTML/CSS/JavaScript
- JSON for data storage

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a .env file with your configuration:

   ```
   PORT=3000
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000` in your browser

## Project Structure

```
src/
├── controllers/    # Request handlers
├── models/         # Data models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Helper functions
├── public/         # Static files
└── views/          # Frontend templates

data/              # JSON storage
tests/             # Unit tests
```

## API Endpoints

- POST /api/passcodes - Submit a passcode
- GET /api/leaderboard - Get current rankings
- GET /api/timer - Get remaining time

## Best Practices

This project follows:

- MVC architecture
- RESTful API design
- Clean code principles
- Error handling best practices
- Proper code documentation
