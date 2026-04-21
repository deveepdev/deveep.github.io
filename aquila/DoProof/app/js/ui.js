export function createRow(label, key) {
    return `
    <div class="card" data-size="${key}">
        <h2>${label}</h2>

        <div class="rows"></div>

        <button type="button" class="addRowBtn">+ Add Row</button>
    </div>`;
}

export function createEntry(key) {
    return `
    <div class="grid entry">

        <label>Trays</label>
        <div class="number-control">
            <button type="button" data-action="dec">-</button>
            <input type="number" name="tray${key}" min="0">
            <button type="button" data-action="inc">+</button>
        </div>

        <label>Dough</label>
        <div class="number-control">
            <button type="button" data-action="dec">-</button>
            <input type="number" name="dough${key}" min="0">
            <button type="button" data-action="inc">+</button>
        </div>

        <label>Date</label>
        <select name="date${key}">
            <option value="N/A">Select</option>
            <option value="Lun-Sam">Lun-Sam</option>
            <option value="Mar-Dim">Mar-Dim</option>
            <option value="Mer-Lun">Mer-Lun</option>
            <option value="Jeu-Mar">Jeu-Mar</option>
            <option value="Ven-Mer">Ven-Mer</option>
            <option value="Sam-Jeu">Sam-Jeu</option>
            <option value="Dim-Ven">Dim-Ven</option>
        </select>

        <button type="button" class="removeRow">✕</button>

    </div>`;
}

export function applyViewportHeight() {
    const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);
}

export function setupSideMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenuBtn = document.getElementById('closeMenuBtn');

    const toggleSideMenu = () => {
        if (!sideMenu || !menuOverlay) return;

        const isOpen = sideMenu.classList.toggle('open');
        menuOverlay.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuBtn?.addEventListener('click', toggleSideMenu);
    closeMenuBtn?.addEventListener('click', toggleSideMenu);
    menuOverlay?.addEventListener('click', toggleSideMenu);
    menuOverlay?.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleSideMenu();
    });
}

export function setupHoldControls() {
    let holdTimeout;
    let holdInterval;
    let speed = 120;
    let currentTarget = null;

    const startHold = (target) => {
        if (!target?.dataset?.action) return;

        currentTarget = target;
        speed = 120;

        holdTimeout = setTimeout(() => {
            holdInterval = setInterval(() => {
                currentTarget.click();

                if (speed > 30) {
                    speed -= 10;
                    clearInterval(holdInterval);
                    holdInterval = setInterval(() => {
                        currentTarget.click();
                    }, speed);
                }
            }, speed);
        }, 300);
    };

    const stopHold = () => {
        clearTimeout(holdTimeout);
        clearInterval(holdInterval);
        currentTarget = null;
    };

    document.addEventListener('mousedown', (e) => startHold(e.target));
    document.addEventListener('mouseup', stopHold);
    document.addEventListener('mouseleave', stopHold);

    document.addEventListener('touchstart', (e) => {
        startHold(e.target);
    }, { passive: true });

    document.addEventListener('touchend', stopHold);
    document.addEventListener('touchcancel', stopHold);
}

export function setupHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    let scrollTicking = false;
    const scrollTolerance = 12;

    const handleHeaderScroll = () => {
        const currentScroll = window.scrollY;
        const delta = currentScroll - lastScrollY;

        if (!header) {
            scrollTicking = false;
            return;
        }

        if (Math.abs(delta) < scrollTolerance) {
            scrollTicking = false;
            return;
        }

        if (currentScroll <= 24 || delta < 0) {
            header.classList.remove('hidden');
        } else if (delta > 0) {
            header.classList.add('hidden');
        }

        lastScrollY = currentScroll;
        scrollTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(handleHeaderScroll);
            scrollTicking = true;
        }
    });
}
