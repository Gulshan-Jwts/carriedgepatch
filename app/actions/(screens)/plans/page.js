"use client";

import Link from "next/link";
import "@/stylesheet/user/plans.css";
import { useEffect } from "react";
import { useToast } from "@/components/ToastContext";
import { mutate } from "swr";
import { useState } from "react";

export default function PlansPage() {
  const { Toast } = useToast();

  const [showDialoge, setShowDialoge] = useState(false);
  const [showCheckoutFor, setShowCheckoutFor] = useState(0);
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [didOpenUPI, setDidOpenUPI] = useState(false);

  const handleBuyClick = async () => {
    setIsSaving(true);
    const planCode = showCheckoutFor;
    let res = await fetch("/api/purchasePlan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planCode, phone }),
    });

    if (!res.ok) {
      Toast.show("Something went wrong.");
      return;
    }

    mutate("/api/user");
    setIsSaving(false);
    setShowDialoge(true);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setDidOpenUPI(true);
        console.log("User likely opened UPI app");
      } else {
        console.log("User returned");
        setTimeout(() => {
          if (didOpenUPI) {
            handleBuyClick();
            setDidOpenUPI(false);
          } else {
            Toast.show("Can't open UPI app.");
            console.log("User did not open UPI app");
          }
        }, 4000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [didOpenUPI]);

  return (
    <div className="plans-container">
      <main className="scroll-content">
        <header className="plans-header">
          <p className="subtitle">Maximize your earnings with a Pro limit.</p>
        </header>

        <section className="plan-card">
          <h3 className="plan-name">Basic</h3>

          <div className="plan-price">
            <h2>&#8377;199</h2>
            <span>/ 7 days</span>
          </div>

          <ul className="feature-list">
            <li className="feature-item">
              <span className="material-symbols-rounded">check_circle</span>
              1GB Data Selling Limit
            </li>
            <li className="feature-item">
              <span className="material-symbols-rounded">check_circle</span>
              Regular Payout Speed
            </li>
            <li className="feature-item">
              <span className="material-symbols-rounded">check_circle</span>
              Standard Support
            </li>
          </ul>

          <button
            className="buy-btn btn-outline"
            onClick={() => setShowCheckoutFor(2)}
          >
            Buy Now
          </button>
        </section>

        <section className="plan-card premium">
          <div className="badge-recommended">Recommended</div>

          <h3 className="plan-name pro">Pro</h3>

          <div className="plan-price">
            <h2>&#8377;299</h2>
            <span>/ 7 days</span>
          </div>

          <ul className="feature-list">
            <li className="feature-item">
              <span className="material-symbols-rounded">check_circle</span>
              <b>5GB Data Selling Limit</b>
            </li>
            <li className="feature-item">
              <span className="material-symbols-rounded">check_circle</span>
              Faster Payouts
            </li>
            <li className="feature-item">
              <span className="material-symbols-rounded">check_circle</span>
              Priority Support
            </li>
          </ul>

          <button
            className="buy-btn btn-filled"
            onClick={() => setShowCheckoutFor(3)}
          >
            Buy Now
          </button>
        </section>
      </main>

      <div
        className={`dialog-overlay ${showDialoge ? "show" : ""}`}
        id="activationDialog"
      >
        <div className="dialog">
          <h3 className="dialog-title">Payment Successful</h3>
          <p className="dialog-msg">
            Payment successful. Your new plan will be <b>activated tomorrow</b>
            at 12:00 AM.
          </p>
          <div className="dialog-actions">
            <Link href="/actions/home">
              <button className="text-button">Got it</button>
            </Link>
          </div>
        </div>
      </div>
      {showCheckoutFor > 0 && (
        <div
          className={`scrim ${showCheckoutFor > 0 ? "show" : ""}`}
          onClick={() => {
            setShowCheckoutFor(0);
          }}
        ></div>
      )}

      <div
        className={`bottom-panel ${showCheckoutFor > 0 ? "show" : ""}`}
        id="editSheet"
      >
        <div className="sheet-handle"></div>

        <h3>Update your phone number</h3>
        <p>UPI phone number</p>

        <div className="edit-form">
          <input
            type="number"
            value={phone}
            onChange={(e) => {setPhone(e.target.value.slice(0, 10));console.log(e.target.value.slice(0, 10))}}
            placeholder="UPI Phone Number"
            className="input-field"
          />
          {showCheckoutFor === 2 ? (
            <button
              className="save-btn"
              onClick={() => {
                window.location.href =
                  "upi://pay?pa=carriagepatch.pvt.ltd@okicici&pn=CarriagePatch%20PVT%20LTD&am=299.00&cu=INR";
              }}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          ) : (
            <button
              className="save-btn"
              onClick={() => {
                try {
                  window.location.href =
                    "upi://pay?pa=carriagepatch.pvt.ltd@okicici&pn=CarriagePatch%20PVT%20LTD&am=299.00&cu=INR";
                  
                } catch (error) {
                  console.error("Error opening UPI app:", error);
                  Toast.show("Can't open UPI app.");
                }
              }}
              disabled={isSaving}
            >
              {isSaving ? "Opening..." : "Pay with UPI"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
