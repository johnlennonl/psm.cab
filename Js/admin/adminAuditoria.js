"use strict";

window.PSM_ADMIN_MODULES = window.PSM_ADMIN_MODULES || {};

window.PSM_ADMIN_MODULES.auditoria = {
    render({ panel }) {
        return `
            <div class="admin-audit-list">
                ${panel.items.map((item) => `
                    <article class="admin-audit-row">
                        <span><i class="fa-solid ${item.icon}" aria-hidden="true"></i></span>
                        <div>
                            <strong>${item.title}</strong>
                            <p>${item.text}</p>
                            <small>${item.time}</small>
                        </div>
                    </article>
                `).join("")}
            </div>
        `;
    }
};