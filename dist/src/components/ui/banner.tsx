import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Função auxiliar para converter VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

const NotificationBanner = () => {
  const { toast } = useToast();

  const [visible, setVisible] = useState(false);
 

  const userId = 'user-1';

  useEffect(() => {

    const checkAndShowBanner = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        // Se não existir subscription, já mostra o banner
        if (!subscription) {
          console.warn("Nenhuma subscription encontrada → exibindo banner.");
          setVisible(true);
          return;
        }

        // Faz a requisição antes de exibir o banner
        const res = await fetch("http://98.93.193.4:7001/subscriptions/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userId,
            endpoint: subscription.endpoint,
          }),
        });

        const result = await res.json();

        // Se o backend mandar exibir
        if (result.showBanner === true) {
          const timer = setTimeout(() => setVisible(true), 500);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Erro ao verificar banner:", error);
      }
    };

    checkAndShowBanner()
 
  }, [userId]);

  
// ----------------------
// Funções auxiliares
// ----------------------

// Carrega ou cria uma subscription push
async function getOrCreateSubscription(publicVapidKey) {
  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
  }

  return subscription;
}

// Envia dados para o backend
async function sendSubscriptionToServer({ id, subscription, active }) {
  const response = await fetch("http://98.93.193.4:7001/subscriptions/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, subscription, active }),
  });

  return response.json();
}



  // ----------------------
  // Handlers (limpos)
  // ----------------------

  const handleYes = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const publicVapidKey =
        "BNyR2VIokuew2M6DO_rVgVdJmqJwiG69i4jzMiLOtw-Eyf3UGuJLONEgdycUB6lwksnfS9dl4zgkvnpcOO4X4WA";

      const subscription = await getOrCreateSubscription(publicVapidKey);

      const data = await sendSubscriptionToServer({
        id: userId,
        subscription,
        active: true,
      });

      console.log("Response do servidor (YES):", data);
       
      toast({
        title: "Success!",
        description: "Notificação ativada",
        variant: "default",
      });




    } catch (error) {
      console.error("Erro no handleYes:", error);
      toast({
        title: "Erro ao processar sua solicitação.",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setVisible(false);
      location.reload()
    }
  };

  


  const handleNo = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const publicVapidKey =
        "BNyR2VIokuew2M6DO_rVgVdJmqJwiG69i4jzMiLOtw-Eyf3UGuJLONEgdycUB6lwksnfS9dl4zgkvnpcOO4X4WA";

      const subscription = await getOrCreateSubscription(publicVapidKey);

      const data = await sendSubscriptionToServer({
        id: userId,
        subscription,
        active: false,
      });

      console.log("Response do servidor (NO):", data);
      toast({
        title: "Success!",
        description: "Notificação desativada!",
        variant: "destructive",
      });

    } catch (error) {
      console.error("Erro no handleNo:", error);
      toast({
        title: "Erro ao processar sua solicitação.",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setVisible(false);
      location.reload()
    }
  };


  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 
        bg-white rounded-xl p-5 shadow-lg flex items-center gap-5 
        min-w-[320px] z-50 transition-all duration-300 
        ${visible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"}`}
    >
      <p className="text-gray-900">Deseja ativar as notificações do site?</p>
      <div className="flex gap-3">
        <button
          className="px-4 py-2 font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          onClick={handleYes}
        >
          Sim
        </button>
        <button
          className="px-4 py-2 font-semibold rounded-lg bg-gray-300 text-gray-900 hover:bg-gray-400 transition-colors"
          onClick={handleNo}
        >
          Não
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;
