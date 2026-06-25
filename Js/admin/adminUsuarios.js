"use strict";

window.PSM_ADMIN_MODULES = window.PSM_ADMIN_MODULES || {};

window.PSM_ADMIN_MODULES.usuarios = {
    render({ panel }) {
        return `
            <div class="admin-toolbar">
                <div class="admin-filter-group" aria-label="Filtros de usuarios">
                    ${panel.filters.map((filter, index) => `
                        <button class="admin-filter${index === 0 ? " is-active" : ""}" type="button">${filter}</button>
                    `).join("")}
                </div>
                <button class="admin-primary-action" type="button" data-admin-action="create-user">
                    <i class="fa-solid fa-user-plus" aria-hidden="true"></i>
                    <span>Nuevo usuario</span>
                </button>
            </div>
            <div class="admin-user-list">
                ${panel.users.map((user) => `
                    <article class="admin-user-row">
                        <div class="admin-user-main">
                            <span class="admin-avatar" aria-hidden="true">${user.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span>
                            <div>
                                <strong>${user.name}</strong>
                                <small>${user.document} | ${user.area}</small>
                            </div>
                        </div>
                        <div class="admin-user-meta">
                            <span>${user.role}</span>
                            <em class="admin-status admin-status-${user.status.toLowerCase()}">${user.status}</em>
                            <small>${user.access}</small>
                        </div>
                        <div class="admin-row-actions">
                            <button type="button" data-admin-action="view-user"><i class="fa-solid fa-eye" aria-hidden="true"></i><span>Ver ficha</span></button>
                            <button type="button" data-admin-action="toggle-user"><i class="fa-solid fa-user-shield" aria-hidden="true"></i><span>Permisos</span></button>
                        </div>
                    </article>
                `).join("")}
            </div>
        `;
    }
};