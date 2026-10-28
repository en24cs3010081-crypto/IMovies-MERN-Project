# IMovies — Movie Ticket Booking (MERN)

A starter MERN project for the Creditcourse capstone project. Includes movie search, movie details, seat selection, booking form, and booking history.

## Requirements
- Node.js 18+
- MongoDB Community Server or a MongoDB Atlas connection string

## 1. Run the backend
Open a terminal:

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set `MONGODB_URI`. Example:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/imovies
```

Then run:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## 2. Run the frontend
Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Features
- Browse and search movies
- Filter by genre
- Select a movie and showtime
- Select seats
- Enter customer details and create a booking
- View booking history by email
- MongoDB persistence through the Express API
- Demo movie data is shown if the API is temporarily unavailable

## Important
This is a learning/demo project. It does not process real payments or guarantee live cinema seat availability. Booking confirmation is for demonstration purposes only.
