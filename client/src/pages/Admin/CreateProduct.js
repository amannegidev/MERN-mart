/*  ───────── CreateProduct (responsive w/ sidebar toggle) ───────── */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";
import toast from "react-hot-toast";
import axios from "axios";

import AdminMenu from "../../components/layouts/AdminMenu";

const { Option } = Select;

const CreateProduct = () => {
  /* logic unchanged */
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);   /* NEW */

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) setCategories(data.category);
    } catch {
      toast.error("Something went wrong while fetching categories");
    }
  };
  useEffect(() => { getAllCategory(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);
      productData.append("shipping", shipping);

      const { data } = await axios.post(
        "/api/v1/products/create-products",
        productData
      );

      if (data?.error) toast.error(data.message);
      else {
        toast.success("Product created successfully");
        navigate("/dashboard/admin/products");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  /* ────────────────── UI only below ────────────────── */
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* off-canvas sidebar */}
      <aside
        className={`fixed inset-y-0 z-40 w-64 bg-gray-900 text-gray-200 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:static lg:translate-x-0 lg:w-64`}
      >
        <AdminMenu />
      </aside>

      {/* overlay when sidebar open */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* content */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <header className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 lg:px-12 py-4 flex items-center gap-4">
          {/* hamburger */}
          <button
        className="lg:hidden fixed top-4 lg:top-0  right-4 z-30 p-2 rounded-md bg-white "
        onClick={() => setSidebarOpen(true)}
      >
        <i className="bi bi-list text-2xl" />
      </button>

          <h1 className="text-lg sm:text-xl font-semibold uppercase">
            Create Product
          </h1>
        </header>

        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8">
          <form
            onSubmit={handleCreate}
            className="w-full n  bg-white shadow-sm rounded-lg p-4 sm:p-6 space-y-6
                       md:shadow-sm md:rounded-lg  "
          >
            {/* category selector */}
            <div>
              <Select
                size="large"
                className="w-full "
                placeholder="Select a category"
                showSearch
                value={category || undefined}
                onChange={(v) => setCategory(v)}
              >
                {categories.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </div>

            {/* upload */}
            <div>
         
              <label className="flex items-center justify-center border border-dashed border-gray-400 rounded-md h-32 cursor-pointer hover:bg-gray-50">
                <span className="text-sm text-gray-600">
                  {photo ? "Change photo" : "Click to upload"}
                </span>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  hidden
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </label>
              {photo && (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="preview"
                  className="mt-4 h-40 object-contain mx-auto"
                />
              )}
            </div>

            {/* inputs */}
            <div className="grid sm:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-200 focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Price"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-200 focus:outline-none"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <textarea
                rows="3"
                placeholder="Description"
                className="sm:col-span-2 w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:ring-indigo-200 focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="number"
                placeholder="Quantity"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-200 focus:outline-none"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <Select
                size="large"
                className="w-full"
                placeholder="Shipping?"
                value={shipping || undefined}
                onChange={(v) => setShipping(v)}
              >
                <Option value="0">No</Option>
                <Option value="1">Yes</Option>
              </Select>
            </div>

            {/* submit */}
            <div className="text-center mt-4">
              <button
                type="submit"
                className="w-full text-center  py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
              >
                CREATE PRODUCT
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateProduct;
