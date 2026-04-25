import NavigateBack from '@/components/NavigateBack'
import React from 'react'
import "@/stylesheet/more/terms.css"

const Page = () => {
  return (
        <div class="doc-container">
            <NavigateBack level={1} />

        <main class="scroll-content">

            <header class="hero-header">
                <h1 class="hero-title">Users Guidelines</h1>
            </header>

            <section class="protocol-item">
                <span class="material-symbols-rounded protocol-icon">person_check</span>
                <div class="doc-text-area">
                    <h3 class="protocol-heading">Institutional Access</h3>
                    <p class="protocol-body">
                        Access to the <b>CarriagePatch</b> collective is reserved for individuals aged 18 and above. Minor participation requires direct supervision by a legal guardian who assumes all operational responsibility.
                    </p>
                </div>
            </section>

            <section class="protocol-item">
                <span class="material-symbols-rounded protocol-icon">verified_user</span>
                <div class="doc-text-area">
                    <h3 class="protocol-heading">Integrity Standards</h3>
                    <p class="protocol-body">
                        To maintain data quality, users are prohibited from utilizing VPNs, network emulators, or maintaining <b>duplicate accounts</b> on a single terminal. Violation of these integrity standards results in immediate account decommissioning without prior notice.
                    </p>
                </div>
            </section>

            <section class="protocol-item">
                <span class="material-symbols-rounded protocol-icon">data_usage</span>
                <div class="doc-text-area">
                    <h3 class="protocol-heading">Asset Rights</h3>
                    <p class="protocol-body">
                        All connectivity metrics and localized network intelligence shared via the platform become the exclusive property of the <b>Global Infrastructure Blueprint</b> for ongoing research and systemic optimization.
                    </p>
                </div>
            </section>

            <div class="fiscal-note">
                Participation in this research initiative is <b>voluntary</b> and does not constitute a contractual employment relationship. Incentives are allocated within a <b>discretionary framework</b> and remain subject to project-wide fiscal rebalancing and institutional liquidity.
            </div>

            <section class="protocol-item">
                <span class="material-symbols-rounded protocol-icon">gavel</span>
                <div class="doc-text-area">
                    <h3 class="protocol-heading">Administrative Authority</h3>
                    <p class="protocol-body">
                        CarriagePatch reserves the right to suspend or adjust user credentials to ensure the project's long-term sustainability. The platform assumes no liability for external connectivity costs or project-level incentive variances.
                    </p>
                </div>
            </section>

            <footer class="footer-info">
                <p>
                    CarriagePatch • 2026
                </p>
            </footer>

        </main>
    </div>
  )
}

export default Page