import { useEffect, useMemo, useState } from "react";
import { Search, Film, Ticket, Clock3, Star, CalendarDays, X, CheckCircle2, Armchair, Popcorn, Clapperboard } from "lucide-react";

const API = "https://imovies-mern-project-jdpu.onrender.com/api";
const fallbackMovies = [
  { _id:"m1", title:"The Last Horizon", genre:"Adventure", duration:"2h 08m", rating:"8.2", language:"Hindi", price:180, poster:"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80", description:"A daring expedition sets out to discover what lies beyond the known world." },
  { _id:"m2", title:"City of Dreams", genre:"Drama", duration:"1h 56m", rating:"7.8", language:"Hindi", price:160, poster:"https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80", description:"In a city that never sleeps, three lives intersect in unexpected ways." },
  { _id:"m3", title:"Cosmic Run", genre:"Sci-Fi", duration:"2h 15m", rating:"8.6", language:"English", price:220, poster:"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80", description:"A mission to the edge of the galaxy becomes a race against time." },
  { _id:"m4", title:"Laugh Out Loud", genre:"Comedy", duration:"1h 42m", rating:"7.4", language:"Hindi", price:150, poster:"https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80", description:"One chaotic weekend turns a quiet family into the talk of the town." },
  { _id:"m5", title:"Midnight Case", genre:"Thriller", duration:"2h 01m", rating:"8.0", language:"Hindi", price:190, poster:"https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80", description:"A detective follows a trail of clues that changes with every answer." },
  { _id:"m6", title:"Monsoon Melody", genre:"Romance", duration:"1h 49m", rating:"7.9", language:"Hindi", price:170, poster:"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80", description:"A chance meeting during the monsoon becomes a story of music and love." }
];
const times = ["10:30 AM", "1:45 PM", "5:15 PM", "8:30 PM"];
const genres = ["All", "Adventure", "Drama", "Sci-Fi", "Comedy", "Thriller", "Romance"];

