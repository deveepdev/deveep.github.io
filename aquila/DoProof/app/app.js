import "./js/main.js";

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            await navigator.serviceWorker.register('./sw.js');
            console.log('Service worker registered');
        } catch (err) {
            console.warn('Service worker registration failed:', err);
        }
    });
}
