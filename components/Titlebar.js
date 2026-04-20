"use client";

import { useUser } from "@/lib/useUser";
import Link from "next/link";

export default function Titlebar() {
  const { data: user, isLoading } = useUser();
  let wallet = user?.user?.wallet?.toFixed(2)
  return (
    <nav className="top-nav">
      <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>CarriagePatch</div>
      <div className="wallet-pill">
        <span style={{ fontWeight: 700 }}>
          &#8377; {isLoading? "Updating": (wallet || 0)}
        </span>
        <Link href="/actions/withdraw/">
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
  );
}
