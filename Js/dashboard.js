"use strict";

const DASHBOARD_LOADER_DELAY_MS = 1400;
const PROFILE_STORAGE_KEY = "psm_profile_data";
const ROLE_STORAGE_KEY = "psm_user_role";
const ATTENDANCE_STORAGE_KEY = "psm_teacher_attendance_records";
const TEACHER_GRADES_STORAGE_KEY = "psm_teacher_grade_records";
const SETTINGS_STORAGE_KEY = "psm_dashboard_settings";

const dashboardData = window.PSM_DASHBOARD_DATA || {};
const weekDays = window.PSM_WEEK_DAYS || [];

const studentNavigation = window.PSM_STUDENT_NAVIGATION || [];
const studentModules = window.PSM_STUDENT_MODULES || {};
const teacherModules = window.PSM_TEACHER_MODULES || {};
const adminModules = window.PSM_ADMIN_MODULES || {};
const roleDashboards = window.PSM_ROLES || {};

const CAREER_WATERMARKS = [
    { match: "sistemas", icon: "fa-laptop-code", label: "Sistemas" },
    { match: "civil", icon: "fa-helmet-safety", label: "Civil" },
    { match: "arquitectura", icon: "fa-drafting-compass", label: "Arquitectura" },
    { match: "industrial", icon: "fa-industry", label: "Industrial" },
    { match: "electrica", icon: "fa-bolt", label: "Electrica" },
    { match: "electronica", icon: "fa-microchip", label: "Electronica" },
    { match: "mantenimiento", icon: "fa-gears", label: "Mantenimiento" },
    { match: "diseno", icon: "fa-pen-nib", label: "Diseno" },
    { match: "quimica", icon: "fa-flask", label: "Quimica" },
    { match: "petroleo", icon: "fa-oil-well", label: "Petroleo" }
];

const DEFAULT_SETTINGS = {
    compactMode: false,
    reducedMotion: false,
    reminderAlerts: true
};

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

function loadTeacherGradeRecords() {
    const savedRecords = localStorage.getItem(TEACHER_GRADES_STORAGE_KEY);

    if (!savedRecords) {
        return {};
    }

    try {
        return JSON.parse(savedRecords);
    } catch (error) {
        localStorage.removeItem(TEACHER_GRADES_STORAGE_KEY);
        return {};
    }
}

function saveTeacherGradeRecords(records) {
    localStorage.setItem(TEACHER_GRADES_STORAGE_KEY, JSON.stringify(records));
}

function applySavedTeacherGrades() {
    const experience = getTeacherExperience();
    const records = loadTeacherGradeRecords();

    if (!experience || !experience.sections) {
        return;
    }

    experience.sections.forEach((section) => {
        const sectionGrades = records[section.id];

        if (!sectionGrades) {
            return;
        }

        section.students.forEach((student) => {
            if (sectionGrades[student.document]) {
                student.grades = {
                    ...student.grades,
                    ...sectionGrades[student.document]
                };
            }
        });
    });
}

function saveCurrentSectionGrades(section) {
    const records = loadTeacherGradeRecords();

    records[section.id] = section.students.reduce((sectionGrades, student) => {
        return {
            ...sectionGrades,
            [student.document]: student.grades
        };
    }, {});

    saveTeacherGradeRecords(records);
}

function saveCurrentAttendance(section, date) {
    section.students.forEach((student) => {
        setAttendanceStatus(section.id, student, date, getAttendanceStatus(section.id, student, date));
    });
}

