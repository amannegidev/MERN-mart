import { NavLink } from "react-router-dom";
// import "bootstrap-icons/font/bootstrap-icons.css";  // once globally

const AdminMenu = () => {


  /* ── icons (Bootstrap-Icons) ───────────────────────── */
  const menuItems = [
    { name: "Create Category", path: "/dashboard/create-category", icon: "bi-tags" },
    { name: "Create Products", path: "/dashboard/create-products", icon: "bi-box2" },
    { name: "Product List",    path: "/dashboard/products",         icon: "bi-list-check" },
    { name: "Orders",          path: "/dashboard/orders",           icon: "bi-basket" },
    { name: "Home", path: "/", icon: "bi bi-house-door-fill text-lg" },
    { name: "Shop", path: "/products", icon: "bi bi-bag-fill text-lg" }
  ];

  return (
    <nav className="w-64 md:w-64 h-screen flex flex-col bg-gray-900 text-gray-200
                    border-r border-gray-700">
      {/* heading */}
      <div className="flex items-center justify-center h-16">
        <h4 className="text-lg font-semibold uppercase pt-4 text-white">Admin Panel</h4>
      </div>
      <hr className="border-gray-700 mb-2" />

      {/* links */}
      {menuItems.map(({ name, path, icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-3 no-underline transition-colors
             ${isActive
               ? "bg-indigo-500/20 text-indigo-400 border-r-4 border-indigo-500"
               : "hover:bg-gray-800"}`
          }
        >
          <i className={`bi ${icon} text-lg`} />
          <span className="whitespace-nowrap">{name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default AdminMenu;
