
export async function registerWorker() {
    if ('serviceWorker' in navigator && 'Notification' in window) {
        try {
            // Registra o Service Worker
            const sw = await navigator.serviceWorker.register('sw.js');
            console.log('Service Worker registrado:', sw);

            // Recebe mensagens do SW e mostra toast
            navigator.serviceWorker.addEventListener('message', event => {
                showToastPush(event.data);
            });

        } catch (err) {
            console.error('Erro ao registrar Service Worker:', err);
        }
    }
}

export function showToastPush(payload) {
    // Tenta pegar o container
    let toastContainer = document.getElementById('toast-container');

    // Se não existir, cria e adiciona ao body
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        Object.assign(toastContainer.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        });
        document.body.appendChild(toastContainer);
    }

    // Cria o toast
    const toast = document.createElement('div');
    Object.assign(toast.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 15px',
        borderRadius: '8px',
        color: '#fff',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'transform 0.5s ease, opacity 0.5s ease',
        minWidth: '250px',
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        backgroundColor: payload.color || '#333'
    });

    // Ícone
    if (payload.icon) {
        const iconWrapper = document.createElement('div');
        Object.assign(iconWrapper.style, {
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: '0'
        });

        const icon = document.createElement('img');
        Object.assign(icon.style, {
            width: '48px',
            height: '48px',
            objectFit: 'contain'
        });
        icon.src = `../../${payload.icon}`;
        icon.alt = 'Ícone de QR';

        iconWrapper.appendChild(icon);
        toast.appendChild(iconWrapper);
    }

    // Container de texto
    const textContainer = document.createElement('div');
    Object.assign(textContainer.style, {
        display: 'flex',
        flexDirection: 'column',
        flex: '1'
    });

    // Título
    if (payload.title) {
        const title = document.createElement('span');
        Object.assign(title.style, {
            fontWeight: 'bold',
            fontSize: '16px',
            marginBottom: '2px'
        });
        title.innerText = payload.title;
        textContainer.appendChild(title);
    }

    // Subtítulo / corpo
    if (payload.body) {
        const body = document.createElement('span');
        Object.assign(body.style, {
            fontSize: '14px',
            opacity: '0.85'
        });
        body.innerText = payload.body;
        textContainer.appendChild(body);
    }

    toast.appendChild(textContainer);

    // Barra de progresso
    const progress = document.createElement('div');
    Object.assign(progress.style, {
        position: 'absolute',
        bottom: '0',
        left: '0',
        height: '3px',
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '0 0 8px 8px',
        width: '100%',
        transition: 'width 3s linear'
    });
    toast.appendChild(progress);

    // Adiciona ao container
    toastContainer.appendChild(toast);

    // Trigger animação de entrada
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
        progress.style.width = '0%';
    }, 100);

    // Remover toast após 3 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toastContainer.removeChild(toast), 500);
    }, 3000);
}

