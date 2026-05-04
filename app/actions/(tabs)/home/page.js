"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "@/stylesheet/user/home.css";
import { useUser } from "@/lib/useUser";
import { useToast } from "@/components/ToastContext";
import { mutate } from "swr";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data, isLoading } = useUser();
  const user = data?.user;
  const { Toast } = useToast();
  const [greeting, setGreeting] = useState("Skylie");
  const [isCopied, setIsCopied] = useState("content_copy");
  const [referPanel, setReferPanel] = useState(false);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [earned, setEarned] = useState(0);
  const [popupMessage, setPopupMessage] = useState({ title: "", message: "" });

  const isConnectedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const hour = new Date().getHours();
    const greetingEl =
      hour < 12
        ? "Good Morning"
        : hour < 17
          ? "Good Afternoon"
          : "Good Evening";

    setGreeting(greetingEl + ",");
  }, []);

  useEffect(() => {
    const userIsOnSameDevice = localStorage.getItem("isOnSameDevice") === "true";
    if (userIsOnSameDevice && user?.plan?.active === 1) {
      async function expirePlan() {
        await fetch("/api/expirePlan", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dataUsed: 0,
          }),
        });
      }
      expirePlan();
      mutate("/api/user");
    } else {
      localStorage.setItem("isOnSameDevice", "true");
    }
  }, []);

  useEffect(() => {
    if (user && user?.earned > 0) {
      setEarned(user?.earned);
    }
  }, [user]);

  const dailyQuota =
    user?.plan?.active === 1
      ? 250
      : user?.plan?.active === 2
        ? 1024
        : user?.plan?.active === 3
          ? 5120
          : 0;
  const isToday =
    user?.today?.date &&
    new Date(user.today.date).toDateString() === new Date().toDateString();

  const todayUsed = isToday ? user?.today?.quota || 0 : 0;
  const remainingQuota = dailyQuota - todayUsed;

  const disconnect = (percentage = 0) => {
    const dataUsed = (percentage / 100) * remainingQuota;
    setEarned(Math.floor(dataUsed / 10));
    if (user?.plan?.active === 1) {
      async function expirePlan() {
        await fetch("/api/expirePlan", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dataUsed: Number(dataUsed.toFixed(0)),
          }),
        });
      }
      setShowRewardPopup(true);
      expirePlan();
      mutate("/api/user");
      setSpeed(0);
      setPercentage(0);
      setIsConnected(false);
      isConnectedRef.current = false;
      return;
    }
    if (dataUsed > 0) {
      async function updateWallet() {
        fetch("/api/updateWallet", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dataUsed,
          }),
        });
      }
      updateWallet();
    }

    mutate("/api/user");
    setSpeed(0);
    setPercentage(0);
    setIsConnected(false);
    isConnectedRef.current = false;
  };

  const connect = () => {
    if (!remainingQuota) {
      Toast.show("Limit exeeded now. It will reset tommorow.");
      return;
    }
    if (!remainingQuota) return;
    setIsConnected(true);
    isConnectedRef.current = true;

    let targetMB = remainingQuota;
    let downloaded = 0;
    let limit = user?.limit || 490;

    async function loadChunk(percentage) {
      const startTime = Date.now();
      let updatedWallete =
        user?.wallet + (remainingQuota / 1000) * percentage || 0;
      let assumed =
        (1 - Math.pow(updatedWallete / limit, 2)) * (2 * 1024 * 1024);
      let chunkSize = assumed >= 0 ? assumed : 0;

      try {
        if (chunkSize === 0) return;
        // let response = await fetch("https://speed.cloudflare.com/__down?bytes=" + chunkSize.toFixed(0));
        let response = await fetch("/api/tempchunks", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chunkSize,
          }),
        });
        const reader = response.body.getReader();

        let lastBufferTime = Date.now();
        let downloadedSinceUpdate = 0;
        let runLoop = true;
        while (runLoop) {
          const { done, value } = await reader.read();
          if (!isConnectedRef.current) break;
          if (done) {
            let now = Date.now();
            updatedWallete += downloadedSinceUpdate / (1024 * 1024) / 10 || 0;
            let percent = (downloaded / (targetMB * 1024 * 1024)) * 100;
            setPercentage(Math.min(percent, 100));

            let elapsed = (now - lastBufferTime) / 1000;
            let speed = downloadedSinceUpdate / elapsed / (1024 * 1024);

            setSpeed(speed);
            lastBufferTime = now;
            downloadedSinceUpdate = 0;
            break;
          }
          downloaded += value.length;
          downloadedSinceUpdate += value.length;

          let now = Date.now();

          if (limit - updatedWallete <= 0) {
            setSpeed(0);
            runLoop = false;
            break;
          }

          if (now - lastBufferTime > 1000) {
            updatedWallete += downloadedSinceUpdate / (1024 * 1024) / 10 || 0;
            let percent = (downloaded / (targetMB * 1024 * 1024)) * 100;
            setPercentage(Math.min(percent, 100));

            let elapsed = (now - lastBufferTime) / 1000;
            let speed = downloadedSinceUpdate / elapsed / (1024 * 1024);

            setSpeed(speed);
            lastBufferTime = now;
            downloadedSinceUpdate = 0;
          }
        }

        let percent = (downloaded / (targetMB * 1024 * 1024)) * 100;

        if (downloaded < targetMB * 1024 * 1024) {
          const interval = 1000 - (Date.now() - startTime);
          if (!isConnectedRef.current) return;
          setTimeout(
            () => loadChunk(Math.min(percent, 100)),
            Math.max(0, interval),
          );
        } else {
          disconnect(Math.min(percent, 100));
        }
      } catch (e) {
        disconnect(0);
        Toast.show("Something went wrong!");
        console.error("Error loading chunk", e);
      }
    }

    loadChunk();
  };

  return (
    <>
      <main className="app-container">
        <header style={{ margin: "24px 0" }}>
          <h1 id="greeting" style={{ fontSize: "1.75rem", fontWeight: 500 }}>
            {greeting}
            <span style={{ color: "var(--accent-blue)" }}>
              {" "}
              {user?.name?.split(" ")[0].toUpperCase()}
            </span>
          </h1>
          <p style={{ color: "var(--text-sub)" }}>Share data and earn</p>
        </header>
        <div className="chips-container">
          <div className="chips-row">
            <Link href={`/actions/history`}>
              <div className="chip">
                <span className="material-symbols-rounded">history</span>History
              </div>
            </Link>

            <div
              className="chip"
              id="openRefer"
              onClick={() => setReferPanel(!referPanel)}
            >
              <span className="material-symbols-rounded">group</span>Refer
            </div>

            <Link href={`/actions/plans`}>
              <div className="chip">
                <span className="material-symbols-rounded">layers</span>Plans
              </div>
            </Link>

            <Link href={`/actions/profile`}>
              <div className="chip">
                <span className="material-symbols-rounded">settings</span>
                Settings
              </div>
            </Link>
          </div>
        </div>

        <section className={`card ${isConnected && "connected"}`} id="earnCard">
          <div className="sharing-badge">Sharing</div>
          <p
            style={{
              color: "var(--text-sub)",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            Current Earnings
          </p>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 500, margin: "8px 0" }}>
            &#8377;{" "}
            {(((remainingQuota / 100) * percentage) / 10).toFixed(2) || 0}
          </h2>

          <div className="progress-wrapper">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${percentage}%` }}
                id="progressBar"
              ></div>
            </div>
            <div className="progress-labels">
              <span id="progressText">
                {percentage.toFixed(2)}% (
                {((remainingQuota / 100) * percentage).toFixed(1)} MB)
              </span>
              <span>
                {Math.ceil(remainingQuota)}
                MB
              </span>
            </div>
          </div>
        </section>

        <section
          className={`card ${isConnected && "connected"}`}
          id="speedCard"
          style={{ display: "flex", alignItems: "center" }}
        >
          <div className="speed-box" id="speedIcon">
            <span className="material-symbols-rounded">speed</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "var(--text-sub)", fontSize: "0.8rem" }}>
              Live Speed
            </p>
            <h3 id="speedValue" style={{ fontWeight: 500 }}>
              {speed.toFixed(2)} Mb/s
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
          <Link href="/actions/history">
            <button
              style={{
                background: "none",
                border: "none",
                color: "var(--accent-blue)",
                fontWeight: 700,
                fontSize: "0.85rem",
              }}
            >
              View all
            </button>
          </Link>
        </div>

        {user?.history
          ?.sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((item, index) => {
            let amount =
              item?.source === "refer"
                ? (50).toFixed(2)
                : (item?.data / 10).toFixed(2);
            return (
              <div className="activity-item" key={index}>
                <div
                  className="item-icon"
                  style={{
                    background:
                      item?.source === "refer"
                        ? "#e8f0fe"
                        : "var(--green-container)",
                    color:
                      item?.source === "refer"
                        ? "var(--accent-blue)"
                        : "var(--green)",
                  }}
                >
                  <span className="material-symbols-rounded">
                    {item?.source === "refer" ? "person_add" : "wifi_tethering"}
                  </span>
                </div>

                <div className="info-col">
                  <h4>{item?.description}</h4>
                  <p>
                    {new Date(item?.date).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {item?.source === "refer" && !item?.isPending ? (
                    <span
                      className={`tag tag-${!item?.isCredited ? "pending" : "completed"}`}
                    >
                      {!item?.isCredited ? "Pending" : "Completed"}
                    </span>
                  ) : null}
                </div>

                <div className="amount-col">
                  {item?.source === "refer" && item?.isPending ? (
                    <Link
                      className="claim-btn"
                      href={`/actions/withdraw/${item?.source === "refer" ? (50).toFixed(0) : (item?.data / 10).toFixed(0) || 0}`}
                    >
                      Claim
                    </Link>
                  ) : (
                    <div
                      className={`amount-text text-${item?.source === "refer" && !item?.isCredited ? "neutral" : "green"}`}
                    >
                      +&#8377; {amount || 0}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </main>

      <div
        className={`panel ${referPanel && "show"}`}
        onClick={() => setReferPanel(false)}
        onBlur={() => setReferPanel(false)}
        id="panel"
      ></div>

      <div className={`bottom-sheet ${referPanel && "show"}`} id="referSheet">
        <div className="drag-handle"></div>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#202124" }}>
            Refer & Earn
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#5f6368" }}>
            Invite friends to get rewarded instantly
          </p>
        </div>

        <div className="stepper-container">
          <div className="step-item">
            <div
              className="step-icon"
              style={{ background: "#e8f0fe", color: "#1a73e8" }}
            >
              <span className="material-symbols-rounded">send</span>
            </div>
            <div className="step-content">
              <h4>Invite Friends</h4>
              <p>Share your unique referral link with your friends.</p>
            </div>
          </div>

          <div className="step-item">
            <div
              className="step-icon"
              style={{ background: "#f1f3f4", color: "#ff8000" }}
            >
              <span className="material-symbols-rounded">verified_user</span>
            </div>
            <div className="step-content">
              <h4>Friend Joins</h4>
              <p>
                You get rewarded, when they signup and buy their first plan.
              </p>
            </div>
          </div>

          <div className="step-item">
            <div
              className="step-icon"
              style={{ background: "#e6f4ea", color: "#1e8e3e" }}
            >
              <span className="material-symbols-rounded">account_balance</span>
            </div>
            <div className="step-content">
              <h4>Direct Payout</h4>
              <p>
                <strong>&#8377;50 bonus</strong> will be credited to your
                registered bank account number
              </p>
            </div>
          </div>
        </div>

        <div className="copy-area" style={{ border: "1px dashed #dadce0" }}>
          <span
            style={{
              flex: 1,
              fontSize: "0.8rem",
              fontFamily: "monospace",
              color: "#202124",
              maxWidth: "70vw",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            carriedgepatch.vercel.app/?ref={user?._id}
          </span>
          <button
            id="copyBtn"
            className="icon-btn"
            onClick={function () {
              setIsCopied("done");
              const linkText = "carriedgepatch.vercel.app/?ref=" + user?._id;
              navigator.clipboard.writeText(linkText);

              setTimeout(() => {
                setIsCopied("content_copy");
              }, 2000);
            }}
          >
            <span
              className="material-symbols-rounded"
              style={{ fontSize: "20px" }}
            >
              {isCopied}
            </span>
          </button>
        </div>
      </div>

      <button
        className="connect"
        id="connectBtn"
        onClick={() => {
          if (isConnected) {
            setPopupMessage({
              title: "Do you really want to stop sharing?",
              message: `Maybe your first plan will be deactivated.`,
            });
            setShowRewardPopup(false);
          } else {
            if (!dailyQuota) {
              if (user?.plan?.active > 0) {
                Toast.show("Your daily quota had been ended");
              } else {
                router.push(`/actions/plans`);
                Toast.show("Activate any plan to continue");
              }
              return;
            }
            connect();
          }
        }}
        data-state={isConnected ? "connected" : "disconnected"}
      >
        {isConnected ? (
          <>
            <span className="material-symbols-rounded">pause_circle</span>
            <span>Stop Sharing</span>
          </>
        ) : (
          <>
            <span className="material-symbols-rounded">sensors</span>
            <span>Connect</span>
          </>
        )}
      </button>

      <div
        className={`reward-popup-overlay ${showRewardPopup || user?.earned ? "show" : ""}`}
        id="rewardPopup"
      >
        <div className="reward-modal">
          <div className="reward-content">
            <div className="reward-icon-container">
              <span className="material-symbols-rounded">
                account_balance_wallet
              </span>
            </div>
            <h2 className="reward-title">&#8377;{earned} earned</h2>
            <p className="reward-subtitle">
              Your data sharing bonus has been credited to your CarriagePatch
              wallet.
            </p>
          </div>

          <div className="withdrawbtn">
            <Link href={`/actions/withdraw/${earned?.toFixed(0)}`}>
              <button className="btn-fill">Withdraw now</button>
            </Link>
          </div>
        </div>
      </div>
      <div
        className={`popup-overlay ${popupMessage.message.length > 0 && "show"}`}
        id="popupOverlay"
      >
        <div className="popup">
          <h3
            id="popupTitle"
            style={{
              fontWeight: 500,
              marginBottom: "12px",
              color: "var(--text-main)",
            }}
          >
            {popupMessage.title}
          </h3>
          <p
            id="popupMessage"
            style={{
              color: "var(--text-sub)",
              fontSize: "0.9rem",
              lineHeight: "1.4",
            }}
          >
            {popupMessage.message}
          </p>
          <div className="popup-actions">
            <button
              className="text-button"
              onClick={() => disconnect(percentage)}
              id="closepopup"
            >
              Stop Sharing
            </button>
            <button
              className="text-button"
              onClick={() => setPopupMessage({ message: "", title: "" })}
              id="closepopup"
            >
              Keep Sharing
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
