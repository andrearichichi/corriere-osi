"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "./ui";

const LINKS = [
  { href: "/strategy", label: "Strategia" },
  { href: "/prototype", label: "Prototipo" },
  { href: "/growth-lab", label: "Growth Lab" },
  { href: "/roadmap", label: "Roadmap" },
];

export function SiteNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="no-print sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Home" className="shrink-0">
          <Wordmark />
        </Link>
        <nav aria-label="Principale" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => {
              const active = path?.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      active ? "bg-navy text-white" : "text-ink-2 hover:bg-navy/5 hover:text-navy",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <button
          className="rounded-full px-3 py-2 text-sm font-semibold text-navy md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Chiudi" : "Menu"}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Principale" className="border-t border-rule bg-paper md:hidden">
          <ul className="mx-auto max-w-[1240px] px-4 py-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 text-base font-medium text-ink hover:bg-navy/5"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
