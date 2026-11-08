import Link from "next/link";
import { TAGLINE } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="foot">
      <span>© {new Date().getFullYear()} The Execution Log · {TAGLINE}</span>
      <nav>
        <Link href="/pricing">Pricing</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
    </footer>
  );
}
