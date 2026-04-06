"use client";

import { useRouter, usePathname } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";

const adminNav = [
  { href: "/admin/schedule", label: "Schedule" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createBrowserClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  // Don't show the admin sub-header on the login page
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
            className="text-[11px] text-gray-600 hover:text-white uppercase tracking-wider transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
