import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/layouts/Layout";

const ForgotPass = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [answer, setAnswer] = useState("");
    const navigate = useNavigate();

    const handleForgotpass = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/v1/auth/forgotpass", {
                email,
                newPassword,
                answer
            });
            if (res && res.data.success) {
                toast.success(res.data.message);
                navigate("/login"); // Redirect to a protected route
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Login failed. Please try again.");
        }
    };

    return (
        <Layout>
            <div className="h-[700px] md:flex w-10/12 mx-auto mt-24 md:space-x-4">
                <div className="relative overflow-hidden md:flex w-1/2 rounded bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center hidden">
                    <div>
                        <h1 className="text-white font-bold text-4xl font-sans">eCommerce</h1>
                        <p className="text-white mt-1">Welcome back!</p>
                    </div>
                </div>
                <div className="flex md:w-1/2 justify-center py-10 items-center bg-white lg:p-20">
                    <form className="bg-white w-full" onSubmit={handleForgotpass}>
                        <h1 className="text-gray-800 font-bold text-lg uppercase mb-2">reset password Here!</h1>
                        <hr />
                        <p className="font-[Ubuntu] pr-2">
                            Enter your email and password to access your account.
                        </p>

                        <div className="flex items-center mb-4">
                            <input
                                className="border rounded w-full py-2 px-3"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                required
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <input
                                className="border rounded w-full py-2 px-3"
                                type="password"
                                name="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <input
                                className="border rounded w-full py-2 px-3"
                                type="text"
                                name="answer"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Enter answer"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2"
                        >
                            reset password
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default ForgotPass;
