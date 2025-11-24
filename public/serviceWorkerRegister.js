
export async function registerWorker(toast)  {
    
    if ('serviceWorker' in navigator) {
        try {
            const sw = await navigator.serviceWorker.register('sw.js');
            console.log('Service Worker registrado:', sw);

            // Recebe mensagens do SW e mostra toast
            navigator.serviceWorker.addEventListener('message', event => {

                console.log(event.data)
                toast({
                    title: event.data.title,
                    description: event.data.body,
                    variant: "push",
                });
            });

        } catch (err) {
            console.error('Erro ao registrar Service Worker:', err);
        }
    }
}


export function showToastPush(payload) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast-vehicle';
    
    // Aplica a cor de fundo baseada no payload
    toast.style.backgroundColor = payload.color || '#333'; // fallback para cinza escuro

    // Ícone
    const icon = document.createElement('img');
    icon.className = 'toast-icon';
    icon.src = `../../${payload.icon}`;
    icon.alt = 'Ícone de QR';
    toast.appendChild(icon);

    // Texto
    const text = document.createElement('span');
    text.className = 'toast-text';
    text.innerText = payload.body || '';
    toast.appendChild(text);

    // Barra de progresso
    const progress = document.createElement('div');
    progress.className = 'toast-progress';
    toast.appendChild(progress);

    toastContainer.appendChild(toast);

    // Animação de entrada
    setTimeout(() => toast.classList.add('show'), 100);

    // Remover toast após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toastContainer.removeChild(toast), 500);
    }, 3000);
}
