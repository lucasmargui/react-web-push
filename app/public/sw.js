self.addEventListener('push', event => {
    event.waitUntil((async () => {
        let data = {};

        if (event.data) {
            try {
                // Tenta ler como JSON
                data = event.data.json();
            } catch (e) {
                // Se não for JSON, usa apenas o texto como body
                const rawText = await event.data.text();
                data.body = rawText;
            }
        } else {
            console.warn('SW: Push sem dados recebidos.');
            return;
        }

        // Mostra a notificação
        await self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            image: data.image,
            tag: data.tag,
            data: { url: data.url || 'http://localhost:8080/' }, // fallback seguro
            actions: [
                { action: "open_url", title: "Abrir" }
            ]
        });

        // Envia mensagem para todas as janelas abertas
        const clientsList = await self.clients.matchAll({
            includeUncontrolled: true,
            type: 'window'
        });

        for (const client of clientsList) {
            client.postMessage({ type: "PUSH_RECEIVED", ...data });
        }
    })());
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const url = (event.notification.data && event.notification.data.url) || 'http://localhost:8080/';

    event.waitUntil((async () => {
        const allClients = await clients.matchAll({
            type: "window",
            includeUncontrolled: true
        });

        for (const client of allClients) {
            if (client.url === url && 'focus' in client) {
                return client.focus();
            }
        }

        if (clients.openWindow) {
            return clients.openWindow(url);
        }
    })());
});
