import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
    const [count, setCount] = useState(3);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevValue) => --prevValue);
        }, 1000);
        count === 0 &&
            navigate(`/${path}`, {
                state: location.pathname,
            });
        return () => clearInterval(interval);
    }, [count, navigate, location, path]);

    return (
        <>
            <h1 className="text-center text-3xl bg-lime-900 p-5">Redirecting you in {count} second</h1>

            <div className="h-96 w-[100%] flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-l-3 border-blue-500"></div>
            </div>s

        </>
    );
};

export default Spinner;