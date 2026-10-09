"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  fetchInvoices,
  createInvoiceFromOrderApi,
  syncInvoiceStatusApi,
  deleteInvoiceApi,
} from "@/services/invoiceService";
import { createPaymentApi } from "@/services/paymentService";
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
  Trash2,
  RefreshCw,
  CreditCard,
  DollarSign,
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

  // Delete Invoice Modal
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [syncingId, setSyncingId] = useState(null);

  // Record Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [invoiceForPayment, setInvoiceForPayment] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("TRANSFER");
  const [payDate, setPayDate] = useState("");
  const [payNotes, setPayNotes] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

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

  const handleSyncStatus = async (id) => {
    setSyncingId(id);
    const res = await syncInvoiceStatusApi(id);
    setSyncingId(null);
    if (res?.success) {
      loadInvoices();
    } else {
      alert(res?.message || "Failed to sync payment status.");
    }
  };

  const handleOpenDeleteModal = (inv) => {
    setInvoiceToDelete(inv);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setInvoiceToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!invoiceToDelete) return;
    setIsDeleting(true);
    const res = await deleteInvoiceApi(invoiceToDelete.id);
    setIsDeleting(false);

    if (res?.success) {
      handleCloseDeleteModal();
      loadInvoices();
    } else {
      alert(res?.message || "Failed to delete invoice.");
    }
  };

  const handleOpenPaymentModal = (inv) => {
    setPaymentError("");
    setInvoiceForPayment(inv);
    const totalPaid = parseFloat(inv.total_paid || 0);
    const grandTotal = parseFloat(inv.grand_total || 0);
    const remaining = Math.max(0, grandTotal - totalPaid);

    setPayAmount(remaining > 0 ? remaining.toString() : grandTotal.toString());
    setPayMethod("TRANSFER");
    setPayDate(new Date().toISOString().split("T")[0]);
    setPayNotes("");
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setInvoiceForPayment(null);
    setPaymentError("");
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");

    if (!payAmount || parseFloat(payAmount) <= 0) {
      setPaymentError("Jumlah pembayaran harus lebih besar dari 0.");
      return;
    }

    setIsSubmittingPayment(true);
    const res = await createPaymentApi({
      invoice_id: invoiceForPayment.id,
      amount: parseFloat(payAmount),
      payment_method: payMethod,
      payment_date: payDate || new Date().toISOString(),
      notes: payNotes,
    });
    setIsSubmittingPayment(false);

    if (res?.success) {
      handleClosePaymentModal();
      loadInvoices();
    } else {
      setPaymentError(res?.message || "Gagal mencatat pembayaran.");
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
                      <div>{formatCurrency(inv.grand_total)}</div>
                      {parseFloat(inv.total_paid || 0) > 0 && (
                        <div className="text-[10px] text-slate-400 font-normal">
                          Paid: {formatCurrency(inv.total_paid)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {renderPaymentBadge(inv.payment_status)}
                        <button
                          onClick={() => handleSyncStatus(inv.id)}
                          disabled={syncingId === inv.id}
                          title="Auto Sync Status Base On Payment"
                          className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          <RefreshCw className={`w-3 h-3 ${syncingId === inv.id ? "animate-spin text-cyan-400" : ""}`} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenPaymentModal(inv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold transition-all"
                          title="Record Payment"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Bayar</span>
                        </button>
                        <Link
                          href={`/admin/invoices/${inv.id}`}
                          className="inline-flex items-center p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all"
                          title="View Full Invoice"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenDeleteModal(inv)}
                          className="inline-flex items-center p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && invoiceToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" /> Hapus Invoice
              </h3>
              <button
                onClick={handleCloseDeleteModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2">
              <p>
                Apakah Anda yakin ingin menghapus invoice{" "}
                <span className="font-mono font-bold text-cyan-400">
                  {invoiceToDelete.invoice_number}
                </span>{" "}
                untuk pelanggan{" "}
                <span className="font-bold text-white">
                  {invoiceToDelete.customer_name}
                </span>
                ?
              </p>
              <p className="text-slate-400 text-[11px] bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                ⚠️ Tindakan ini akan menghapus data invoice beserta riwayat pembayarannya secara permanen.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/20 transition-all flex items-center gap-1.5"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Hapus Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && invoiceForPayment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" /> Catat Pembayaran Invoice
              </h3>
              <button
                onClick={handleClosePaymentModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Box */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Invoice:</span>
                <span className="font-mono font-bold text-cyan-400">
                  {invoiceForPayment.invoice_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pelanggan:</span>
                <span className="font-bold text-white">
                  {invoiceForPayment.customer_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Grand Total:</span>
                <span className="font-mono font-bold text-slate-200">
                  {formatCurrency(invoiceForPayment.grand_total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sudah Dibayar:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatCurrency(invoiceForPayment.total_paid || 0)}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800/60 font-bold text-rose-400">
                <span>Sisa Tagihan:</span>
                <span className="font-mono">
                  {formatCurrency(
                    Math.max(
                      0,
                      parseFloat(invoiceForPayment.grand_total || 0) -
                        parseFloat(invoiceForPayment.total_paid || 0)
                    )
                  )}
                </span>
              </div>
            </div>

            {paymentError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Jumlah Pembayaran (Rp) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="1"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-mono"
                  placeholder="Masukkan nominal pembayaran..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Metode Pembayaran *
                </label>
                <select
                  required
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all"
                >
                  <option value="TRANSFER">Bank Transfer</option>
                  <option value="CASH">Cash / Tunai</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="DEBIT_CARD">Debit Card</option>
                  <option value="EWALLET">E-Wallet (GoPay, OVO, QRIS)</option>
                  <option value="CHEQUE">Cheque / Cek</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tanggal Pembayaran
                </label>
                <input
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Catatan / Nomor Referensi Transfer
                </label>
                <textarea
                  rows="2"
                  placeholder="Contoh: Transfer Bank BCA Reff #987654..."
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClosePaymentModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  {isSubmittingPayment && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Simpan Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  placeholder="e.g. Please transfer payment to Bank BCA Account #1234567890 a.n GUSMEDIA..."
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
