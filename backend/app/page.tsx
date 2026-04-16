import Link from "next/link";

function CheckIcon() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

export default function Home() {
  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1a1a2e", background: "#fafbfc" }}>
      {/* Nav */}
      <header style={{ borderBottom: "1px solid #e5e7eb", background: "white", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "#2563eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14 }}>A</div>
            <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>ArchiveBase</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="#pricing" style={{ fontSize: 14, color: "#6b7280", textDecoration: "none" }}>Pricing</a>
            <a href="#how-it-works" style={{ fontSize: 14, color: "#6b7280", textDecoration: "none" }}>How it works</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px 64px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#eff6ff", color: "#2563eb", fontSize: 13, fontWeight: 500, padding: "6px 14px", borderRadius: 20, marginBottom: 24, border: "1px solid #dbeafe" }}>
          Airtable extension
        </div>

        <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20, maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
          Your Airtable base is slow.
          <br />
          <span style={{ color: "#2563eb" }}>Archive fixes that.</span>
        </h1>

        <p style={{ fontSize: 18, color: "#6b7280", maxWidth: 540, margin: "0 auto 32px", lineHeight: 1.6 }}>
          Move old records to a searchable CSV archive. Your base stays fast, your data stays safe.
        </p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <a href="https://airtable.com/marketplace" style={{ display: "inline-block", background: "#1a1a2e", color: "white", padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 500, textDecoration: "none" }}>
            Install from Airtable Marketplace
          </a>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>Free tier: 500 records/month</span>
        </div>
      </section>

      {/* Problem/solution */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 16, padding: 32 }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>🐌</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>The problem</h3>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
              Airtable slows down as record counts grow. Views take forever to load. Filters lag. Your team complains. But you can&apos;t just delete records — you need that data.
            </p>
          </div>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 16, padding: 32 }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>⚡</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>The fix</h3>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
              ArchiveBase moves old records out of your base and into timestamped CSV files. Set rules based on age or status. Your base gets fast again. Your data stays safe.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: "center", marginBottom: 12, letterSpacing: "-0.02em" }}>How it works</h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 48 }}>Three steps. No code required.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {[
            { step: "01", title: "Set archive rules", desc: "Choose which records to archive: older than X days, specific status values, or both." },
            { step: "02", title: "Preview & confirm", desc: "See exactly how many records match before anything happens. No surprises." },
            { step: "03", title: "Archive & export", desc: "Records are exported to CSV with timestamps, then removed from your base. Reversible." },
          ].map((item) => (
            <div key={item.step} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 16, padding: 32 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#2563eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: "center", marginBottom: 48, letterSpacing: "-0.02em" }}>Built for Airtable teams</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {[
            { icon: "📏", title: "Age-based rules", desc: "Archive records older than a set number of days automatically." },
            { icon: "🏷️", title: "Status-based rules", desc: "Archive by field value — closed tickets, completed orders, past events." },
            { icon: "📊", title: "Dashboard", desc: "See record counts, archive history, and storage savings at a glance." },
            { icon: "📁", title: "CSV exports", desc: "Every archive creates a timestamped CSV. Your data is always recoverable." },
            { icon: "👁️", title: "Preview first", desc: "See exactly what will be archived before confirming. No accidental deletions." },
            { icon: "🔒", title: "Runs in Airtable", desc: "Native extension. No external accounts, no data leaving your workspace." },
          ].map((f) => (
            <div key={f.title} style={{ padding: 24, borderRadius: 16 }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: "center", marginBottom: 12, letterSpacing: "-0.02em" }}>Simple pricing</h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 48 }}>Start free. Upgrade when your base grows.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, maxWidth: 800, margin: "0 auto" }}>
          {/* Free */}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 16, padding: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Free</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>For small bases</p>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.03em" }}>$0</span>
              <span style={{ color: "#9ca3af", marginLeft: 4 }}>/mo</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {["500 records/month", "1 archive rule", "CSV export", "Dashboard"].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                  <CheckIcon />{item}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div style={{ background: "#1a1a2e", color: "white", borderRadius: 16, padding: 32, position: "relative" }}>
            <span style={{ position: "absolute", top: 16, right: 16, background: "rgba(37,99,235,0.2)", color: "#93c5fd", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 12 }}>Popular</span>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Pro</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>For growing teams</p>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.03em" }}>$19</span>
              <span style={{ color: "#9ca3af", marginLeft: 4 }}>/mo</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {["Unlimited records", "Unlimited rules", "Scheduled archiving", "Priority support", "Team workspace"].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#d1d5db" }}>
                  <CheckIcon />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 24, padding: "64px 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.02em" }}>Your base doesn&apos;t have to be slow</h2>
          <p style={{ color: "#6b7280", marginBottom: 32, maxWidth: 440, margin: "0 auto 32px" }}>
            Install ArchiveBase and start archiving old records in minutes.
          </p>
          <a href="https://airtable.com/marketplace" style={{ display: "inline-block", background: "#1a1a2e", color: "white", padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 500, textDecoration: "none" }}>
            Get ArchiveBase
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "24px 0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>&copy; {new Date().getFullYear()} ArchiveBase</span>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>
            Built by <a href="https://dasgroupllc.com" style={{ color: "#6b7280", textDecoration: "none" }}>Das Group LLC</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
