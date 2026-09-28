export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Company Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Configure company details, logo, and system parameters.</p>
        </div>
      </div>
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
        Settings module initialized.
      </div>
    </div>
  );
}
