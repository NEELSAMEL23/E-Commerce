import { createContext, useContext, useEffect, useState } from "react";
import { getProfileService, loginService, registerService } from "../Services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("authUser")) || null);
    const [token, setToken] = useState(() => localStorage.getItem("authToken"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (!token) return setLoading(false);
            try {
                const data = await getProfileService();
                setUser(data);
                localStorage.setItem("authUser", JSON.stringify(data));
            } catch (err) {
                if (err.response?.status === 401) logout();
                else console.error("Auto-login failed:", err);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, [token]);

    const storeAuthData = (data) => {
        const userInfo = {
            _id: data._id,
            name: data.name,
            email: data.email,
            avatar: data.avatar,
            role: data.role,
        };
        setUser(userInfo);
        setToken(data.token);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("authUser", JSON.stringify(userInfo));
    };

    const login = async (email, password) => {
        const data = await loginService({ email, password });
        storeAuthData(data);
        return data;
    };

    const register = async (formData) => {
        const data = await registerService(formData);
        storeAuthData(data);
        return data;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
    };

    const refreshProfile = async () => {
        try {
            const data = await getProfileService();
            setUser(data);
            localStorage.setItem("authUser", JSON.stringify(data));
        } catch (err) {
            console.error("Failed to refresh profile:", err);
        }
    };

    const updateProfile = (updatedData) => {
        setUser((prev) => ({ ...prev, ...updatedData }));
        localStorage.setItem("authUser", JSON.stringify({ ...user, ...updatedData }));
    };

    const isAuthenticated = !!user && !!token;

    return (
        <AuthContext.Provider
            value={{ user, token, loading, isAuthenticated, login, register, logout, refreshProfile, updateProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
