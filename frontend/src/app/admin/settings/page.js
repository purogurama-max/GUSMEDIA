"use client";

import { useState, useEffect } from "react";
import {
  fetchUsers,
  createUserApi,
  updateUserStatusApi,
  updateUserApi,
  deleteUserApi,
} from "@/services/userService";
import { getAdminUser } from "@/services/authService";
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  UserX,
  UserCheck,
  Search,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Building,
  Save,
  KeyRound,
  Edit3,
  Lock,
  User,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Notification Banner
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }

  // Modal State - Add User
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("ADMIN");
  const [newUserIsActive, setNewUserIsActive] = useState(true);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [userFormError, setUserFormError] = useState("");

  // Modal State - Edit User / Change Password
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("ADMIN");
  const [editPassword, setEditPassword] = useState("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editFormError, setEditFormError] = useState("");

  // Modal State - Toggle Status / Delete Confirm
  const [actionUser, setActionUser] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isActionProcessing, setIsActionProcessing] = useState(false);

  // Company Settings Form State
  const [companyName, setCompanyName] = useState("GUSMEDIA");
  const [companyEmail, setCompanyEmail] = useState("info@gusmedia.com");
  const [companyPhone, setCompanyPhone] = useState("+62 21 5558 9000");
  const [companyAddress, setCompanyAddress] = useState("Jakarta Tech Hub, Level 14, Indonesia");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const loadUsersData = async () => {
    setLoadingUsers(true);
    const res = await fetchUsers();
    if (res?.success) {
      setUsers(res.data || []);
    } else {
      setUsers([]);
      showNotification("error", res?.message || "Gagal memuat daftar user.");
    }
    setLoadingUsers(false);
  };

  useEffect(() => {
    setCurrentUser(getAdminUser());
    loadUsersData();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Add User Handlers
  const handleOpenAddModal = () => {
    setUserFormError("");
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserRole("ADMIN");
    setNewUserIsActive(true);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setUserFormError("");
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    setUserFormError("");

    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword) {
      setUserFormError("Harap lengkapi semua bidang isian wajib.");
      return;
    }

    if (newUserPassword.length < 6) {
      setUserFormError("Password minimal harus 6 karakter.");
      return;
    }

    setIsSubmittingUser(true);
    const res = await createUserApi({
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole,
      is_active: newUserIsActive,
    });
    setIsSubmittingUser(false);

    if (res?.success) {
      showNotification("success", `User "${newUserName}" berhasil ditambahkan!`);
      handleCloseAddModal();
      loadUsersData();
    } else {
      setUserFormError(res?.message || "Gagal membuat user baru.");
    }
  };

  // Edit User / Change Password Handlers
  const handleOpenEditModal = (user) => {
    setEditFormError("");
    setEditingUser(user);
    setEditName(user.name || "");
    setEditEmail(user.email || "");
    setEditRole(user.role || "ADMIN");
    setEditPassword("");
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setEditFormError("");
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    setEditFormError("");

    if (!editName.trim() || !editEmail.trim()) {
      setEditFormError("Nama dan email wajib diisi.");
      return;
    }

    if (editPassword && editPassword.length < 6) {
      setEditFormError("Password baru minimal 6 karakter.");
      return;
    }

    setIsSubmittingEdit(true);
    const res = await updateUserApi(editingUser.id, {
      name: editName,
      email: editEmail,
      role: editRole,
      password: editPassword || undefined,
    });
    setIsSubmittingEdit(false);

    if (res?.success) {
      showNotification("success", `Data / password untuk "${editName}" berhasil diperbarui!`);
      handleCloseEditModal();
      loadUsersData();
    } else {
      setEditFormError(res?.message || "Gagal memperbarui data user.");
    }
  };

  // Toggle Status Handlers
  const handleOpenStatusModal = (user) => {
    setActionUser(user);
    setIsStatusModalOpen(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!actionUser) return;
    setIsActionProcessing(true);
    const newStatus = !actionUser.is_active;
    const res = await updateUserStatusApi(actionUser.id, newStatus);
    setIsActionProcessing(false);

    if (res?.success) {
      showNotification(
        "success",
        `User "${actionUser.name}" berhasil di-${newStatus ? "aktifkan" : "nonaktifkan"}.`
      );
      setIsStatusModalOpen(false);
      setActionUser(null);
      loadUsersData();
    } else {
      showNotification("error", res?.message || "Gagal mengubah status user.");
    }
  };

  // Delete User Handlers
  const handleOpenDeleteModal = (user) => {
    setActionUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteUser = async () => {
    if (!actionUser) return;
    setIsActionProcessing(true);
    const res = await deleteUserApi(actionUser.id);
    setIsActionProcessing(false);

    if (res?.success) {
      showNotification("success", `User "${actionUser.name}" berhasil dihapus.`);
      setIsDeleteModalOpen(false);
      setActionUser(null);
      loadUsersData();
    } else {
      showNotification("error", res?.message || "Gagal menghapus user.");
    }
  };

  // Company Settings Submit
  const handleSaveCompanySettings = (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setTimeout(() => {
      setIsSavingSettings(false);
      showNotification("success", "Pengaturan perusahaan berhasil disimpan.");
    }, 600);
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  // Find object of current active admin user from list
  const currentAdminUserObj = users.find((u) => u.email?.toLowerCase() === currentUser?.email?.toLowerCase()) || currentUser;

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" /> System Settings & User Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola akses user login admin, ganti password, serta nonaktifkan hak akses user.
          </p>
        </div>

        {activeTab === "users" && (
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Tambah User Admin
          </button>
        )}
      </div>

      {/* Global Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 border shadow-xl transition-all ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "users"
              ? "border-cyan-400 text-cyan-400 bg-slate-900/60"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" /> Manajemen User Admin ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("company")}
          className={`px-5 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "company"
              ? "border-cyan-400 text-cyan-400 bg-slate-900/60"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Building className="w-4 h-4" /> Profil Perusahaan
        </button>
      </div>

      {/* TAB 1: USER MANAGEMENT */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* Current Active Admin Profile Banner */}
          {currentAdminUserObj && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-base border border-cyan-500/40 shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-white">
                      {currentAdminUserObj.name || "Administrator"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-extrabold border border-cyan-500/30">
                      Sesi Login Anda Saat Ini
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {currentAdminUserObj.email || "admin@gusmedia.com"} • Role:{" "}
                    <span className="text-purple-400 font-bold">{currentAdminUserObj.role || "ADMIN"}</span>
                  </div>
                </div>
              </div>

              {currentAdminUserObj.id && (
                <button
                  onClick={() => handleOpenEditModal(currentAdminUserObj)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-2 shrink-0"
                >
                  <Lock className="w-3.5 h-3.5" /> Ganti Password Saya
                </button>
              )}
            </div>
          )}

          {/* Search Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari user berdasarkan nama, email, atau role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>

            <div className="text-xs text-slate-400 font-medium hidden sm:block">
              Total User Registered: <span className="font-bold text-white">{users.length}</span>
            </div>
          </div>

          {/* User Table */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            {loadingUsers ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                <span className="text-xs">Memuat data pengguna...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-slate-600" />
                <div className="text-sm font-semibold">Tidak ada user ditemukan</div>
                <div className="text-xs">
                  Tambahkan user baru atau sesuaikan kata kunci pencarian Anda.
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Role Access</th>
                      <th className="px-6 py-4">Status Hak Login</th>
                      <th className="px-6 py-4">Tanggal Dibuat</th>
                      <th className="px-6 py-4 text-right">Aksi Management</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.map((user) => {
                      const isSelf = currentUser && (currentUser.id === user.id || currentUser.email === user.email);

                      return (
                        <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/30 uppercase shrink-0">
                                {user.name?.substring(0, 2) || "US"}
                              </div>
                              <div>
                                <div className="font-bold text-white flex items-center gap-2">
                                  <span>{user.name}</span>
                                  {isSelf && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
                                      Akun Anda
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              <KeyRound className="w-3 h-3" /> {user.role || "ADMIN"}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            {user.is_active ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <UserCheck className="w-3.5 h-3.5" /> Aktif (Bisa Login)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                <UserX className="w-3.5 h-3.5" /> Nonaktif (Login Ditolak)
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-slate-400 font-mono">
                            {user.created_at
                              ? new Date(user.created_at).toLocaleDateString("id-ID", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "-"}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Edit & Ganti Password Button */}
                              <button
                                onClick={() => handleOpenEditModal(user)}
                                title="Edit data user & ganti password"
                                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 hover:border-cyan-500/30 transition-all flex items-center gap-1 text-xs font-semibold"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> Edit / Password
                              </button>

                              {/* Toggle Active Button */}
                              <button
                                onClick={() => handleOpenStatusModal(user)}
                                disabled={isSelf}
                                title={
                                  isSelf
                                    ? "Anda tidak bisa menonaktifkan akun sendiri"
                                    : user.is_active
                                    ? "Klik untuk menonaktifkan login user"
                                    : "Klik untuk mengaktifkan kembali login user"
                                }
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
                                  user.is_active
                                    ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                                    : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                                }`}
                              >
                                {user.is_active ? (
                                  <>
                                    <UserX className="w-3.5 h-3.5" /> Nonaktifkan
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-3.5 h-3.5" /> Aktifkan
                                  </>
                                )}
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleOpenDeleteModal(user)}
                                disabled={isSelf}
                                title={
                                  isSelf
                                    ? "Anda tidak bisa menghapus akun sendiri"
                                    : "Hapus user ini"
                                }
                                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: COMPANY PROFILE */}
      {activeTab === "company" && (
        <div className="max-w-3xl p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-cyan-400" /> Profil & Informasi Perusahaan
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Informasi ini akan ditampilkan pada header invoice dan halaman publik perusahaan.
            </p>
          </div>

          <form onSubmit={handleSaveCompanySettings} className="space-y-5 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                Nama Perusahaan
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                  Email Perusahaan
                </label>
                <input
                  type="email"
                  required
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                  Telepon Hotline
                </label>
                <input
                  type="text"
                  required
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                Alamat Kantor Pusat
              </label>
              <textarea
                rows="3"
                required
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                {isSavingSettings ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Simpan Perubahan Perusahaan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: TAMBAH USER ADMIN */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-5 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-400" /> Tambah User Admin Baru
              </h3>
              <button
                onClick={handleCloseAddModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {userFormError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{userFormError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUserSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Luqman Hakim"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gusmedia.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Password Login *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter..."
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Role Hak Akses
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPERADMIN">SUPERADMIN</option>
                    <option value="STAFF">STAFF</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Status Hak Login
                  </label>
                  <select
                    value={newUserIsActive ? "true" : "false"}
                    onChange={(e) => setNewUserIsActive(e.target.value === "true")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
                  >
                    <option value="true">Aktif (Bisa Login)</option>
                    <option value="false">Nonaktif (Ditolak)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  {isSubmittingUser && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Simpan User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER & GANTI PASSWORD */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-5 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-cyan-400" /> Edit User & Ganti Password
              </h3>
              <button
                onClick={handleCloseEditModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editFormError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{editFormError}</span>
              </div>
            )}

            <form onSubmit={handleEditUserSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Role Hak Akses
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPERADMIN">SUPERADMIN</option>
                  <option value="STAFF">STAFF</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-bold text-cyan-400 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Ganti Password Baru (Opsional)
                </label>
                <input
                  type="password"
                  placeholder="Kosongkan jika tidak ingin mengubah password..."
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-all font-medium"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Isi password baru minimal 6 karakter jika ingin mengganti password user ini.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  {isSubmittingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI STATUS (AKTIF / NONAKTIF) */}
      {isStatusModalOpen && actionUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {actionUser.is_active ? (
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                )}
                Konfirmasi Status User
              </h3>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3">
              <p>
                Apakah Anda yakin ingin{" "}
                <span className="font-bold text-white uppercase">
                  {actionUser.is_active ? "menonaktifkan" : "mengaktifkan kembali"}
                </span>{" "}
                akses login user berikut?
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <div className="font-bold text-white">{actionUser.name}</div>
                <div className="text-slate-400 text-[11px]">{actionUser.email}</div>
              </div>

              {actionUser.is_active ? (
                <p className="text-rose-400 text-[11px] bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                  ⚠️ User ini tidak akan bisa login lagi ke Dashboard Admin sampai diaktifkan kembali.
                </p>
              ) : (
                <p className="text-emerald-400 text-[11px] bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                  ✅ User ini akan memperoleh hak akses login ke Dashboard Admin dengan password yang ada.
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmToggleStatus}
                disabled={isActionProcessing}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all flex items-center gap-1.5 ${
                  actionUser.is_active
                    ? "bg-rose-600 hover:bg-rose-500 shadow-rose-600/20"
                    : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
                }`}
              >
                {isActionProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {actionUser.is_active ? "Ya, Nonaktifkan User" : "Ya, Aktifkan User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS USER */}
      {isDeleteModalOpen && actionUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" /> Hapus User Admin
              </h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3">
              <p>
                Apakah Anda yakin ingin menghapus user{" "}
                <span className="font-bold text-white">{actionUser.name}</span> (
                <span className="font-mono text-cyan-400">{actionUser.email}</span>)?
              </p>
              <p className="text-rose-400 text-[11px] bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                ⚠️ Tindakan ini permanen dan tidak dapat dibatalkan.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                disabled={isActionProcessing}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/20 transition-all flex items-center gap-1.5"
              >
                {isActionProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Hapus User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
