// calculator.js
import { sizeDefinitions, datesHours } from './data.js';

const buildResultRow = (label, date, total, hours) => `
    <div class="result-row">
        <div class="col-size">${label}</div>
        <div class="col-date">${date}</div>
        <div class="col-total">${total}</div>
        <div class="col-hours">${hours}</div>
    </div>`;

export function calc(resultsEl) {
    const today = new Date().getDay();
    let rows = '';

    sizeDefinitions.forEach(({ key, label, traySize }) => {
        const card = document.querySelector(`[data-size="${key}"]`);
        if (!card) return;

        const grouped = {};

        card.querySelectorAll('.entry').forEach((entry) => {
            const trays = parseInt(entry.querySelector(`[name="tray${key}"]`).value, 10) || 0;
            const dough = parseInt(entry.querySelector(`[name="dough${key}"]`).value, 10) || 0;
            const date = entry.querySelector(`[name="date${key}"]`).value;

            if (date === 'N/A') return;

            const total = trays * traySize + dough;
            grouped[date] = (grouped[date] || 0) + total;
        });

        Object.entries(grouped).forEach(([date, total]) => {
            const hours = datesHours[date]?.[today] || '--';
            rows += buildResultRow(label === 'PAN' ? label : `${label}\"`, date, total, hours);
        });
    });

    if (!rows) {
        resultsEl.innerHTML = '<div class="empty">— No data —</div>';
        return;
    }

    resultsEl.innerHTML = `
        <div class="result-header">
            <div>Size</div>
            <div>Date</div>
            <div style="text-align:right;">Qty</div>
            <div style="text-align:right;">Time</div>
        </div>
        ${rows}
    `;
}