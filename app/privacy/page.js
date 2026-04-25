import NavigateBack from '@/components/NavigateBack'
import React from 'react'
import "@/stylesheet/more/privacy.css";

const Page = () => {
  return (
        <div className="doc-container">
        <NavigateBack level={1} />

        <main className="scroll-content">

            <header className="hero-header">
                <h1 className="hero-title">You&apos;re in Control</h1>
            </header>

            <section className="policy-item">
                <h3 className="policy-heading"><span className="material-symbols-rounded">shield</span> Data Integrity</h3>
                <p className="policy-body">
                    We maintain strict <b>Identity Separation</b>. Account credentials and network contributions are isolated. All connectivity metrics are processed through anonymized research nodes.
                </p>
            </section>

            <section className="policy-item">
                <h3 className="policy-heading"><span className="material-symbols-rounded">history</span> Participation</h3>
                <p className="policy-body">
                    By engaging with the platform, users provide a localized signal map for global research. Participation is voluntary and can be managed or terminated via the application settings at any time.
                </p>
            </section>

            <section className="policy-item">
                <h3 className="policy-heading"><span className="material-symbols-rounded">account_balance_wallet</span> Distribution Protocols</h3>
                <p className="policy-body">
                    The allocation of project rewards is managed within a <b>discretionary framework</b> based on prevailing institutional liquidity. All disbursements remain contingent upon the current fiscal health of the project and are processed according to available operational funding cycles.
                </p>
                <p className="policy-body" style={{marginTop: '8px'}}>
                    As a research-driven collective, CarriagePatch reserves the authority to adjust or rebalance incentive pools to align with global infrastructure outcomes. Participation is recognized as a voluntary contribution to the research blueprint, with reward cycles subject to internal fiscal variances and systemic overhead adjustments.
                </p>
            </section>

            <section className="policy-item">
                <h3 className="policy-heading"><span className="material-symbols-rounded">lock</span> Information Security</h3>
                <p className="policy-body">
                    All user metrics are encrypted. Contact information is utilized exclusively for account management and verified payout facilitation through standard institutional gateways.
                </p>
            </section>

            <footer className="footer-info">
                <p>
                    CarriagePatch • 2026
                </p>
            </footer>

        </main>
    </div>
  )
}

export default Page