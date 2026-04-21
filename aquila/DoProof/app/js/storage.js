import { createEntry } from './ui.js';

export function saveData() {
    const data = [];

    document.querySelectorAll('.entry').forEach((entry) => {
        const row = {};
        entry.querySelectorAll('input, select').forEach((input) => {
            row[input.name] = input.value;
        });
        data.push(row);
    });

    localStorage.setItem('doughData', JSON.stringify(data));
}

export function loadData() {
    const data = JSON.parse(localStorage.getItem('doughData') || '[]');
    if (!data.length) return false;

    document.querySelectorAll('.rows').forEach((rows) => {
        rows.innerHTML = '';
    });

    data.forEach((row) => {
        const key = Object.keys(row)[0].replace(/[^\dA-Za-z]/g, '').replace('tray', '');
        const card = document.querySelector(`[data-size="${key}"]`);
        if (!card) return;

        const rowsDiv = card.querySelector('.rows');
        rowsDiv.insertAdjacentHTML('beforeend', createEntry(key));
        const newEntry = rowsDiv.lastElementChild;

        Object.entries(row).forEach(([name, value]) => {
            const input = newEntry.querySelector(`[name="${name}"]`);
            if (input) input.value = value;
        });
    });

    return true;
}

export function clearData() {
    document.querySelectorAll('.rows').forEach((rows) => {
        const key = rows.closest('.card')?.dataset.size;
        rows.innerHTML = key ? createEntry(key) : '';
    });
}

export function initializeDefaultRows() {
    document.querySelectorAll('.card').forEach((card) => {
        const key = card.dataset.size;
        const rows = card.querySelector('.rows');
        if (rows) rows.innerHTML = createEntry(key);
    });
}
