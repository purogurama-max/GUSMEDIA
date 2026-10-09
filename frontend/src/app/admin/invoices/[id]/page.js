"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchInvoiceById } from "@/services/invoiceService";
import { createPaymentApi, fetchPaymentHistory } from "@/services/paymentService";
import { formatCurrency } from "@/services/productService";
import {
  ArrowLeft,
  Printer,
  FileText,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
  CreditCard,
  X,
  AlertCircle,
  History,
} from "lucide-react";

export default function AdminInvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [invoice, setInvoice] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Record Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("TRANSFER");
  const [payDate, setPayDate] = useState("");
  const [payNotes, setPayNotes] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const loadInvoice = async () => {
    if (!id) return;
    setLoading(true);
    const data = await fetchInvoiceById(id);
    setInvoice(data);

    const history = await fetchPaymentHistory(id);
    setPaymentHistory(history);

    setLoading(false);
  };

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const handleOpenPaymentModal = () => {
    setPaymentError("");
    const totalPaid = parseFloat(paymentHistory?.total_paid || 0);
    const grandTotal = parseFloat(invoice?.grand_total || 0);
    const remaining = Math.max(0, grandTotal - totalPaid);

    setPayAmount(remaining > 0 ? remaining.toString() : grandTotal.toString());
    setPayMethod("TRANSFER");
    setPayDate(new Date().toISOString().split("T")[0]);
    setPayNotes("");
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
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
      invoice_id: invoice.id,
      amount: parseFloat(payAmount),
      payment_method: payMethod,
      payment_date: payDate || new Date().toISOString(),
      notes: payNotes,
    });
    setIsSubmittingPayment(false);

    if (res?.success) {
      handleClosePaymentModal();
      loadInvoice();
    } else {
      setPaymentError(res?.message || "Gagal mencatat pembayaran.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderPaymentBadge = (status) => {
    switch (status) {
      case "UNPAID":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/30">
            <Clock className="w-3.5 h-3.5" /> UNPAID
          </span>
        );
      case "PARTIAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> PARTIAL
          </span>
        );
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> PAID
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-500 border border-slate-500/30">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#2D9CFF]" />
        <span className="text-sm font-medium">Loading invoice document...</span>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-4">
        <div className="text-lg font-bold text-rose-400">Invoice Not Found</div>
        <p className="text-xs text-slate-500">
          The requested invoice record could not be found or has been deleted.
        </p>
        <Link
          href="/admin/invoices"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Invoices List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar (Hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          href="/admin/invoices"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Invoices List
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400">Status:</span>
            {renderPaymentBadge(invoice.payment_status)}
          </div>
          <button
            onClick={handleOpenPaymentModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" /> Catat Pembayaran
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print Invoice (A4)
          </button>
        </div>
      </div>

      {/* Invoice Document Box (A4 Structured View) */}
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 sm:p-12 text-slate-200 print:bg-white print:text-black print:border-none print:shadow-none print:p-0 print:m-0 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-800 print:border-slate-300 pb-8 gap-6">
          <div>
            <div className="text-2xl font-black text-white print:text-black tracking-tight flex items-center gap-2">
              <img src="/logo.jpg" alt="GUSMEDIA Logo" className="h-8 w-auto object-contain" />
              <span>GUSMEDIA</span>
            </div>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
              Software Solutions & Enterprise Consulting
            </p>
            <div className="text-xs text-slate-400 print:text-slate-700 mt-3 space-y-1">
              <div>Jakarta Tech Hub, Level 14, Indonesia</div>
              <div>Email: info@gusmedia.com</div>
              <div>Phone: +62 21 5558 9000</div>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-2">
            <div className="text-3xl font-black text-white print:text-black uppercase tracking-wider">
              INVOICE
            </div>
            <div className="text-sm font-mono font-bold text-cyan-400 print:text-black">
              #{invoice.invoice_number}
            </div>
            <div className="text-xs text-slate-400 print:text-slate-600">
              Ref Order: <span className="font-mono font-semibold">{invoice.order_number}</span>
            </div>
            <div className="pt-2">{renderPaymentBadge(invoice.payment_status)}</div>
          </div>
        </div>

        {/* Customer & Dates Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-300 text-xs">
          {/* Bill To */}
          <div className="space-y-1.5">
            <div className="text-slate-400 print:text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              Billed To
            </div>
            <div className="text-base font-bold text-white print:text-black">
              {invoice.customer_name}
            </div>
            {invoice.customer_company && (
              <div className="text-slate-300 print:text-slate-800 font-medium">
                {invoice.customer_company}
              </div>
            )}
            <div className="text-slate-400 print:text-slate-700">Email: {invoice.customer_email}</div>
            {invoice.customer_phone && (
              <div className="text-slate-400 print:text-slate-700">Phone: {invoice.customer_phone}</div>
            )}
            {invoice.customer_address && (
              <div className="text-slate-400 print:text-slate-700">Address: {invoice.customer_address}</div>
            )}
          </div>

          {/* Dates & Reference */}
          <div className="space-y-2 sm:text-right">
            <div className="text-slate-400 print:text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              Invoice Dates
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600">Issue Date: </span>
              <span className="font-bold text-white print:text-black">
                {new Date(invoice.issue_date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600">Due Date: </span>
              <span className="font-bold text-rose-400 print:text-black">
                {new Date(invoice.due_date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Products & Items Table */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider">
            Order Items & Description
          </div>
          <div className="rounded-xl border border-slate-800 print:border-slate-300 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 print:bg-slate-200 text-slate-400 print:text-slate-700 font-semibold uppercase border-b border-slate-800 print:border-slate-300">
                <tr>
                  <th className="px-4 py-3.5">Product</th>
                  <th className="px-4 py-3.5 text-center">Quantity</th>
                  <th className="px-4 py-3.5 text-right">Unit Price</th>
                  <th className="px-4 py-3.5 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-300">
                {invoice.items?.map((item) => (
                  <tr key={item.id} className="text-slate-300 print:text-black">
                    <td className="px-4 py-3.5 font-bold text-white print:text-black">
                      {item.product_name}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono">{item.quantity}</td>
                    <td className="px-4 py-3.5 text-right font-mono">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-cyan-400 print:text-black font-mono">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculation & Notes Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 print:border-slate-300 space-y-2 text-xs">
            <div className="font-semibold text-slate-400 print:text-slate-600">Payment Notes</div>
            <div className="text-slate-300 print:text-slate-800 italic">
              {invoice.notes || "Standard payment terms net 30 days apply."}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 print:bg-slate-50 print:border-slate-300 text-xs">
            <div className="flex justify-between text-slate-400 print:text-slate-700">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold text-white print:text-black">
                {formatCurrency(invoice.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-slate-400 print:text-slate-700">
              <span>Discount:</span>
              <span className="font-mono font-semibold text-rose-400 print:text-black">
                -{formatCurrency(invoice.discount)}
              </span>
            </div>
            <div className="flex justify-between text-slate-400 print:text-slate-700">
              <span>Tax:</span>
              <span className="font-mono font-semibold text-slate-300 print:text-black">
                +{formatCurrency(invoice.tax)}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 print:border-slate-300 flex justify-between text-base font-black text-emerald-400 print:text-black">
              <span>Grand Total:</span>
              <span className="font-mono">{formatCurrency(invoice.grand_total)}</span>
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        {paymentHistory && (
          <div className="pt-6 border-t border-slate-800 print:border-slate-300 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-4 h-4 text-emerald-400" /> Riwayat Pembayaran (Payment History)
              </div>
              <div className="text-xs font-semibold text-emerald-400 print:text-slate-800">
                Total Paid: {formatCurrency(paymentHistory.total_paid)} | Sisa: {formatCurrency(paymentHistory.outstanding)}
              </div>
            </div>

            {paymentHistory.payments?.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-500 text-center">
                Belum ada transaksi pembayaran yang dicatat untuk invoice ini.
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 print:border-slate-300 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 print:bg-slate-200 text-slate-400 print:text-slate-700 font-semibold uppercase">
                    <tr>
                      <th className="px-4 py-2.5">Tanggal</th>
                      <th className="px-4 py-2.5">Metode</th>
                      <th className="px-4 py-2.5">Nominal</th>
                      <th className="px-4 py-2.5">Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 print:divide-slate-300">
                    {paymentHistory.payments?.map((p) => (
                      <tr key={p.id} className="text-slate-300 print:text-black">
                        <td className="px-4 py-2.5">
                          {new Date(p.payment_date).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-4 py-2.5 font-bold text-cyan-400 print:text-black">
                          {p.payment_method}
                        </td>
                        <td className="px-4 py-2.5 font-bold text-emerald-400 print:text-black font-mono">
                          {formatCurrency(p.amount)}
                        </td>
                        <td className="px-4 py-2.5 text-slate-400 print:text-slate-600 text-[11px]">
                          {p.notes || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Signature & Stamp Block */}
        <div className="pt-8 border-t border-slate-800 print:border-slate-300 grid grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <div className="text-slate-400 print:text-slate-600 font-semibold">Terms & Conditions</div>
            <div className="text-[11px] text-slate-500 print:text-slate-600">
              Payment is due by the specified due date. Software licenses will be issued upon payment confirmation.
            </div>
          </div>

          <div className="text-right space-y-12">
            <div className="text-slate-400 print:text-slate-600 font-semibold">Authorized Signature</div>
            <div className="text-white print:text-black font-bold border-b border-slate-700 print:border-black inline-block pb-1 min-w-[160px]">
              Finance & Billing Dept.
            </div>
            <div className="text-[10px] text-slate-500 print:text-slate-600">GUSMEDIA Indonesia</div>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isPaymentModalOpen && invoice && (
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
                  {invoice.invoice_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pelanggan:</span>
                <span className="font-bold text-white">
                  {invoice.customer_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Grand Total:</span>
                <span className="font-mono font-bold text-slate-200">
                  {formatCurrency(invoice.grand_total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sudah Dibayar:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatCurrency(paymentHistory?.total_paid || 0)}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800/60 font-bold text-rose-400">
                <span>Sisa Tagihan:</span>
                <span className="font-mono">
                  {formatCurrency(paymentHistory?.outstanding || invoice.grand_total)}
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
    </div>
  );
}
