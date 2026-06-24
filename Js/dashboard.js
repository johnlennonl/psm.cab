"use strict";

const DASHBOARD_LOADER_DELAY_MS = 1400;
const PROFILE_STORAGE_KEY = "psm_profile_data";
const ROLE_STORAGE_KEY = "psm_user_role";
const ATTENDANCE_STORAGE_KEY = "psm_teacher_attendance_records";

const dashboardData = window.PSM_DASHBOARD_DATA || {};
const weekDays = window.PSM_WEEK_DAYS || [];

const studentNavigation = window.PSM_STUDENT_NAVIGATION || [];
const roleDashboards = window.PSM_ROLES || {};

let selectedTeacherSectionId = roleDashboards.teacher?.selectedSectionId || "prog-ii-a";
let isLabRequestOpen = false;
let lastLabRequest = null;
let selectedAttendanceDate = new Date().toISOString().slice(0, 10);

function getTeacherExperience() {
    return roleDashboards.teacher;
}

function getSelectedTeacherSection() {
    const experience = getTeacherExperience();
    return experience.sections.find((section) => section.id === selectedTeacherSectionId) || experience.sections[0];
}

function getNumericGrade(value) {
    const grade = Number(value);
    return Number.isFinite(grade) ? Math.min(20, Math.max(0, grade)) : null;
}

function calculateWeightedFinal(grades, gradePlan) {
    return gradePlan.reduce((total, evaluation) => {
        const grade = getNumericGrade(grades[evaluation.key]);
        return grade === null ? total : total + (grade * evaluation.weight / 100);
    }, 0);
}

function calculateCutScore(grades, gradePlan, cutName) {
    const cutEvaluations = gradePlan.filter((evaluation) => evaluation.cut === cutName);
    const available = cutEvaluations.filter((evaluation) => getNumericGrade(grades[evaluation.key]) !== null);

    if (!available.length) {
        return null;
    }

    const weightedScore = available.reduce((total, evaluation) => {
        return total + (getNumericGrade(grades[evaluation.key]) * evaluation.weight);
    }, 0);
    const totalWeight = available.reduce((total, evaluation) => total + evaluation.weight, 0);

    return weightedScore / totalWeight;
}

function getCompletedCutScores(grades, gradePlan) {
    const cutNames = [...new Set(gradePlan.map((evaluation) => evaluation.cut))];

    return cutNames.reduce((completedCuts, cutName) => {
        const cutEvaluations = gradePlan.filter((evaluation) => evaluation.cut === cutName);
        const isCutComplete = cutEvaluations.every((evaluation) => getNumericGrade(grades[evaluation.key]) !== null);

        if (!isCutComplete) {
            return completedCuts;
        }

        return [
            ...completedCuts,
            {
                cut: cutName,
                score: calculateCutScore(grades, gradePlan, cutName)
            }
        ];
    }, []);
}

function getCompletedGradeValues(grades, gradePlan) {
    return gradePlan
        .map((evaluation) => getNumericGrade(grades[evaluation.key]))
        .filter((grade) => grade !== null);
}

function calculateCurrentAverage(grades, gradePlan) {
    const completedGrades = getCompletedGradeValues(grades, gradePlan);

    if (!completedGrades.length) {
        return null;
    }

    return completedGrades.reduce((total, grade) => total + grade, 0) / completedGrades.length;
}

function formatGrade(value) {
    if (value === null || Number.isNaN(value)) {
        return "Pendiente";
    }

    return value.toFixed(1);
}

function loadAttendanceRecords() {
    const savedRecords = localStorage.getItem(ATTENDANCE_STORAGE_KEY);

    if (!savedRecords) {
        return {};
    }

    try {
        return JSON.parse(savedRecords);
    } catch (error) {
        localStorage.removeItem(ATTENDANCE_STORAGE_KEY);
        return {};
    }
}

function saveAttendanceRecords(records) {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(records));
}

function getAttendanceStatus(sectionId, student, date) {
    const records = loadAttendanceRecords();
    return records[sectionId]?.[date]?.[student.document] || student.attendance || "Presente";
}

function setAttendanceStatus(sectionId, student, date, status) {
    const records = loadAttendanceRecords();

    records[sectionId] = records[sectionId] || {};
    records[sectionId][date] = records[sectionId][date] || {};
    records[sectionId][date][student.document] = status;
    saveAttendanceRecords(records);
}

