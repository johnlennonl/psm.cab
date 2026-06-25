"use strict";

window.PSM_TEACHER_MODULES = window.PSM_TEACHER_MODULES || {};

window.PSM_TEACHER_MODULES.planificacion = {
    render({ section }) {
        return `
            <div class="teacher-panel-intro">
                <strong>${section.subject} | Seccion ${section.section}</strong>
                <span>Planificacion vinculada a ${section.code}, no a otras asignaturas.</span>
            </div>
            <div class="timeline-list">
                ${section.planning.map((item) => `
                    <article class="timeline-item">
                        <span><i class="fa-solid ${item.icon}" aria-hidden="true"></i></span>
                        <div>
                            <strong>${item.title}</strong>
                            <p>${item.text}</p>
                        </div>
                    </article>
                `).join("")}
            </div>
        `;
    }
};