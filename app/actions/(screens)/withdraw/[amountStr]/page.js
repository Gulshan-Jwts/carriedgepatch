"use client";
import React, { useEffect, useState } from "react";
import "@/stylesheet/user/withdraw.css";
import { useUser } from "@/lib/useUser";
import Link from "next/link";
import { useToast } from "@/components/ToastContext";
import { useParams } from "next/navigation";
import { mutate } from "swr";

const Page = () => {
  const { amountStr } = useParams();
  const amount = Number(amountStr).toFixed(0);
  const { data, isLoading } = useUser();
  const user = data?.user;
  const { Toast } = useToast();

  const [popupMessage, setPopupMessage] = useState({
    title: "",
    message: "",
  });
  const [reqSent, setReqSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    amount: 0,
  });

  useEffect(() => {
    if (user?.receivingPhone && user?.name) {
      setFormData({ ...formData, name: user.name, phone: user.receivingPhone });
    }
  }, [user]);

  const sendRequest = async () => {
    if (!formData.name) {
      Toast.show("Please enter your full name.");
      return;
    }
    if (formData.phone.length < 10) {
      Toast.show("Enter a valid 10-digit phone number.");
      return;
    }
    if ((isNaN(formData.amount) || formData.amount <= 0) && !amount) {
      Toast.show("Please enter a valid withdrawal amount.");
      return;
    }

    if (formData.amount > user?.wallet) {
      setPopupMessage({
        title: "Insufficient Balance",
        message:
          "You don't have enough funds to withdraw &#8377; " + formData.amount + ".",
      });
      return;
    }

    try {
      if (!amount) {
        if (user?.pendingWithdraw > 0) {
          setPopupMessage({
            title: "Already payment requested",
            message: `An Payment is still at request. Please wait!`,
          });
          return;
        }

        if (formData.amount < 500) {
          setPopupMessage({
            title: "Amount too low",
            message: "The minimum withdrawal limit is &#8377; 500.",
          });
          return;
        }

        if (formData.amount > user?.wallet) {
          setPopupMessage({
            title: "Insufficient Balance",
            message:
              "You don't have enough funds to withdraw &#8377; " +
              formData.amount +
              ".",
          });
          return;
        }

        const fetchreq = async () => {
          const res = await fetch("/api/reqPayment/pending", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: formData.amount,
            }),
          });

          return res;
        };

        const res = fetchreq();

        if (!res.ok) {
          setPopupMessage({
            title: "Something went wrong!",
            message:
              "Please check your internet connection, or try again later.",
          });
        }
        mutate("/api/user");

        return;
      } else {
        if (user?.withdraw?.amount > 0) {
          setPopupMessage({
            title: "Already payment requested",
            message: `An Payment is still at request. Please wait!`,
          });
          return;
        }

        const foundOnHistory = user?.history.find(
          (item) => item.source === "refer" && item.isPending,
        );
        if (user?.earned < amount - 1 && !foundOnHistory) {
          alert(user?.earned, amount);
          setPopupMessage({
            title: "Insufficient Balance",
            message: "You can't withdraw &#8377; " + user?.earned + ".",
          });
          return;
        }
        const isReferAmount = user?.earned <= 0 && foundOnHistory;

        const fetchreq = async () => {
          const res = await fetch("/api/reqPayment", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              source: isReferAmount ? "refer" : isReferAmount,
              amount: Number(amount),
              formData,
            }),
          });
          let status = res.status;
          return status;
        };

        const status = await fetchreq();

        if (status != 200) {
          setPopupMessage({
            title: "Something went wrong!",
            message:
              "Please check your internet connection, or try again later.",
          });
          return;
        }
        mutate("/api/user");

        setReqSent(true);

        return;
      }
    } catch (error) {
      Toast.show("Something went wrong!");
      console.log(error);
    }
  };

  const handleFormChange = (e) => {
    if (e.target.disabled) return;
    if (e.target.type === "number" && e.target.value.length > 10) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="withdraw-container">
        <main className="scroll-content" id="withdrawForm">
          <header style={{ marginBottom: "24px", marginTop: "75px" }}>
            <p style={{ color: "var(--text-sub)", fontSize: "0.95rem" }}>
              Transfer earnings to your bank account.
            </p>
          </header>

          <div className="balance-card">
            <div>
              <p style={{ fontSize: "0.85rem", opacity: "0.8" }}>
                Available Balance
              </p>
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 500,
                  marginTop: "4px",
                }}>
                &#8377; {amount ? amount : user?.wallet?.toFixed(2)}
              </h2>
            </div>
            <span
              className="material-symbols-rounded"
              style={{ fontSize: "40px", opacity: "0.4" }}>
              account_balance_wallet
            </span>
          </div>

          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              className="input"
              id="userName"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Name as per bank"
            />
          </div>

          <div className="input-group">
            <label className="input-label">UPI Phone Number</label>
            <input
              type="number"
              className="input"
              id="userPhone"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              placeholder="10-digit number"
              maxLength="10"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Withdrawal Amount</label>
            <input
              type="number"
              className="input"
              id="withdrawAmount"
              name="amount"
              value={!amount ? formData.amount : amount}
              onChange={handleFormChange}
              disabled={amount}
              placeholder="Min. &#8377; 500"
            />
          </div>

          <div style={{ marginTop: "32px" }}>
            <button
              className="submit-btn"
              id="submitRequest"
              onClick={sendRequest}>
              Submit Request
            </button>
          </div>
        </main>

        <section id="successState" className={reqSent ? "show" : ""}>
          <div className="success-icon-circle">
            <span
              className="material-symbols-rounded"
              style={{ fontSize: "48px" }}>
              check_circle
            </span>
          </div>
          <h2 style={{ fontWeight: 500, color: "var(--text-main)" }}>
            Request Submitted
          </h2>
          <p
            style={{
              color: "var(--text-sub)",
              margin: "12px 32px 32px",
              fontSize: "0.95rem",
              lineHeight: "1.5",
            }}>
            Your request is being processed. Payment will reflect in your
            account within <b>7 business days</b>.
          </p>
          <Link href="/actions/home">
            <button className="submit-btn" style={{ maxWidth: "240px" }}>
              Done
            </button>
          </Link>
        </section>
      </div>
      <div
        className={`popup-overlay ${popupMessage.message.length > 0 && "show"}`}
        id="popupOverlay">
        <div className="popup">
          <h3
            id="popupTitle"
            style={{
              fontWeight: 500,
              marginBottom: "12px",
              color: "var(--text-main)",
            }}>
            {popupMessage.title}
          </h3>
          <p
            id="popupMessage"
            style={{
              color: "var(--text-sub)",
              fontSize: "0.9rem",
              lineHeight: "1.4",
            }}>
            {popupMessage.message}
          </p>
          <div className="popup-actions">
            <Link href="/actions/home">
              <button className="text-button" id="closepopup">
                Got it
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