function getElements() {
    return {
        sidebar: document.querySelector("#sidebar"),
        overlay: document.querySelector("#sidebar-overlay"),
        menuButton: document.querySelector("#menu-button"),
        logoutButton: document.querySelector("#logout-button"),
        welcomeName: document.querySelector("#welcome-name"),
        studentName: document.querySelector("#student-name"),
        studentCareer: document.querySelector("#student-career"),
        studentAvatar: document.querySelector("#student-avatar"),
        statsGrid: document.querySelector("#stats-grid"),
        scheduleGrid: document.querySelector("#schedule-grid"),
        gradesList: document.querySelector("#grades-list"),
        notificationsList: document.querySelector("#notifications-list"),
        messagesList: document.querySelector("#messages-list"),
        newsList: document.querySelector("#news-list"),
        notificationCount: document.querySelector("#notification-count"),
        nextClassTitle: document.querySelector("#next-class-title"),
        nextClassDetail: document.querySelector("#next-class-detail"),
        pensumList: document.querySelector("#pensum-list"),
        sidebarNav: document.querySelector(".sidebar-nav"),
        contentGrid: document.querySelector(".content-grid"),
        topbarEyebrow: document.querySelector(".topbar-title p"),
        heroPanel: document.querySelector("#overview"),
        profileButton: document.querySelector("#profile-button"),
        profileModal: document.querySelector("#profile-modal"),
        profileModalTitle: document.querySelector("#profile-modal-title"),
        profilePhotoTitle: document.querySelector("#profile-photo-title"),
        profilePhotoCopy: document.querySelector("#profile-photo-copy"),
        profileForm: document.querySelector("#profile-form"),
        profileCloseButton: document.querySelector("#profile-close-button"),
        profileAvatarPreview: document.querySelector("#profile-avatar-preview"),
        profilePhotoInput: document.querySelector("#profile-photo-input"),
        profileBirthdateLabel: document.querySelector("#profile-birthdate-label"),
        profileDocumentLabel: document.querySelector("#profile-document-label"),
        profileCareerLabel: document.querySelector("#profile-career-label"),
        profileBirthdate: document.querySelector("#profile-birthdate"),
        profileDocument: document.querySelector("#profile-document"),
        profileCareer: document.querySelector("#profile-career")
    };
}

