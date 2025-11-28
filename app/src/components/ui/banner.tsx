import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import  checkBrowser from "@/utils/browserInfo"


const PUBLIC_VAPID_KEY = "BNyR2VIokuew2M6DO_rVgVdJmqJwiG69i4jzMiLOtw-Eyf3UGuJLONEgdycUB6lwksnfS9dl4zgkvnpcOO4X4WA";

const safari_web_push_url = "xxxxxxxxxxxxxxxx"
const safari_web_push_id = "xxxxxxxxxxxxxxxxx"

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
  // Estado para controlar se o SW está pronto
  const [swReady, setSwReady] = useState(false);


  const userId = 'user-1';



// ------------------------------------------------------
// Types
// ------------------------------------------------------
type PermissionState = "default" | "denied" | "granted";

interface ServerResponse {
  showBanner?: boolean;
  success?: boolean;
  [key: string]: any;
}

// ------------------------------------------------------
// Helpers
// ------------------------------------------------------
const isSafariBrowser = () => {
  const isSafari = checkBrowser() === "safari";
  const supportsSafariPush = typeof window.safari?.pushNotification !== "undefined";
  return isSafari && supportsSafariPush;
};

const safeJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

// ------------------------------------------------------
// Safari Subscription / Permission
// ------------------------------------------------------
async function getSafariSubscription() {
  return window.safari.pushNotification.permission(safari_web_push_id);
}

async function getSafariPermission(): Promise<PermissionState> {
  const sub = await getSafariSubscription();
  return sub.permission;
}

// ------------------------------------------------------
// Generic Browser Subscription / Permission
// ------------------------------------------------------
async function getSubscription() {
  try {

    if (Notification.permission === "default") {
        return null;
    }



    const registration = await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();


    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });
    }

    return subscription;
  } catch (error) {
    console.error("[getSubscription] Error:", error);
    // Mostra toast caso não seja possível obter a subscription

    return null;
  }
}

function getPermission(): PermissionState {
  return Notification.permission;
}

// ------------------------------------------------------
// Extract endpoint (Safari não tem endpoint)
// ------------------------------------------------------
function extractEndpoint(subscription: any): string | null {
  if (!subscription) return null;
  if ("permission" in subscription) return null; // Safari
  return subscription.endpoint ?? null;
}

// ------------------------------------------------------
// API Requests
// ------------------------------------------------------
async function apiPOST(url: string, body: object): Promise<ServerResponse> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await safeJson(response);

    if (!response.ok) {
      throw new Error(data?.error || `HTTP ${response.status}`);
    }

    return data || {};
  } catch (error) {
    console.error(`[API ERROR] ${url}:`, error);
    throw error;
  }
}



const checkShowBanner = (id: string, subscription: any) => {
  const endpoint = extractEndpoint(subscription);
  return apiPOST("http://localhost:7000/subscriptions/showBanner", {
    id,
    endpoint,
  });
};


// ------------------------------------------------------
// Enable Notifications
// ------------------------------------------------------
async function handleEnableNotifications() {
  try {
    if (!("Notification" in window)) {
      toast({
        title: "Erro",
        description: "Este navegador não suporta notificações.",
        variant: "destructive",
      });
      return;
    }

    const safari = isSafariBrowser();
    const permission: PermissionState = safari
      ? await getSafariPermission()
      : getPermission();

    // ---- Permission Handling ----
    if (permission === "denied") {
      toast({
        title: "Permissão negada",
        description:
          "Notificação aceita, mas seu navegador bloqueou alertas. Ative as notificações nas configurações do navegador para receber atualizações.",
        variant: "destructive",
      });
      return;
    }

    if (permission === "default") {
      if (safari) {
        await new Promise((resolve) => {
          window.safari.pushNotification.requestPermission(
            safari_web_push_url,
            safari_web_push_id,
            {},
            resolve
          );
        });
      } else {
        await Notification.requestPermission();
      }
    }

    // ---- Get final subscription ----
    const subscription = safari
      ? await getSafariSubscription()
      : await getSubscription();

 

    const data = await apiPOST("http://localhost:7000/subscriptions/save",{
      id: userId,
      subscription,
      active: true,
    });

    console.log("Server Response:", data);

    toast({
      title: "Notificações ativadas",
      description: "Tudo certo! Você receberá alertas.",
    });

    setActive(true);
  } catch (error: any) {
    console.error("Enable error:", error);
    toast({
      title: "Erro ao ativar notificações",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setVisible(false);
  }
}

// ------------------------------------------------------
// Disable Notifications
// ------------------------------------------------------
async function handleDisableNotifications() {
  try {
    if (!("Notification" in window)) {
      throw new Error("Notificações não são suportadas neste navegador.");
    }

    const safari = isSafariBrowser();
    const subscription = safari
      ? await getSafariSubscription()
      : await getSubscription();

    const data = await apiPOST("http://localhost:7000/subscriptions/save",{
      id: userId,
      subscription,
      active: false,
    });

    console.log("Disable response:", data);

    toast({
      title: "Notificações desativadas",
      description: "Você não receberá mais alertas.",
      variant: "destructive",
    });
  } catch (error: any) {
    toast({
      title: "Erro ao desativar notificações",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setVisible(false);

  }
}

// ------------------------------------------------------
// Browser Subscription
// ------------------------------------------------------

const getBrowserSubscription = async () => {
  try {
    return isSafariBrowser()
      ? await getSafariSubscription()
      : await getSubscription();
  } catch (err) {
    console.error("[Subscription] Error:", err);
    return null;
  }
};




// ------------------------------------------------------
// React Effect (Banner)
// ------------------------------------------------------
useEffect(() => {
  if (!userId) return;

  let timeoutId: any;

  const init = async () => {
    try {
     
      const subscription = await getBrowserSubscription();

      const result = await checkShowBanner(userId, subscription);

      if (result?.showBanner) {
        timeoutId = setTimeout(() => setVisible(true), 500);
      }

    } catch (error) {
      toast({
        title: "Erro ao verificar banner",
        description: String(error),
        variant: "destructive",
      });
    }
  };
  const checkServiceWorkerReady = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration) {
        setSwReady(true); // SW pronto
      }
    } catch (error) {
      setSwReady(false);
       toast({
        title: "Notificação",
        description: `Service Worker não está pronto ou não é suportado.${error} `,
        variant: "destructive",
      });
      console.error("Service Worker não está pronto ou não é suportado.", error);
    }
  };

  
  if(!swReady){

    checkServiceWorkerReady()
  }

  if(swReady){
  
     init();
  }

  return () => clearTimeout(timeoutId);
}, [userId, swReady]);



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
