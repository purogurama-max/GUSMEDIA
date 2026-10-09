"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchPayments } from "@/services/paymentService";
import { formatCurrency } from "@/services/productService";
import {
  CreditCard,
  Search,
  Filter,
  Eye,
  FileText,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Receipt,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  const loadPayments = async () => {
    setLoading(true);
    const res = await fetchPayments();
    if (res?.success) {
      setPayments(res.data || []);
    } else {
      setPayments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // Filter payments client-side for fast search & method filtering
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      !search ||
      p.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
      p.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.notes?.toLowerCase().includes(search.toLowerCase());

    const matchesMethod = !methodFilter || p.payment_method === methodFilter;

    return matchesSearch && matchesMethod;
  });

  // Calculate statistics
  const totalAmountCollected = filteredPayments.reduce(
    (acc, p) => acc + parseFloat(p.amount || 0),
    0
  );
  const totalTransactionsCount = filteredPayments.length;

  const renderMethodBadge = (method) => {
    const m = (method || "").toUpperCase();
    switch (m) {
      case "TRANSFER":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Bank Transfer
          </span>
        );
      case "CASH":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Cash / Tunai
          </span>
        );
      case "CREDIT_CARD":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Credit Card
          </span>
        );
      case "DEBIT_CARD":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Debit Card
          </span>
        );
      case "EWALLET":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            E-Wallet
          </span>
        );
      case "CHEQUE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            Cheque / Cek
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {method}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-emerald-400" /> Payment Transactions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Riwayat pencatatan pembayaran masuk dari invoice pelanggan.
          </p>
        </div>
        <Link
          href="/admin/invoices"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <Receipt className="w-4 h-4" /> Kelola Invoice
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Total Pembayaran Masuk</div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
              {formatCurrency(totalAmountCollected)}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Jumlah Transaksi</div>
            <div className="text-xl font-black text-white font-mono mt-0.5">
              {totalTransactionsCount} <span className="text-xs font-normal text-slate-400">transaksi</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Status Transaksi</div>
            <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Real-time DB Synchronized
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari Invoice, Pelanggan, atau Catatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 transition-all"
          >
            <option value="">Semua Metode Pembayaran</option>
            <option value="TRANSFER">Bank Transfer</option>
            <option value="CASH">Cash / Tunai</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="DEBIT_CARD">Debit Card</option>
            <option value="EWALLET">E-Wallet</option>
            <option value="CHEQUE">Cheque / Cek</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            <span className="text-sm font-medium">Memuat data pembayaran...</span>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-600" />
            <div className="text-sm font-semibold">Tidak ada transaksi pembayaran</div>
            <div className="text-xs text-slate-500">
              Belum ada data pembayaran yang cocok dengan kriteria pencarian Anda.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">ID Transaksi</th>
                  <th className="px-6 py-4">Invoice Ref</th>
                  <th className="px-6 py-4">Pelanggan</th>
                  <th className="px-6 py-4">Tanggal Pembayaran</th>
                  <th className="px-6 py-4">Metode</th>
                  <th className="px-6 py-4">Jumlah (Rp)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-400">
                      #PAY-{String(p.id).padStart(5, "0")}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-cyan-400">
                      <Link
                        href={`/admin/invoices/${p.invoice_id}`}
                        className="hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{p.invoice_number}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {p.customer_name || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-400 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>
                          {p.payment_date
                            ? new Date(p.payment_date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{renderMethodBadge(p.payment_method)}</td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> PAID
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/invoices/${p.invoice_id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[11px] font-semibold transition-all"
                        title="Lihat Detail Invoice"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
