export default  function checkBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();
    let isMobile = userAgent.indexOf("mobile") >= 0;

    // FB WebView e Android WebView
    if (userAgent.indexOf('fb_iab') >= 0 || userAgent.indexOf('; wv') >= 0) {
        return false;
    }

    // CHROME
    if (
        userAgent.indexOf('chrome') >= 0 &&
        userAgent.indexOf('opr/') < 0 &&
        userAgent.indexOf('ucbrowser/') < 0 &&
        userAgent.indexOf('edge/') < 0 &&
        userAgent.indexOf('yabrowser/') < 0 &&
        userAgent.indexOf('edg/') < 0
    ) {
        const match = userAgent.match(/chrom(e|ium)\/([0-9]+)\./);
        const version = match ? parseInt(match[2], 10) : false;

        return version && version >= 42 ? "chrome" : false;
    }

    // FIREFOX
    if (userAgent.indexOf('firefox') >= 0) {
        const match = userAgent.match(/firefox\/([0-9]+)\./);
        const version = match ? parseInt(match[1], 10) : false;

        if (!version) return false;

        if (version >= 44 && !isMobile) return "firefox";
        if (version >= 48 && isMobile) return "firefox";

        return false;
    }

    // OPERA
    if (userAgent.indexOf('opr/') >= 0) {
        const match = userAgent.match(/opr\/([0-9]+)\./);
        const version = match ? parseInt(match[1], 10) : false;

        if (!version) return false;

        if (version >= 42 && !isMobile) return "opera";
        if (version >= 37 && isMobile) return "opera";

        return false;
    }

    // UCBROWSER
    if (userAgent.indexOf('ucbrowser/') >= 0) {
        const match = userAgent.match(/ucbrowser\/([0-9]+)\./);
        const version = match ? parseInt(match[1], 10) : false;

        if (version && version >= 12 && isMobile) {
            return "ucbrowser";
        }
        return false;
    }

    // EDGE (Chromium)
    if (userAgent.indexOf('edg/') >= 0) {
        const match = userAgent.match(/edg\/([0-9]+)\./);
        const version = match ? parseInt(match[1], 10) : false;

        return version && version >= 79 ? "edge" : false;
    }

    // EDGE Legacy
    if (userAgent.indexOf('edge/') >= 0) {
        const match = userAgent.match(/edge\/([0-9\.]+)/);
        const version = match ? parseFloat(match[1]) : false;

        return version && version >= 17.17134 ? "edge" : false;
    }

    // YANDEX
    if (userAgent.indexOf('yabrowser') >= 0) {
        return "yandexbrowser";
    }

    // SAFARI
    if (userAgent.indexOf('safari') >= 0) {
        // Safari moderno com Service Workers
        if ("PushManager" in window && "serviceWorker" in navigator) {
            const standalone = 'standalone' in window.navigator && (window.navigator as any).standalone;
            if (!isMobile || (isMobile && standalone)) {
                return "safarin"; // como estava no seu código
            }
            return false;
        }

        // Safari antigo (macOS)
        if (!isMobile && (window as any).safari && 'pushNotification' in (window as any).safari) {
            return "safari";
        }

        return false;
    }

    return false;
}
