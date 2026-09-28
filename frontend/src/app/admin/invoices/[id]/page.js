"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  fetchInvoiceById,
  updateInvoiceStatusApi,
} from "@/services/invoiceService";
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
  Check,
} from "lucide-react";

export default function AdminInvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadInvoice = async () => {
    if (!id) return;
    setLoading(true);
    const data = await fetchInvoiceById(id);
    setInvoice(data);
    setLoading(false);
  };

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (!invoice) return;
    setUpdatingStatus(true);
    const res = await updateInvoiceStatusApi(invoice.id, newStatus);
    setUpdatingStatus(false);

    if (res?.success) {
      setInvoice({ ...invoice, payment_status: newStatus });
    } else {
      alert(res?.message || "Failed to update payment status.");
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
            <select
              value={invoice.payment_status}
              disabled={updatingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs font-bold text-white rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value="UNPAID">UNPAID</option>
              <option value="PARTIAL">PARTIAL</option>
              <option value="PAID">PAID</option>
            </select>
          </div>
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
              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 inline-block align-middle">
                <img src="/logo.jpg" alt="PROXIMEDIA Logo" className="w-full h-full object-cover" />
              </div>
              <span>PROXIMEDIA</span>
            </div>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
              Software Solutions & Enterprise Consulting
            </p>
            <div className="text-xs text-slate-400 print:text-slate-700 mt-3 space-y-1">
              <div>Jakarta Tech Hub, Level 14, Indonesia</div>
              <div>Email: info@proximedia.com</div>
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
            <div className="text-[10px] text-slate-500 print:text-slate-600">PROXIMEDIA Indonesia</div>
          </div>
        </div>
      </div>
    </div>
  );
}
