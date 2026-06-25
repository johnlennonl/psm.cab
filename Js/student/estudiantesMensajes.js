"use strict";

window.PSM_STUDENT_MODULES = window.PSM_STUDENT_MODULES || {};

window.PSM_STUDENT_MODULES.mensajes = (() => {
    let selectedMessageIndex = 0;

    function getMessages(dashboardData) {
        return Array.isArray(dashboardData.messages) ? dashboardData.messages : [];
    }

    function normalizeText(value) {
        return String(value || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function escapeAttribute(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function getActiveSearchQuery() {
        return document.querySelector("#messages .panel-search-bar input")?.value.trim() || "";
    }

    function matchesSearch(message, query) {
        const type = getMessageType(message);
        const searchableText = normalizeText(`${message.title} ${message.text} ${message.time} ${type.label}`);
        return !query || searchableText.includes(normalizeText(query));
    }

    function getMessageType(message) {
        const title = (message.title || "").toLowerCase();
        const icon = message.icon || "";

        if (title.includes("prof") || icon.includes("user")) {
            return { label: "Profesor", tone: "teacher", badge: "Material" };
        }

        if (title.includes("control") || icon.includes("file")) {
            return { label: "Control", tone: "records", badge: "Documento" };
        }

        return { label: "Academico", tone: "academic", badge: "Importante" };
    }

    function render(elements, dashboardData) {
        const activeQuery = getActiveSearchQuery();
        const allMessages = getMessages(dashboardData);
        const messages = allMessages.filter((message) => matchesSearch(message, activeQuery));

        if (!allMessages.length) {
            elements.messagesList.innerHTML = '<p class="muted">No tienes mensajes institucionales por ahora.</p>';
            return;
        }

        if (!messages.length) {
            elements.messagesList.innerHTML = '<p class="muted">No hay mensajes con ese asunto.</p>';
            return;
        }

        selectedMessageIndex = Math.min(selectedMessageIndex, messages.length - 1);
        const selectedMessage = messages[selectedMessageIndex];
        const selectedType = getMessageType(selectedMessage);
        const selectedIsUnread = selectedMessageIndex < 2;

        elements.messagesList.innerHTML = `
            <div class="student-inbox">
                <section class="student-inbox-summary" aria-label="Resumen de mensajes">
                    <div>
                        <span class="student-inbox-eyebrow">Centro de comunicaciones</span>
                        <strong>${messages.length} mensajes institucionales</strong>
                        <p>Prioriza avisos academicos, materiales y documentos enviados por PSM.</p>
                    </div>
                    <div class="student-inbox-metrics" aria-label="Estado de bandeja">
                        <span><i class="fa-solid fa-envelope-open-text" aria-hidden="true"></i>${Math.min(2, messages.length)} nuevos</span>
                        <span><i class="fa-solid fa-star" aria-hidden="true"></i>${messages.length} destacados</span>
                    </div>
                </section>

                <div class="student-inbox-layout">
                    <div class="student-message-list" role="listbox" aria-label="Lista de mensajes">
                        ${messages.map((message, index) => {
                            const type = getMessageType(message);
                            return `
                                <button class="student-message-card ${type.tone}${index === selectedMessageIndex ? " is-active" : ""}" type="button" data-message-index="${index}" data-search-text="${escapeAttribute(`${message.title} ${message.text} ${message.time} ${type.label}`)}" role="option" aria-selected="${index === selectedMessageIndex}">
                                    <span class="student-message-icon"><i class="fa-solid ${message.icon}" aria-hidden="true"></i></span>
                                    <span class="student-message-content">
                                        <span class="student-message-row">
                                            <strong>${message.title}</strong>
                                            <span>${message.time}</span>
                                        </span>
                                        <span class="student-message-preview">${message.text}</span>
                                        <span class="student-message-tags">
                                            <small>${type.label}</small>
                                            ${index < 2 ? "<small>Nuevo</small>" : ""}
                                        </span>
                                    </span>
                                </button>
                            `;
                        }).join("")}
                    </div>

                    <article class="student-message-detail ${selectedType.tone}${selectedIsUnread ? " is-unread" : ""}" aria-live="polite">
                        <div class="student-message-watermark" aria-hidden="true"><i class="fa-solid fa-envelope-open-text"></i></div>
                        <span class="student-message-stamp">PSM</span>
                        <div class="student-message-detail-header">
                            <span>${selectedType.badge}</span>
                            <h3>${selectedMessage.title}</h3>
                        </div>
                        <p>${selectedMessage.text}</p>
                        <div class="student-message-detail-meta">
                            <span><i class="fa-regular fa-clock" aria-hidden="true"></i>${selectedMessage.time}</span>
                            <span><i class="fa-solid fa-layer-group" aria-hidden="true"></i>${selectedType.label}</span>
                        </div>
                        <div class="student-message-detail-actions">
                            <button type="button"><i class="fa-solid fa-check" aria-hidden="true"></i>Leido</button>
                            <button type="button"><i class="fa-solid fa-box-archive" aria-hidden="true"></i>Archivar</button>
                        </div>
                    </article>
                </div>
            </div>
        `;

        elements.messagesList.querySelectorAll("[data-message-index]").forEach((button) => {
            button.addEventListener("click", (event) => {
                selectedMessageIndex = Number(event.currentTarget.dataset.messageIndex);
                render(elements, dashboardData);
            });
        });
    }

    return { render };
})();