import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/NavBar.css";
import logo from "../assets/masters_logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__brand">
        <img className="navbar__logo" src={logo} />
        Diamond Dogs Masters Draft
      </div>

      {/* Desktop Nav */}
      {/* <ul className="navbar__links">
        <li><Link to="/">Leaderboard</Link></li>
        <li><Link to="/playersscores">Player Scores</Link></li>
      </ul> */}

      {/* Hamburger Button */}
      <button
        className="navbar__hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Menu */}
      <ul
        className={`navbar__mobile ${menuOpen ? "navbar__mobile--open" : ""}`}
      >
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Leaderboard
          </Link>
        </li>
        <li>
          <Link to="/playersscores" onClick={() => setMenuOpen(false)}>
            Player Scores
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
