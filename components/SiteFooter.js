import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="foot">
      <span>© {new Date().getFullYear()} The Execution Log · Every trade. Every lesson.</span>
      <nav>
        <Link href="/pricing">Pricing</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
    </footer>
  );
}
