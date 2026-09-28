"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  BadgeDollarSign,
} from "lucide-react";
import { formatCurrency } from "@/services/productService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchDashboardStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/stats`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch stats");
    const result = await res.json();
    return result.data || null;
  } catch {
    return null;
  }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const kpiCards = stats
    ? [
        {
          title: "Total Revenue",
          value: formatCurrency(stats.total_revenue),
          sub: `${stats.completed_orders} completed orders`,
          icon: DollarSign,
          color: "text-cyan-400",
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/20",
        },
        {
          title: "Total Orders",
          value: stats.total_orders.toLocaleString("id-ID"),
          sub: `${stats.pending_orders} pending`,
          icon: ShoppingBag,
          color: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
        },
        {
          title: "Total Customers",
          value: stats.total_customers.toLocaleString("id-ID"),
          sub: "Registered clients",
          icon: Users,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
        },
        {
          title: "Active Products",
          value: stats.total_products.toLocaleString("id-ID"),
          sub: "Published in catalog",
          icon: Package,
          color: "text-blue-400",
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Overview</h1>
          <p className="text-slate-400 text-sm mt-1">
            Welcome back, Administrator. Here is a realtime summary of your software sales system.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 animate-pulse"
              >
                <div className="h-4 bg-slate-800 rounded w-2/3" />
                <div className="h-8 bg-slate-800 rounded w-1/2" />
                <div className="h-3 bg-slate-800 rounded w-3/4" />
              </div>
            ))
          : kpiCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {card.title}
                    </span>
                    <div className={`p-2.5 rounded-xl ${card.bg} border ${card.border}`}>
                      <Icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{card.value}</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      {card.sub}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Status Overview + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white">System Quick Overview</h2>
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Live Data
            </span>
          </div>

          <div className="space-y-3">
            {/* Pending Orders */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Pending Orders</div>
                  <div className="text-xs text-slate-400">
                    {loading ? "Loading..." : `${stats?.pending_orders ?? 0} orders require confirmation`}
                  </div>
                </div>
              </div>
              <Link
                href="/admin/orders"
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold hover:bg-amber-500/20 transition-all flex items-center gap-1"
              >
                Review <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Completed Orders */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Completed Orders</div>
                  <div className="text-xs text-slate-400">
                    {loading ? "Loading..." : `${stats?.completed_orders ?? 0} successfully fulfilled`}
                  </div>
                </div>
              </div>
              <Link
                href="/admin/orders"
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-1"
              >
                View <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Outstanding Invoices */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Outstanding Receivables</div>
                  <div className="text-xs text-slate-400">
                    {loading
                      ? "Loading..."
                      : `${formatCurrency(stats?.total_outstanding ?? 0)} unpaid / partial`}
                  </div>
                </div>
              </div>
              <Link
                href="/admin/invoices"
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold hover:bg-rose-500/20 transition-all flex items-center gap-1"
              >
                Invoices <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white pb-4 border-b border-slate-800">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: "/admin/products", icon: Package, label: "Products", color: "text-blue-400" },
              { href: "/admin/customers", icon: Users, label: "Customers", color: "text-emerald-400" },
              { href: "/admin/orders", icon: ShoppingBag, label: "Orders", color: "text-amber-400" },
              { href: "/admin/invoices", icon: FileText, label: "Invoices", color: "text-cyan-400" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-center transition-all group"
                >
                  <Icon
                    className={`w-5 h-5 ${item.color} mx-auto mb-2 group-hover:scale-110 transition-transform`}
                  />
                  <span className="text-xs font-bold text-slate-300">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Total Revenue Summary Box */}
          <div className="mt-2 p-4 rounded-xl bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border border-cyan-500/20 space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <BadgeDollarSign className="w-3 h-3 text-cyan-400" /> Total Revenue
            </div>
            {loading ? (
              <div className="h-7 bg-slate-800 rounded animate-pulse w-3/4" />
            ) : (
              <div className="text-xl font-black text-cyan-300">
                {formatCurrency(stats?.total_revenue ?? 0)}
              </div>
            )}
            <div className="text-[10px] text-slate-500">From completed orders only</div>
          </div>
        </div>
      </div>
    </div>
  );
}
