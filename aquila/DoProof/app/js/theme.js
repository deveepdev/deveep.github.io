const schemes = {
    classic: {
        '--background': '#0f172a',
        '--primary': '#1e293b',
        '--secondary': '#334155',
        '--accent': '#3d7d54',
        '--border': 'rgba(255, 255, 255, 0.08)',
        '--red': '#f94f16',
        '--text': '#e2e8f0'
    },
    dark: {
        '--background': '#0a0a0a',
        '--primary': '#171717',
        '--secondary': '#262626',
        '--accent': '#41235e',
        '--border': 'rgba(255, 255, 255, 0.06)',
        '--red': '#ef4444',
        '--text': '#f5f5f5'
    },
    light: {
        '--background': '#fcfff8',
        '--primary': '#a9d178',
        '--secondary': '#bdd1a4',
        '--accent': '#92CC49',
        '--border': 'rgba(0, 0, 0, 0.08)',
        '--red': '#fb7185',
        '--text': '#0f172a'
    },
    civic: {
        '--background': '#050607',
        '--primary': '#1a1d20',
        '--secondary': '#2c3136',
        '--accent': '#6b7280',
        '--border': 'rgba(255, 255, 255, 0.06)',
        '--red': '#ff3b3b',
        '--text': '#f1f5f9'
    }
};

const schemeNames = Object.keys(schemes);
let deferredPrompt = null;
let animationId = null;
let isCivicActive = false;
let civicX = -200;

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt event fired', e);
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.style.display = 'block';
    }
});

window.addEventListener('appinstalled', () => {
    console.log('PWA installed');
    deferredPrompt = null;
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.style.display = 'none';
    }
});

export const applyScheme = (name) => {
    const root = document.documentElement;
    const colors = schemes[name];

    Object.entries(colors).forEach(([prop, value]) => {
        root.style.setProperty(prop, value);
    });

    localStorage.setItem('selected-theme', name);
    document.body.classList.toggle('civic-active', name === 'civic');

    const headerTitle = document.querySelector('.header h1');
    const headerImage = document.querySelector('.header img');

    if (name === 'civic') {
        isCivicActive = true;
        if (headerTitle) headerTitle.textContent = 'Honda Civic Proofing';
        if (headerImage) headerImage.src = './src/honda.png';
        if (!animationId) civicLoop();
    } else {
        isCivicActive = false;
        if (headerTitle) headerTitle.innerHTML = "<b><span style='color: #92CC49;'>Do</span></b>Proof";
        if (headerImage) headerImage.src = './src/DoProof_logo logo - transparent.png';
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
};

const civicLoop = () => {
    if (!isCivicActive) return;

    const wrapper = document.querySelector('.civic-wrapper');
    const rims = document.querySelectorAll('.rim');

    if (wrapper) wrapper.style.transform = `translate(${civicX}%, -100%)`;

    const rotation = civicX * 8;
    rims.forEach((rim) => {
        rim.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    });

    civicX += 0.2;
    if (civicX > 150) civicX = -200;
    animationId = requestAnimationFrame(civicLoop);
};

export function setupThemeSwitcher() {
    const button = document.querySelector('.color-scheme-button');
    const installBtn = document.getElementById('installBtn');

    const savedTheme = localStorage.getItem('selected-theme');
    const initialTheme = schemeNames.includes(savedTheme) ? savedTheme : 'classic';
    let currentIndex = schemeNames.indexOf(initialTheme);

    applyScheme(initialTheme);
    if (button) {
        button.textContent = `Color Scheme: ${initialTheme.charAt(0).toUpperCase() + initialTheme.slice(1)}`;
        button.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % schemeNames.length;
            const nextTheme = schemeNames[currentIndex];
            applyScheme(nextTheme);
            button.textContent = `Color Scheme: ${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)}`;
        });
    }

    if (installBtn) {
        installBtn.style.display = deferredPrompt ? 'block' : 'none';

        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) {
                alert('Install not available');
                return;
            }

            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        });
    }
}
