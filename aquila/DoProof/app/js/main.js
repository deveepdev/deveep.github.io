// main.js
import {
    createRow,
    createEntry,
    applyViewportHeight,
    setupSideMenu,
    setupHoldControls,
    setupHeaderScroll
} from './ui.js';

import { calc } from './calculator.js';
import { saveData, loadData, clearData, initializeDefaultRows } from './storage.js';
import { setupThemeSwitcher } from './theme.js';
import { sizeDefinitions } from './data.js';

import { auth } from './firebase.js';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const inputsDiv = document.getElementById('inputs');
const results = document.getElementById('results');
const loadBtn = document.getElementById('loadBtn');
const clearBtn = document.getElementById('clearBtn');
const form = document.getElementById('form');

// auth UI
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const authBtn = document.getElementById("authBtn");
const authModalBackdrop = document.getElementById('authModalBackdrop');
const status = document.getElementById("status");
const hideLoadingOverlay = () => {
    const overlay = document.getElementById('loadingOverlay');
    if (!overlay) return;

    const removeOverlay = () => {
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    };

    const scheduleRemoval = () => {
        requestAnimationFrame(() => requestAnimationFrame(removeOverlay));
    };

    if (document.readyState === 'complete') {
        scheduleRemoval();
    } else {
        window.addEventListener('load', scheduleRemoval, { once: true });
    }
};
function renderCards() {
    inputsDiv.innerHTML = sizeDefinitions.map(({ key, label }) => {
        const title = label === 'PAN' ? label : `${label}\"`;
        return createRow(title, key);
    }).join('');
}

// 🔒 ALWAYS use this instead of calc()
function runCalcIfLoggedIn() {
    const user = auth.currentUser;

    if (user) {
    // if (!user) { // <-- use this line instead to disable calc without login, but keep UI enabled
        results.innerHTML = '<div class="empty">🔒 Log in to use calculator</div>';
        return;
    }

    calc(results);
}

// 🔒 disable UI if not logged in
function setAppEnabled(enabled) {
    // document.querySelectorAll('input, button').forEach(el => {
    //     if (!el.closest('#authSection')) {
    //         el.disabled = !enabled;
    //     }
    // });
}

function closeAuthPopup() {
    authModalBackdrop?.classList.remove('open');
    authModalBackdrop?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

function getUserDisplayName(user) {
    return user?.displayName || user?.email || 'Account';
}

function updateAuthButton(user) {
    if (!authBtn) return;

    if (user) {
        authBtn.innerText = getUserDisplayName(user);
        authBtn.disabled = true;
        authBtn.classList.add('logged-in');
    } else {
        authBtn.innerText = 'Login / Signup';
        authBtn.disabled = false;
        authBtn.classList.remove('logged-in');
    }
}

function addRowListeners(event) {
    const target = event.target;

    if (target.classList.contains('addRowBtn')) {
        const card = target.closest('.card');
        const key = card?.dataset.size;
        const rows = card?.querySelector('.rows');

        if (!rows || !key) return;

        rows.style.maxHeight = `${rows.scrollHeight}px`;
        rows.insertAdjacentHTML('beforeend', createEntry(key));
        rows.offsetHeight;
        rows.style.maxHeight = `${rows.scrollHeight}px`;

        saveData();
        runCalcIfLoggedIn();
        return;
    }

    if (target.classList.contains('removeRow')) {
        const entry = target.closest('.entry');
        const rows = entry?.parentElement;
        if (!entry || !rows) return;

        rows.style.maxHeight = `${rows.scrollHeight}px`;
        entry.remove();
        rows.offsetHeight;
        rows.style.maxHeight = `${rows.scrollHeight}px`;

        saveData();
        runCalcIfLoggedIn();
        return;
    }

    if (target.dataset.action) {
        const input = target.parentElement.querySelector('input');
        if (!input) return;

        let value = parseInt(input.value, 10) || 0;
        value = target.dataset.action === 'inc'
            ? value + 1
            : Math.max(0, value - 1);

        input.value = value;

        saveData();
        runCalcIfLoggedIn();
    }
}

function setupAuth() {
    signupBtn?.addEventListener("click", async () => {
        try {
            await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
        } catch (e) {
            status.innerText = e.message;
        }
    });

    loginBtn?.addEventListener("click", async () => {
        try {
            await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
        } catch (e) {
            status.innerText = e.message;
        }
    });

    logoutBtn?.addEventListener("click", async () => {
        await signOut(auth);
    });
}

function init(user) {
    applyViewportHeight();
    setupSideMenu();
    setupHoldControls();
    setupHeaderScroll();
    setupThemeSwitcher();

    renderCards();
    initializeDefaultRows();
    setupAuth();

    setAppEnabled(!!user);
    updateAuthButton(user);

    if (user) {
        status.innerText = "Logged in as: " + getUserDisplayName(user);
    } else {
        status.innerText = "Not logged in";
    }

    loadBtn?.addEventListener('click', () => {
        loadData();
        runCalcIfLoggedIn();
    });

    clearBtn?.addEventListener('click', () => {
        clearData();
        runCalcIfLoggedIn();
    });

    form?.addEventListener('input', () => {
        saveData();
        runCalcIfLoggedIn();
    });

    document.addEventListener('click', addRowListeners);
    hideLoadingOverlay();

    runCalcIfLoggedIn();
}

let appInitialized = false;

onAuthStateChanged(auth, (user) => {
    // Run init ONLY ONCE
    if (!appInitialized) {
        init();
        appInitialized = true;
    }

    // Always update UI based on auth
    setAppEnabled(!!user);
    updateAuthButton(user);

    if (user) {
        closeAuthPopup();
        status.innerText = "Logged in as: " + getUserDisplayName(user);
    } else {
        status.innerText = "Not logged in";
    }

    runCalcIfLoggedIn();
});