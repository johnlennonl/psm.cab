"use strict";

window.PSM_ADMIN_MODULES = window.PSM_ADMIN_MODULES || {};

window.PSM_ADMIN_MODULES.academico = {
    render({ panel }) {
        return `
            <div class="admin-card-grid">
                ${panel.items.map((item) => `
                    <article class="admin-academic-card">
                        <div>
                            <span>${item.meta}</span>
                            <strong>${item.title}</strong>
                            <p>${item.text}</p>
                        </div>
                        <div class="admin-progress" aria-label="Ocupacion ${item.progress}%">
                            <span style="--value: ${item.progress}%"></span>
                        </div>
                        <div class="admin-card-footer">
                            <em>${item.status}</em>
                            <button type="button" data-admin-action="manage-section">Gestionar</button>
                        </div>
                    </article>
                `).join("")}
            </div>
        `;
    }
};