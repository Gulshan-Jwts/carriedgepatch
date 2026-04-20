"use client";
import React from "react";
import Link from "next/link";
import "@/stylesheet/user/history.css";
import { useUser } from "@/lib/useUser";

const Page = () => {
  const { data, isLoading } = useUser();
  const user = data?.user;

  if (isLoading) return <div>Loading...</div>;

  const history = [...(user?.history || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const hasHistory = history.length > 0;

  return (
    <main className="scroll-content">

      {user?.pendingWithdraw > 0 && (
        <section id="withdrawalPendingCard" style={{marginTop: "100px"}} className="pending-card">
          <div className="pending-icon">
            <span className="material-symbols-rounded">payments</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#b8860b" }}>
              PENDING WITHDRAWAL
            </p>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 500, margin: "2px 0" }}>
              &#8377; {user.pendingWithdraw.toFixed(2)}
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-sub)" }}>
              Requested recently
            </p>
          </div>
        </section>
      )}

      {!hasHistory && (
        <div className="empty-state">
          <div className="empty-icon-circle">
            <span className="material-symbols-rounded" style={{ fontSize: 44 }}>
              history
            </span>
          </div>
          <h3 className="empty-title">No activity yet</h3>
          <p className="empty-msg">
            Your sharing history is empty. Start selling data to see your earnings here.
          </p>

          <Link href="/home" className="earn-btn">
            Start Earning
          </Link>
        </div>
      )}

      {hasHistory && (
        <div className="history-list">
          {history.map((item, index) => {
            const isReferral = item.source === "refer";
            const amount = isReferral ? 50 : item.data / 10;

            return (
              <div className="activity-item" key={index}>
                
                <div
                  className="item-icon"
                  style={{
                    background: isReferral
                      ? "#e8f0fe"
                      : "var(--green-container)",
                    color: isReferral
                      ? "var(--accent-blue)"
                      : "var(--green)",
                  }}
                >
                  <span className="material-symbols-rounded">
                    {isReferral ? "person_add" : "wifi_tethering"}
                  </span>
                </div>

                <div className="info-col">
                  <h4>{item.description}</h4>

                  <p>
                    {new Date(item.date).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {isReferral && !item.isPending ? (
                  <span
                    className={`tag tag-${!item.isCredited ? "pending" : "completed"}`}>
                    {!item.isCredited ? "Pending" : "Completed"}
                  </span>
                ) : null}
                </div>

                <div className="amount-col">
                  {isReferral && item.isPending ? (
                    <Link
                      className="claim-btn"
                      href={`/actions/withdraw/${amount}`}
                    >
                      Claim
                    </Link>
                  ) : (
                    <div
                      className={`amount-text text-${
                        isReferral && !item.isCredited
                          ? "neutral"
                          : "green"
                      }`}
                    >
                      +&#8377; {amount?.toFixed(2)}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Page;