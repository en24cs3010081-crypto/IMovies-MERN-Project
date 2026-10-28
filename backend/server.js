import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const moviesSeed = [
  { title: "The Last Horizon", genre: "Adventure", duration: "2h 08m", rating: "8.2", language: "Hindi", price: 180, poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80", description: "A daring expedition sets out to discover what lies beyond the known world." },
  { title: "City of Dreams", genre: "Drama", duration: "1h 56m", rating: "7.8", language: "Hindi", price: 160, poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80", description: "In a city that never sleeps, three lives intersect in unexpected ways." },
  { title: "Cosmic Run", genre: "Sci-Fi", duration: "2h 15m", rating: "8.6", language: "English", price: 220, poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80", description: "A mission to the edge of the galaxy becomes a race against time." },
  { title: "Laugh Out Loud", genre: "Comedy", duration: "1h 42m", rating: "7.4", language: "Hindi", price: 150, poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80", description: "One chaotic weekend turns a quiet family into the talk of the town." },
  { title: "Midnight Case", genre: "Thriller", duration: "2h 01m", rating: "8.0", language: "Hindi", price: 190, poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80", description: "A detective follows a trail of clues that changes with every answer." },
  { title: "Monsoon Melody", genre: "Romance", duration: "1h 49m", rating: "7.9", language: "Hindi", price: 170, poster: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80", description: "A chance meeting during the monsoon becomes a story of music and love." }
];

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: String,
  duration: String,
  rating: String,
  language: String,
  price: Number,
  poster: String,
  description: String
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  bookingCode: { type: String, required: true, unique: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: false },
  movieTitle: { type: String, required: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  showDate: { type: String, required: true },
  showTime: { type: String, required: true },
  seats: { type: [String], required: true },
  total: { type: Number, required: true }
}, { timestamps: true });

const Movie = mongoose.model("Movie", movieSchema);
const Booking = mongoose.model("Booking", bookingSchema);

app.get("/api/health", (_req, res) => res.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" }));

app.get("/api/movies", async (_req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) return res.json(moviesSeed);
    let movies = await Movie.find().sort({ title: 1 });
    if (!movies.length) movies = await Movie.insertMany(moviesSeed);
    res.json(movies);
  } catch (error) {
    console.error("GET movies:", error.message);
    res.json(moviesSeed);
  }
});

app.get("/api/bookings", async (req, res) => {
  const email = String(req.query.email || "").trim().toLowerCase();
  if (!email) return res.status(400).json({ message: "Email is required." });
  try {
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: "Database is not connected. Start MongoDB to view saved bookings." });
    const bookings = await Booking.find({ email }).sort({ createdAt: -1 }).limit(50);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch bookings." });
  }
});

app.post("/api/bookings", async (req, res) => {
  const { movieId, movieTitle, customerName, email, showDate, showTime, seats } = req.body || {};
  if (!movieTitle || !customerName?.trim() || !email?.trim() || !showDate || !showTime || !Array.isArray(seats) || seats.length < 1) {
    return res.status(400).json({ message: "Please provide all booking details and select at least one seat." });
  }
  const movie = moviesSeed.find(m => m.title === movieTitle);
  const price = Number(movie?.price || 180);
  const booking = {
    bookingCode: "IM" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    movieTitle, customerName: customerName.trim(), email: email.trim().toLowerCase(),
    showDate, showTime, seats, total: price * seats.length
  };
  try {
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: "MongoDB is not connected. Start MongoDB and try again." });
    if (mongoose.Types.ObjectId.isValid(movieId)) booking.movieId = movieId;
    const saved = await Booking.create(booking);
    res.status(201).json(saved);
  } catch (error) {
    console.error("POST booking:", error.message);
    res.status(500).json({ message: "Booking could not be saved. Please try again." });
  }
});

const PORT = process.env.PORT || 5000;
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection failed:", err.message));
}
app.listen(PORT, () => console.log(`IMovies API running on http://localhost:${PORT}`));
