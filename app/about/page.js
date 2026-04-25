import NavigateBack from "@/components/NavigateBack";
import React from "react";
import "@/stylesheet/more/about.css";

const Page = () => {
  return (
    <div class="about-container">
      <NavigateBack level={1} />

      <main class="scroll-content">
        <header class="hero-header">
          <h1 class="hero-title">CarriagePatch</h1>
          <p class="hero-tagline">Network Quality Research</p>
        </header>

        <section class="doc-section">
          <span class="material-symbols-rounded doc-icon">wifi_tethering</span>
          <div class="doc-text-area">
            <h3 class="doc-heading">Overview</h3>
            <p class="doc-body">
              CarriagePatch is a specialized infrastructure collective. We map
              the <b>real-world quality</b> of mobile internet across India
              through actual device connectivity.
            </p>
          </div>
        </section>

        <section class="doc-section">
          <span class="material-symbols-rounded doc-icon">architecture</span>
          <div class="doc-text-area">
            <h3 class="doc-heading">The Purpose</h3>
            <p class="doc-body">
              Your connection provides the &ldquo;signal map&ldquo; required for a
              <b>massive, global infrastructure project</b>. We analyze how
              internet behaves in the hands of the public to build the next-gen
              backbone of connectivity.
            </p>
          </div>
        </section>

        <section class="doc-section">
          <span class="material-symbols-rounded doc-icon">payments</span>
          <div class="doc-text-area">
            <h3 class="doc-heading">The Fair Exchange</h3>
            <p class="doc-body">
              Information is the world&apos;s most valuable currency. Since your
              mobile internet provides the core insights for our project, it is
              only logical that you own a share of the value. CarriagePatch
              operates on a direct-reward model: you provide the network
              metrics, and we provide the payout.
            </p>
          </div>
        </section>

        <div class="logic-note">
          Since your connection provides the core insights for this blueprint,
          it is only <b>logical</b> that you own a share of the value created.
        </div>

        <section class="doc-section">
          <span class="material-symbols-rounded doc-icon">hub</span>
          <div class="doc-text-area">
            <h3 class="doc-heading">The Vision</h3>
            <p class="doc-body">
              We are building the silent backbone for the future of
              connectivity. The internet you share today is the blueprint for
              the infrastructure we are building for tomorrow.
            </p>
          </div>
        </section>

        <footer class="footer-info">
          <p>CarriagePatch • 2026</p>
        </footer>
      </main>
    </div>
  );
};

export default Page;
