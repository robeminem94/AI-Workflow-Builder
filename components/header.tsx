import Link from "next/link";
import { Workflow } from "lucide-react";
import { ButtonLink } from "@/components/button";

const navItems = [
  { href: "/builder", label: "Builder" },
  { href: "/saved", label: "Saved" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-bold text-ink">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm">
            <Workflow className="h-5 w-5" />
          </span>
          <span>AI Workflow Builder</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-brand-600">
              {item.label}
            </Link>
          ))}
        </nav>
        <ButtonLink href="/builder" className="hidden sm:inline-flex">
          Build a Workflow
        </ButtonLink>
      </div>
    </header>
  );
}
