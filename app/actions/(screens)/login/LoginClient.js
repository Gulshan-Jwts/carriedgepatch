"use client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import "@/stylesheet/user/login.css";

const LoginClient = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const referrer = searchParams.get("ref");

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.replace(`/actions/home`);
      return;
    }
  }, [status, referrer, router, session]);
  return (
    <div className="login-container">
      <header className="app-logo-area">
        <div className="logo-icon-wrapper">
          <span className="material-symbols-rounded" style={{ fontSize: 40 }}>
            <svg
              width="50"
              height="50"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <rect width="512" height="512" rx="120" fill="#E0EBFF" />

              <path
                d="M110 210C160 150 240 130 310 150C350 160 385 185 415 220"
                stroke="#2563EB"
                strokeWidth="35"
                strokeLinecap="round"
              />

              <path
                d="M175 285C210 245 270 235 315 255C335 265 355 280 375 305"
                stroke="#2563EB"
                strokeWidth="35"
                strokeLinecap="round"
              />

              <g transform="translate(250, 340)">
                <path
                  d="M-60 0H80"
                  stroke="#1E40AF"
                  strokeWidth="35"
                  strokeLinecap="round"
                />

                <path
                  d="M-55 45H75"
                  stroke="#1E40AF"
                  strokeWidth="35"
                  strokeLinecap="round"
                />

                <path
                  d="M70 45C70 45 75 -5 10 -5C-40 -5 -50 40 -50 40L60 130"
                  stroke="#1E40AF"
                  strokeWidth="35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </span>
        </div>

        <h1 className="app-name">CarriagePatch</h1>

        <p className="app-tagline">
          Share your unused data and earn instantly.
        </p>
      </header>

      <button
        className="google-btn"
        onClick={() => {
          if (referrer) {
            document.cookie = `ref=${referrer}; path=/;`;
          }
          signIn("google", {
            callbackUrl: `/actions/home?ref=${referrer || ""}` || "/",
          });
        }}>
        <svg className="google-icon" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>

      <footer className="login-footer">
        By continuing, you agree to CarriagePatch{" "}
        <a href="/terms" className="footer-link">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="footer-link">
          Privacy Policy
        </a>
        .
      </footer>
    </div>
  );
};

export default LoginClient;
