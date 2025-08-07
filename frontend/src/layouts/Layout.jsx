import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user } = useAuth();
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  // ✅ Show only page content if user is not logged in
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      {isNavbarVisible && (
        <Navbar onToggle={() => setIsNavbarVisible(!isNavbarVisible)} />
      )}

      {/* Main content area */}
      <div className="flex-1 pt-14">
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
