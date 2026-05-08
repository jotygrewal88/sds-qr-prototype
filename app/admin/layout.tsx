import { Sidebar } from "@/components/admin/Sidebar";
import { TopBar } from "@/components/admin/TopBar";

const adminBreadcrumbs = ["Safety Management", "Access Points"];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-950">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar breadcrumbs={adminBreadcrumbs} />
        <main className="flex-1 px-7 py-6">{children}</main>
      </div>
    </div>
  );
}
