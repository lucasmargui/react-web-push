import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff } from "lucide-react";


const NotificationStatus = ({active, setActive, open}) => {
  const [visible, setVisible] = useState(false);
 
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
        const res = await fetch("http://localhost:7000/subscriptions/active", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userId,
            endpoint: subscription.endpoint,
          }),
        });

        const result = await res.json();

       

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
  key={isActive ? "active" : "inactive"}
  layout
  transition={{ type: "spring", stiffness: 140, damping: 18 }}
  animate={isActive ? "active" : "inactive"}
  variants={{
    active: {
      background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
      borderColor: "#6ee7b7",
      boxShadow: "0 10px 25px rgba(16,185,129,0.25)",
      scale: 1.03
    },
    inactive: {
      background: "linear-gradient(135deg, #fee2e2, #fecaca)",
      borderColor: "#fca5a5",
      boxShadow: "0 8px 18px rgba(239,68,68,0.20)",
      scale: 1
    }
  }}
  className={`
    flex items-center
    ${open ? "px-3 py-2 gap-1" : "flex-col px-6 py-2 gap-1.5"}
    rounded-2xl backdrop-blur-md border shadow-lg
    transition-all duration-500
  `}
>
  {/* Ícone */}
  {isActive ? (
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 2, -2, 0]
      }}
      transition={{ duration: 1.8, repeat: Infinity }}
      className="text-green-600"
    >
      <Bell size={open ? 22 : 20} />
    </motion.div>
  ) : (
    <motion.div
      animate={{
        opacity: [0.6, 0.9, 0.6],
        x: !open ? 0 : [0, -2, 2, 0]
      }}
      transition={{ duration: 1.4, repeat: Infinity }}
      className="text-red-600"
    >
      <BellOff size={!open ? 22 : 20} />
    </motion.div>
  )}

  {open && (
    <motion.span
      key={isActive ? "text-active" : "text-inactive"}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`font-semibold tracking-wide text-base text-center ${
        isActive ? "text-green-700" : "text-red-700"
      }`}
    >
      {isActive ? "Notificação ativada" : "Notificação desativada"}
    </motion.span>
  )}
</motion.div>

</div>

  );
};

export default NotificationStatus;