function App() {
  const [movies, setMovies] = useState(fallbackMovies);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showtime, setShowtime] = useState(times[1]);
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [seats, setSeats] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [booking, setBooking] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyEmail, setHistoryEmail] = useState("");
  const [view, setView] = useState("movies");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/movies`).then(r => r.ok ? r.json() : Promise.reject()).then(data => {
      if (Array.isArray(data) && data.length) setMovies(data);
    }).catch(() => {});
  }, []);

  const filtered = useMemo(() => movies.filter(m =>
    (genre === "All" || m.genre === genre) &&
    `${m.title} ${m.genre} ${m.language}`.toLowerCase().includes(query.toLowerCase())
  ), [movies, genre, query]);

  function openBooking(movie) {
    setSelected(movie); setSeats([]); setShowtime(times[1]); setNotice(""); setBooking(null);
  }
  function toggleSeat(seat) {
    setSeats(current => current.includes(seat) ? current.filter(s => s !== seat) : current.length < 8 ? [...current, seat] : current);
  }
  async function confirmBooking(e) {
    e.preventDefault();
    if (!seats.length) { setNotice("Please select at least one seat."); return; }
    setLoading(true); setNotice("");
    try {
      const response = await fetch(`${API}/bookings`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ movieId:selected._id, movieTitle:selected.title, customerName, email, showDate:date, showTime:showtime, seats })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Booking failed.");
      setBooking(data);
    } catch (err) {
      setNotice(`${err.message || "Could not connect to the API."} Make sure the backend and MongoDB are running.`);
    } finally { setLoading(false); }
  }
  async function loadHistory(e) {
    e.preventDefault(); setNotice("");
    try {
      const response = await fetch(`${API}/bookings?email=${encodeURIComponent(historyEmail)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not load bookings.");
      setHistory(data); setView("history");
    } catch (err) { setNotice(err.message || "Could not connect to the API."); }
  }
  const money = n => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#" onClick={e => {e.preventDefault();setView("movies");}}><span className="brand-mark"><Film size={22}/></span>i<span>MOVIES</span></a>
      <nav><button className={view === "movies" ? "nav-active" : ""} onClick={() => setView("movies")}>Discover</button><button className={view === "history" ? "nav-active" : ""} onClick={() => setView("history")}>My Bookings</button></nav>
      <div className="top-right"><span className="status-dot"/> Your movie night starts here</div>
    </header>

    {view === "movies" ? <>
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><span/> YOUR FRONT ROW TO ENTERTAINMENT</div>
          <h1>Stories worth<br/><em>watching.</em></h1>
          <p>Find your next favourite. Pick your seats. Let the big screen do the rest.</p>
          <button className="primary-btn" onClick={() => document.getElementById("movies")?.scrollIntoView({behavior:"smooth"})}>Explore movies <span>↘</span></button>
          <div className="hero-stats"><div><strong>{movies.length.toString().padStart(2,"0")}</strong><small>NOW SHOWING</small></div><div><strong>4K</strong><small>BIG SCREEN FEEL</small></div><div><strong>1 click</strong><small>TO YOUR NEXT FILM</small></div></div>
        </div>
        <div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="poster-stack"><div className="poster-back poster-back-one"/><div className="poster-back poster-back-two"/><div className="poster-main"><img src={movies[2]?.poster || fallbackMovies[2].poster} alt="Featured movie"/><div className="poster-shade"/><div className="poster-label"><span>FEATURED FILM</span><strong>{movies[2]?.title || "Cosmic Run"}</strong><small><Star size={13} fill="currentColor"/> {movies[2]?.rating || "8.6"} / 10</small></div></div></div><div className="floating-ticket"><Ticket size={18}/><span>YOUR SEAT<br/><b>AWAITS</b></span></div><div className="hero-spark">✳</div></div>
      </section>
      <main id="movies" className="content">
        <div className="section-head"><div><div className="eyebrow muted">THE BIG SCREEN LINEUP</div><h2>Now <em>showing</em></h2></div><div className="movie-count"><Clapperboard size={17}/> {filtered.length} films to explore</div></div>
        <div className="toolbar"><div className="searchbox"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search movies, genres..."/></div><div className="genre-list">{genres.map(g=><button key={g} className={genre===g?"genre-active":""} onClick={()=>setGenre(g)}>{g}</button>)}</div></div>
        <div className="movie-grid">{filtered.map((movie, i)=><article className="movie-card" key={movie._id || movie.title}><div className="movie-poster"><img src={movie.poster} alt={movie.title} loading="lazy"/><span className="rating"><Star size={13} fill="currentColor"/> {movie.rating}</span><span className="poster-index">0{i+1}</span><button className="quick-book" onClick={()=>openBooking(movie)}>Book tickets <span>↗</span></button></div><div className="movie-info"><div className="movie-meta"><span>{movie.genre}</span><span>•</span><span>{movie.duration}</span></div><h3>{movie.title}</h3><div className="movie-bottom"><span>{movie.language}</span><strong>from {money(movie.price)}</strong></div></div></article>)}</div>
        {filtered.length===0 && <div className="empty"><Film size={30}/><h3>No movies found</h3><p>Try another title or genre.</p></div>}
      </main>
    </> : <main className="content history-page"><div className="eyebrow muted">YOUR CINEMA JOURNEY</div><h2>My <em>bookings</em></h2><p className="history-intro">Enter the email address used at checkout to find your tickets.</p><form className="history-form" onSubmit={loadHistory}><input type="email" required placeholder="you@example.com" value={historyEmail} onChange={e=>setHistoryEmail(e.target.value)}/><button className="primary-btn">Find bookings ↗</button></form>{notice && <p className="notice">{notice}</p>}{history.length ? <div className="history-list">{history.map(b=><div className="history-card" key={b._id}><div className="history-icon"><Ticket/></div><div className="history-detail"><strong>{b.movieTitle}</strong><span>{b.showDate} · {b.showTime} · Seats {b.seats.join(", ")}</span><small>Booking code: {b.bookingCode}</small></div><b>{money(b.total)}</b></div>)}</div> : <div className="empty"><Ticket size={30}/><h3>Your tickets will appear here</h3><p>Once you book a movie, look it up with your email.</p></div>}</main>}

    <footer><div className="footer-brand"><Film size={20}/> IMOVIES</div><span>A student MERN stack capstone project</span><span>Made for movie lovers <span className="heart">♥</span></span></footer>

    {selected && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget){setSelected(null);setBooking(null);}}}><div className="booking-modal">
      <button className="close-modal" onClick={()=>{setSelected(null);setBooking(null);}} aria-label="Close"><X size={20}/></button>
      {booking ? <div className="success-state"><div className="success-icon"><CheckCircle2 size={38}/></div><div className="eyebrow muted">BOOKING CONFIRMED</div><h2>Your seats are <em>saved.</em></h2><p>You're all set for <strong>{booking.movieTitle}</strong>.</p><div className="ticket-confirm"><div><small>BOOKING CODE</small><strong>{booking.bookingCode}</strong></div><div><small>SHOW</small><strong>{booking.showDate} · {booking.showTime}</strong></div><div><small>SEATS</small><strong>{booking.seats.join(", ")}</strong></div><div><small>TOTAL PAID</small><strong>{money(booking.total)}</strong></div></div><p className="small-note">Demo confirmation only — no payment was processed.</p><button className="primary-btn full" onClick={()=>{setSelected(null);setBooking(null);setView("history");setHistoryEmail(email);}}>Done</button></div> : <><div className="modal-heading"><div className="eyebrow muted">RESERVE YOUR SEATS</div><h2>Make it a <em>movie night.</em></h2><p>{selected.title} <span>·</span> {selected.duration} <span>·</span> {money(selected.price)} / seat</p></div><form onSubmit={confirmBooking}>
        <label className="field-label">Choose a date<input type="date" required min={new Date().toISOString().slice(0,10)} value={date} onChange={e=>setDate(e.target.value)}/></label>
        <div className="field-label">Pick a showtime<div className="time-options">{times.map(t=><button type="button" key={t} className={showtime===t?"time-active":""} onClick={()=>setShowtime(t)}><Clock3 size={14}/>{t}</button>)}</div></div>
        <div className="seat-section"><div className="seat-heading"><span><Armchair size={16}/> Select seats</span><small>Up to 8 seats</small></div><div className="screen"><span>SCREEN THIS WAY</span></div><div className="seat-grid">{Array.from({length:40},(_,i)=>{const row=String.fromCharCode(65+Math.floor(i/8));const seat=`${row}${i%8+1}`;const unavailable=[3,12,18,27,34].includes(i);return <button type="button" disabled={unavailable} key={seat} className={`seat ${unavailable?"seat-taken":seats.includes(seat)?"seat-selected":""}`} onClick={()=>toggleSeat(seat)} title={unavailable?"Unavailable":seat}>{i%8+1}</button>})}</div><div className="seat-legend"><span><i/> Available</span><span><i className="selected-legend"/> Selected</span><span><i className="taken-legend"/> Unavailable</span></div></div>
        <div className="booking-fields"><label className="field-label">Your name<input required value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="Full name"/></label><label className="field-label">Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label></div>
        <div className="checkout-row"><div><small>{seats.length} seat{seats.length!==1?"s":""} selected</small><strong>{money((selected.price||180)*seats.length)}</strong></div><button className="primary-btn" disabled={loading}>{loading?"Booking...":"Confirm booking ↗"}</button></div>
        {notice && <p className="notice">{notice}</p>}
      </form></>}
    </div></div>}
  </div>;
}

export default App;
