"use client";

import { useEffect, useState } from "react";
import "@/stylesheet/user/home.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const navItems = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/leader", label: "Leaderboard", icon: "leaderboard" },
  { href: "/profile", label: "Profile", icon: "person" },
];

export default function Home({ searchParams }) {
  let [ref, setRef] = useState("");
  const [greeting, setGreeting] = useState("Skylie");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.replace(`/actions/home`);
      return;
    }
  }, [status, router, session]);

  useEffect(() => {
    async function paramsearch() {
      const paramer = await searchParams;
      setRef(paramer?.ref);
    }
    paramsearch();
  }, []);

  const hour = new Date().getHours();
  let greetingEl = "Skylie";
  greetingEl =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  if (greetingEl != greeting) {
    setGreeting(greetingEl);
  }

  return (
    <>
      <nav className="top-nav">
        <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>CarriagePatch</div>
        <div className="wallet-pill">
          <span style={{ fontWeight: 700 }}>&#8377; 0</span>
          <Link href={`/actions/login?ref=${ref}`}>
            <button className="payout-btn">
              <span
                className="material-symbols-rounded"
                style={{ fontSize: "20px" }}>
                account_balance_wallet
              </span>
            </button>
          </Link>
        </div>
      </nav>
      <main className="app-container">
        <header style={{ margin: "24px 0" }}>
          <h1 id="greeting" style={{ fontSize: "1.75rem", fontWeight: 500 }}>
            {greeting}
          </h1>
          <p style={{ color: "var(--text-sub)" }}>Share data and earn</p>
        </header>
        <div className="chips-container">
          <div className="chips-row">
            <Link href={`/actions/login?ref=${ref}`}>
              <div className="chip">
                <span className="material-symbols-rounded">history</span>History
              </div>
            </Link>

            <Link href={`/actions/login?ref=${ref}`}>
              <div className="chip" id="openRefer">
                <span className="material-symbols-rounded">group</span>Refer
              </div>
            </Link>

            <Link href={`/actions/login?ref=${ref}`}>
              <div className="chip">
                <span className="material-symbols-rounded">layers</span>Plans
              </div>
            </Link>

            <Link href={`/actions/login?ref=${ref}`}>
              <div className="chip">
                <span className="material-symbols-rounded">settings</span>
                Settings
              </div>
            </Link>
          </div>
        </div>

        <section className="card" id="earnCard">
          <div className="sharing-badge">Sharing</div>
          <p
            style={{
              color: "var(--text-sub)",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}>
            Current Earnings
          </p>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 500, margin: "8px 0" }}>
            &#8377; 0.00
          </h2>

          <div className="progress-wrapper">
            <div className="progress-track">
              <div className="progress-fill" id="progressBar"></div>
            </div>
            <div className="progress-labels">
              <span id="progressText">0%</span>
              <span>250MB</span>
            </div>
          </div>
        </section>

        <section
          className="card"
          id="speedCard"
          style={{ display: "flex", alignItems: "center" }}>
          <div className="speed-box" id="speedIcon">
            <span className="material-symbols-rounded">speed</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "var(--text-sub)", fontSize: "0.8rem" }}>
              Live Speed
            </p>
            <h3 id="speedValue" style={{ fontWeight: 500 }}>
              0.00 Mb/s
            </h3>
          </div>

          <div className="spinner-wrapper">
            <div className="ray r1"></div>
            <div className="ray r2"></div>
            <div className="ray r3"></div>
          </div>
        </section>

        <div className="section-header">
          <h3 style={{ fontSize: "1.05rem", fontWeight: 500 }}>
            Recent Activity
          </h3>
          <button
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-blue)",
              fontWeight: 700,
              fontSize: "0.85rem",
            }}>
            View all
          </button>
        </div>
      </main>

      <Link href={`/actions/login?ref=${ref}`}>
        <button className="connect" id="connectBtn" data-state="disconnected">
          <span className="material-symbols-rounded">sensors</span>{" "}
          <span>Connect</span>
        </button>
      </Link>

      <nav className="bottom-nav">
        {navItems.map((item) => {
          const isActive = item.href === "/";
          return (
            <Link
              key={item.href}
              href={`/actions/login?ref=${ref}`}
              className={`nav-link ${isActive ? "active" : ""}`}>
              <div className="nav-icon-wrapper">
                <span className="material-symbols-rounded">{item.icon}</span>
              </div>
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