function confirmPanelSubmit(button, confirmedText) {
    const label = button.querySelector("span");
    const originalText = label ? label.textContent : button.textContent;

    button.classList.add("is-confirmed");
    if (label) {
        label.textContent = confirmedText;
    } else {
        button.textContent = confirmedText;
    }
    window.setTimeout(() => {
        button.classList.remove("is-confirmed");
        if (label) {
            label.textContent = originalText;
        } else {
            button.textContent = originalText;
        }
    }, 1400);
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
        requestsList: document.querySelector("#requests-list"),
        requestsButton: document.querySelector("#requests-button"),
        requestsModal: document.querySelector("#requests-modal"),
        requestsCloseButton: document.querySelector("#requests-close-button"),
        newsList: document.querySelector("#news-list"),
        searchInput: document.querySelector("#dashboard-search-input"),
        notificationCount: document.querySelector("#notification-count"),
        nextClassTitle: document.querySelector("#next-class-title"),
        nextClassDetail: document.querySelector("#next-class-detail"),
        pensumList: document.querySelector("#pensum-list"),
        sidebarNav: document.querySelector(".sidebar-nav"),
        contentGrid: document.querySelector(".content-grid"),
        topbarEyebrow: document.querySelector(".topbar-title p"),
        heroPanel: document.querySelector("#overview"),
        settingsControl: document.querySelector(".settings-control"),
        settingsButton: document.querySelector("#settings-button"),
        settingsQuickMenu: document.querySelector("#settings-quick-menu"),
        settingsModal: document.querySelector("#settings-modal"),
        settingsCloseButton: document.querySelector("#settings-close-button"),
        settingsForm: document.querySelector("#settings-form"),
        settingsCompactMode: document.querySelector("#setting-compact-mode"),
        settingsReducedMotion: document.querySelector("#setting-reduced-motion"),
        settingsReminderAlerts: document.querySelector("#setting-reminder-alerts"),
        settingsResetButton: document.querySelector("#settings-reset-button"),
        settingsClearExpired: document.querySelector("#settings-clear-expired"),
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

function loadSettings() {
    try {
        return {
            ...DEFAULT_SETTINGS,
            ...JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || "{}")
        };
    } catch (error) {
        localStorage.removeItem(SETTINGS_STORAGE_KEY);
        return { ...DEFAULT_SETTINGS };
    }
}

