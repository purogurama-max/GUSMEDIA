"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrderApi } from "@/services/orderService";
import { createCustomerApi, fetchCustomers } from "@/services/customerService";
import { ShoppingBag, CheckCircle2, AlertCircle } from "lucide-react";

export default function OrderForm({ product }) {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!name.trim() || !email.trim()) {
        throw new Error("Nama dan Email wajib diisi");
      }

      // 1. Check if customer already exists or create new customer
      let customerId = null;
      const customersRes = await fetchCustomers({ search: email.trim() });
      const existingCustomer = customersRes?.data?.find(
        (c) => c.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const newCustomerRes = await createCustomerApi({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          company: company.trim() || null,
        });

        if (!newCustomerRes.success || !newCustomerRes.data?.id) {
          throw new Error(newCustomerRes.message || "Gagal membuat data pelanggan baru");
        }
        customerId = newCustomerRes.data.id;
      }

      // 2. Create Order
      const orderPayload = {
        customer_id: customerId,
        items: [
          {
            product_id: product.id,
            quantity: Number(quantity) || 1,
            price: Number(product.price),
          },
        ],
        notes: notes.trim() || `Pemesanan dari web publik untuk ${product.name}`,
      };

      const orderRes = await createOrderApi(orderPayload);

      if (!orderRes.success) {
        throw new Error(orderRes.message || "Gagal membuat pesanan");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/products");
      }, 3000);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memproses pesanan");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
        <h3 className="text-lg font-bold text-emerald-900">Pesanan Berhasil Dibuat!</h3>
        <p className="text-xs font-medium text-emerald-700 leading-relaxed">
          Permintaan pesanan Anda telah tersimpan di sistem admin. Tim kami akan segera menghubungi Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-900 text-base font-bold">
        <ShoppingBag className="w-5 h-5 text-[#2D9CFF]" /> Form Pemesanan Lisensi
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pemesan / Kontak *</label>
          <input
            type="text"
            required
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2D9CFF] focus:bg-white transition-all font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Kontak / Procurement *</label>
          <input
            type="email"
            required
            placeholder="procurement@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2D9CFF] focus:bg-white transition-all font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Nama Perusahaan / Organisasi</label>
          <input
            type="text"
            placeholder="PT Example Indonesia"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2D9CFF] focus:bg-white transition-all font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">No. Telepon / WhatsApp</label>
          <input
            type="text"
            placeholder="081234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2D9CFF] focus:bg-white transition-all font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Lisensi (Qty)</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2D9CFF] focus:bg-white transition-all font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
          <textarea
            rows={2}
            placeholder="Kebutuhan khusus kustomisasi / tim pengembang..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2D9CFF] focus:bg-white transition-all font-medium resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-[#2D9CFF] hover:bg-[#1E7EC8] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all mt-2 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            "Kirim Permintaan Pesanan"
          )}
        </button>
      </form>
    </div>
  );
}
