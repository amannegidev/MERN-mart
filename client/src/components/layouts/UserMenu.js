import { NavLink } from "react-router-dom";

const UserMenu = () => {
return (
  <div className="w-full rounded-xl bg-green-100 p-6 md:h-screen">
    <h4 className="mb-4 text-xl font-semibold uppercase text-black">User Panel</h4>

    <div className="flex flex-col gap-3">
      <NavLink
        to="/dashboard/user/profile"
        className="text-base text-black transition-colors duration-200 hover:text-green-600 no-underline"
      >
        Update Profile
      </NavLink>

      <NavLink
        to="/dashboard/user/orders"
        className="text-base text-black transition-colors duration-200 hover:text-green-600 no-underline"
      >
        Orders
      </NavLink>
    </div>
  </div>
);

};

export default UserMenu;
