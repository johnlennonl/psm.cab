"use strict";

window.PSM_TEACHER_MODULES = window.PSM_TEACHER_MODULES || {};

window.PSM_TEACHER_MODULES.contexto = {
    render({ section, selectedAttendanceDate, getAttendanceStatus, countPendingGrades }) {
        const presentCount = section.students.filter((student) => getAttendanceStatus(section.id, student, selectedAttendanceDate) === "Presente").length;
        const pendingGrades = countPendingGrades(section);

        return `
            <div class="section-context-card" style="--section-accent: ${section.accent}">
                <div class="section-context-main">
                    <span>${section.code} | Seccion ${section.section} | ${section.period}</span>
                    <strong>${section.subject}</strong>
                    <p>${section.room} | ${section.schedule}</p>
                </div>
                <div class="section-context-metrics">
                    <article><strong>${section.students.length}</strong><span>Alumnos</span></article>
                    <article><strong>${presentCount}</strong><span>Presentes hoy</span></article>
                    <article><strong>${pendingGrades}</strong><span>Notas pendientes</span></article>
                </div>
                <div class="section-context-actions">
                    <a class="ghost-button" href="#attendance"><i class="fa-solid fa-clipboard-check" aria-hidden="true"></i><span>Tomar asistencia</span></a>
                    <a class="ghost-button" href="#gradebook"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i><span>Cargar notas</span></a>
                </div>
            </div>
        `;
    }
};