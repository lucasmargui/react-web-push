export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.warn('Notificações não são suportadas neste navegador.');
        return false;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Permissão de notificações negada.');
            return false;
        }
        return true;
    } catch (err) {
        console.error('Erro ao solicitar permissão de notificações:', err);
        return false;
    }
}