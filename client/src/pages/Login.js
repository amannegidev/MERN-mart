import { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/layouts/Layout";
import { useAuth } from "../context/auth";

// ✅ Google OAuth imports
import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/v1/auth/login", {
                email,
                password,
            });
            if (res && res.data.success) {
                toast.success(res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                });
                localStorage.setItem("auth", JSON.stringify(res.data));
                navigate(location.state || "/");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Login failed. Please try again.");
        }
    };

    // Handle Google login response
    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const idToken = credentialResponse.credential; // RAW token
    
            // Send the raw token to backend
            const res = await axios.post("/api/v1/auth/google-login", { idToken });
    
            if (res && res.data.success) {
                toast.success("Logged in with Google");
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                });
                localStorage.setItem("auth", JSON.stringify(res.data));
                navigate(location.state || "/");
            } else {
                toast.error(res.data.message || "Google login failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Google login failed");
        }
    };
    

  return (
  <Layout>
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-xl rounded-lg overflow-hidden">
        
        {/* Left Section - Welcome Banner */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-blue-200 to-purple-300 justify-center items-center p-10">
          <div className="text-center">
            <h1 className="text-black font-bold text-4xl mb-2">E-Commerce</h1>
            <p className="text-black text-lg">Welcome back! Login to continue.</p>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-10">
          <form className="w-full space-y-6" onSubmit={handleLogin}>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-gray-800">Login Here!</h1>
              <NavLink to="/forgotpass" className="text-sm text-indigo-600 hover:underline no-underline mt-2 sm:mt-0">
                Forgot password?
              </NavLink>
            </div>

            <hr className="border-gray-300" />

            <p className="text-gray-600">
              Enter your email and password to access your account.
            </p>

            <div>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
            >
              Login
            </button>

            {/* Google Login */}
            <div className="mt-4 w-full">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google login failed")}
              />
            </div>

            {/* Register Link */}
            <div className="text-center mt-6">
              <span className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <NavLink to="/register" className="text-indigo-600 font-medium hover:underline">
                  Register
                </NavLink>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
);

};

export default Login;
