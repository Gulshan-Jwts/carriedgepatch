"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const NavigateBack = () => {
  let pathname = usePathname();
  pathname = pathname.split("/")[2];
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/home");
    }
  };
  return (
    <>
      {!pathname.includes("login") && (
        <nav
        style={{
          display: "flex",
          alignItems: "center",
          position: "fixed",
          width: "100%",
          padding: "16px 20px",
          background: "var(--surface)",
          zIndex: "1000",
        }}>
            {console.log(pathname)}
          <button className="icon-btn" onClick={handleBack}>
            <span className="material-symbols-rounded">arrow_back</span>
          </button>
          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: "500",
              flex: "1",
              marginLeft: "16px",
              color: "var(--text-main)",
            }}>
            {pathname[0].toUpperCase() + pathname.slice(1).split("/")[0]}
          </div>
        </nav>
      )}
    </>
  );
};

export default NavigateBack;
