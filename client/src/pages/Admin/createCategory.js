import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import axios from "axios";
import toast from "react-hot-toast";

import AdminMenu from "../../components/layouts/AdminMenu";
import CategoryForm from "../../components/forms/categoryForms";

const CreateCategory = () => {
  /* ─────────── state ─────────── */
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const [visible, setVisible]   = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);   // ← NEW

  /* ─────────── CRUD helpers ─────────── */
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-Category");
      if (data?.success) setCategories(data.category);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => { getAllCategory(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/category/create-category", { name });
      if (data?.success) {
        toast.success(`${name} created`);
        setName("");
        getAllCategory();
      } else toast.error(data?.message || "Creation failed");
    } catch { toast.error("Error creating category"); }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/v1/category/delete-category/${id}`);
      if (data.success) {
        toast.success("Category deleted");
        getAllCategory();
      } else toast.error(data.message);
    } catch { toast.error("Deletion failed"); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data?.success) {
        toast.success("Category updated");
        setVisible(false);
        setUpdatedName("");
        setSelected(null);
        getAllCategory();
      } else toast.error(data.message);
    } catch { toast.error("Update failed"); }
  };

  /* ─────────── view ─────────── */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">

      {/* ── mobile hamburger ── */}
      <button
        className="lg:hidden fixed top-4 lg:top-0  right-4 z-30 p-2 rounded-md bg-white "
        onClick={() => setSidebarOpen(true)}
      >
        <i className="bi bi-list text-2xl" />
      </button>

      {/* ── sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 transform
                    lg:static lg:translate-x-0
                    transition-transform duration-200 ease-in-out
                    bg-gray-900
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <AdminMenu />
      </aside>

      {/* overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── main column ── */}
      <div className="flex-1 flex flex-col overflow-x-hidden">

        <main className="flex-1 px-4 sm:px-8 py-10  lg:px-16 lg:py-8   ">
          <h1 className="text-lg sm:text-2xl font-semibold uppercase mb-8">
            Manage Categories
          </h1>

          {/* form */}
          <section className="max-w-lg w-full mb-12">
            <CategoryForm
              handleSubmit={handleSubmit}
              value={name}
              setValue={setName}
            />
          </section>

          {/* table */}
          <section className="">
            <table className="w-full min-w-[26rem] bg-white text-sm sm:text-base sm:p-10">
              <thead>
                <tr className="bg-gray-100 uppercase text-gray-600">
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id} className="border-t first:border-t-0 hover:bg-gray-50">
                    <td className="px-4 py-3">{c.name}</td>
                    <td className="px-4 py-2 text-right space-x-1 sm:space-x-2">
                      <button
                        className="px-2 sm:px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                        onClick={() => { setVisible(true); setSelected(c); setUpdatedName(c.name); }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 sm:px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>

      {/* modal */}
      <Modal
        title="Edit Category"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <CategoryForm
          handleSubmit={handleUpdate}
          value={updatedName}
          setValue={setUpdatedName}
        />
      </Modal>
    </div>
  );
};

export default CreateCategory;
