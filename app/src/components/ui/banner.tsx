import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";


const PUBLIC_VAPID_KEY = "BNyR2VIokuew2M6DO_rVgVdJmqJwiG69i4jzMiLOtw-Eyf3UGuJLONEgdycUB6lwksnfS9dl4zgkvnpcOO4X4WA";

// Função auxiliar para converter VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

const NotificationBanner = ({setActive}) => {
  const { toast } = useToast();

  const [visible, setVisible] = useState(false);
  const [permission, setPermission] = useState<"on" | "off" | "default">("default");

  const userId = 'user-1';

  useEffect(() => {


    const showBanner = async () => {

        const subscription = await getSubscription();
       
        const res = await fetch("https://main-domain-example.win/subscriptions/showBanner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userId,
            endpoint: subscription ? subscription.endpoint : null,
          }),
        });


        const result = await res.json();
        return result;
    }

      const init = async () => {
        try {
    
          // Verifica se o banner deve ser exibido
          const result = await showBanner();

          if (result.showBanner === true) {
            // Exibe o banner com delay
            const timer = setTimeout(() => setVisible(true), 500);
            return () => clearTimeout(timer);
          }

        } catch (error) {
          console.error("[Init] Erro ao verificar banner:", error);
          toast({
            title: "Erro ao verificar banner",
            description:
              `Não foi possível verificar se o banner deve ser exibido. Por favor, tente novamente.${error}`,
            variant: "destructive",
          });
        }
      };

    init()
 
  }, [userId]);

  

  // Cria ou retorna a subscription existente
async function getSubscription() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error("Service Worker ou Push não suportados neste navegador.");
  }

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if(!subscription){
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
    });
  }

  return subscription;
}

// Envia subscription para o backend
async function sendSubscriptionToServer({ id, subscription, active }) {

  console.log(id, subscription, active)

  const response = await fetch("https://main-domain-example.win/subscriptions/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, subscription, active }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao enviar subscription: ${response.statusText}`);
  }

  return response.json();
}

// ----------------------
// Handlers
// ----------------------
// ----------------------
// Ativar notificações
// ----------------------
async function handleEnableNotifications() {
  try {
    // 1️⃣ Verifica se o navegador suporta notificações
    if (!('Notification' in window)) {
      toast({
        title: "Erro",
        description: "Notificações não suportadas neste navegador.",
        variant: "destructive",
      });
      return;
    }

    // 2️⃣ Checa o estado atual da permissão
    let permission = Notification.permission;

    switch (permission) {
      case "granted":
        console.log("[Notification Service] Permissão já concedida.");
        break;

      case "denied":
        toast({
          title: "Permissão negada",
          description:
            "Você negou notificações anteriormente. Habilite manualmente nas configurações do navegador.",
          variant: "destructive",
        });
        return;

      case "default":
        // Solicita permissão
        permission = await Notification.requestPermission();
        if (permission !== "granted") {
          toast({
            title: "Permissão não concedida",
            description: "Você precisa permitir notificações para continuar.",
            variant: "destructive",
          });
          return;
        }
        break;
    }

    // 3️⃣ Se chegou aqui, permissão está concedida
    const subscription = await getSubscription();
    const data = await sendSubscriptionToServer({
      id: userId,
      subscription,
      active: true,
    });

    console.log("Response do servidor:", data);

    toast({
      title: "Success!",
      description: "Notificação ativada",
      variant: "default",
    });

    setActive(true)

  } catch (error) {
    console.error("Erro ao ativar notificações:", error);
    toast({
      title: "Erro ao processar sua solicitação",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setVisible(false);
  }
}
// ----------------------
// Desativar notificações
// ----------------------
async function handleDisableNotifications() {
  try {
    if (!('Notification' in window)) {
      throw new Error("Notificações não suportadas neste navegador.");
    }

    // Não precisa solicitar permissão, só desativar
    const subscription = await getSubscription();

    const data = await sendSubscriptionToServer({
      id: userId,
      subscription,
      active: false,
    });

    console.log("Response do servidor (NO):", data);

    toast({
      title: "Success!",
      description: "Notificação desativada",
      variant: "destructive",
    });
  } catch (error) {
    console.error("Erro ao desativar notificações:", error);
    toast({
      title: "Erro ao processar sua solicitação.",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setVisible(false);
    location.reload();
  }
}


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
          onClick={() => handleEnableNotifications()}
        >
          Sim
        </button>
        <button
          className="px-4 py-2 font-semibold rounded-lg bg-gray-300 text-gray-900 hover:bg-gray-400 transition-colors"
          onClick={() => handleDisableNotifications()}
        >
          Não
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;
