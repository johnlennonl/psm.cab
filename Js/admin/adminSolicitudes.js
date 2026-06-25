"use strict";

window.PSM_ADMIN_MODULES = window.PSM_ADMIN_MODULES || {};

window.PSM_ADMIN_MODULES.solicitudes = {
    render({ panel }) {
        return `
            <div class="admin-request-list">
                ${panel.requests.map((request) => `
                    <article class="admin-request-row admin-priority-${request.priority.toLowerCase()}">
                        <div>
                            <span>${request.time} | Prioridad ${request.priority}</span>
                            <strong>${request.name}</strong>
                            <p>${request.detail}</p>
                        </div>
                        <em>${request.badge}</em>
                        <div class="admin-row-actions">
                            <button type="button" data-admin-action="approve-request"><i class="fa-solid fa-check" aria-hidden="true"></i><span>Aprobar</span></button>
                            <button type="button" data-admin-action="review-request"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><span>Revisar</span></button>
                        </div>
                    </article>
                `).join("")}
            </div>
        `;
    }
};