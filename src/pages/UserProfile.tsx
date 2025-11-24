import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "lucide-react"; // ícone de usuário
import { motion } from "framer-motion"; // animações avançadas
import NotificationBanner from "@/components/ui/banner";

const UserInfo = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulação de busca de dados do usuário
    const fetchUser = async () => {
      const mockUser = {
        id: "12345",
        name: "Lucas Silva",
        email: "lucas@example.com",
        role: "Administrator",
        joined: "2023-05-01",
        lastLogin: "2025-11-20",
        status: "Active",
      };
      setUser(mockUser);
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <p className="text-gray-500 animate-pulse text-lg font-medium">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">

      <NotificationBanner id="1" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
      >
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
          className="flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/60 w-full md:w-48 h-48 md:h-auto"
        >
          <User className="h-28 w-28 text-primary animate-bounce-slow" />
        </motion.div>

        {/* Informações do usuário */}
        <div className="flex-1 p-8 flex flex-col justify-center space-y-4">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl font-bold text-gray-800"
          >
            {user.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700"
          >
            <div>
              <span className="font-semibold text-gray-900">ID:</span> {user.id}
            </div>
            <div>
              <span className="font-semibold text-gray-900">Email:</span> {user.email}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Role:</span>
              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                user.role === "Administrator" ? "bg-red-500" : "bg-blue-500"
              }`}>
                {user.role}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Status:</span>
              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                user.status === "Active" ? "bg-green-500" : "bg-gray-400"
              }`}>
                {user.status}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Joined:</span> {user.joined}
            </div>
            <div>
              <span className="font-semibold text-gray-900">Last Login:</span> {user.lastLogin}
            </div>
          </motion.div>

          <motion.a
            href="/"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-6 inline-block text-primary font-medium hover:underline self-start"
          >
            ← Return to Home
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default UserInfo;
