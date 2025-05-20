import React, { useState, useEffect } from "react";
import UserMenu from "../../components/layouts/UserMenu";
import Layout from "../../components/layouts/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (auth && auth.user) {
      setName(auth.user.name);
      setEmail(auth.user.email);
      setPhone(auth.user.phone);
      setAddress(auth.user.address);
    }
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/v1/auth/profile", {
        name,
        email,
        phone,
        address,
      });
      if (data?.error) {
        toast.error(data.error);
      } else {
        setAuth({ ...auth, user: data.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating profile");
    }
  };

 return (
  <Layout title="Your Profile">
    <div className="mx-auto max-w-screen-sm px-3 py-4 sm:max-w-screen-md md:max-w-screen-xl">
      <div className="flex flex-col gap-3 md:flex-row md:gap-6">
        {/* side menu */}
        <aside className="w-full md:w-1/4 ">
          <UserMenu />
        </aside>

        {/* profile form */}
        <section className="w-full rounded-lg bg-green-100 p-3 shadow-sm sm:p-4 md:w-3/4 md:p-6">
          <h1 className="mb-4 text-center text-xl font-semibold sm:mb-6 sm:text-2xl">
            Update Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="form-input"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="form-input"
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="form-input"
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className="form-input"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-green-600 py-2 text-white transition hover:bg-green-700"
            >
              Update Profile
            </button>
          </form>
        </section>
      </div>
    </div>
  </Layout>
);



};

export default Profile;
