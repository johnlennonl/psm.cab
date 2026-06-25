"use strict";

window.PSM_ADMIN_MODULES = window.PSM_ADMIN_MODULES || {};

window.PSM_ADMIN_MODULES.metricas = {
    render({ panel }) {
        return `
            <div class="admin-metric-grid">
                ${panel.items.map((item) => `
                    <article class="admin-metric admin-metric-${item.tone}">
                        <span>${item.label}</span>
                        <strong>${item.value}</strong>
                        <em>${item.trend}</em>
                    </article>
                `).join("")}
            </div>
        `;
    }
};