"use strict";

window.PSM_TEACHER_MODULES = window.PSM_TEACHER_MODULES || {};

window.PSM_TEACHER_MODULES.notas = {
    render({ experience, section, renderStudentIdentity, formatGrade, calculateCutScore, calculateWeightedFinal }) {
        const cuts = ["Primer corte", "Segundo corte", "Tercer corte"];

        return `
            <div class="teacher-panel-intro">
                <strong>${section.subject} | ${section.code} | Seccion ${section.section}</strong>
                <span>Evaluaciones: 10% + 20%, 10% + 20%, 20% + 20% = 100%</span>
            </div>
            <div class="grade-plan-strip" aria-label="Plan de evaluacion">
                ${experience.gradePlan.map((evaluation) => `
                    <span>${evaluation.label}</span>
                `).join("")}
            </div>
            <div class="role-table-wrap gradebook-wrap">
                <table class="role-table gradebook-table">
                    <thead>
                        <tr>
                            <th>Estudiante</th>
                            ${experience.gradePlan.map((evaluation) => `<th>${evaluation.label}</th>`).join("")}
                            ${cuts.map((cut) => `<th>${cut}</th>`).join("")}
                            <th>Acum./Final</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${section.students.map((student, studentIndex) => {
                            const cutCells = cuts.map((cut) => `<td class="grade-total">${formatGrade(calculateCutScore(student.grades, experience.gradePlan, cut))}</td>`).join("");
                            const finalScore = calculateWeightedFinal(student.grades, experience.gradePlan);

                            return `
                                <tr>
                                    <td>
                                        ${renderStudentIdentity(student)}
                                    </td>
                                    ${experience.gradePlan.map((evaluation) => `
                                        <td>
                                            <input class="grade-input" type="number" min="0" max="20" step="0.1" value="${student.grades[evaluation.key]}" data-student-index="${studentIndex}" data-grade-key="${evaluation.key}" aria-label="${evaluation.label} de ${student.name}">
                                        </td>
                                    `).join("")}
                                    ${cutCells}
                                    <td class="grade-final${finalScore < 10 ? " is-risk" : ""}">${formatGrade(finalScore)}</td>
                                </tr>
                            `;
                        }).join("")}
                    </tbody>
                </table>
            </div>
            <div class="teacher-panel-submit-bar">
                <button class="teacher-panel-submit save-grades-button" type="button">
                    <i class="fa-solid fa-floppy-disk" aria-hidden="true"></i>
                    <span>Actualizar Notas</span>
                </button>
                <small>Guarda las calificaciones cargadas para ${section.subject} | Seccion ${section.section}.</small>
            </div>
        `;
    }
};