function renderPensum(elements) {
    if (!dashboardData.pensum || !dashboardData.pensum.length) {
        elements.pensumList.innerHTML = '<p class="muted">Pensum no disponible. Puedes importar o editar los datos.</p>';
        return;
    }

    elements.pensumList.innerHTML = dashboardData.pensum.map((sem, sidx) => {
        const rows = sem.subjects.map((sub) => {
            const gradeMatch = dashboardData.grades.find((grade) => sub.name.toLowerCase().includes(grade.subject.toLowerCase()));
            const statusClass = gradeMatch && gradeMatch.score >= 16 ? ' pensum-approved' : ` pensum-${sem.status}`;
            const scoreBadge = gradeMatch ? `<span class="pensum-score">${gradeMatch.score}/20</span>` : '';

            return `
                <div class="pensum-row${statusClass}">
                    <div class="pensum-code">${sub.code}</div>
                    <div class="pensum-name">${sub.name}</div>
                    <div>${sub.ht}</div>
                    <div>${sub.hp}</div>
                    <div>${sub.hl}</div>
                    <div>${sub.th}</div>
                    <div class="pensum-uc">${sub.uc} ${scoreBadge}</div>
                    <div class="pensum-pre">${sub.pre}</div>
                </div>
            `;
        }).join('');

        const statusLabel = {
            approved: "Aprobado",
            active: "En curso",
            pending: "Pendiente"
        }[sem.status] || "Pendiente";

        const isOpen = sem.status === "active";

        return `
            <section class="pensum-semester pensum-semester-${sem.status}" data-semester-index="${sidx}">
                <button type="button" class="pensum-toggle" aria-expanded="${isOpen}">
                    <span>${sem.semester}</span>
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
    }).join('');

    // bind toggles
    elements.pensumList.querySelectorAll('.pensum-toggle').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const parent = e.currentTarget.closest('.pensum-semester');
            const table = parent.querySelector('.pensum-table');
            const isHidden = table.hasAttribute('hidden');
            e.currentTarget.setAttribute('aria-expanded', String(isHidden));
            if (isHidden) table.removeAttribute('hidden'); else table.setAttribute('hidden', '');
        });
    });
}

let currentLightboxIndex = null;

function guardSession() {
    const token = localStorage.getItem("psm_auth_token");

    if (!token) {
        window.location.href = "../index.html";
    }
}

function getInitials(name) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}

function loadProfileData() {
    const savedProfile = localStorage.getItem(getProfileStorageKey());

    if (!savedProfile) {
        return;
    }

    try {
        const profile = JSON.parse(savedProfile);
        dashboardData.student = {
            ...dashboardData.student,
            ...profile
        };
    } catch (error) {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
    }
}

function saveProfileData(profile) {
    localStorage.setItem(getProfileStorageKey(), JSON.stringify(profile));
}

function getProfileStorageKey() {
    return `${PROFILE_STORAGE_KEY}_${getCurrentRole()}`;
}

function loadSavedProfile() {
    const savedProfile = localStorage.getItem(getProfileStorageKey());

    if (!savedProfile) {
        return {};
    }

    try {
        return JSON.parse(savedProfile);
    } catch (error) {
        localStorage.removeItem(getProfileStorageKey());
        return {};
    }
}

function renderAvatar(container, student) {
    const initials = getInitials(student.name);

    if (student.photo) {
        container.innerHTML = `<img src="${student.photo}" alt="Foto de perfil de ${student.name}">`;
        return;
    }

    container.textContent = initials;
}

function renderStudent(elements) {
    const firstName = dashboardData.student.name.split(" ")[0];

    elements.welcomeName.textContent = firstName;
    elements.studentName.textContent = dashboardData.student.name;
    elements.studentCareer.textContent = `${dashboardData.student.career} - ${dashboardData.student.semester}`;
    renderAvatar(elements.studentAvatar, dashboardData.student);
}

function syncProfileForm(elements) {
    const role = getCurrentRole();
    const savedProfile = loadSavedProfile();
    const isTeacher = role === "teacher";
    const baseProfile = isTeacher
        ? {
            name: getSessionName(getTeacherExperience().identity.name),
            document: localStorage.getItem("psm_user_document") || "V-11111111",
            career: savedProfile.career || "Ingenieria de Sistemas",
            birthdate: savedProfile.birthdate || "",
            photo: savedProfile.photo || ""
        }
        : dashboardData.student;

    elements.profileModalTitle.textContent = isTeacher ? "Ficha del profesor" : "Ficha del estudiante";
    elements.profilePhotoTitle.textContent = isTeacher ? "Actualiza tu foto docente" : "Cambia tu foto de perfil";
    elements.profilePhotoCopy.textContent = isTeacher
        ? "Esta imagen identifica tu perfil ante estudiantes y administracion."
        : "Sube una imagen para que tu ficha academica se vea brutal.";
    elements.profileBirthdateLabel.textContent = "Fecha de Nacimiento";
    elements.profileDocumentLabel.textContent = "Cedula de Identidad";
    elements.profileCareerLabel.textContent = isTeacher ? "Departamento o especialidad" : "Carrera que esta cursando";
    elements.profileCareer.placeholder = isTeacher ? "Ingenieria de Sistemas" : "Ingenieria de Sistemas";
    elements.profileBirthdate.value = baseProfile.birthdate || "";
    elements.profileDocument.value = baseProfile.document || "";
    elements.profileCareer.value = baseProfile.career || "";
    elements.profilePhotoInput.value = "";
    elements.profileAvatarPreview.dataset.photo = baseProfile.photo || "";
    renderAvatar(elements.profileAvatarPreview, baseProfile);
}

function getFocusableProfileElements(elements) {
    return Array.from(elements.profileModal.querySelectorAll("button, input, label[for], [href], [tabindex]:not([tabindex='-1'])"))
        .filter((element) => !element.disabled && element.offsetParent !== null);
}

function openProfileModal(elements) {
    syncProfileForm(elements);
    elements.profileModal.hidden = false;
    elements.profileModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("profile-modal-open");
    elements.profileCloseButton.focus();
}

function closeProfileModal(elements) {
    elements.profileModal.hidden = true;
    elements.profileModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("profile-modal-open");
    elements.profileButton.focus();
}

function handleProfilePhotoChange(event, elements) {
    const [file] = event.target.files;

    if (!file || !file.type.startsWith("image/")) {
        return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
        const photo = reader.result;
        elements.profileAvatarPreview.dataset.photo = photo;
        renderAvatar(elements.profileAvatarPreview, {
            ...dashboardData.student,
            photo
        });
    });

    reader.readAsDataURL(file);
}

function handleProfileSubmit(event, elements) {
    event.preventDefault();
    const role = getCurrentRole();

    const updatedProfile = {
        birthdate: elements.profileBirthdate.value,
        document: elements.profileDocument.value.trim(),
        career: elements.profileCareer.value.trim() || (role === "teacher" ? "Ingenieria de Sistemas" : dashboardData.student.career),
        photo: elements.profileAvatarPreview.dataset.photo || ""
    };

    if (role === "teacher") {
        saveProfileData(updatedProfile);
        elements.studentCareer.textContent = `Docente | ${updatedProfile.career}`;
        renderAvatar(elements.studentAvatar, {
            name: getSessionName(getTeacherExperience().identity.name),
            photo: updatedProfile.photo
        });
        closeProfileModal(elements);
        return;
    }

    dashboardData.student = {
        ...dashboardData.student,
        ...updatedProfile
    };

    saveProfileData(updatedProfile);
    renderStudent(elements);
    closeProfileModal(elements);
}

function handleProfileKeyboard(event, elements) {
    if (elements.profileModal.hidden) {
        return;
    }

    if (event.key === "Escape") {
        closeProfileModal(elements);
        return;
    }

    if (event.key !== "Tab") {
        return;
    }

    const focusableElements = getFocusableProfileElements(elements);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
}

function renderStats(elements) {
    elements.statsGrid.innerHTML = dashboardData.stats.map((stat) => {
        return `
            <article class="stat-card stat-card-${stat.tone}">
                <strong class="stat-card-value">${stat.value}</strong>
                <span class="stat-card-label">${stat.label}</span>
                <span class="stat-card-icon"><i class="fa-solid ${stat.icon}" aria-hidden="true"></i></span>
            </article>
        `;
    }).join("");
}

function renderSchedule(elements) {
    elements.scheduleGrid.innerHTML = weekDays.map((day) => {
        const classes = dashboardData.schedule.filter((item) => item.day === day);
        const classCards = classes.length
            ? classes.map((item) => createClassCard(item)).join("")
            : '<span class="empty-day">Sin clases asignadas</span>';

        return `
            <section class="day-column" aria-label="${day}">
                <h3>${day}</h3>
                ${classCards}
            </section>
        `;
    }).join("");
}

function createClassCard(classItem) {
    return `
        <article class="class-card" style="--accent: ${classItem.accent}">
            <strong>${classItem.subject}</strong>
            <p>${classItem.time} | ${classItem.room}</p>
            <p>${classItem.teacher} | ${classItem.mode}</p>
        </article>
    `;
}

function renderNextClass(elements) {
    const nextClass = dashboardData.schedule[0];

    elements.nextClassTitle.textContent = nextClass.subject;
    elements.nextClassDetail.textContent = `${nextClass.day}, ${nextClass.time} | ${nextClass.room}`;
}

function renderGrades(elements) {
    elements.gradesList.innerHTML = dashboardData.grades.map((grade) => {
        const progress = Math.min(100, Math.max(0, grade.score * 5));

        return `
            <article class="grade-item">
                <div class="grade-header">
                    <strong>${grade.subject}</strong>
                    <span class="grade-score">${grade.score}/20</span>
                </div>
                <div class="progress-bar" aria-label="Progreso de nota ${grade.score} sobre 20">
                    <span style="--value: ${progress}%"></span>
                </div>
                <p>${grade.status}</p>
            </article>
        `;
    }).join("");
}

function renderStackList(container, items) {
    container.innerHTML = items.map((item) => {
        return `
            <article class="stack-item">
                <span class="stack-icon"><i class="fa-solid ${item.icon}" aria-hidden="true"></i></span>
                <div>
                    <strong>${item.title}</strong>
                    <p>${item.text}</p>
                    <span class="stack-meta">${item.time}</span>
                </div>
            </article>
        `;
    }).join("");
}

function getCurrentRole() {
    const role = localStorage.getItem(ROLE_STORAGE_KEY) || "student";
    return roleDashboards[role] ? role : "student";
}

function getSessionName(fallbackName) {
    return localStorage.getItem("psm_user_name") || fallbackName;
}

function renderNavigation(elements, navItems) {
    elements.sidebarNav.innerHTML = navItems.map((item, index) => {
        return `
            <a class="nav-link${index === 0 ? " active" : ""}" href="${item.href}">
                <i class="fa-solid ${item.icon}" aria-hidden="true"></i>
                <span>${item.label}</span>
            </a>
        `;
    }).join("");
}

function renderRoleIdentity(elements, experience) {
    const name = getSessionName(experience.identity.name);
    const firstName = name.split(" ")[0];
    const savedProfile = loadSavedProfile();

    elements.welcomeName.textContent = firstName;
    elements.studentName.textContent = name;
    elements.studentCareer.textContent = getCurrentRole() === "teacher" && savedProfile.career
        ? `Docente | ${savedProfile.career}`
        : experience.identity.subtitle;
    renderAvatar(elements.studentAvatar, {
        name,
        photo: savedProfile.photo || ""
    });
    elements.topbarEyebrow.textContent = experience.topbarLabel;
}

function renderRoleHero(elements, hero) {
    const status = elements.heroPanel.querySelector(".status-pill");
    const title = elements.heroPanel.querySelector("h2");
    const text = elements.heroPanel.querySelector("p");
    const highlightLabel = elements.heroPanel.querySelector(".hero-next-class span");

    status.textContent = hero.status;
    title.textContent = hero.title;
    text.textContent = hero.text;
    highlightLabel.textContent = hero.highlightLabel;
    elements.nextClassTitle.textContent = hero.highlightTitle;
    elements.nextClassDetail.textContent = hero.highlightDetail;
}

function getTeacherHero(experience) {
    const selectedSection = getSelectedTeacherSection();

    return {
        ...experience.hero,
        status: `${selectedSection.period} | ${selectedSection.code} | Seccion ${selectedSection.section}`,
        title: `${selectedSection.subject} | Seccion ${selectedSection.section}`,
        text: `Estas trabajando en ${selectedSection.room}. Usa este contexto para asistencia, notas, planificacion y seguimiento.`,
        highlightLabel: "Asignatura activa",
        highlightTitle: selectedSection.code,
        highlightDetail: `${selectedSection.nextClass} | ${selectedSection.schedule}`
    };
}

function renderRoleStats(elements, stats) {
    elements.statsGrid.innerHTML = stats.map((stat) => {
        return `
            <article class="stat-card stat-card-${stat.tone}">
                <strong class="stat-card-value">${stat.value}</strong>
                <span class="stat-card-label">${stat.label}</span>
                <span class="stat-card-icon"><i class="fa-solid ${stat.icon}" aria-hidden="true"></i></span>
            </article>
        `;
    }).join("");
}

function countPendingGrades(section) {
    return section.students.reduce((total, student) => {
        return total + Object.values(student.grades).filter((grade) => grade === "" || grade === null || grade === undefined).length;
    }, 0);
}

function getTeacherRiskStudents(section) {
    return section.students
        .map((student) => ({ ...student, risk: getStudentRisk(student) }))
        .filter((student) => student.risk);
}

function getTeacherStats(experience) {
    const section = getSelectedTeacherSection();

    return [
        {
            label: "Secciones activas",
            value: String(experience.sections.length),
            icon: "fa-chalkboard-user",
            tone: "blue"
        },
        {
            label: "Estudiantes",
            value: String(section.students.length),
            icon: "fa-users",
            tone: "sky"
        },
        {
            label: "Notas pendientes",
            value: String(countPendingGrades(section)),
            icon: "fa-pen-to-square",
            tone: "gold"
        },
        {
            label: "Riesgo academico",
            value: String(getTeacherRiskStudents(section).length),
            icon: "fa-triangle-exclamation",
            tone: "red"
        }
    ];
}

function renderRolePanels(elements, panels) {
    elements.contentGrid.innerHTML = panels.map((panel) => {
        return `
            <article id="${panel.id}" class="panel role-panel role-panel-${panel.type}">
                <div class="section-heading">
                    <div>
                        <p>${panel.kicker}</p>
                        <h2>${panel.title}</h2>
                    </div>
                </div>
                ${renderRolePanelContent(panel)}
            </article>
        `;
    }).join("");
}

function renderRolePanelContent(panel) {
    const renderers = {
        cards: renderRoleCards,
        attendance: renderAttendanceList,
        table: renderRoleTable,
        timeline: renderTimelineList,
        people: renderPeopleList,
        actions: renderActionList,
        metrics: renderMetricList,
        teacherSections: renderTeacherSections,
        teacherContext: renderTeacherContext,
        teacherAttendance: renderTeacherAttendance,
        teacherGradebook: renderTeacherGradebook,
        teacherPlanning: renderTeacherPlanning,
        teacherRisk: renderTeacherRisk
    };

    return renderers[panel.type] ? renderers[panel.type](panel) : "";
}

function renderTeacherSections() {
    const experience = getTeacherExperience();

    return `
        <div class="teacher-section-grid">
            ${experience.sections.map((section) => `
                <button class="teacher-section-card${section.id === selectedTeacherSectionId ? " is-selected" : ""}" type="button" data-section-id="${section.id}" style="--section-accent: ${section.accent}">
                    <span>${section.code} | Seccion ${section.section}</span>
                    <strong>${section.subject}</strong>
                    <small>${section.schedule}</small>
                    <em>${section.students.length} alumnos | ${section.status}</em>
                </button>
            `).join("")}
        </div>
    `;
}

function renderTeacherContext() {
    const section = getSelectedTeacherSection();
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

function renderTeacherPlanning() {
    const section = getSelectedTeacherSection();

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

function getStudentRisk(student) {
    const gradePlan = getTeacherExperience().gradePlan;
    const completedCuts = getCompletedCutScores(student.grades, gradePlan);

    if (completedCuts.length < 2) {
        return null;
    }

    const lowCuts = completedCuts.filter((cut) => cut.score <= 8);

    if (lowCuts.length >= 2) {
        return {
            badge: "Alto",
            reason: lowCuts.map((cut) => `${cut.cut}: ${formatGrade(cut.score)}`).join(" | ")
        };
    }

    return null;
}

function renderTeacherRisk() {
    const section = getSelectedTeacherSection();
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

function renderStudentIdentity(student, detail) {
    return `
        <div class="student-mini-identity">
            <span class="student-mini-avatar" aria-hidden="true">
                <i class="fa-solid fa-user-graduate"></i>
            </span>
            <div>
                <strong>${student.name}</strong>
                <span>${detail || student.document}</span>
            </div>
        </div>
    `;
}

function renderTeacherAttendance() {
    const section = getSelectedTeacherSection();
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
            ${section.students.map((student) => `
                <article class="attendance-item">
                    ${renderStudentIdentity(student)}
                    <div class="attendance-controls" aria-label="Asistencia de ${student.name}" data-student-index="${section.students.indexOf(student)}">
                        ${["Presente", "Tarde", "Ausente"].map((status) => `
                            <button class="attendance-chip${getAttendanceStatus(section.id, student, selectedAttendanceDate) === status ? " is-active" : ""}" type="button" data-attendance-status="${status}">${status}</button>
                        `).join("")}
                    </div>
                </article>
            `).join("")}
        </div>
    `;
}

function renderTeacherGradebook() {
    const experience = getTeacherExperience();
    const section = getSelectedTeacherSection();
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
    `;
}

function renderRoleCards(panel) {
    return `
        <div class="role-card-grid">
            ${panel.items.map((item) => `
                <article class="role-card-item">
                    <div>
                        <strong>${item.title}</strong>
                        <span>${item.meta}</span>
                    </div>
                    <p>${item.text}</p>
                    <em>${item.status}</em>
                </article>
            `).join("")}
        </div>
    `;
}

function renderAttendanceList(panel) {
    return `
        <div class="attendance-list">
            ${panel.items.map((item) => `
                <article class="attendance-item">
                    <div>
                        <strong>${item.name}</strong>
                        <span>${item.document}</span>
                    </div>
                    <div class="attendance-controls" aria-label="Asistencia de ${item.name}">
                        ${["Presente", "Tarde", "Ausente"].map((status) => `
                            <button class="attendance-chip${item.status === status ? " is-active" : ""}" type="button">${status}</button>
                        `).join("")}
                    </div>
                </article>
            `).join("")}
        </div>
    `;
}

function renderRoleTable(panel) {
    return `
        <div class="role-table-wrap">
            <table class="role-table">
                <thead>
                    <tr>${panel.columns.map((column) => `<th>${column}</th>`).join("")}</tr>
                </thead>
                <tbody>
                    ${panel.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function renderTimelineList(panel) {
    return `
        <div class="timeline-list">
            ${panel.items.map((item) => `
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

function renderPeopleList(panel) {
    return `
        <div class="people-list">
            ${panel.items.map((item) => `
                <article class="person-row">
                    <div>
                        <strong>${item.name}</strong>
                        <span>${item.detail}</span>
                    </div>
                    <em>${item.badge}</em>
                </article>
            `).join("")}
        </div>
    `;
}

function renderActionList(panel) {
    if (getCurrentRole() === "teacher" && panel.id === "teacher-messages") {
        return renderTeacherActions(panel);
    }

    return `
        <div class="action-list">
            ${panel.items.map((item) => `
                <button class="action-row" type="button">
                    <span><i class="fa-solid ${item.icon}" aria-hidden="true"></i></span>
                    <div>
                        <strong>${item.title}</strong>
                        <small>${item.text}</small>
                    </div>
                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </button>
            `).join("")}
        </div>
    `;
}

function renderTeacherActions(panel) {
    const section = getSelectedTeacherSection();

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
        ${lastLabRequest ? renderLabRequestSummary() : ""}
    `;
}

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

function renderLabRequestSummary() {
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

function renderMetricList(panel) {
    return `
        <div class="metric-grid">
            ${panel.items.map((item) => `
                <article class="metric-card">
                    <span>${item.label}</span>
                    <strong>${item.value}</strong>
                </article>
            `).join("")}
        </div>
    `;
}

function refreshTeacherPanels(elements) {
    const experience = getTeacherExperience();

    renderRoleHero(elements, getTeacherHero(experience));
    renderRoleStats(elements, getTeacherStats(experience));
    renderRolePanels(elements, experience.panels);
    addPanelActions();
    bindRolePanelEvents(elements);
}

function bindRolePanelEvents(elements) {
    document.querySelectorAll(".teacher-section-card").forEach((button) => {
        button.addEventListener("click", (event) => {
            selectedTeacherSectionId = event.currentTarget.dataset.sectionId;
            refreshTeacherPanels(elements);
        });
    });

    const attendanceDateInput = document.querySelector("#attendance-date-input");

    if (attendanceDateInput) {
        attendanceDateInput.addEventListener("change", (event) => {
            selectedAttendanceDate = event.currentTarget.value || new Date().toISOString().slice(0, 10);
            refreshTeacherPanels(elements);
            document.querySelector("#attendance")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    document.querySelectorAll(".attendance-chip").forEach((button) => {
        button.addEventListener("click", (event) => {
            const controls = event.currentTarget.closest(".attendance-controls");
            const section = getSelectedTeacherSection();
            const student = section.students[Number(controls.dataset.studentIndex)];
            const status = event.currentTarget.dataset.attendanceStatus || event.currentTarget.textContent.trim();

            if (student) {
                student.attendance = status;
                setAttendanceStatus(section.id, student, selectedAttendanceDate, status);
            }

            refreshTeacherPanels(elements);
            document.querySelector("#attendance")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    document.querySelectorAll(".grade-input").forEach((input) => {
        input.addEventListener("change", (event) => {
            const section = getSelectedTeacherSection();
            const student = section.students[Number(event.currentTarget.dataset.studentIndex)];
            const gradeKey = event.currentTarget.dataset.gradeKey;

            if (!student || !gradeKey) {
                return;
            }

            student.grades[gradeKey] = event.currentTarget.value === "" ? "" : getNumericGrade(event.currentTarget.value);
            refreshTeacherPanels(elements);
            document.querySelector("#gradebook")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    document.querySelectorAll(".contact-student-button").forEach((button) => {
        button.addEventListener("click", (event) => {
            const studentName = event.currentTarget.dataset.studentName;

            event.currentTarget.classList.add("is-confirmed");
            event.currentTarget.querySelector("span").textContent = `Mensaje listo para ${studentName.split(" ")[0]}`;
            window.setTimeout(() => {
                event.currentTarget.classList.remove("is-confirmed");
                event.currentTarget.querySelector("span").textContent = "Contactar";
            }, 1600);
        });
    });

    document.querySelectorAll(".lab-request-trigger").forEach((button) => {
        button.addEventListener("click", () => {
            isLabRequestOpen = true;
            refreshTeacherPanels(elements);
            document.querySelector("#teacher-messages")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    document.querySelectorAll("[data-close-lab-request]").forEach((button) => {
        button.addEventListener("click", () => {
            isLabRequestOpen = false;
            refreshTeacherPanels(elements);
            document.querySelector("#teacher-messages")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    const labRequestForm = document.querySelector("#lab-request-form");

    if (labRequestForm) {
        labRequestForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const section = getSelectedTeacherSection();
            const formData = new FormData(event.currentTarget);

            lastLabRequest = {
                subject: section.subject,
                section: section.section,
                lab: formData.get("lab"),
                date: formData.get("date"),
                startTime: formData.get("startTime"),
                endTime: formData.get("endTime"),
                reason: formData.get("reason")
            };
            isLabRequestOpen = false;
            refreshTeacherPanels(elements);
            document.querySelector("#teacher-messages")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    document.querySelectorAll(".action-row").forEach((button) => {
        button.addEventListener("click", () => {
            if (button.classList.contains("lab-request-trigger")) {
                return;
            }

            button.classList.add("is-confirmed");
            window.setTimeout(() => button.classList.remove("is-confirmed"), 900);
        });
    });
}

let currentNewsIndex = 0;

function renderNews(elements) {
    const item = dashboardData.news[currentNewsIndex];

    if (!item) {
        elements.newsList.innerHTML = '<p class="muted">No hay noticias disponibles.</p>';
        return;
    }

    elements.newsList.innerHTML = `
        <div class="news-carousel simple-carousel" aria-live="polite">
            <button class="carousel-nav carousel-prev" type="button" aria-label="Noticia anterior">‹</button>
            <article class="news-slide is-active" role="group" aria-label="${currentNewsIndex + 1} de ${dashboardData.news.length}">
                <button class="news-slide-image" type="button" data-open-lightbox="${currentNewsIndex}" aria-label="Ver flyer: ${item.title}">
                    <img src="${item.image || ''}" alt="${item.title}" loading="eager">
                </button>
                <div class="news-slide-info">
                    <time class="news-date">${item.date}</time>
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                    <button class="ghost-button" type="button" data-open-lightbox="${currentNewsIndex}">Ver imagen</button>
                </div>
            </article>
            <button class="carousel-nav carousel-next" type="button" aria-label="Siguiente noticia">›</button>
            <div class="carousel-dots" aria-label="Indicadores de noticias">
                ${dashboardData.news.map((_, index) => `<button type="button" class="carousel-dot${index === currentNewsIndex ? ' is-active' : ''}" data-news-index="${index}" aria-label="Ir a noticia ${index + 1}"></button>`).join('')}
            </div>
        </div>
    `;

    initNewsCarousel(elements);
}

function openNewsLightbox(elements, index) {
    currentLightboxIndex = index;
    showLightboxAt(index);
}

function showLightboxAt(index) {
    const newsItem = dashboardData.news[index];
    const lightbox = document.querySelector('#news-lightbox');
    const img = document.querySelector('#news-lightbox-img');
    const title = document.querySelector('#news-lightbox-title');
    const text = document.querySelector('#news-lightbox-text');
    const date = document.querySelector('#news-lightbox-date');
    const download = document.querySelector('#news-lightbox-download');

    img.src = newsItem.image || '';
    img.alt = newsItem.title || 'Flyer noticia';
    title.textContent = newsItem.title || '';
    text.textContent = newsItem.text || '';
    date.textContent = newsItem.date || '';
    download.href = newsItem.image || '#';

    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('news-lightbox-open');
}

// Carousel functions
function initNewsCarousel(elements) {
    const prev = elements.newsList.querySelector('.carousel-prev');
    const next = elements.newsList.querySelector('.carousel-next');
    const dots = elements.newsList.querySelectorAll('.carousel-dot');

    function goTo(index) {
        currentNewsIndex = (index + dashboardData.news.length) % dashboardData.news.length;
        renderNews(elements);
    }

    if (dashboardData.news.length <= 1) {
        prev.hidden = true;
        next.hidden = true;
    }

    prev.addEventListener('click', () => goTo(currentNewsIndex - 1));
    next.addEventListener('click', () => goTo(currentNewsIndex + 1));

    dots.forEach((dot) => {
        dot.addEventListener('click', (event) => {
            goTo(Number(event.currentTarget.dataset.newsIndex));
        });
    });

    elements.newsList.querySelectorAll('[data-open-lightbox]').forEach((button) => {
        button.addEventListener('click', (event) => {
            openNewsLightbox(elements, Number(event.currentTarget.dataset.openLightbox));
        });
    });
}

function addPanelActions() {
    document.querySelectorAll('.section-heading').forEach((heading) => {
        if (heading.querySelector('.panel-actions')) return;
        const actions = document.createElement('div');
        actions.className = 'panel-actions';

        const exportBtn = document.createElement('button');
        exportBtn.type = 'button';
        exportBtn.title = 'Exportar datos';
        exportBtn.innerHTML = '<i class="fa-solid fa-file-export" aria-hidden="true"></i>';
        exportBtn.addEventListener('click', () => exportPanel(heading));

        const filterBtn = document.createElement('button');
        filterBtn.type = 'button';
        filterBtn.title = 'Filtrar contenido';
        filterBtn.innerHTML = '<i class="fa-solid fa-filter" aria-hidden="true"></i>';
        filterBtn.addEventListener('click', () => filterPanel(heading));

        actions.appendChild(exportBtn);
        actions.appendChild(filterBtn);
        heading.appendChild(actions);
    });
}

function exportPanel(heading) {
    const article = heading.closest('article');
    if (!article) return;
    const id = article.id;
    const role = getCurrentRole();
    const rolePanel = roleDashboards[role]?.panels.find((panel) => panel.id === id);
    const teacherContextData = role === "teacher" && ["section-context", "attendance", "gradebook"].includes(id)
        ? { panel: id, section: getSelectedTeacherSection(), gradePlan: getTeacherExperience().gradePlan }
        : null;
    const map = {
        schedule: dashboardData.schedule,
        notifications: dashboardData.notifications,
        grades: dashboardData.grades,
        messages: dashboardData.messages,
        news: dashboardData.news,
        pensum: dashboardData.pensum
    };
    const data = teacherContextData || rolePanel || map[id] || { message: 'No hay datos exportables para este panel.' };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id || 'panel'}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function filterPanel(heading) {
    const query = prompt('Texto a filtrar (vacío para reset):');
    const article = heading.closest('article');
    if (!article) return;
    const container = article.querySelector('.stack-list, .grades-list, .news-grid, .pensum-list, .schedule-grid, .stats-grid, .role-card-grid, .attendance-list, .role-table tbody, .timeline-list, .people-list, .action-list, .metric-grid');
    if (!container) return;
    const items = Array.from(container.children);
    if (!query) {
        items.forEach(i => i.style.display = '');
        return;
    }
    const q = query.toLowerCase();
    items.forEach((it) => {
        const text = it.innerText.toLowerCase();
        it.style.display = text.includes(q) ? '' : 'none';
    });
}

function closeNewsLightbox() {
    const lightbox = document.querySelector('#news-lightbox');
    const img = document.querySelector('#news-lightbox-img');

    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    img.src = '';
    document.body.classList.remove('news-lightbox-open');
    currentLightboxIndex = null;
}

function showNextNews() {
    if (currentLightboxIndex === null) return;
    const next = (currentLightboxIndex + 1) % dashboardData.news.length;
    currentLightboxIndex = next;
    showLightboxAt(next);
}

function showPrevNews() {
    if (currentLightboxIndex === null) return;
    const prev = (currentLightboxIndex - 1 + dashboardData.news.length) % dashboardData.news.length;
    currentLightboxIndex = prev;
    showLightboxAt(prev);
}

function toggleSidebar(elements, isOpen) {
    elements.sidebar.classList.toggle("is-open", isOpen);
    elements.overlay.hidden = !isOpen;
}

function bindEvents(elements) {
    elements.menuButton.addEventListener("click", () => toggleSidebar(elements, true));
    elements.overlay.addEventListener("click", () => toggleSidebar(elements, false));
    elements.profileButton.addEventListener("click", () => openProfileModal(elements));
    elements.profilePhotoInput.addEventListener("change", (event) => handleProfilePhotoChange(event, elements));
    elements.profileForm.addEventListener("submit", (event) => handleProfileSubmit(event, elements));
    elements.profileModal.querySelectorAll("[data-profile-close]").forEach((button) => {
        button.addEventListener("click", () => closeProfileModal(elements));
    });
    document.addEventListener("keydown", (event) => handleProfileKeyboard(event, elements));

    // lightbox close bindings
    const lightboxClose = document.querySelector('#news-lightbox-close');
    const lightboxBackdrop = document.querySelector('.news-lightbox-backdrop');
    if (lightboxClose) lightboxClose.addEventListener('click', () => closeNewsLightbox());
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', () => closeNewsLightbox());
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeNewsLightbox();
        }
    });

    const lightboxPrev = document.querySelector('#news-lightbox-prev');
    const lightboxNext = document.querySelector('#news-lightbox-next');
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => showPrevNews());
    if (lightboxNext) lightboxNext.addEventListener('click', () => showNextNews());
    // keyboard left/right navigation
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('#news-lightbox') && !document.querySelector('#news-lightbox').hidden) {
            if (e.key === 'ArrowRight') showNextNews();
            if (e.key === 'ArrowLeft') showPrevNews();
        }
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => toggleSidebar(elements, false));
    });

    elements.logoutButton.addEventListener("click", () => {
        localStorage.removeItem("psm_auth_token");
        localStorage.removeItem("psm_user_role");
        localStorage.removeItem("psm_user_name");
        localStorage.removeItem("psm_user_document");
        window.location.href = "../index.html";
    });
}

function renderDashboard() {
    const elements = getElements();
    const role = getCurrentRole();

    document.body.dataset.role = role;

    if (role !== "student") {
        const experience = roleDashboards[role];

        renderNavigation(elements, experience.nav);
        renderRoleIdentity(elements, experience);
        if (role === "teacher") {
            renderRoleHero(elements, getTeacherHero(experience));
            renderRoleStats(elements, getTeacherStats(experience));
        } else {
            renderRoleHero(elements, experience.hero);
            renderRoleStats(elements, experience.stats);
        }
        renderRolePanels(elements, experience.panels);
        elements.notificationCount.textContent = experience.notificationsCount;
        elements.profileButton.hidden = role === "admin";
        addPanelActions();
        bindEvents(elements);
        bindRolePanelEvents(elements);
        return;
    }

    renderNavigation(elements, studentNavigation);
    elements.topbarEyebrow.textContent = "Panel academico";
    elements.profileButton.hidden = false;
    loadProfileData();
    renderStudent(elements);
    renderStats(elements);
    renderSchedule(elements);
    renderNextClass(elements);
    renderGrades(elements);
    renderStackList(elements.notificationsList, dashboardData.notifications);
    renderStackList(elements.messagesList, dashboardData.messages);
    renderPensum(elements);
    renderNews(elements);
    addPanelActions();
    elements.notificationCount.textContent = dashboardData.notifications.length;
    bindEvents(elements);
}

function revealDashboard() {
    window.setTimeout(() => {
        document.body.classList.remove("dashboard-loading");
        document.body.classList.add("dashboard-ready");
    }, DASHBOARD_LOADER_DELAY_MS);
}

document.addEventListener("DOMContentLoaded", () => {
    guardSession();
    renderDashboard();
    revealDashboard();
});
