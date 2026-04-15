"use client";

import { useTransition } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "./actions";

const adminNav = [
  { href: "/admin/schedule", label: "Schedule" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/schools", label: "Schools" },
  { href: "/admin/sports", label: "Sports Pages" },
  { href: "/admin/forms", label: "Forms" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(() => signOut());
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="pt-[68px]">
      {/* Admin sub-header */}
      <div className="sticky top-[68px] z-40 bg-[#0d0d0d] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 h-11 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C9A84C] mr-3">
              Admin
            </span>
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-colors ${
                  pathname.startsWith(item.href)
                    ? "bg-white/10 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <button
            onClick={handleSignOut}
            disabled={pending}
            className="text-[11px] text-gray-600 hover:text-white uppercase tracking-wider transition-colors disabled:opacity-40"
          >
            {pending ? "…" : "Sign Out"}
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
