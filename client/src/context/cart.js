import { useState, useContext, createContext, useEffect } from "react";

const cartContex = createContext();
const CartProvider = ({ children }) =>{

    const [cart, setCart] = useState([]);
;

    useEffect(() => {
       let existingCart = localStorage.getItem("cart");
       if (existingCart) {
            setCart(JSON.parse(existingCart));
        }
    }, []);

    return (
        <cartContex.Provider value={{ cart, setCart }}>
            {children}
        </cartContex.Provider>
    );
}

// CUSTOM HOOK
const useCart = () => useContext(cartContex);

export { useCart, CartProvider };