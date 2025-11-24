import { useState, useEffect } from "react";

// Função auxiliar para converter VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

const NotificationBanner = ({ id }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleYes = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const publicVapidKey =
        "BNyR2VIokuew2M6DO_rVgVdJmqJwiG69i4jzMiLOtw-Eyf3UGuJLONEgdycUB6lwksnfS9dl4zgkvnpcOO4X4WA";

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });
      }

      const response = await fetch("http://localhost:7001/subscriptions/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, subscription }),
      });
      const data = await response.json();

      console.log("Response do servidor:", data);


      alert("Resposta do servidor:\n" + JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Erro ao enviar ID:", error);
      alert("Erro ao enviar ID.");
    } finally {
      setVisible(false);
      // Caso queira recarregar a página:
      // location.reload();
      // Caso tenha botão de adicionar ID, manipule aqui
      // addIdButton.style.display = 'inline-block';
    }
  };

  const handleNo = () => {
    setVisible(false);
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
