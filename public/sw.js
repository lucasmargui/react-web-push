self.addEventListener('push', event => {
    console.log("SW: Evento push disparou!");

    event.waitUntil((async () => {

        // Apenas recebe os dados enviados, sem fallback
        let data = {};
        if (event.data) {
            const rawText = await event.data.text();
            try {
                data = JSON.parse(rawText);
            } catch (e) {
                data.body = rawText; // caso não seja JSON, usa apenas o texto
            }
        } else {
            // Se não houver dados, não exibe notificação
            console.warn('SW: Push sem dados recebidos.');
            return;
        }

        // Mostra a notificação
        await self.registration.showNotification(data.title, {
            body: data.body,
            data: data.url,
            icon: data.icon,
            image: data.image,
            tag: data.tag,
            url: data.url,

            // ➕ BOTÃO NO CANTO INFERIOR DIREITO
            actions: [
                {
                    action: "open_url",
                    title: "Abrir",
                }
            ]
        });

        // Envia mensagem para todas as janelas abertas
        const clientsList = await self.clients.matchAll({
            includeUncontrolled: true,
            type: 'window'
        });

        for (const client of clientsList) {
            client.postMessage({
                type: "PUSH_RECEIVED",
                ...data
            });
        }

    })());
});

self.addEventListener('notificationclick', event => {
    event.notification.close();

    // Recupera a URL enviada no payload
    const url = event.notification.data?.url;

    // Se clicou no botão (action)
    if (event.action === "open_url") {
        event.waitUntil(clients.openWindow(url));
        return;
    }

    // Se clicou no corpo da notificação
    event.waitUntil(clients.openWindow(url));
});
