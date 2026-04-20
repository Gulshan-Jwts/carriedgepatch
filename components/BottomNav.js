"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/actions/home", label: "Home", icon: "home" },
  { href: "/actions/leaders", label: "Leaderboard", icon: "leaderboard" },
  { href: "/actions/profile", label: "Profile", icon: "person" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${isActive ? "active" : ""}`}>
            <div className="nav-icon-wrapper">
              <span className="material-symbols-rounded">{item.icon}</span>
            </div>
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
