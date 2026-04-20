"use client";

import { useState } from "react";
import Link from "next/link";
import "@/stylesheet/user/leader.css";
import Image from "next/image";

export default function LeaderboardPage() {
  const [showTooltip, setShowTooltip] = useState(false);

  const leaders = [
    {
      rank: 1,
      name: "Aarav Sharma",
      earnings: "₹68,200",
      photo: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      rank: 2,
      name: "Priya Malhotra",
      earnings: "₹42,500",
      photo: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      rank: 3,
      name: "Vikram Singh",
      earnings: "₹38,900",
      photo: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      rank: 4,
      name: "Ananya Reddy",
      earnings: "₹24,150",
      photo: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      rank: 5,
      name: "Rohan Kapoor",
      earnings: "₹21,800",
      photo: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      rank: 6,
      name: "Mehak Kaur",
      earnings: "₹19,400",
      photo: "https://randomuser.me/api/portraits/women/6.jpg",
    },
    {
      rank: 7,
      name: "Arjun Patel",
      earnings: "₹15,200",
      photo: "https://randomuser.me/api/portraits/men/7.jpg",
    },
    {
      rank: 8,
      name: "Sneha Iyer",
      earnings: "₹12,400",
      photo: "https://randomuser.me/api/portraits/women/8.jpg",
    },
    {
      rank: 9,
      name: "Karanpreet Singh",
      earnings: "₹11,900",
      photo: "https://randomuser.me/api/portraits/men/9.jpg",
    },
    {
      rank: 10,
      name: "Ishita Verma",
      earnings: "₹10,200",
      photo: "https://randomuser.me/api/portraits/women/10.jpg",
    },
  ];

  const topThree = [leaders[1], leaders[0], leaders[2]];

  return (
    <div className="leaderboard-container">
      <nav className="leaderboard-header">
        <h3 className="nav-title">Leaderboard</h3>

        <div className="info-wrapper">
          <button
            className="icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(!showTooltip);
            }}>
            <span className="material-symbols-rounded">help_outline</span>
          </button>

          <div className={`tooltip ${showTooltip ? "show" : ""}`}>
            You rank in top 10 when your earnings hits 10k or more.
          </div>
        </div>
      </nav>

      <main className="scroll-content">
        <section className="topper-section">
          {topThree.map((leader, index) => {
            const rankOrder = [2, 1, 3];
            const displayRank = rankOrder[index];

            return (
              <div
                key={leader.rank}
                className={`topper-item rank-${displayRank}`}>
                <div className="avatar-frame">
                  <Image
                    height={300}
                    width={300}
                    src={leader.photo}
                    alt={leader.name}
                    className="user-photo"
                  />
                  <div className="rank-badge">{displayRank}</div>
                </div>
                <p className="topper-name">{leader.name}</p>
                <p className="topper-earnings">{leader.earnings}</p>
              </div>
            );
          })}
        </section>

        <h3 className="section-title">Top 10 Earners</h3>

        <div className="ranking-list">
          {leaders.map((leader) => (
            <div
              key={leader.rank}
              className="ranking-item"
              style={leader.rank === 10 ? { borderBottom: "none" } : {}}>
              <div className="rank-num">{leader.rank}</div>
              <Image
                height={300}
                width={300}
                src={leader.photo}
                alt={leader.name}
                className="list-photo"
              />
              <div className="user-name">{leader.name}</div>
              <div className="earnings-text">{leader.earnings}</div>
            </div>
          ))}
        </div>
      </main>

      <nav className="bottom-nav">
        <Link href="/" className="nav-link">
          <div className="nav-icon-wrapper">
            <span className="material-symbols-rounded">home</span>
          </div>
          <span className="nav-label">Home</span>
        </Link>

        <Link href="/leaderboard" className="nav-link active">
          <div className="nav-icon-wrapper">
            <span className="material-symbols-rounded">leaderboard</span>
          </div>
          <span className="nav-label">Leaderboard</span>
        </Link>

        <Link href="/profile" className="nav-link">
          <div className="nav-icon-wrapper">
            <span className="material-symbols-rounded">person</span>
          </div>
          <span className="nav-label">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
