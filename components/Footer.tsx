import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-5 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Image
            src="/logo-dark.png"
            alt="SAE Academy"
            width={80}
            height={80}
            className="w-16 h-16 object-contain rounded-full"
          />
          <p className="text-gray-500 text-xs leading-relaxed max-w-[220px]">
            Developing the next generation of athletes and artists in Newfoundland through daily, high-level programming.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.3em] mb-5">
            Quick Links
          </p>
          <ul className="flex flex-col gap-3">
            {[
              { href: "/", label: "Home" },
              { href: "/sports", label: "Programs" },
              { href: "/schedule", label: "Schedule" },
              { href: "/schools", label: "Participating Schools" },
              { href: "/faq", label: "FAQ" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-gray-500 text-xs font-semibold uppercase tracking-wider hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.3em] mb-5">
            Contact
          </p>
          <p className="text-gray-600 text-xs mb-2 uppercase tracking-wider">For inquiries:</p>
          <a
            href="mailto:info@saeacademynl.com"
            className="text-white text-sm font-bold hover:text-[#C9A84C] transition-colors break-all"
          >
            info@saeacademynl.com
          </a>
          <p className="text-gray-700 text-[10px] mt-8 uppercase tracking-wider">
            &copy; {new Date().getFullYear()} Sports, Arts, Education Academy
          </p>
        </div>
      </div>

      {/* Mailing List CTA */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.3em] mb-1">
              Stay in the loop
            </p>
            <p className="text-white text-sm font-bold">
              Join our mailing list
            </p>
            <p className="text-gray-500 text-xs mt-1 max-w-xs">
              Be among the first to secure a spot in the SAE Academy&apos;s Elite After-School Development Program.
            </p>
          </div>
          <a
            href="https://mailchi.mp/saeacademynl/email-sign-up"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8933d] text-black text-xs font-bold uppercase tracking-widest px-6 py-3 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            Sign Up Now
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="h-[3px] bg-gradient-to-r from-[#C8102E] via-[#C9A84C] to-[#C8102E]" />
    </footer>
  );
}
