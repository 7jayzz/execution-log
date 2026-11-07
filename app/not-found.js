import Link from "next/link";
import AuthShell from "@/components/AuthShell";

export default function NotFound() {
  return (
    <AuthShell>
      <div className="auth-card" style={{ textAlign: "center" }}>
        <span className="label">404</span>
        <h1>Page not found</h1>
        <p className="lead">That page doesn't exist or has moved.</p>
        <Link href="/" className="btn primary block">Go home</Link>
      </div>
    </AuthShell>
  );
}
