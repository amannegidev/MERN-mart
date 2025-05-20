import { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/layouts/Layout";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [answer, setAnswer] = useState("");
    const [address, setAddress] = useState("");
    const [profilePic, setProfilePic] = useState(null); // Added profilePic state
    const navigate = useNavigate();

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("phone", phone);
            formData.append("answer", answer);
            formData.append("address", address);
            if (profilePic) {
                formData.append("profilePic", profilePic);
            }

            const res = await axios.post("/api/v1/auth/register", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res && res.data.success) {
                toast.success(res.data.message);
                navigate('/login');
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        }
    };


return (
  <Layout>
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-xl rounded-lg overflow-hidden">

        {/* Left Section - Welcome Banner */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-blue-300 to-purple-400 justify-center items-center p-10">
          <div className="text-center">
            <h1 className="text-black font-bold text-4xl mb-2">E-Commerce</h1>
            <p className="text-black text-lg">Welcome new users</p>
          </div>
        </div>

        {/* Right Section - Registration Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-10">
          <form
            className="w-full space-y-5"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-800 uppercase">Register Here!</h1>
              <hr className="border-gray-300 my-2" />
              <p className="text-sm text-gray-600">
                Join us by filling out the registration form below. Provide your details to gain access to exclusive features, updates, and services.
              </p>
            </div>

            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              required
            />

            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />

            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              required
            />

            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />

            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="number"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              required
            />

            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              name="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Security question answer"
              required
            />

            <input
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files[0])}
            />

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
            >
              Register
            </button>

            <p className="text-sm text-center text-gray-600">
              Already registered?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </Layout>
);


};

export default Register;