function saveSettings(settings) {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

function applySettings(settings = loadSettings()) {
    document.body.classList.toggle("pref-compact", settings.compactMode);
    document.body.classList.toggle("pref-reduced-motion", settings.reducedMotion);
}

function syncSettingsForm(elements) {
    const settings = loadSettings();

    elements.settingsCompactMode.checked = settings.compactMode;
    elements.settingsReducedMotion.checked = settings.reducedMotion;
    elements.settingsReminderAlerts.checked = settings.reminderAlerts;
}

function openSettingsModal(elements, focusSection = null) {
    elements.settingsControl.classList.add("is-menu-dismissed");
    syncSettingsForm(elements);
    elements.settingsModal.hidden = false;
    elements.settingsModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("settings-modal-open");

    if (focusSection) {
        elements.settingsModal.querySelector(`[data-settings-section="${focusSection}"]`)?.scrollIntoView({ block: "center" });
    }

    elements.settingsCloseButton.focus();
}

function closeSettingsModal(elements) {
    elements.settingsModal.hidden = true;
    elements.settingsModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("settings-modal-open");
    elements.settingsControl.classList.add("is-menu-dismissed");
    elements.settingsButton.blur();
}

function openRequestsModal(elements) {
    studentModules.solicitudes?.render(elements, dashboardData);
    elements.requestsModal.hidden = false;
    elements.requestsModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("requests-modal-open");
    elements.requestsCloseButton.focus();
}

function closeRequestsModal(elements, force = false) {
    const closeModal = () => {
        elements.requestsModal.hidden = true;
        elements.requestsModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("requests-modal-open");
        elements.requestsButton.blur();
    };

    if (!force && studentModules.solicitudes?.handleCloseRequest) {
        studentModules.solicitudes.handleCloseRequest(elements, closeModal);
        return;
    }

    closeModal();
}

function handleSettingsSubmit(event, elements) {
    event.preventDefault();
    const settings = {
        compactMode: elements.settingsCompactMode.checked,
        reducedMotion: elements.settingsReducedMotion.checked,
        reminderAlerts: elements.settingsReminderAlerts.checked
    };

    saveSettings(settings);
    applySettings(settings);
    confirmPanelSubmit(event.submitter || elements.settingsForm.querySelector(".settings-save-button"), "Guardado");
}

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

function normalizeText(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function renderCareerWatermark(career) {
    const watermark = document.querySelector("#career-watermark");

    if (!watermark) {
        return;
    }

    const normalizedCareer = normalizeText(career || "");
    const careerWatermark = CAREER_WATERMARKS.find((item) => normalizedCareer.includes(item.match)) || {
        icon: "fa-graduation-cap",
        label: "Carrera"
    };

    watermark.innerHTML = `<i class="fa-solid ${careerWatermark.icon}" aria-hidden="true"></i><span>${careerWatermark.label}</span>`;
}

function renderStudent(elements) {
    const firstName = dashboardData.student.name.split(" ")[0];

    elements.welcomeName.textContent = firstName;
    elements.studentName.textContent = dashboardData.student.name;
    elements.studentCareer.textContent = `${dashboardData.student.career} - ${dashboardData.student.semester}`;
    renderCareerWatermark(dashboardData.student.career);
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

function getCurrentRole() {
    const role = localStorage.getItem(ROLE_STORAGE_KEY) || "student";
    return roleDashboards[role] ? role : "student";
}

function getSessionName(fallbackName) {
    return localStorage.getItem("psm_user_name") || fallbackName;
}

function getTeacherDisplayName(name) {
    return name.replace(/^(profesora|profesor|profa|prof)\.?\s*/i, "").trim() || name;
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

function syncTopbarSearch(elements, role) {
    if (!elements.searchInput) {
        return;
    }

    const placeholders = {
           student: "Buscar materias, solicitudes, noticias o mensajes",
        teacher: "Buscar secciones, estudiantes, asistencia o notas",
        admin: "Buscar usuarios, solicitudes, noticias o auditoria"
    };

    elements.searchInput.placeholder = placeholders[role] || placeholders.student;
}

function renderRoleIdentity(elements, experience) {
    const name = getSessionName(experience.identity.name);
    const isTeacher = getCurrentRole() === "teacher";
    const cleanName = isTeacher ? getTeacherDisplayName(name) : name;
    const displayName = isTeacher ? cleanName : cleanName.split(" ")[0];
    const savedProfile = loadSavedProfile();

    elements.welcomeName.textContent = displayName;
    elements.studentName.textContent = cleanName;
    elements.studentCareer.textContent = isTeacher && savedProfile.career
        ? `Docente | ${savedProfile.career}`
        : experience.identity.subtitle;
    renderAvatar(elements.studentAvatar, {
        name: cleanName,
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

function getTeacherModuleContext(panel = null) {
    const experience = getTeacherExperience();
    const section = getSelectedTeacherSection();

    return {
        panel,
        experience,
        section,
        selectedTeacherSectionId,
        selectedAttendanceDate,
        isLabRequestOpen,
        lastLabRequest,
        getAttendanceStatus,
        countPendingGrades,
        getTeacherRiskStudents,
        renderStudentIdentity,
        formatGrade,
        calculateCutScore,
        calculateWeightedFinal
    };
}

function getAdminModuleContext(panel = null) {
    return {
        panel,
        experience: roleDashboards.admin
    };
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
                <div class="section-heading ">
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
        teacherSections: (currentPanel) => teacherModules.secciones?.render(getTeacherModuleContext(currentPanel)) || "",
        teacherContext: (currentPanel) => teacherModules.contexto?.render(getTeacherModuleContext(currentPanel)) || "",
        teacherAttendance: (currentPanel) => teacherModules.asistencia?.render(getTeacherModuleContext(currentPanel)) || "",
        teacherGradebook: (currentPanel) => teacherModules.notas?.render(getTeacherModuleContext(currentPanel)) || "",
        teacherPlanning: (currentPanel) => teacherModules.planificacion?.render(getTeacherModuleContext(currentPanel)) || "",
        teacherRisk: (currentPanel) => teacherModules.riesgo?.render(getTeacherModuleContext(currentPanel)) || "",
        adminUsers: (currentPanel) => adminModules.usuarios?.render(getAdminModuleContext(currentPanel)) || "",
        adminAcademic: (currentPanel) => adminModules.academico?.render(getAdminModuleContext(currentPanel)) || "",
        adminRequests: (currentPanel) => adminModules.solicitudes?.render(getAdminModuleContext(currentPanel)) || "",
        adminMetrics: (currentPanel) => adminModules.metricas?.render(getAdminModuleContext(currentPanel)) || "",
        adminNews: (currentPanel) => adminModules.noticias?.render(getAdminModuleContext(currentPanel)) || "",
        adminAudit: (currentPanel) => adminModules.auditoria?.render(getAdminModuleContext(currentPanel)) || ""
    };

    return renderers[panel.type] ? renderers[panel.type](panel) : "";
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
        return teacherModules.acciones?.render(getTeacherModuleContext(panel)) || "";
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
    if (getCurrentRole() === "admin") {
        bindAdminPanelEvents();
        return;
    }

    document.querySelectorAll(".teacher-section-card").forEach((card) => {
        card.addEventListener("click", (event) => {
            const sectionAction = event.target.closest("[data-section-action]");
            const sectionActionTarget = sectionAction?.getAttribute("href");

            if (sectionAction) {
                event.preventDefault();
            }

            selectedTeacherSectionId = event.currentTarget.dataset.sectionId;
            refreshTeacherPanels(elements);

            if (sectionActionTarget) {
                document.querySelector(sectionActionTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
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

    document.querySelectorAll(".save-attendance-button").forEach((button) => {
        button.addEventListener("click", (event) => {
            const section = getSelectedTeacherSection();

            saveCurrentAttendance(section, selectedAttendanceDate);
            confirmPanelSubmit(event.currentTarget, "Asistencias cargadas");
        });
    });

    document.querySelectorAll(".save-grades-button").forEach((button) => {
        button.addEventListener("click", (event) => {
            const section = getSelectedTeacherSection();

            saveCurrentSectionGrades(section);
            confirmPanelSubmit(event.currentTarget, "Notas actualizadas");
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

function bindAdminPanelEvents() {
    document.querySelectorAll(".admin-filter").forEach((button) => {
        button.addEventListener("click", (event) => {
            const group = event.currentTarget.closest(".admin-filter-group");

            group.querySelectorAll(".admin-filter").forEach((filter) => filter.classList.remove("is-active"));
            event.currentTarget.classList.add("is-active");
        });
    });

    document.querySelectorAll("[data-admin-action]").forEach((button) => {
        button.addEventListener("click", (event) => {
            const actionLabels = {
                "create-user": "Usuario preparado",
                "view-user": "Ficha abierta",
                "toggle-user": "Permisos revisados",
                "manage-section": "Seccion lista",
                "approve-request": "Solicitud aprobada",
                "review-request": "Revision iniciada",
                "create-news": "Noticia preparada",
                "edit-news": "Edicion abierta",
                "publish-news": "Publicacion enviada"
            };
            const label = actionLabels[event.currentTarget.dataset.adminAction] || "Accion lista";

            confirmPanelSubmit(event.currentTarget, label);
        });
    });
}

function addPanelActions() {
    document.querySelectorAll('.section-heading').forEach((heading) => {
        if (heading.querySelector('.panel-actions')) return;
        const article = heading.closest('article');
        const id = article?.id;
        const actions = document.createElement('div');
        actions.className = 'panel-actions';

        if (id === "notifications" || id === "messages") {
            const historyBtn = document.createElement('button');
            historyBtn.type = 'button';
            historyBtn.title = id === "notifications" ? 'Ver historial de avisos' : 'Ver historial de mensajes';
            historyBtn.setAttribute('aria-label', historyBtn.title);
            historyBtn.innerHTML = '<i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i>';
            historyBtn.addEventListener('click', () => resetPanelSearch(article));

            const searchBtn = document.createElement('button');
            searchBtn.type = 'button';
            searchBtn.title = id === "notifications" ? 'Buscar avisos' : 'Buscar mensajes';
            searchBtn.setAttribute('aria-label', searchBtn.title);
            searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>';
            searchBtn.addEventListener('click', () => togglePanelSearch(article, id));

            actions.appendChild(historyBtn);
            actions.appendChild(searchBtn);
            heading.appendChild(actions);
            return;
        }

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

function ensurePanelSearch(article, id) {
    let searchBar = article.querySelector('.panel-search-bar');

    if (searchBar) {
        return searchBar;
    }

    const placeholder = id === "notifications" ? "Buscar por titulo o aviso" : "Buscar por asunto o mensaje";
    searchBar = document.createElement('div');
    searchBar.className = 'panel-search-bar';
    searchBar.hidden = true;
    searchBar.innerHTML = `
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <input type="search" placeholder="${placeholder}" aria-label="${placeholder}">
        <button type="button" aria-label="Limpiar busqueda"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
    `;

    article.querySelector('.section-heading')?.after(searchBar);

    const input = searchBar.querySelector('input');
    const clearButton = searchBar.querySelector('button');

    input.addEventListener('input', () => filterPanelCards(article, input.value));
    clearButton.addEventListener('click', () => {
        input.value = '';
        filterPanelCards(article, '');
        input.focus();
    });

    return searchBar;
}

function togglePanelSearch(article, id) {
    const searchBar = ensurePanelSearch(article, id);
    const input = searchBar.querySelector('input');
    searchBar.hidden = !searchBar.hidden;

    if (!searchBar.hidden) {
        input.focus();
        input.select();
    }
}

function resetPanelSearch(article) {
    const searchBar = article.querySelector('.panel-search-bar');
    const input = searchBar?.querySelector('input');

    if (input) {
        input.value = '';
    }

    filterPanelCards(article, '');
    article.querySelector('.student-alert-list, .student-message-list')?.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterPanelCards(article, query) {
    const normalizedQuery = normalizeText(query);
    const cards = Array.from(article.querySelectorAll('.student-alert-card, .student-message-card'));
    let visibleCount = 0;

    cards.forEach((card) => {
        const searchableText = normalizeText(card.dataset.searchText || card.innerText);
        const isVisible = !normalizedQuery || searchableText.includes(normalizedQuery);
        card.hidden = !isVisible;
        if (isVisible) {
            visibleCount += 1;
        }
    });

    article.classList.toggle('is-search-empty', Boolean(normalizedQuery) && visibleCount === 0);
}

function exportPanel(heading) {
    const article = heading.closest('article');
    if (!article) return;
    const id = article.id;
    const role = getCurrentRole();

    if (role === "student" && id === "schedule" && studentModules.horarioAcademico?.exportSchedulePdf) {
        studentModules.horarioAcademico.exportSchedulePdf(dashboardData, weekDays);
        return;
    }

    const rolePanel = roleDashboards[role]?.panels.find((panel) => panel.id === id);
    const teacherContextData = role === "teacher" && ["section-context", "attendance", "gradebook"].includes(id)
        ? { panel: id, section: getSelectedTeacherSection(), gradePlan: getTeacherExperience().gradePlan }
        : null;
    const map = {
        schedule: dashboardData.schedule,
        notifications: dashboardData.notifications,
        grades: dashboardData.grades,
        messages: dashboardData.messages,
        requests: studentModules.solicitudes?.getRequests?.() || [],
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
    const container = article.querySelector('.stack-list, .grades-list, .news-grid, .pensum-list, .student-requests-list, .schedule-grid, .stats-grid, .role-card-grid, .attendance-list, .role-table tbody, .timeline-list, .people-list, .action-list, .metric-grid');
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

function toggleSidebar(elements, isOpen) {
    elements.sidebar.classList.toggle("is-open", isOpen);
    elements.overlay.hidden = !isOpen;
}

function bindEvents(elements) {
    elements.menuButton.addEventListener("click", () => toggleSidebar(elements, true));
    elements.overlay.addEventListener("click", () => toggleSidebar(elements, false));
    elements.settingsControl.addEventListener("mouseenter", () => elements.settingsControl.classList.remove("is-menu-dismissed"));
    elements.settingsControl.addEventListener("mouseleave", () => elements.settingsControl.classList.remove("is-menu-dismissed"));
    elements.settingsButton.addEventListener("click", () => openSettingsModal(elements));
    elements.settingsQuickMenu.querySelectorAll("[data-settings-open]").forEach((button) => {
        button.addEventListener("click", () => openSettingsModal(elements));
    });
    elements.settingsQuickMenu.querySelectorAll("[data-settings-focus]").forEach((button) => {
        button.addEventListener("click", (event) => openSettingsModal(elements, event.currentTarget.dataset.settingsFocus));
    });
    elements.requestsButton.addEventListener("click", () => openRequestsModal(elements));
    elements.requestsModal.querySelectorAll("[data-requests-close]").forEach((button) => {
        button.addEventListener("click", () => closeRequestsModal(elements));
    });
    elements.settingsModal.querySelectorAll("[data-settings-close]").forEach((button) => {
        button.addEventListener("click", () => closeSettingsModal(elements));
    });
    elements.settingsForm.addEventListener("submit", (event) => handleSettingsSubmit(event, elements));
    elements.settingsResetButton.addEventListener("click", () => {
        saveSettings({ ...DEFAULT_SETTINGS });
        applySettings(DEFAULT_SETTINGS);
        syncSettingsForm(elements);
        confirmPanelSubmit(elements.settingsResetButton, "Listo");
    });
    elements.settingsClearExpired.addEventListener("click", () => {
        const removedCount = studentModules.horarioAcademico?.cleanupExpiredReminders?.() || 0;
        studentModules.horarioAcademico?.render?.(elements, dashboardData, weekDays);
        confirmPanelSubmit(elements.settingsClearExpired, removedCount ? `${removedCount} limpiado(s)` : "Todo al dia");
    });
    elements.profileButton.addEventListener("click", () => openProfileModal(elements));
    elements.profilePhotoInput.addEventListener("change", (event) => handleProfilePhotoChange(event, elements));
    elements.profileForm.addEventListener("submit", (event) => handleProfileSubmit(event, elements));
    elements.profileModal.querySelectorAll("[data-profile-close]").forEach((button) => {
        button.addEventListener("click", () => closeProfileModal(elements));
    });
    document.addEventListener("keydown", (event) => handleProfileKeyboard(event, elements));
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !elements.settingsModal.hidden) {
            closeSettingsModal(elements);
        }

        if (event.key === "Escape" && !elements.requestsModal.hidden) {
            closeRequestsModal(elements);
        }
    });

    // lightbox close bindings
    const lightboxClose = document.querySelector('#news-lightbox-close');
    const lightboxBackdrop = document.querySelector('.news-lightbox-backdrop');
    if (lightboxClose) lightboxClose.addEventListener('click', () => studentModules.noticias?.closeLightbox());
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', () => studentModules.noticias?.closeLightbox());
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            studentModules.noticias?.closeLightbox();
        }
    });

    const lightboxPrev = document.querySelector('#news-lightbox-prev');
    const lightboxNext = document.querySelector('#news-lightbox-next');
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => studentModules.noticias?.showPrev(dashboardData));
    if (lightboxNext) lightboxNext.addEventListener('click', () => studentModules.noticias?.showNext(dashboardData));
    // keyboard left/right navigation
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('#news-lightbox') && !document.querySelector('#news-lightbox').hidden) {
            if (e.key === 'ArrowRight') studentModules.noticias?.showNext(dashboardData);
            if (e.key === 'ArrowLeft') studentModules.noticias?.showPrev(dashboardData);
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
    syncTopbarSearch(elements, role);

    if (role !== "student") {
        const experience = roleDashboards[role];

        renderNavigation(elements, experience.nav);
        renderRoleIdentity(elements, experience);
        if (role === "teacher") {
            applySavedTeacherGrades();
            renderRoleHero(elements, getTeacherHero(experience));
            renderRoleStats(elements, getTeacherStats(experience));
        } else {
            renderRoleHero(elements, experience.hero);
            renderRoleStats(elements, experience.stats);
        }
        renderRolePanels(elements, experience.panels);
        elements.notificationCount.textContent = experience.notificationsCount;
        elements.profileButton.hidden = role === "admin";
        elements.requestsButton.hidden = true;
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
    studentModules.horarioAcademico?.render(elements, dashboardData, weekDays);
    studentModules.horarioAcademico?.renderNextClass(elements, dashboardData);
    studentModules.horarioAcademico?.showStartupReminderAlert(elements);
    studentModules.notas?.render(elements, dashboardData);
    studentModules.notificaciones?.render(elements, dashboardData);
    studentModules.mensajes?.render(elements, dashboardData);
    studentModules.pensum?.render(elements, dashboardData);
    studentModules.noticias?.render(elements, dashboardData);
    elements.requestsButton.hidden = false;
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
    applySettings();
    renderDashboard();
    revealDashboard();
});
