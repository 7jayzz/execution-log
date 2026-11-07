import Link from "next/link";

export function Mark() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="9" fill="var(--accent)" />
      <line x1="13" y1="8" x2="13" y2="31" stroke="var(--accent-ink)" strokeWidth="2" />
      <rect x="9" y="14" width="8" height="11" rx="1.5" fill="var(--accent-ink)" />
      <line x1="27" y1="10" x2="27" y2="33" stroke="var(--accent-ink)" strokeWidth="2" />
      <rect x="23" y="17" width="8" height="10" rx="1.5" fill="var(--accent)" stroke="var(--accent-ink)" strokeWidth="2" />
    </svg>
  );
}

export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="The Execution Log home">
      <Mark />
      <span>The Execution <em>Log</em></span>
    </Link>
  );
}
