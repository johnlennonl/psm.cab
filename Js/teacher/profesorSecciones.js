"use strict";

window.PSM_TEACHER_MODULES = window.PSM_TEACHER_MODULES || {};

window.PSM_TEACHER_MODULES.secciones = {
    render({ experience, selectedTeacherSectionId }) {
        return `
            <div class="teacher-section-grid">
                ${experience.sections.map((section) => `
                    <article class="teacher-section-card${section.id === selectedTeacherSectionId ? " is-selected" : ""}" data-section-id="${section.id}" style="--section-accent: ${section.accent}">
                        <button class="teacher-section-main" type="button" aria-pressed="${section.id === selectedTeacherSectionId}">
                            <span>${section.code} | Seccion ${section.section}</span>
                            <strong>${section.subject}</strong>
                            <small>${section.schedule}</small>
                            <em>${section.students.length} alumnos | ${section.status}</em>
                        </button>
                        <div class="teacher-section-actions" aria-label="Acciones para ${section.subject} seccion ${section.section}">
                            <a href="#attendance" data-section-action="attendance">
                                <i class="fa-solid fa-clipboard-check" aria-hidden="true"></i>
                                <span>Cargar Asistencias</span>
                            </a>
                            <a href="#gradebook" data-section-action="gradebook">
                                <i class="fa-solid fa-pen-to-square" aria-hidden="true"></i>
                                <span>Actualizar Notas</span>
                            </a>
                        </div>
                    </article>
                `).join("")}
            </div>
        `;
    }
};