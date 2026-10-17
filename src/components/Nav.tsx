import Link from "next/link";
import styles from "./Nav.module.css";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#how", label: "How it works" },
  { href: "/#software", label: "Software" },
  { href: "/#about", label: "About" },
];

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <path d="M15 2 27 9v12l-12 7L3 21V9l12-7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M15 2v12m0 0 12-5M15 14 3 9m12 5v14" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

export default function Nav({ compact = false }: { compact?: boolean }) {
  return (
    <header className={`${styles.header} ${compact ? styles.compact : ""}`}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" aria-label="QBTTEXAS home" className={styles.brand}>
          <Logo />
          <span className={`display ${styles.wordmark}`}>QBTTEXAS</span>
          {compact ? <span className={`mono ${styles.tag}`}>3D model viewer</span> : null}
        </Link>
        <nav aria-label="Primary" className={styles.links}>
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <Link href="/#contact" className="btn btn--ghost btn--sm">
            Contact
          </Link>
          <Link href="/models" className="btn btn--primary btn--sm">
            3D Demo
          </Link>
        </div>
      </div>
    </header>
  );
}
