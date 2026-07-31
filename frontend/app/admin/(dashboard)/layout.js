"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Tags, Car, ClipboardList, LogOut } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import Loader from "@/components/ui/Loader";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Brands", href: "/admin/brands", icon: Tags },
  { label: "Vehicles", href: "/admin/vehicles", icon: Car },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
];

export default function AdminDashboardLayout({ children }) {
  const { user, isLoading, isAuthenticated, logout } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-6 pb-16 pt-32 lg:px-12">
      <aside className="w-56 shrink-0">
        <p className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-gold">
          Admin — {user.name}
        </p>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 border-l-2 px-4 py-3 font-body text-sm transition-colors ${
                  isActive
                    ? "border-gold text-gold"
                    : "border-transparent text-ivory/70 hover:border-hairline hover:text-ivory"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => {
            logout();
            router.push("/admin/login");
          }}
          className="mt-8 flex items-center gap-3 px-4 py-3 font-body text-sm text-graphite transition-colors hover:text-gold"
        >
          <LogOut size={16} />
          Log out
        </button>
      </aside>

      <div className="flex-1">{children}</div>
    </div>
  );
}