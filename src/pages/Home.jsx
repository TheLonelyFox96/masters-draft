import TeamLeaderboard from "../components/TeamLeaderboard";
import TopPlayerLeaderboard from "../components/TopPlayerLeaderboard";
import logo from "../assets/masters.webp";
import { animated as _animated, useSpring } from "@react-spring/web";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

function Home() {
  const reducedMotion = usePrefersReducedMotion();
  const pageSpring = useSpring({
    from: { opacity: 0, transform: "translate3d(0, 20px, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0px, 0)" },
    config: { tension: 220, friction: 26 },
    immediate: reducedMotion,
  });

  return (
    <_animated.div style={pageSpring} className="min-h-screen bg-page">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] sm:h-[380px] md:h-[440px] overflow-hidden">
        <img
          src={logo}
          alt="Masters Draft 2026"
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />

        {/* Gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Hero content - centered */}
        <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-8">
          <div className="max-w-2xl text-center">
            <p className="text-sm sm:text-base md:text-lg font-light text-white bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl px-6 sm:px-10 py-5 sm:py-6 leading-relaxed shadow-lg">
              The Diamond Dogs (minus Nate) are back with the 2026 Masters
              Draft. After a disappointing 2025 where Josh choked a 6 shot lead
              and Evan claimed the title, can anyone save this competition from
              shame...
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboards */}
      <div className="py-6 sm:py-8">
        <TeamLeaderboard />
        <TopPlayerLeaderboard />
      </div>
    </_animated.div>
  );
}

export default Home;
