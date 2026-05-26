import Link from "next/link";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const baseClasses =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-700",
  secondary: "border border-line bg-white text-ink shadow-sm hover:border-brand-100 hover:bg-brand-50",
  ghost: "text-slate-700 hover:bg-slate-100",
  danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50"
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base"
};

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
  size = "md"
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <Link href={href} className={clsx(baseClasses, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button type={type} className={clsx(baseClasses, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
