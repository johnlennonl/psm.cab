"use strict";

window.PSM_STUDENT_MODULES = window.PSM_STUDENT_MODULES || {};

window.PSM_STUDENT_MODULES.notas = {
    render(elements, dashboardData) {
        const grades = Array.isArray(dashboardData.grades) ? dashboardData.grades : [];

        if (!grades.length) {
            elements.gradesList.innerHTML = '<p class="muted">Aun no hay calificaciones publicadas.</p>';
            return;
        }

        const average = grades.reduce((total, grade) => total + grade.score, 0) / grades.length;
        const bestGrade = grades.reduce((best, grade) => grade.score > best.score ? grade : best, grades[0]);
        const excellentCount = grades.filter((grade) => grade.score >= 18).length;
        const approvedCount = grades.filter((grade) => grade.score >= 10).length;
        const averageProgress = Math.min(100, Math.max(0, average * 5));

        elements.gradesList.innerHTML = `
            <div class="student-performance">
                <section class="student-performance-hero" aria-label="Resumen de rendimiento">
                    <div>
                        <span class="student-performance-eyebrow">Promedio actual</span>
                        <strong>${average.toFixed(1)}/20</strong>
                        <p>${excellentCount} materias en rendimiento sobresaliente de ${grades.length} evaluadas.</p>
                    </div>
                    <div class="student-performance-ring" style="--value: ${averageProgress}%" aria-label="Promedio ${average.toFixed(1)} sobre 20">
                        <span>${Math.round(averageProgress)}%</span>
                    </div>
                </section>

                <div class="student-performance-metrics" aria-label="Indicadores de notas">
                    <article>
                        <span><i class="fa-solid fa-trophy" aria-hidden="true"></i>Mejor nota</span>
                        <strong>${bestGrade.score}/20</strong>
                        <p>${bestGrade.subject}</p>
                    </article>
                    <article>
                        <span><i class="fa-solid fa-circle-check" aria-hidden="true"></i>Aprobadas</span>
                        <strong>${approvedCount}/${grades.length}</strong>
                        <p>Materias con nota publicada</p>
                    </article>
                </div>

                <div class="student-performance-list">
                    ${grades.map((grade) => {
                        const progress = Math.min(100, Math.max(0, grade.score * 5));
                        const tone = grade.score >= 18 ? "excellent" : grade.score >= 14 ? "solid" : grade.score >= 10 ? "approved" : "risk";
                        const label = grade.score >= 18 ? "Sobresaliente" : grade.score >= 14 ? "Buen avance" : grade.score >= 10 ? "Aprobado" : "Atencion";

                        return `
                            <article class="student-grade-card ${tone}" style="--grade-value: ${progress}%">
                                <div class="student-grade-main">
                                    <span class="student-grade-badge">${label}</span>
                                    <h3>${grade.subject}</h3>
                                    <p>${grade.status}</p>
                                </div>
                                <div class="student-grade-score" aria-label="Nota ${grade.score} sobre 20">
                                    <strong>${grade.score}</strong>
                                    <span>/20</span>
                                </div>
                                <div class="student-grade-track" aria-hidden="true">
                                    <span></span>
                                </div>
                            </article>
                        `;
                    }).join("")}
                </div>
            </div>
        `;
    }
};