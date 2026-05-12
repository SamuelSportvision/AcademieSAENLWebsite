"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/sports", label: "Programs" },
  { href: "/schedule", label: "Schedule" },
  { href: "/schools", label: "Schools" },
  { href: "/faq", label: "FAQ" },
];

interface NavbarProps {
  /** Registration URL for the "Join Our Mailing List" CTA (set in admin → Settings). */
  registrationUrl: string;
}

export default function Navbar({ registrationUrl }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    // Set initial state in case page loads mid-scroll
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setScrolled(window.scrollY > 40);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black border-b border-white/10 shadow-lg"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 h-[68px] flex items-center justify-between gap-4">

        {/* Logo — far left */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0" onClick={() => setOpen(false)}>
          <Image
            src="/logo-dark-clean.png"
            alt="SAE Academy NL"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <div>
            <span className="block font-black text-white text-sm tracking-wide uppercase leading-none">
              SAE Academy NL
            </span>
            <span className="block text-[10px] text-[#C9A84C] tracking-[0.2em] uppercase font-medium mt-0.5">
              Sports · Arts · Education
            </span>
          </div>
        </Link>

        {/* Center nav pill — desktop only */}
        <nav className="hidden md:flex items-center bg-black/60 backdrop-blur-sm rounded-full px-2 py-1.5 gap-1 border border-white/10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full transition-colors ${
                pathname === l.href
                  ? "bg-white/10 text-[#C9A84C]"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA — far right (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-3">
          <Link
            href={registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-block bg-[#C9A84C] text-black font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-yellow-400 transition-colors whitespace-nowrap"
          >
            Register Now!
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden relative z-[70] text-white p-3 -mr-2 focus:outline-none"
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

    </header>

      {/* Mobile full-screen overlay menu */}
      {open && (
        <div
          className="fixed inset-0 z-[60] md:hidden flex flex-col bg-black"
          onClick={() => setOpen(false)}
        >
          {/* Spacer matching the header height */}
          <div className="h-[68px] flex-shrink-0" />

          {/* Nav links */}
          <nav
            className="flex-1 overflow-y-auto px-5 pt-8 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`text-sm font-bold uppercase tracking-widest py-4 border-b border-white/10 ${
                  pathname === l.href ? "text-[#C9A84C]" : "text-gray-300"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-8 bg-[#C9A84C] text-black text-center font-black uppercase tracking-wider px-4 py-4 text-sm rounded-full"
            >
              Register Now!
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
