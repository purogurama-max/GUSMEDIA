"use client";

import { useState, useEffect } from "react";
import {
  fetchOrders,
  fetchOrderById,
  updateOrderStatusApi,
} from "@/services/orderService";
import { formatCurrency } from "@/services/productService";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Printer,
  FileText,
  X,
  AlertCircle,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  User,
  Calendar,
  DollarSign,
  Package,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Detail Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;

    const res = await fetchOrders(params);
    if (res?.success) {
      setOrders(res.data || []);
    } else {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [search, statusFilter]);

  const handleOpenDetail = async (orderId) => {
    setIsDetailModalOpen(true);
    setLoadingDetail(true);
    setStatusMsg("");
    const orderData = await fetchOrderById(orderId);
    setSelectedOrder(orderData);
    setLoadingDetail(false);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
    setStatusMsg("");
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    setStatusMsg("");
    const res = await updateOrderStatusApi(orderId, newStatus);
    setUpdatingStatus(false);

    if (res?.success) {
      setStatusMsg(`Order status updated to ${newStatus}`);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      loadOrders();
    } else {
      alert(res?.message || "Failed to update status.");
    }
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const handleCreateInvoice = (orderNumber) => {
    alert(
      `Invoice creation for ${orderNumber} queued! Full automated Invoice generation & billing workflow will be connected in STEP 16 & STEP 17.`
    );
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> PENDING
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CheckCircle2 className="w-3 h-3" /> CONFIRMED
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <RefreshCw className="w-3 h-3 animate-spin" /> PROCESSING
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> COMPLETED
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" /> CANCELLED
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#2D9CFF]" /> Order Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming software sales orders, track fulfillment status, and generate invoices.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center print:hidden">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order number or customer..."
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
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl print:hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#2D9CFF]" />
            <span className="text-xs">Loading order transactions...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-600" />
            <div className="text-sm font-semibold">No orders found</div>
            <div className="text-xs">Try adjusting filter or search term.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Order Number</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Order Date</th>
                  <th className="px-6 py-4">Grand Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-cyan-400">
                      {ord.order_number}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      <div>{ord.customer_name || `Customer #${ord.customer_id}`}</div>
                      {ord.customer_email && (
                        <div className="text-[11px] text-slate-500 font-normal">
                          {ord.customer_email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {ord.order_date
                        ? new Date(ord.order_date).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400">
                      {formatCurrency(ord.grand_total)}
                    </td>
                    <td className="px-6 py-4">{renderStatusBadge(ord.status)}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDetail(ord.id)}
                        className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all"
                        title="View Order Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:static print:bg-white">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:bg-white print:text-black">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:border-slate-300">
              <div>
                <h3 className="text-lg font-bold text-white print:text-black flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400 print:text-black" />
                  Order Detail: {selectedOrder?.order_number || "..."}
                </h3>
                <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                  Generated Order Summary & Fulfillment Details
                </p>
              </div>
              <button
                onClick={handleCloseDetail}
                className="text-slate-400 hover:text-white transition-colors print:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 print:hidden">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{statusMsg}</span>
              </div>
            )}

            {loadingDetail ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#2D9CFF]" />
                <span className="text-xs">Fetching order detail...</span>
              </div>
            ) : selectedOrder ? (
              <div className="space-y-6">
                {/* Meta Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Card */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 print:bg-slate-50 print:border-slate-300">
                    <div className="text-xs font-semibold text-slate-400 print:text-slate-600 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-400 print:text-black" /> Customer Information
                    </div>
                    <div className="text-sm font-bold text-white print:text-black">
                      {selectedOrder.customer?.name || `Customer #${selectedOrder.customer_id}`}
                    </div>
                    {selectedOrder.customer?.email && (
                      <div className="text-xs text-slate-400 print:text-slate-700">
                        Email: {selectedOrder.customer.email}
                      </div>
                    )}
                    {selectedOrder.customer?.phone && (
                      <div className="text-xs text-slate-400 print:text-slate-700">
                        Phone: {selectedOrder.customer.phone}
                      </div>
                    )}
                    {selectedOrder.customer?.company && (
                      <div className="text-xs text-slate-400 print:text-slate-700">
                        Company: {selectedOrder.customer.company}
                      </div>
                    )}
                  </div>

                  {/* Order Status & Info Card */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3 print:bg-slate-50 print:border-slate-300">
                    <div className="text-xs font-semibold text-slate-400 print:text-slate-600 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400 print:text-black" /> Order Meta
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 print:text-slate-600">Order Date:</span>
                      <span className="font-bold text-white print:text-black">
                        {new Date(selectedOrder.order_date).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 print:text-slate-600">Current Status:</span>
                      <div className="flex items-center gap-2">
                        {renderStatusBadge(selectedOrder.status)}
                      </div>
                    </div>

                    {/* Status Changer (Admin control) */}
                    <div className="pt-2 border-t border-slate-800/60 print:hidden flex items-center justify-between text-xs">
                      <span className="text-slate-400">Update Status:</span>
                      <select
                        value={selectedOrder.status}
                        disabled={updatingStatus}
                        onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div>
                  <div className="text-xs font-semibold text-slate-300 print:text-slate-800 mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-cyan-400 print:text-black" /> Purchased Software & Services
                  </div>
                  <div className="rounded-xl border border-slate-800 print:border-slate-300 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 print:bg-slate-200 text-slate-400 print:text-slate-700 font-semibold border-b border-slate-800 print:border-slate-300">
                        <tr>
                          <th className="px-4 py-3">Product Name</th>
                          <th className="px-4 py-3 text-center">Qty</th>
                          <th className="px-4 py-3 text-right">Price</th>
                          <th className="px-4 py-3 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 print:divide-slate-300">
                        {selectedOrder.items?.map((item) => (
                          <tr key={item.id} className="text-slate-300 print:text-black">
                            <td className="px-4 py-3 font-semibold text-white print:text-black">
                              {item.product_name || `Product #${item.product_id}`}
                            </td>
                            <td className="px-4 py-3 text-center font-mono">{item.quantity}</td>
                            <td className="px-4 py-3 text-right font-mono">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-cyan-400 print:text-black font-mono">
                              {formatCurrency(item.subtotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Calculation & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 print:border-slate-300">
                    <div className="text-xs font-semibold text-slate-400 print:text-slate-600 mb-1">
                      Notes
                    </div>
                    <div className="text-xs text-slate-300 print:text-slate-800 italic">
                      {selectedOrder.notes || "No additional notes provided."}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 print:bg-slate-50 print:border-slate-300 text-xs">
                    <div className="flex justify-between text-slate-400 print:text-slate-700">
                      <span>Subtotal:</span>
                      <span className="font-mono font-semibold text-white print:text-black">
                        {formatCurrency(selectedOrder.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400 print:text-slate-700">
                      <span>Discount:</span>
                      <span className="font-mono font-semibold text-rose-400 print:text-black">
                        -{formatCurrency(selectedOrder.discount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400 print:text-slate-700">
                      <span>Tax:</span>
                      <span className="font-mono font-semibold text-slate-300 print:text-black">
                        +{formatCurrency(selectedOrder.tax)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 print:border-slate-300 flex justify-between text-sm font-extrabold text-emerald-400 print:text-black">
                      <span>Grand Total:</span>
                      <span className="font-mono">{formatCurrency(selectedOrder.grand_total)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap justify-end gap-3 print:hidden">
                  <button
                    onClick={handlePrintOrder}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-all flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" /> Print Order Summary
                  </button>
                  <button
                    onClick={() => handleCreateInvoice(selectedOrder.order_number)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" /> Create Invoice
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-rose-400 text-xs">Failed to load order.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
