import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-white/10 pt-8 pb-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="flex items-center gap-[3px] font-display text-lg font-medium tracking-wide text-white">
            <span>S</span>
            <span className="inline-block h-[0.45em] w-[0.45em] rounded-full bg-accent" />
            <span>lve</span>
          </p>
          <p className="mt-2 text-sm text-white/50">
            Solve is a free collection of everyday calculators and converters — fast, mobile-friendly tools
            that update instantly, with no sign-up required.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50">
          <Link href="/about" className="transition-colors hover:text-white">
            About
          </Link>
          <Link href="/privacy-policy" className="transition-colors hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-white">
            Terms of Use
          </Link>
          <Link href="/contact" className="transition-colors hover:text-white">
            Contact
          </Link>
        </nav>
      </div>

      <p className="mt-6 text-xs text-white/30">© {year} Solve. All rights reserved.</p>
    </footer>
  );
}
