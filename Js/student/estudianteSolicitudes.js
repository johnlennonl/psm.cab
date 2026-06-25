"use strict";

window.PSM_STUDENT_MODULES = window.PSM_STUDENT_MODULES || {};

window.PSM_STUDENT_MODULES.solicitudes = (() => {
    const STORAGE_KEY = "psm_student_requests";
    let selectedRequestId = null;

    const requestTypes = [
        { value: "Constancia de estudios", icon: "fa-file-lines", sla: "24-48 horas" },
        { value: "Record academico", icon: "fa-chart-column", sla: "3 dias habiles" },
        { value: "Cambio de seccion", icon: "fa-right-left", sla: "Segun cupo" },
        { value: "Retiro de materia", icon: "fa-file-circle-minus", sla: "Revision academica" },
        { value: "Justificativo", icon: "fa-notes-medical", sla: "48 horas" }
    ];

    const defaultRequests = [
        {
            id: "req-constancia-001",
            type: "Constancia de estudios",
            subject: "Solicitud de constancia vigente",
            detail: "Necesito constancia para tramite laboral con datos academicos actualizados.",
            status: "En revision",
            createdAt: "2026-06-24T09:20:00",
            updatedAt: "2026-06-25T08:40:00",
            timeline: ["Solicitud recibida", "Validando solvencia administrativa"]
        },
        {
            id: "req-seccion-002",
            type: "Cambio de seccion",
            subject: "Cambio por cruce de horario",
            detail: "Solicito cambio de seccion en Programacion II por cruce con laboratorio.",
            status: "Pendiente",
            createdAt: "2026-06-23T14:15:00",
            updatedAt: "2026-06-23T14:15:00",
            timeline: ["Solicitud enviada"]
        }
    ];

    function loadRequests() {
        try {
            const savedRequests = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
            return Array.isArray(savedRequests) ? savedRequests : defaultRequests;
        } catch (error) {
            localStorage.removeItem(STORAGE_KEY);
            return defaultRequests;
        }
    }

    function saveRequests(requests) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    }

    function getRequests() {
        return loadRequests();
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getFormElements(elements) {
        return {
            form: elements.requestsList.querySelector("#student-request-form"),
            type: elements.requestsList.querySelector("#student-request-type"),
            subject: elements.requestsList.querySelector("#student-request-subject"),
            detail: elements.requestsList.querySelector("#student-request-detail"),
            error: elements.requestsList.querySelector("#student-request-form-error"),
            exitAlert: elements.requestsList.querySelector("#student-request-exit-alert")
        };
    }

    function getRequestType(type) {
        return requestTypes.find((item) => item.value === type) || requestTypes[0];
    }

    function getStatusTone(status) {
        const normalized = status.toLowerCase();

        if (normalized.includes("aprob")) {
            return "approved";
        }

        if (normalized.includes("revision")) {
            return "review";
        }

        if (normalized.includes("rechaz")) {
            return "rejected";
        }

        return "pending";
    }

    function formatDate(value) {
        return new Intl.DateTimeFormat("es-VE", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        }).format(new Date(value));
    }

    function hasPendingDraft(elements) {
        const formElements = getFormElements(elements);

        return Boolean(
            formElements.subject?.value.trim()
            || formElements.detail?.value.trim()
            || formElements.type?.value !== requestTypes[0].value
        );
    }

    function hideFormError(elements) {
        const formElements = getFormElements(elements);

        formElements.error.hidden = true;
        formElements.error.textContent = "";
        formElements.subject.classList.remove("is-invalid");
        formElements.detail.classList.remove("is-invalid");
    }

    function showFormError(elements, message, field) {
        const formElements = getFormElements(elements);

        formElements.error.hidden = false;
        formElements.error.textContent = message;
        formElements.subject.classList.toggle("is-invalid", field === "subject");
        formElements.detail.classList.toggle("is-invalid", field === "detail");
        formElements[field]?.focus();
    }

    function hideExitWarning(elements) {
        const formElements = getFormElements(elements);
        formElements.exitAlert.hidden = true;
    }

    function clearDraft(elements) {
        const formElements = getFormElements(elements);

        formElements.type.value = requestTypes[0].value;
        formElements.subject.value = "";
        formElements.detail.value = "";
        hideFormError(elements);
        hideExitWarning(elements);
    }

    function showExitWarning(elements, closeModal) {
        const formElements = getFormElements(elements);

        formElements.exitAlert.hidden = false;
        formElements.exitAlert.querySelector("[data-request-keep]").onclick = () => {
            hideExitWarning(elements);
            formElements.subject.focus();
        };
        formElements.exitAlert.querySelector("[data-request-discard]").onclick = () => {
            clearDraft(elements);
            closeModal();
        };
        formElements.exitAlert.querySelector("[data-request-keep]").focus();
    }

    function handleCloseRequest(elements, closeModal) {
        if (hasPendingDraft(elements)) {
            showExitWarning(elements, closeModal);
            return;
        }

        closeModal();
    }

    function renderRequestCard(request) {
        const type = getRequestType(request.type);
        const tone = getStatusTone(request.status);
        const isSelected = request.id === selectedRequestId;

        return `
            <button class="student-request-card ${tone}${isSelected ? " is-active" : ""}" type="button" data-request-id="${request.id}">
                <span class="student-request-icon"><i class="fa-solid ${type.icon}" aria-hidden="true"></i></span>
                <span class="student-request-content">
                    <span class="student-request-row">
                        <strong>${escapeHtml(request.type)}</strong>
                        <small>${escapeHtml(request.status)}</small>
                    </span>
                    <span class="student-request-subject">${escapeHtml(request.subject)}</span>
                    <span class="student-request-date"><i class="fa-regular fa-clock" aria-hidden="true"></i>${formatDate(request.updatedAt)}</span>
                </span>
            </button>
        `;
    }

    function renderDetail(request) {
        const type = getRequestType(request.type);
        const tone = getStatusTone(request.status);

        return `
            <article class="student-request-detail ${tone}">
                <div class="student-request-watermark" aria-hidden="true"><i class="fa-solid ${type.icon}"></i></div>
                <span class="student-request-stamp">PSM</span>
                <span class="student-request-detail-kicker">${escapeHtml(request.status)}</span>
                <h3>${escapeHtml(request.subject)}</h3>
                <p>${escapeHtml(request.detail)}</p>
                <div class="student-request-detail-meta">
                    <span><i class="fa-solid fa-layer-group" aria-hidden="true"></i>${escapeHtml(request.type)}</span>
                    <span><i class="fa-solid fa-stopwatch" aria-hidden="true"></i>${escapeHtml(type.sla)}</span>
                </div>
                <div class="student-request-timeline">
                    ${request.timeline.map((item) => `<span><i class="fa-solid fa-check" aria-hidden="true"></i>${escapeHtml(item)}</span>`).join("")}
                </div>
            </article>
        `;
    }

    function render(elements) {
        const requests = loadRequests().sort((first, second) => new Date(second.updatedAt) - new Date(first.updatedAt));

        if (!selectedRequestId || !requests.some((request) => request.id === selectedRequestId)) {
            selectedRequestId = requests[0]?.id || null;
        }

        const selectedRequest = requests.find((request) => request.id === selectedRequestId);
        const pendingCount = requests.filter((request) => getStatusTone(request.status) !== "approved").length;

        elements.requestsList.innerHTML = `
            <div class="student-requests">
                <section class="student-requests-summary" aria-label="Resumen de solicitudes">
                    <div>
                        <span>Ventanilla academica</span>
                        <strong>${requests.length} solicitudes registradas</strong>
                        <p>${pendingCount} proceso(s) requieren seguimiento administrativo.</p>
                    </div>
                    <div class="student-requests-seal" aria-hidden="true"><i class="fa-solid fa-file-signature"></i></div>
                </section>

                <form id="student-request-form" class="student-request-form" novalidate>
                    <select id="student-request-type" aria-label="Tipo de solicitud">
                        ${requestTypes.map((type) => `<option value="${type.value}">${type.value}</option>`).join("")}
                    </select>
                    <input id="student-request-subject" type="text" maxlength="64" placeholder="Asunto de la solicitud" aria-label="Asunto">
                    <textarea id="student-request-detail" maxlength="180" placeholder="Describe brevemente tu caso" aria-label="Detalle"></textarea>
                    <button type="submit"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i>Enviar</button>
                    <p id="student-request-form-error" class="student-request-form-error" role="alert" hidden></p>
                </form>

                <section id="student-request-exit-alert" class="student-request-exit-alert" role="alertdialog" aria-live="assertive" hidden>
                    <div>
                        <strong>Solicitud sin enviar</strong>
                        <p>Tienes datos cargados en el formulario. Puedes completar la solicitud o cancelar el borrador.</p>
                    </div>
                    <div class="student-request-exit-actions">
                        <button type="button" data-request-keep>Completar solicitud</button>
                        <button type="button" data-request-discard>Cancelar borrador</button>
                    </div>
                </section>

                <div class="student-requests-layout">
                    <div class="student-request-list" role="listbox" aria-label="Solicitudes creadas">
                        ${requests.map((request) => renderRequestCard(request)).join("")}
                    </div>
                    ${selectedRequest ? renderDetail(selectedRequest) : '<article class="student-request-detail"><h3>Sin solicitudes</h3><p>Crea tu primera solicitud para iniciar seguimiento.</p></article>'}
                </div>
            </div>
        `;

        bindEvents(elements, requests);
    }

    function bindEvents(elements, requests) {
        elements.requestsList.querySelector("#student-request-form")?.addEventListener("submit", (event) => {
            event.preventDefault();
            const type = elements.requestsList.querySelector("#student-request-type")?.value || requestTypes[0].value;
            const subjectInput = elements.requestsList.querySelector("#student-request-subject");
            const detailInput = elements.requestsList.querySelector("#student-request-detail");
            const subject = subjectInput?.value.trim();
            const detail = detailInput?.value.trim();

            hideExitWarning(elements);

            if (!subject) {
                showFormError(elements, "Agrega un asunto para identificar la solicitud.", "subject");
                return;
            }

            if (!detail) {
                showFormError(elements, "Describe brevemente el motivo antes de enviar.", "detail");
                return;
            }

            hideFormError(elements);

            const now = new Date().toISOString();
            const nextRequest = {
                id: `req-${Date.now()}`,
                type,
                subject,
                detail,
                status: "Pendiente",
                createdAt: now,
                updatedAt: now,
                timeline: ["Solicitud enviada"]
            };

            selectedRequestId = nextRequest.id;
            saveRequests([nextRequest, ...requests].slice(0, 18));
            render(elements);
        });

        elements.requestsList.querySelectorAll("#student-request-type, #student-request-subject, #student-request-detail").forEach((field) => {
            field.addEventListener("input", () => {
                hideFormError(elements);
                hideExitWarning(elements);
            });
            field.addEventListener("change", () => hideExitWarning(elements));
        });

        elements.requestsList.querySelectorAll("[data-request-id]").forEach((button) => {
            button.addEventListener("click", (event) => {
                selectedRequestId = event.currentTarget.dataset.requestId;
                render(elements);
            });
        });
    }

    return { render, getRequests, handleCloseRequest };
})();