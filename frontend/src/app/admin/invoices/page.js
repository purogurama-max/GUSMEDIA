"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  fetchInvoices,
  createInvoiceFromOrderApi,
  updateInvoiceStatusApi,
} from "@/services/invoiceService";
import { fetchOrders } from "@/services/orderService";
import { formatCurrency } from "@/services/productService";
import {
  FileText,
  Search,
  Filter,
  Eye,
  Plus,
  X,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
} from "lucide-react";

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Create Invoice Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [dueDays, setDueDays] = useState("30");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadInvoices = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.payment_status = statusFilter;

    const res = await fetchInvoices(params);
    if (res?.success) {
      setInvoices(res.data || []);
    } else {
      setInvoices([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadInvoices();
  }, [search, statusFilter]);

  const handleOpenCreateModal = async () => {
    setErrorMsg("");
    setSelectedOrderId("");
    setDueDays("30");
    setNotes("");
    setIsModalOpen(true);

    const ordersRes = await fetchOrders({ limit: 100 });
    if (ordersRes?.success) {
      setOrders(ordersRes.data || []);
    }
  };

  const handleCloseCreateModal = () => {
    setIsModalOpen(false);
    setErrorMsg("");
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedOrderId) {
      setErrorMsg("Please select an order to generate invoice.");
      return;
    }

    setIsSubmitting(true);
    const res = await createInvoiceFromOrderApi(selectedOrderId, dueDays, notes);
    setIsSubmitting(false);

    if (res?.success) {
      handleCloseCreateModal();
      loadInvoices();
    } else {
      setErrorMsg(res?.message || "Failed to create invoice.");
    }
  };

  const handleQuickStatusUpdate = async (id, newStatus) => {
    const res = await updateInvoiceStatusApi(id, newStatus);
    if (res?.success) {
      loadInvoices();
    } else {
      alert(res?.message || "Failed to update payment status.");
    }
  };

  const renderPaymentBadge = (status) => {
    switch (status) {
      case "UNPAID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Clock className="w-3 h-3" /> UNPAID
          </span>
        );
      case "PARTIAL":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" /> PARTIAL
          </span>
        );
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> PAID
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#2D9CFF]" /> Invoice Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate, track, and manage client billing invoices and payment statuses.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Invoice
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by invoice #, order #, or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Payment Statuses</option>
            <option value="UNPAID">UNPAID</option>
            <option value="PARTIAL">PARTIAL</option>
            <option value="PAID">PAID</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#2D9CFF]" />
            <span className="text-xs">Loading billing invoices...</span>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-600" />
            <div className="text-sm font-semibold">No invoices found</div>
            <div className="text-xs">Generate a new invoice from an order or adjust your search.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Invoice Number</th>
                  <th className="px-6 py-4">Order Ref</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Issue / Due Date</th>
                  <th className="px-6 py-4">Grand Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-cyan-400">
                      {inv.invoice_number}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300">{inv.order_number}</td>
                    <td className="px-6 py-4 font-bold text-white">
                      <div>{inv.customer_name}</div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        {inv.customer_email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 space-y-0.5">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>
                          {inv.issue_date
                            ? new Date(inv.issue_date).toLocaleDateString("id-ID")
                            : "-"}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Due:{" "}
                        {inv.due_date
                          ? new Date(inv.due_date).toLocaleDateString("id-ID")
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400">
                      {formatCurrency(inv.grand_total)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {renderPaymentBadge(inv.payment_status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <select
                        value={inv.payment_status}
                        onChange={(e) => handleQuickStatusUpdate(inv.id, e.target.value)}
                        className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300 focus:outline-none"
                      >
                        <option value="UNPAID">UNPAID</option>
                        <option value="PARTIAL">PARTIAL</option>
                        <option value="PAID">PAID</option>
                      </select>
                      <Link
                        href={`/admin/invoices/${inv.id}`}
                        className="inline-flex items-center p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all"
                        title="View Full Invoice"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" /> Generate Invoice from Order
              </h3>
              <button
                onClick={handleCloseCreateModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Order *
                </label>
                <select
                  required
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
                >
                  <option value="">-- Choose Order --</option>
                  {orders.map((ord) => (
                    <option key={ord.id} value={ord.id}>
                      {ord.order_number} - {ord.customer_name || `Customer #${ord.customer_id}`} (
                      {formatCurrency(ord.grand_total)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Payment Due Period (Days)
                </label>
                <select
                  value={dueDays}
                  onChange={(e) => setDueDays(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
                >
                  <option value="7">7 Days (Net 7)</option>
                  <option value="14">14 Days (Net 14)</option>
                  <option value="30">30 Days (Net 30)</option>
                  <option value="60">60 Days (Net 60)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Invoice Notes / Payment Instructions
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Please transfer payment to Bank BCA Account #1234567890 a.n PROXIMEDIA..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
