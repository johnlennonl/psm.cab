"use strict";

window.PSM_TEACHER_MODULES = window.PSM_TEACHER_MODULES || {};

window.PSM_TEACHER_MODULES.riesgo = {
    render({ section, getTeacherRiskStudents, renderStudentIdentity }) {
        const riskStudents = getTeacherRiskStudents(section);

        if (!riskStudents.length) {
            return `
                <div class="teacher-panel-intro">
                    <strong>${section.subject} | Seccion ${section.section}</strong>
                    <span>No hay alumnos en riesgo con la evidencia actual.</span>
                </div>
                <p class="muted">Este panel se activa cuando hay al menos dos cortes completamente evaluados y el estudiante tiene 08 o menos en dos cortes.</p>
            `;
        }

        return `
            <div class="teacher-panel-intro">
                <strong>${section.subject} | Seccion ${section.section}</strong>
                <span>Seguimiento calculado solo con alumnos inscritos en esta seccion.</span>
            </div>
            <div class="people-list">
                ${riskStudents.map((student) => `
                    <article class="person-row">
                        ${renderStudentIdentity(student, `${section.subject} | ${student.risk.reason}`)}
                        <div class="person-actions">
                            <em>${student.risk.badge}</em>
                            <button class="contact-student-button" type="button" data-student-name="${student.name}" data-student-document="${student.document}">
                                <i class="fa-solid fa-message" aria-hidden="true"></i>
                                <span>Contactar</span>
                            </button>
                        </div>
                    </article>
                `).join("")}
            </div>
        `;
    }
};