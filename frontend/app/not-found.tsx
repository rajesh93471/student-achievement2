import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px 20px",
        background:
          "radial-gradient(circle at top, rgba(37,99,235,0.08), transparent 45%), #f8fafc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 24,
          padding: "40px 32px",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 13,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#2563eb",
            fontWeight: 700,
          }}
        >
          Vignan Student Portal
        </p>
        <h1
          style={{
            margin: "0 0 14px",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            lineHeight: 1.1,
            color: "#0f172a",
          }}
        >
          Page not found
        </h1>
        <p
          style={{
            margin: "0 0 24px",
            fontSize: 16,
            lineHeight: 1.7,
            color: "#475569",
          }}
        >
          The page you requested is unavailable or may have been moved. Return to the
          homepage or continue to the sign-in screen.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              background: "#1d4ed8",
              color: "#ffffff",
              padding: "12px 18px",
              borderRadius: 12,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Go home
          </Link>
          <Link
            href="/signin"
            style={{
              background: "#ffffff",
              color: "#1e293b",
              padding: "12px 18px",
              borderRadius: 12,
              textDecoration: "none",
              fontWeight: 600,
              border: "1px solid #cbd5e1",
            }}
          >
            Open sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
