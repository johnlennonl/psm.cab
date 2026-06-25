"use strict";

window.PSM_TEACHER_MODULES = window.PSM_TEACHER_MODULES || {};

function renderLabRequestForm(section) {
    return `
        <form class="lab-request-form" id="lab-request-form">
            <div class="lab-request-heading">
                <strong>Solicitud de laboratorio</strong>
                <span>${section.subject} | Seccion ${section.section}</span>
            </div>
            <label>
                <span>Laboratorio</span>
                <select name="lab" required>
                    <option value="Informatica">Informatica</option>
                    <option value="Quimica">Quimica</option>
                </select>
            </label>
            <div class="lab-request-grid">
                <label>
                    <span>Fecha</span>
                    <input name="date" type="date" required>
                </label>
                <label>
                    <span>Hora inicio</span>
                    <input name="startTime" type="time" required>
                </label>
                <label>
                    <span>Hora fin</span>
                    <input name="endTime" type="time" required>
                </label>
            </div>
            <label>
                <span>Motivo</span>
                <textarea name="reason" rows="3" placeholder="Ej. practica evaluada, demostracion, recuperacion de laboratorio" required></textarea>
            </label>
            <div class="lab-request-actions">
                <button class="profile-secondary-button" type="button" data-close-lab-request>Cancelar</button>
                <button class="profile-save-button" type="submit">
                    <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
                    <span>Enviar solicitud</span>
                </button>
            </div>
        </form>
    `;
}

function renderLabRequestSummary(lastLabRequest) {
    return `
        <article class="lab-request-summary">
            <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
            <div>
                <strong>Solicitud enviada</strong>
                <span>${lastLabRequest.lab} | ${lastLabRequest.date} | ${lastLabRequest.startTime} - ${lastLabRequest.endTime}</span>
                <p>${lastLabRequest.subject} | Seccion ${lastLabRequest.section}</p>
            </div>
        </article>
    `;
}

window.PSM_TEACHER_MODULES.acciones = {
    render({ panel, section, isLabRequestOpen, lastLabRequest }) {
        return `
            <div class="action-list">
                ${panel.items.map((item) => {
                    const isLabRequest = item.title === "Solicitar aula laboratorio";

                    return `
                        <button class="action-row${isLabRequest ? " lab-request-trigger" : ""}" type="button" data-action-title="${item.title}">
                            <span><i class="fa-solid ${item.icon}" aria-hidden="true"></i></span>
                            <div>
                                <strong>${item.title}</strong>
                                <small>${item.text}</small>
                            </div>
                            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                        </button>
                    `;
                }).join("")}
            </div>
            ${isLabRequestOpen ? renderLabRequestForm(section) : ""}
            ${lastLabRequest ? renderLabRequestSummary(lastLabRequest) : ""}
        `;
    }
};