import { useState, useEffect } from "react";
import logo from "../assets/masters_logo.png";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={[
        "sticky top-0 z-50 bg-nav transition-all duration-300",
        scrolled ? "py-2 shadow-lg" : "p-2 py-4 sm:py-5",
      ].join(" ")}
      aria-label="Site header"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 sm:gap-4">
        <img
          src={logo}
          alt="Masters logo"
          className="w-8 h-8 sm:w-10 sm:h-10"
          decoding="async"
        />
        <span className="text-nav font-semibold text-base sm:text-lg tracking-wide">
          Diamond Dogs Masters Draft
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
