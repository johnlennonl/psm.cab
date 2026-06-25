"use strict";

window.PSM_STUDENT_MODULES = window.PSM_STUDENT_MODULES || {};

window.PSM_STUDENT_MODULES.pensum = {
    render(elements, dashboardData) {
        if (!dashboardData.pensum || !dashboardData.pensum.length) {
            elements.pensumList.innerHTML = '<p class="muted">Pensum no disponible. Puedes importar o editar los datos.</p>';
            return;
        }

        elements.pensumList.innerHTML = dashboardData.pensum.map((semester, semesterIndex) => {
            const rows = semester.subjects.map((subject) => {
                const gradeMatch = dashboardData.grades.find((grade) => subject.name.toLowerCase().includes(grade.subject.toLowerCase()));
                const statusClass = gradeMatch && gradeMatch.score >= 16 ? " pensum-approved" : ` pensum-${semester.status}`;
                const scoreBadge = gradeMatch ? `<span class="pensum-score">${gradeMatch.score}/20</span>` : "";

                return `
                    <div class="pensum-row${statusClass}">
                        <div class="pensum-code">${subject.code}</div>
                        <div class="pensum-name">${subject.name}</div>
                        <div>${subject.ht}</div>
                        <div>${subject.hp}</div>
                        <div>${subject.hl}</div>
                        <div>${subject.th}</div>
                        <div class="pensum-uc">${subject.uc} ${scoreBadge}</div>
                        <div class="pensum-pre">${subject.pre}</div>
                    </div>
                `;
            }).join("");

            const statusLabel = {
                approved: "Aprobado",
                active: "En curso",
                pending: "Pendiente"
            }[semester.status] || "Pendiente";
            const isOpen = semester.status === "active";

            return `
                <section class="pensum-semester pensum-semester-${semester.status}" data-semester-index="${semesterIndex}">
                    <button type="button" class="pensum-toggle" aria-expanded="${isOpen}">
                        <span>${semester.semester}</span>
                        <strong>${statusLabel}</strong>
                    </button>
                    <div class="pensum-table" ${isOpen ? "" : "hidden"}>
                        <div class="pensum-row pensum-header">
                            <div class="pensum-code">COD</div>
                            <div class="pensum-name">ASIGNATURA</div>
                            <div>HT</div>
                            <div>HP</div>
                            <div>HL</div>
                            <div>TH</div>
                            <div class="pensum-uc">UC</div>
                            <div class="pensum-pre">PRELACION</div>
                        </div>
                        ${rows}
                    </div>
                </section>
            `;
        }).join("");

        elements.pensumList.querySelectorAll(".pensum-toggle").forEach((button) => {
            button.addEventListener("click", (event) => {
                const parent = event.currentTarget.closest(".pensum-semester");
                const table = parent.querySelector(".pensum-table");
                const isHidden = table.hasAttribute("hidden");

                event.currentTarget.setAttribute("aria-expanded", String(isHidden));
                if (isHidden) {
                    table.removeAttribute("hidden");
                    return;
                }
                table.setAttribute("hidden", "");
            });
        });
    }
};"use strict";

window.PSM_STUDENT_MODULES = window.PSM_STUDENT_MODULES || {};

window.PSM_STUDENT_MODULES.renderPensum = function renderPensum(elements) {
    const dashboardData = window.PSM_DASHBOARD_DATA || {};

    if (!dashboardData.pensum || !dashboardData.pensum.length) {
        elements.pensumList.innerHTML = '<p class="muted">Pensum no disponible. Puedes importar o editar los datos.</p>';
        return;
    }

    elements.pensumList.innerHTML = dashboardData.pensum.map((semester, semesterIndex) => {
        const rows = semester.subjects.map((subject) => {
            const gradeMatch = dashboardData.grades.find((grade) => subject.name.toLowerCase().includes(grade.subject.toLowerCase()));
            const statusClass = gradeMatch && gradeMatch.score >= 16 ? " pensum-approved" : ` pensum-${semester.status}`;
            const scoreBadge = gradeMatch ? `<span class="pensum-score">${gradeMatch.score}/20</span>` : "";

            return `
                <div class="pensum-row${statusClass}">
                    <div class="pensum-code">${subject.code}</div>
                    <div class="pensum-name">${subject.name}</div>
                    <div>${subject.ht}</div>
                    <div>${subject.hp}</div>
                    <div>${subject.hl}</div>
                    <div>${subject.th}</div>
                    <div class="pensum-uc">${subject.uc} ${scoreBadge}</div>
                    <div class="pensum-pre">${subject.pre}</div>
                </div>
            `;
        }).join("");

        const statusLabel = {
            approved: "Aprobado",
            active: "En curso",
            pending: "Pendiente"
        }[semester.status] || "Pendiente";

        const isOpen = semester.status === "active";

        return `
            <section class="pensum-semester pensum-semester-${semester.status}" data-semester-index="${semesterIndex}">
                <button type="button" class="pensum-toggle" aria-expanded="${isOpen}">
                    <span>${semester.semester}</span>
                    <strong>${statusLabel}</strong>
                </button>
                <div class="pensum-table" ${isOpen ? "" : "hidden"}>
                    <div class="pensum-row pensum-header">
                        <div class="pensum-code">COD</div>
                        <div class="pensum-name">ASIGNATURA</div>
                        <div>HT</div>
                        <div>HP</div>
                        <div>HL</div>
                        <div>TH</div>
                        <div class="pensum-uc">UC</div>
                        <div class="pensum-pre">PRELACION</div>
                    </div>
                    ${rows}
                </div>
            </section>
        `;
    }).join("");

    elements.pensumList.querySelectorAll(".pensum-toggle").forEach((button) => {
        button.addEventListener("click", (event) => {
            const parent = event.currentTarget.closest(".pensum-semester");
            const table = parent.querySelector(".pensum-table");
            const isHidden = table.hasAttribute("hidden");

            event.currentTarget.setAttribute("aria-expanded", String(isHidden));
            if (isHidden) {
                table.removeAttribute("hidden");
            } else {
                table.setAttribute("hidden", "");
            }
        });
    });
};
