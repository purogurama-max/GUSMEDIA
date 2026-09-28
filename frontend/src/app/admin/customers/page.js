"use client";

import { useState, useEffect } from "react";
import {
  fetchCustomers,
  createCustomerApi,
  updateCustomerApi,
  deleteCustomerApi,
} from "@/services/customerService";
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  Building,
  MapPin,
  Eye,
  Calendar,
} from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals & Active Customer state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null); // Null for create, object for edit/view

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadCustomers = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;

    const res = await fetchCustomers(params);
    if (res?.success) {
      setCustomers(res.data || []);
    } else {
      setCustomers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const handleOpenFormModal = (cust = null) => {
    setErrorMsg("");
    if (cust) {
      setCurrentCustomer(cust);
      setFormData({
        name: cust.name || "",
        email: cust.email || "",
        phone: cust.phone || "",
        company: cust.company || "",
        address: cust.address || "",
      });
    } else {
      setCurrentCustomer(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
      });
    }
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setCurrentCustomer(null);
    setErrorMsg("");
  };

  const handleOpenDetailModal = (cust) => {
    setCurrentCustomer(cust);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setCurrentCustomer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    if (!formData.name.trim()) {
      setErrorMsg("Customer name is required.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
      setErrorMsg("Email address is required.");
      setIsSubmitting(false);
      return;
    }

    let res;
    if (currentCustomer) {
      res = await updateCustomerApi(currentCustomer.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        address: formData.address,
      });
    } else {
      res = await createCustomerApi({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        address: formData.address,
      });
    }

    setIsSubmitting(false);
    if (res?.success) {
      handleCloseFormModal();
      loadCustomers();
    } else {
      setErrorMsg(res?.message || "Operation failed. Please try again.");
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete customer "${name}"?`)) {
      const res = await deleteCustomerApi(id);
      if (res?.success) {
        loadCustomers();
      } else {
        alert(res?.message || "Failed to delete customer.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#2D9CFF]" /> Customer Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your customer list, client contact information, and business profiles.
          </p>
        </div>
        <button
          onClick={() => handleOpenFormModal()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Add New Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Total Customers: <span className="text-white font-bold">{customers.length}</span>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#2D9CFF]" />
            <span className="text-xs">Loading customer records...</span>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-600" />
            <div className="text-sm font-semibold">No customers found</div>
            <div className="text-xs">Try adjusting your search criteria or add a new customer.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs">
                          {cust.name ? cust.name.charAt(0).toUpperCase() : "C"}
                        </div>
                        <div>
                          <div>{cust.name}</div>
                          <div className="text-[11px] text-slate-500 font-normal">ID: #{cust.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{cust.email}</span>
                      </div>
                      {cust.phone && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{cust.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {cust.company ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-300 bg-slate-800/80 border border-slate-700/50">
                          <Building className="w-3 h-3 text-cyan-400" /> {cust.company}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px] italic">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate">
                      {cust.address ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                          <span className="truncate">{cust.address}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px] italic">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDetailModal(cust)}
                        className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-all"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenFormModal(cust)}
                        className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cust.id, cust.name)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Customer Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {currentCustomer ? "Edit Customer Profile" : "Create New Customer"}
              </h3>
              <button
                onClick={handleCloseFormModal}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +62 812-3456-7890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Tech Solutions"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Address
                </label>
                <textarea
                  rows="3"
                  placeholder="Full office or residence address..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseFormModal}
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
                  {currentCustomer ? "Save Changes" : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Detail View Modal */}
      {isDetailModalOpen && currentCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" /> Customer Details
              </h3>
              <button
                onClick={handleCloseDetailModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-lg">
                  {currentCustomer.name ? currentCustomer.name.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{currentCustomer.name}</h4>
                  <p className="text-slate-400 text-[11px]">Customer ID: #{currentCustomer.id}</p>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-cyan-400 mt-0.5" />
                  <div>
                    <div className="text-slate-400 text-[11px]">Email Address</div>
                    <div className="text-white font-medium">{currentCustomer.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-cyan-400 mt-0.5" />
                  <div>
                    <div className="text-slate-400 text-[11px]">Phone Number</div>
                    <div className="text-white font-medium">
                      {currentCustomer.phone || <span className="text-slate-500 italic">Not set</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Building className="w-4 h-4 text-cyan-400 mt-0.5" />
                  <div>
                    <div className="text-slate-400 text-[11px]">Company</div>
                    <div className="text-white font-medium">
                      {currentCustomer.company || <span className="text-slate-500 italic">Not set</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-cyan-400 mt-0.5" />
                  <div>
                    <div className="text-slate-400 text-[11px]">Address</div>
                    <div className="text-white font-medium">
                      {currentCustomer.address || <span className="text-slate-500 italic">Not set</span>}
                    </div>
                  </div>
                </div>

                {currentCustomer.created_at && (
                  <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800/60">
                    <Calendar className="w-4 h-4 text-slate-500 mt-0.5" />
                    <div>
                      <div className="text-slate-400 text-[11px]">Registered Date</div>
                      <div className="text-slate-300">
                        {new Date(currentCustomer.created_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleCloseDetailModal}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
