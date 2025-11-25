import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff } from "lucide-react";

const NotificationStatus = () => {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(null); // null = carregando
  
  const userId = 'user-1';

  useEffect(() => {
    const showStatusActive = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        // Se não existir subscription → desativado
        if (!subscription) {
          console.warn("Nenhuma subscription encontrada → notificações desativadas.");
          setActive(false);
          setVisible(true);
          return;
        }

        // Consulta o backend
        const res = await fetch("http://98.93.193.4:7001/subscriptions/active", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userId,
            endpoint: subscription.endpoint,
          }),
        });

        const result = await res.json();

        console.log("🔍 Status vindo do backend:", result);

        // Armazena o valor vindo do backend (true ou false)
        setActive(result.active === true);

        // Exibe o componente após leve delay
        const timer = setTimeout(() => setVisible(true), 300);
   
        return () => clearTimeout(timer);

      } catch (error) {
        console.error("Erro ao verificar banner:", error);
        
        // Mostra como fallback
        setActive(false);
        setVisible(true);
      }
    };

  
    showStatusActive();

  }, [userId]);

  if (!visible) return null;

  const isActive = active === true;

  return (
    <div className="w-full flex justify-center mt-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-md border
          ${isActive ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"}
        `}
      >
        {isActive ? (
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-green-600"
          >
            <Bell size={22} />
          </motion.div>
        ) : (
          <BellOff size={22} className="text-red-600 opacity-70" />
        )}

        <span
          className={`font-medium ${
            isActive ? "text-green-700" : "text-red-700 opacity-80"
          }`}
        >
          {isActive ? "Notificação ativada" : "Notificação desativada"}
        </span>
      </motion.div>
    </div>
  );
};

export default NotificationStatus;
