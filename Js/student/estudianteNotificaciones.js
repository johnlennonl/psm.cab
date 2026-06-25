"use strict";

window.PSM_STUDENT_MODULES = window.PSM_STUDENT_MODULES || {};

window.PSM_STUDENT_MODULES.notificaciones = (() => {
    let selectedNotificationIndex = 0;

    function getNotifications(dashboardData) {
        return Array.isArray(dashboardData.notifications) ? dashboardData.notifications : [];
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
        return document.querySelector("#notifications .panel-search-bar input")?.value.trim() || "";
    }

    function matchesSearch(notification, query) {
        const searchableText = normalizeText(`${notification.title} ${notification.text} ${notification.time}`);
        return !query || searchableText.includes(normalizeText(query));
    }

    function getNotificationType(notification) {
        const title = (notification.title || "").toLowerCase();
        const icon = notification.icon || "";

        if (title.includes("nota") || icon.includes("chart")) {
            return { label: "Academico", tone: "grade", status: "Revisar nota" };
        }

        if (title.includes("horario") || icon.includes("calendar")) {
            return { label: "Horario", tone: "schedule", status: "Cambio activo" };
        }

        return { label: "Administrativo", tone: "status", status: "Al dia" };
    }

    function isUnread(notification, index) {
        const time = (notification.time || "").toLowerCase();
        return index === 0 || time.includes("hace") || time.includes("hoy");
    }

    function render(elements, dashboardData) {
        const activeQuery = getActiveSearchQuery();
        const allNotifications = getNotifications(dashboardData);
        const notifications = allNotifications.filter((notification) => matchesSearch(notification, activeQuery));

        if (!allNotifications.length) {
            elements.notificationsList.innerHTML = '<p class="muted">No tienes notificaciones pendientes.</p>';
            return;
        }

        if (!notifications.length) {
            elements.notificationsList.innerHTML = '<p class="muted">No hay avisos con ese titulo.</p>';
            return;
        }

        selectedNotificationIndex = Math.min(selectedNotificationIndex, notifications.length - 1);
        const selectedNotification = notifications[selectedNotificationIndex];
        const selectedType = getNotificationType(selectedNotification);
        const unreadCount = notifications.filter(isUnread).length;

        elements.notificationsList.innerHTML = `
            <div class="student-alert-center">
                <section class="student-alert-summary" aria-label="Resumen de notificaciones">
                    <div>
                        <span>Actividad reciente</span>
                        <strong>${unreadCount} avisos por revisar</strong>
                    </div>
                    <div class="student-alert-pulse" aria-hidden="true">
                        <i class="fa-solid fa-bell" aria-hidden="true"></i>
                    </div>
                </section>

                <div class="student-alert-layout">
                    <div class="student-alert-list" role="listbox" aria-label="Lista de notificaciones">
                        ${notifications.map((notification, index) => {
                            const type = getNotificationType(notification);
                            const unread = isUnread(notification, index);
                            return `
                                <button class="student-alert-card ${type.tone}${index === selectedNotificationIndex ? " is-active" : ""}${unread ? " is-unread" : ""}" type="button" data-notification-index="${index}" data-search-text="${escapeAttribute(`${notification.title} ${notification.text} ${notification.time}`)}" role="option" aria-selected="${index === selectedNotificationIndex}">
                                    <span class="student-alert-icon"><i class="fa-solid ${notification.icon}" aria-hidden="true"></i></span>
                                    <span class="student-alert-content">
                                        <span class="student-alert-row">
                                            <strong>${notification.title}</strong>
                                            ${unread ? '<small>Nuevo</small>' : ""}
                                        </span>
                                        <span class="student-alert-preview">${notification.text}</span>
                                        <span class="student-alert-time"><i class="fa-regular fa-clock" aria-hidden="true"></i>${notification.time}</span>
                                    </span>
                                </button>
                            `;
                        }).join("")}
                    </div>

                    <article class="student-alert-detail ${selectedType.tone}${isUnread(selectedNotification, selectedNotificationIndex) ? " is-unread" : ""}" aria-live="polite">
                        <span class="student-alert-detail-label">${selectedType.status}</span>
                        <h3>${selectedNotification.title}</h3>
                        <p>${selectedNotification.text}</p>
                        <div class="student-alert-detail-footer">
                            <span><i class="fa-regular fa-clock" aria-hidden="true"></i>${selectedNotification.time}</span>
                            <span><i class="fa-solid fa-layer-group" aria-hidden="true"></i>${selectedType.label}</span>
                        </div>
                    </article>
                </div>
            </div>
        `;

        elements.notificationsList.querySelectorAll("[data-notification-index]").forEach((button) => {
            button.addEventListener("click", (event) => {
                selectedNotificationIndex = Number(event.currentTarget.dataset.notificationIndex);
                render(elements, dashboardData);
            });
        });
    }

    return { render };
})();