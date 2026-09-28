"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdmin, getAdminUser, getAdminToken } from "@/services/authService";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Bell,
  Search,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Invoices", href: "/admin/invoices", icon: FileText },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Return early if on login page
    if (pathname === "/admin/login") {
      setAuthorized(true);
      return;
    }

    const token = getAdminToken();
    const user = getAdminUser();

    if (!token) {
      setAuthorized(false);
      router.push("/admin/login");
    } else {
      setAuthorized(true);
      setCurrentUser(user);
    }
  }, [pathname, router]);

  // Render children directly if on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Prevent flash of admin content if unauthorized
  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></span>
          <span>Verifikasi Autentikasi Admin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex print:bg-white print:text-black">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between flex-shrink-0 print:hidden">
        <div>
          {/* Admin Header */}
          <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-blue-500/20">
              <img src="/logo.jpg" alt="PROXIMEDIA Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block">
                PROXI<span className="text-cyan-400">MEDIA</span> Admin
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Management System
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/30 uppercase">
              {currentUser?.name?.substring(0, 2) || "AD"}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">
                {currentUser?.name || "Administrator"}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {currentUser?.email || "admin@proximedia.com"}
              </div>
            </div>
          </div>

          <button
            onClick={logoutAdmin}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 print:p-0">
        {/* Top Header */}
        <header className="h-16 px-8 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between backdrop-blur-md sticky top-0 z-40 print:hidden">
          <div className="flex items-center gap-4 max-w-md w-full">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, products, customers..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-all relative">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-1.5 right-1.5"></span>
            </button>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> System Online
            </span>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

