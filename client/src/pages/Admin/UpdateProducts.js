import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminMenu from "../../components/layouts/AdminMenu";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState(null);
  const [id, setId] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false); // NEW

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/products/get-product/${params.slug}`);
      if (data?.product) {
        setName(data.product.name);
        setId(data.product._id);
        setDescription(data.product.description);
        setPrice(data.product.price);
        setQuantity(data.product.quantity);
        setShipping(data.product.shipping ? "1" : "0");
        setCategory(data.product.category?._id || "");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching product");
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    getSingleProduct();
    getAllCategory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("category", category);
      productData.append("shipping", shipping);
      if (photo) productData.append("photo", photo);

      const { data } = await axios.put(`/api/v1/products/update-product/${id}`, productData);
      if (data?.success) {
        toast.success("Product updated successfully");
        navigate("/dashboard/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    try {
      const confirm = window.prompt("Are you sure you want to delete this product?");
      if (!confirm) return;
      const { data } = await axios.delete(`/api/v1/products/delete-product/${id}`);
      if (data?.success) {
        toast.success("Product deleted successfully");
        navigate("/dashboard/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0 lg:static lg:inset-auto lg:z-auto
        `}
      >
        <AdminMenu />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
          <button
            className="lg:hidden fixed top-4 right-4 z-30 p-2 rounded-md bg-white"
            onClick={() => setSidebarOpen(true)}
          >
            <i className="bi bi-list text-2xl" />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold uppercase">Update Product</h1>
          <div className="w-6 lg:hidden" />
        </header>

        {/* Form Card */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-8">
          <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category & Photo Upload */}
              <div className="space-y-4">
                <Select
                  bordered={false}
                  placeholder="Select a category"
                  size="large"
                  className="w-full border border-gray-300"
                  onChange={(value) => setCategory(value)}
                  value={category}
                >
                  {categories.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>

                {/* Upload Box */}
                <div className="border border-dashed border-gray-400 p-6 lg:py-14 rounded-md text-center cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <label className="block text-gray-700">
                    {photo ? photo.name : "Click to Upload Photo"}
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      hidden
                    />
                  </label>
                </div>
              </div>

              {/* Preview */}
              <div className="flex justify-center items-center">
                {photo ? (
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="new"
                    className="h-52 w-auto rounded border"
                  />
                ) : (
                  <img
                    src={`/api/v1/products/product-photo/${id}`}
                    alt="current"
                    className="h-52 w-auto rounded border"
                  />
                )}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                placeholder="Write a name"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                value={description}
                placeholder="Write a description"
                className="form-control"
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="number"
                value={price}
                placeholder="Write a price"
                className="form-control"
                onChange={(e) => setPrice(e.target.value)}
              />

              <input
                type="number"
                value={quantity}
                placeholder="Write a quantity"
                className="form-control"
                onChange={(e) => setQuantity(e.target.value)}
              />

              <Select
                bordered={false}
                placeholder="Select Shipping"
                size="large"
                className="w-full border border-gray-300"
                onChange={(value) => setShipping(value)}
                value={shipping}
              >
                <Option value="0">No</Option>
                <Option value="1">Yes</Option>
              </Select>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                onClick={handleUpdate}
              >
                Update Product
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
                onClick={handleDelete}
              >
                Delete Product
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdateProduct;
