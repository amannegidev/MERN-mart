import { useState, useEffect, useContext, createContext } from "react"; 
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: ""
    });

    axios.defaults.headers.common['Authorization'] = auth?.token;

   

    useEffect(() => {
        const data = localStorage.getItem("auth");
        if (data) {
          const parseData = JSON.parse(data);
          setAuth(parseData); // no need to spread old state
        }
      }, []);
      

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };