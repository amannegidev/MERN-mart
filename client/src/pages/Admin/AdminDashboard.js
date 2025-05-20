import AdminMenu from "../../components/layouts/AdminMenu";
import { useAuth } from "../../context/auth";
import AdminHeader from "../../components/layouts/AdminHeader";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const [auth] = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
      {/* Mobile hamburger */}
      <button
        className="absolute top-4 right-4 z-30 p-2 rounded-md shadow bg-white lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 transform bg-white border-r shadow-lg transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
         
          <AdminMenu />
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col overflow-auto">
     

        {/* Page content */}
        <main className="flex-1 p-6 flex flex-col items-center ">
          <section className="w-full max-w-5xl bg-stone-900 text-white rounded-xl mt-10  p-8 ">
            <h2 className="text-3xl font-semibold mb-8 text-center uppercase">
              Welcome to Admin Dashboard
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-lg">
                  <span className="font-bold mr-2">Admin Name:</span>
                  <span className="text-green-400">{auth?.user?.name}</span>
                </p>
                <p className="text-lg">
                  <span className="font-bold mr-2">Admin Email:</span>
                  <span className="text-green-400">{auth?.user?.email}</span>
                </p>
                {auth?.user?.phone && (
                  <p className="text-lg">
                    <span className="font-bold mr-2">Admin Contact:</span>
                    <span className="text-green-400">{auth?.user?.phone}</span>
                  </p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
