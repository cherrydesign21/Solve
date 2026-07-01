"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { tools } from "@/lib/tools-registry";
import { Logo } from "./Logo";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1.5">
      {tools.map((tool) => {
        const href = `/${tool.slug}`;
        const active = pathname === href;
        const Icon = tool.icon;
        return (
          <Link
            key={tool.slug}
            href={href}
            onClick={onNavigate}
            className={clsx(
              "group flex items-center gap-4 rounded-xl px-4 py-3.5 transition-colors duration-200",
              active ? "bg-white/[0.08]" : "hover:bg-white/[0.05]"
            )}
          >
            <span
              className={clsx(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors duration-200",
                active ? "bg-accent text-black" : "bg-white/10 text-white/70 group-hover:text-white"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <span
              className={clsx(
                "text-[15px] font-medium transition-colors duration-200",
                active ? "text-white" : "text-white/50 group-hover:text-white/80"
              )}
            >
              {tool.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 border-r border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent lg:flex lg:flex-col">
        <div className="flex items-center px-8 py-8">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          <NavList />
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-bg/80 px-4 py-4 backdrop-blur-md lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute left-0 top-0 h-full w-[85%] max-w-[320px] overflow-y-auto border-r border-white/10 bg-panel px-4 py-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <div className="flex items-center justify-between px-4 pb-6">
                <Logo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <NavList onNavigate={() => setOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
