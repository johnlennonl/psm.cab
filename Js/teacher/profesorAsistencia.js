"use strict";

window.PSM_TEACHER_MODULES = window.PSM_TEACHER_MODULES || {};

window.PSM_TEACHER_MODULES.asistencia = {
    render({ section, selectedAttendanceDate, getAttendanceStatus, renderStudentIdentity }) {
        const attendanceSummary = section.students.reduce((summary, student) => {
            const status = getAttendanceStatus(section.id, student, selectedAttendanceDate);

            summary[status] = (summary[status] || 0) + 1;
            return summary;
        }, { Presente: 0, Tarde: 0, Ausente: 0 });

        return `
            <div class="teacher-panel-intro">
                <strong>${section.subject} | Seccion ${section.section}</strong>
                <span>${section.nextClass} | Asistencia diaria</span>
            </div>
            <div class="attendance-toolbar">
                <label for="attendance-date-input">
                    <span>Fecha de clase</span>
                    <input id="attendance-date-input" type="date" value="${selectedAttendanceDate}">
                </label>
                <div class="attendance-summary" aria-label="Resumen de asistencia">
                    <span><strong>${attendanceSummary.Presente}</strong> Presentes</span>
                    <span><strong>${attendanceSummary.Tarde}</strong> Tardes</span>
                    <span><strong>${attendanceSummary.Ausente}</strong> Ausentes</span>
                </div>
            </div>
            <div class="attendance-list">
                ${section.students.map((student, studentIndex) => `
                    <article class="attendance-item">
                        ${renderStudentIdentity(student)}
                        <div class="attendance-controls" aria-label="Asistencia de ${student.name}" data-student-index="${studentIndex}">
                            ${["Presente", "Tarde", "Ausente"].map((status) => `
                                <button class="attendance-chip${getAttendanceStatus(section.id, student, selectedAttendanceDate) === status ? " is-active" : ""}" type="button" data-attendance-status="${status}">${status}</button>
                            `).join("")}
                        </div>
                    </article>
                `).join("")}
            </div>
            <div class="teacher-panel-submit-bar">
                <button class="teacher-panel-submit save-attendance-button" type="button">
                    <i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i>
                    <span>Cargar Asistencias</span>
                </button>
                <small>Guarda la asistencia de ${section.subject} | Seccion ${section.section} para la fecha seleccionada.</small>
            </div>
        `;
    }
};