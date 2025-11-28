

export function checkBrowser() {
        var userAgent = navigator.userAgent.toLocaleLowerCase();
        let isMobile;
        
        if (userAgent.indexOf('mobile') < 0) {
            isMobile = !1
        } 

        if (userAgent.indexOf('fb_iab') >= 0 || userAgent.indexOf('; wv') >= 0) {
            return !1
        } else if (userAgent.indexOf('chrome') >= 0 && userAgent.indexOf('opr\/') < 0 && userAgent.indexOf('ucbrowser\/') < 0 && userAgent.indexOf('edge\/') < 0 && userAgent.indexOf('yabrowser\/') < 0 && userAgent.indexOf('edg\/') < 0) {
            var version = userAgent.match(/chrom(e|ium)\/([0-9]+)\./);
            version = version ? parseInt(version[2], 10) : !1;
            if (version && version >= 42) {
                return "chrome"
            } else {
                return !1
            }
        } else if (userAgent.indexOf('firefox') >= 0) {
            var version = userAgent.match(/firefox\/([0-9]+)\./);
            version = version ? parseInt(version[1], 10) : !1;
            if (version && version >= 44 && !isMobile) {
                return "firefox"
            } else if (version && version >= 48 && isMobile) {
                return "firefox"
            } else {
                return !1
            }
        } else if (userAgent.indexOf('opr\/') >= 0) {
            var version = userAgent.match(/opr\/([0-9]+)\./);
            version = version ? parseInt(version[1], 10) : !1;
            if (version && version >= 42 && !isMobile) {
                return "opera"
            } else if (version && version >= 37 && isMobile) {
                return "opera"
            } else {
                return !1
            }
        } else if (userAgent.indexOf('ucbrowser\/') >= 0) {
            var version = userAgent.match(/ucbrowser\/([0-9]+)\./);
            version = version ? parseInt(version[1], 10) : !1;
            if (version && version >= 12 && isMobile) {
                return "ucbrowser"
            } else {
                return !1
            }
        } else if (userAgent.indexOf('edg\/') >= 0) {
            var version = userAgent.match(/edg\/([0-9]+)\./);
            version = version ? parseInt(version[1], 10) : !1;
            if (version && version >= 79) {
                return "edge"
            } else {
                return !1
            }
        } else if (userAgent.indexOf('edge\/') >= 0) {
            var version = userAgent.match(/edge\/([0-9\.]+)/);
            version = parseFloat(version[1]);
            if (version && version >= 17.17134) {
                return "edge"
            } else {
                return !1
            }
        } else if (userAgent.indexOf('yabrowser') >= 0) {
            return 'yandexbrowser'
        } else if (userAgent.indexOf('safari') >= 0) {
            if ('PushManager' in window && 'serviceWorker' in navigator) {
                var standalone = "standalone" in window.navigator && window.navigator.standalone;
                if (!isMobile || (isMobile && standalone)) {
                    return "safarin"
                } else {
                    return !1
                }
            } else if (!isMobile && 'pushNotification' in window.safari) {

                return "safari"
            } else {
                return !1
            }
        }
        return !1
    }

export async function registerWorker(toast) {

    try {
       
        const browser = checkBrowser();

        // Safari antigo (somente Safari Desktop com Push Notification Legacy)
        const isLegacySafari =
        browser === "safari" &&
        typeof window.safari?.pushNotification !== "undefined";

        // Navegadores suportados:
        // - Qualquer navegador com Service Worker
        // - Safari Legacy (sem Service Worker, mas com push próprio)
        const supportsBrowser =
        (browser !== "safari" && "serviceWorker" in navigator) ||
        isLegacySafari;

        if (!supportsBrowser) {
        toast({
            title: "Navegador não suportado",
            description:
            "Este navegador não possui suporte para notificações push. Tente utilizar Chrome, Firefox, Edge ou Safari atualizado.",
            variant: "destructive",
        });

        return;
        }
  
        const sw = await navigator.serviceWorker.register('sw.js');
        console.log('Service Worker registrado:', sw);

        // Recebe mensagens do SW e mostra toast
        navigator.serviceWorker.addEventListener('message', event => {
            console.log(event.data)
            showToastPush(event.data);
        });

    } catch (err) {
        console.error('Erro ao registrar Service Worker:', err);
    }
    
}

export function showToastPush(payload) {
    // -----------------------------
    // Criação do container principal
    // -----------------------------
    let toastContainer = document.getElementById('toast-container');
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
            gap: '12px',
            pointerEvents: 'none', // Para permitir clicar através dos toasts
        });
        document.body.appendChild(toastContainer);
    }

    // -----------------------------
    // Criação do toast
    // -----------------------------
    const toast = document.createElement('div');
    Object.assign(toast.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        borderRadius: '12px',
        fontFamily: "'Inter', sans-serif",
        fontSize: '14px',
        color: '#fff',
        background: payload.color || 'linear-gradient(135deg, #667eea, #764ba2)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        transform: 'translateX(120%)',
        opacity: '0',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        minWidth: '280px',
        maxWidth: '350px',
        position: 'relative',
        pointerEvents: 'auto', // Permite interações no toast
        overflow: 'hidden'
    });

    // -----------------------------
    // Ícone do toast
    // -----------------------------
    if (payload.icon) {
        const iconWrapper = document.createElement('div');
        Object.assign(iconWrapper.style, {
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: '0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        });

        const icon = document.createElement('img');
        Object.assign(icon.style, {
            width: '32px',
            height: '32px',
            objectFit: 'contain',
        });
        icon.src = `../../${payload.icon}`;
        icon.alt = 'Ícone';

        iconWrapper.appendChild(icon);
        toast.appendChild(iconWrapper);
    }

    // -----------------------------
    // Container de texto
    // -----------------------------
    const textContainer = document.createElement('div');
    Object.assign(textContainer.style, {
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
        gap: '2px'
    });

    if (payload.title) {
        const title = document.createElement('span');
        Object.assign(title.style, {
            fontWeight: '600',
            fontSize: '16px',
            lineHeight: '1.2'
        });
        title.innerText = payload.title;
        textContainer.appendChild(title);
    }

    if (payload.body) {
        const body = document.createElement('span');
        Object.assign(body.style, {
            fontSize: '14px',
            opacity: '0.85',
            lineHeight: '1.3'
        });
        body.innerText = payload.body;
        textContainer.appendChild(body);
    }

    toast.appendChild(textContainer);

    // -----------------------------
    // Barra de progresso animada
    // -----------------------------
    const progress = document.createElement('div');
    Object.assign(progress.style, {
        position: 'absolute',
        bottom: '0',
        left: '0',
        height: '4px',
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '0 0 12px 12px',
        width: '100%',
        transition: 'width 3s linear'
    });
    toast.appendChild(progress);

    // -----------------------------
    // Adiciona toast ao container
    // -----------------------------
    toastContainer.appendChild(toast);

    // Trigger animação de entrada
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
        progress.style.width = '0%';
    }, 50);

    // -----------------------------
    // Remove toast após 3 segundos
    // -----------------------------
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        toast.style.opacity = '0';
        setTimeout(() => toastContainer.removeChild(toast), 500);
    }, 3000);
}



