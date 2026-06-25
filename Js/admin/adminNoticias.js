"use strict";

window.PSM_ADMIN_MODULES = window.PSM_ADMIN_MODULES || {};

window.PSM_ADMIN_MODULES.noticias = {
    render({ panel }) {
        return `
            <div class="admin-toolbar">
                <div>
                    <strong class="admin-toolbar-title">Centro de publicaciones</strong>
                    <span class="admin-toolbar-copy">Controla noticias visibles para estudiantes y profesores.</span>
                </div>
                <button class="admin-primary-action" type="button" data-admin-action="create-news">
                    <i class="fa-solid fa-plus" aria-hidden="true"></i>
                    <span>Crear noticia</span>
                </button>
            </div>
            <div class="admin-publication-list">
                ${panel.publications.map((item) => `
                    <article class="admin-publication-row">
                        <span><i class="fa-solid ${item.icon}" aria-hidden="true"></i></span>
                        <div>
                            <strong>${item.title}</strong>
                            <small>${item.audience} | ${item.date}</small>
                        </div>
                        <em>${item.status}</em>
                        <div class="admin-row-actions">
                            <button type="button" data-admin-action="edit-news"><i class="fa-solid fa-pen" aria-hidden="true"></i><span>Editar</span></button>
                            <button type="button" data-admin-action="publish-news"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i><span>Publicar</span></button>
                        </div>
                    </article>
                `).join("")}
            </div>
        `;
    }
};