import Link from "next/link";
import Brand from "@/components/Brand";

export default function SiteNav({ user }) {
  return (
    <nav className="nav">
      <Brand />
      <div className="nav-r">
        <Link href="/help" className="btn hide-sm">Help</Link>
        <Link href="/pricing" className="btn hide-sm">Pricing</Link>
        {user ? (
          <Link href="/dashboard" className="btn primary">Dashboard</Link>
        ) : (
          <>
            <Link href="/login" className="btn">Log in</Link>
            <Link href="/signup" className="btn primary hide-sm">Create account</Link>
          </>
        )}
      </div>
    </nav>
  );
}
