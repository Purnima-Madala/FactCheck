import { useEffect, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { ParticleBackground } from "./components/3d/ParticleBackground";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LandingPage from "./pages/LandingPage";
import LabPage from "./pages/LabPage";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const stored = localStorage.getItem("neuralarena-theme");
    return stored === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("neuralarena-theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="grid-bg relative min-h-screen">
        <ParticleBackground theme={theme} />

        <header className="sticky top-0 z-30 border-b border-cyan-400/20 bg-slate-950/65 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
            <NavLink to="/" className="font-display text-lg font-semibold tracking-wide text-cyan-200">
              Fact Check LLM
            </NavLink>

            <nav className="flex items-center gap-2 md:gap-3">
              <AppNavLink to="/">Home</AppNavLink>
              <AppNavLink to="/lab">Lab</AppNavLink>
              <AppNavLink to="/about">About</AppNavLink>
              <AppNavLink to="/contact">Contact</AppNavLink>
            </nav>

            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              className="rounded-full border border-cyan-400/35 bg-slate-900/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200 transition hover:brightness-110"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </header>

        <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/lab" element={<LabPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>

        <footer className="relative z-10 border-t border-cyan-400/20 bg-slate-950/65">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-slate-300 md:flex-row md:items-center md:justify-between md:px-8">
            <p>Built for serious verification workflows.</p>
            <p>© 2026 Fact Check LLM</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function AppNavLink({ to, children }: { to: string; children: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded-full px-3 py-1.5 text-sm font-medium transition",
          isActive
            ? "bg-cyan-400/20 text-cyan-100"
            : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-100"
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}
