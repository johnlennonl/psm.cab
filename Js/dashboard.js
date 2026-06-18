"use strict";

const DASHBOARD_LOADER_DELAY_MS = 1400;
const PROFILE_STORAGE_KEY = "psm_profile_data";

const dashboardData = {
    student: {
        name: "John Lennon",
        document: "V-24485562",
        career: "Ingenieria de Sistemas",
        birthdate: "2001-10-09",
        semester: "I Semestre",
        average: "17.8",
        enrolledSubjects: 8,
        status: "Activo",
        photo: ""
    },
    stats: [
        { label: "Promedio general", value: "17.8", icon: "fa-chart-simple", tone: "blue" },
        { label: "Materias inscritas", value: "8", icon: "fa-book-open", tone: "gold" },
        { label: "Mensajes nuevos", value: "4", icon: "fa-envelope-open-text", tone: "sky" },
        { label: "Solvencia", value: "OK", icon: "fa-circle-check", tone: "green" }
    ],
    schedule: [
        { day: "Lunes", subject: "Matematica I", time: "12:15 PM - 2:30 PM", room: "Aula por asignar", teacher: "Docente PSM", mode: "Presencial", accent: "#0b3a6e" },
        { day: "Lunes", subject: "Actividad de Orientacion", time: "2:30 PM - 4:00 PM", room: "Aula por asignar", teacher: "Docente PSM", mode: "Presencial", accent: "#067647" },
        { day: "Lunes", subject: "Algebra I", time: "4:00 PM - 5:30 PM", room: "Aula por asignar", teacher: "Docente PSM", mode: "Presencial", accent: "#7a2e0e" },
        { day: "Martes", subject: "Metodologia de la Investigacion I", time: "12:15 PM - 2:30 PM", room: "Aula por asignar", teacher: "Docente PSM", mode: "Presencial", accent: "#6941c6" },
        { day: "Martes", subject: "Actividad de Orientacion", time: "2:30 PM - 4:00 PM", room: "Aula por asignar", teacher: "Docente PSM", mode: "Presencial", accent: "#067647" },
        { day: "Martes", subject: "Algebra I", time: "4:00 PM - 5:30 PM", room: "Aula por asignar", teacher: "Docente PSM", mode: "Presencial", accent: "#7a2e0e" },
        { day: "Miercoles", subject: "Actividad de Formacion Cultural I", time: "12:15 PM - 1:45 PM", room: "Aula por asignar", teacher: "Docente PSM", mode: "Presencial", accent: "#b42318" },
        { day: "Miercoles", subject: "Introduccion a la Computacion", time: "1:45 PM - 4:00 PM", room: "Aula por asignar", teacher: "Docente PSM", mode: "Presencial", accent: "#0e7090" },
        { day: "Jueves", subject: "Matematica I", time: "1:00 PM - 3:15 PM", room: "Aula por asignar", teacher: "Docente PSM", mode: "Presencial", accent: "#0b3a6e" },
        { day: "Jueves", subject: "Introduccion a la Ingenieria de Sistemas", time: "4:00 PM - 6:15 PM", room: "Aula por asignar", teacher: "Docente PSM", mode: "Presencial", accent: "#475467" },
        { day: "Viernes", subject: "Lenguaje y Comunicacion", time: "1:45 PM - 4:00 PM", room: "Aula por asignar", teacher: "Docente PSM", mode: "Presencial", accent: "#175cd3" },
        { day: "Viernes", subject: "Educacion Salud Fisica y Deportes I", time: "4:00 PM - 5:30 PM", room: "Aula por asignar", teacher: "Docente PSM", mode: "Presencial", accent: "#067647" }
    ],
    grades: [
        { subject: "Introduccion a la Computacion", score: 20, status: "Excelente rendimiento" },
        { subject: "Introduccion a la Ingenieria de Sistemas", score: 19, status: "Excelente rendimiento" },
        { subject: "Matematica I", score: 20, status: "Excelente rendimiento" },
        { subject: "Algebra I", score: 17, status: "Aprobado" }
    ],
    notifications: [
        { title: "Nota publicada", text: "Programacion II ya tiene nota del segundo corte.", time: "Hace 12 min", icon: "fa-chart-line" },
        { title: "Horario actualizado", text: "Redes I cambio al laboratorio principal este viernes.", time: "Hoy", icon: "fa-calendar-check" },
        { title: "Solvencia activa", text: "Tu estatus administrativo esta al dia.", time: "Ayer", icon: "fa-circle-check" }
    ],
    messages: [
        { title: "Coordinacion academica", text: "Recuerda validar tu carga academica antes del viernes.", time: "09:20 AM", icon: "fa-building-columns" },
        { title: "Prof. Salazar", text: "Subi material de practica para el laboratorio de Programacion II.", time: "Ayer", icon: "fa-user-tie" },
        { title: "Control de estudios", text: "Disponible constancia de estudios digital.", time: "Lunes", icon: "fa-file-lines" }
    ],
    news: [
        { title: "Jornada de investigacion estudiantil", text: "Participa con tus proyectos academicos y prototipos tecnologicos.", date: "18 Jun 2026", image: "../img/WhatsApp Image 2026-06-18 at 10.26.34 AM (1).jpeg" },
        { title: "Inscripciones intensivo", text: "Consulta materias disponibles para el periodo academico especial.", date: "20 Jun 2026", image: "../img/WhatsApp Image 2026-06-18 at 10.26.34 AM.jpeg" },
        { title: "Feria de empleabilidad", text: "Empresas aliadas visitaran el campus para entrevistas y charlas.", date: "25 Jun 2026", image: "../img/WhatsApp Image 2026-06-18 at 10.27.44 AM.jpeg" }
    ],
    pensum: [
        { semester: "I Semestre", status: "active", subjects: [
            { code: "4701111", name: "ACTIVIDAD DE FORMACION CULTURAL I", ht: "0", hp: "2", hl: "0", th: "2", uc: "1", pre: "S/P" },
            { code: "4701121", name: "LENGUAJE Y COMUNICACION", ht: "1", hp: "2", hl: "0", th: "3", uc: "2", pre: "S/P" },
            { code: "4701131", name: "ALGEBRA I", ht: "2", hp: "0", hl: "0", th: "4", uc: "3", pre: "S/P" },
            { code: "4701141", name: "MATEMATICAS I", ht: "3", hp: "2", hl: "0", th: "5", uc: "4", pre: "S/P" },
            { code: "4702111", name: "EDUCACION SALUD FISICA Y DEPORTES I", ht: "0", hp: "2", hl: "0", th: "2", uc: "1", pre: "S/P" },
            { code: "4702121", name: "ACTIVIDAD DE ORIENTACION", ht: "0", hp: "4", hl: "0", th: "4", uc: "2", pre: "S/P" },
            { code: "4703121", name: "METODOLOGIA DE LA INVESTIGACION I", ht: "1", hp: "2", hl: "0", th: "3", uc: "2", pre: "S/P" },
            { code: "4704121", name: "INTRODUCCION A LA INGENIERIA DE SISTEMAS", ht: "1", hp: "2", hl: "0", th: "3", uc: "2", pre: "S/P" },
            { code: "4705121", name: "INTRODUCCION A LA COMPUTACION", ht: "1", hp: "2", hl: "0", th: "3", uc: "2", pre: "S/P" }
        ]},
        { semester: "II Semestre", status: "pending", subjects: [
            { code: "4701112", name: "ACTIVIDAD DE FORMACION CULTURAL II", ht: "0", hp: "2", hl: "0", th: "2", uc: "1", pre: "S/P" },
            { code: "4701122", name: "INGLES I", ht: "1", hp: "2", hl: "0", th: "3", uc: "2", pre: "S/P" },
            { code: "4701222", name: "LENGUAJE DE PROGRAMACION I", ht: "1", hp: "3", hl: "0", th: "4", uc: "2", pre: "4704121-4705121" },
            { code: "4701232", name: "ALGEBRA LINEAL", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4701131-4701141" },
            { code: "4701242", name: "MATEMATICAS II", ht: "3", hp: "2", hl: "0", th: "5", uc: "4", pre: "4701141" },
            { code: "4702112", name: "EDUCACION SALUD FISICA Y DEPORTES II", ht: "0", hp: "2", hl: "0", th: "2", uc: "1", pre: "S/P" },
            { code: "4702222", name: "ECONOMIA GENERAL", ht: "2", hp: "0", hl: "0", th: "2", uc: "2", pre: "S/P" },
            { code: "4702232", name: "FISICA I", ht: "2", hp: "3", hl: "0", th: "5", uc: "3", pre: "4701141" },
            { code: "4703222", name: "INTRODUCCION A LA ADMINISTRACION", ht: "1", hp: "2", hl: "0", th: "3", uc: "2", pre: "S/P" }
        ]},
        { semester: "III Semestre", status: "pending", subjects: [
            { code: "4701223", name: "INGLES II", ht: "1", hp: "2", hl: "0", th: "3", uc: "2", pre: "4701122" },
            { code: "4701233", name: "CONTABILIDAD I", ht: "2", hp: "3", hl: "0", th: "5", uc: "3", pre: "S/P" },
            { code: "4701243", name: "MATEMATICAS III", ht: "3", hp: "2", hl: "0", th: "5", uc: "4", pre: "4701242" },
            { code: "4701323", name: "LENGUAJE DE PROGRAMACION II", ht: "1", hp: "3", hl: "0", th: "4", uc: "2", pre: "4701222" },
            { code: "4701333", name: "TEORIA DE SISTEMAS", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4704121" },
            { code: "4702243", name: "FISICA II", ht: "3", hp: "2", hl: "0", th: "5", uc: "4", pre: "4702232-4701242" }
        ]},
        { semester: "IV Semestre", status: "pending", subjects: [
            { code: "4701224", name: "LABORATORIO DE FISICA", ht: "1", hp: "0", hl: "3", th: "4", uc: "2", pre: "4702243" },
            { code: "4701234", name: "CONTABILIDAD II", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4701233" },
            { code: "4701244", name: "MATEMATICAS IV", ht: "3", hp: "2", hl: "0", th: "5", uc: "4", pre: "4701243" },
            { code: "4701324", name: "LENGUAJE DE PROGRAMACION III", ht: "1", hp: "3", hl: "0", th: "4", uc: "2", pre: "4701323" },
            { code: "4701334", name: "ELECTIVA I", ht: "3", hp: "0", hl: "0", th: "3", uc: "3", pre: "57 UCA" },
            { code: "4702334", name: "ESTADISTICA I", ht: "2", hp: "3", hl: "0", th: "5", uc: "3", pre: "4701242" },
            { code: "4703334", name: "ESTRUCTURAS DISCRETAS Y GRAFOS", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4701242-4701323" }
        ]},
        { semester: "V Semestre", status: "pending", subjects: [
            { code: "4701325", name: "TEORIA DE LA ORGANIZACION", ht: "2", hp: "0", hl: "0", th: "2", uc: "2", pre: "4703222-4701333" },
            { code: "4701335", name: "ELECTIVA II", ht: "3", hp: "0", hl: "0", th: "3", uc: "3", pre: "77 UCA" },
            { code: "4702335", name: "ESTADISTICA II", ht: "2", hp: "3", hl: "0", th: "5", uc: "3", pre: "4702334" },
            { code: "4703335", name: "ANALISIS Y DISEÑO DE SISTEMAS", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4701333" },
            { code: "4704335", name: "BASE DE DATOS", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4701324-4703334" },
            { code: "4705335", name: "ESTRUCTURA DE DATOS", ht: "2", hp: "3", hl: "0", th: "5", uc: "3", pre: "4701324" },
            { code: "4706335", name: "PROGRAMACION NUMERICA", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4701324-4701244" }
        ]},
        { semester: "VI Semestre", status: "pending", subjects: [
            { code: "470006", name: "TALLER DE INDUCCION AL SERVICIO COMUNITARIO", ht: "4", hp: "0", hl: "0", th: "4", uc: "0", pre: "97 UCA" },
            { code: "4701226", name: "ORGANIZACION DEL COMPUTADOR", ht: "1", hp: "2", hl: "0", th: "3", uc: "2", pre: "4701324" },
            { code: "4701236", name: "METODOLOGIA DE LA INVESTIGACION II", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4703121-97 UCA" },
            { code: "4701326", name: "TEORIA DE LA INFORMACION", ht: "2", hp: "1", hl: "0", th: "3", uc: "2", pre: "4703335-4704335" },
            { code: "4701336", name: "ELECTIVA III", ht: "3", hp: "0", hl: "0", th: "3", uc: "3", pre: "97 UCA" },
            { code: "4702236", name: "SISTEMAS ELECTRICOS", ht: "1", hp: "2", hl: "3", th: "6", uc: "3", pre: "4701224" },
            { code: "4702326", name: "INGENIERIA ECONOMICA", ht: "1", hp: "2", hl: "0", th: "3", uc: "2", pre: "4701244-4702222" },
            { code: "4702336", name: "SISTEMAS OPERATIVOS I", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4703335" },
            { code: "4703336", name: "PROGRAMACION NO NUMERICA I", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4706335" }
        ]},
        { semester: "VII Semestre", status: "pending", subjects: [
            { code: "470007", name: "PROYECTO DE SERVICIO COMUNITARIO", ht: "4", hp: "0", hl: "0", th: "4", uc: "0", pre: "470006-118 UCA" },
            { code: "4701327", name: "SISTEMAS I", ht: "1", hp: "2", hl: "0", th: "3", uc: "2", pre: "4703335-4703336" },
            { code: "4701337", name: "ELECTIVA IV", ht: "3", hp: "0", hl: "0", th: "3", uc: "3", pre: "118 UCA" },
            { code: "4702337", name: "PLANIFICACION DE SISTEMAS", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4703335-4704335" },
            { code: "4703337", name: "PROGRAMACION NO NUMERICA II", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4703336" },
            { code: "4704337", name: "ELECTRONICA DIGITAL", ht: "2", hp: "2", hl: "3", th: "7", uc: "4", pre: "4701226-4702236" },
            { code: "4704337", name: "INVESTIGACION DE OPERACIONES I", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4701244-4702335" },
            { code: "4705337", name: "SISTEMAS OPERATIVOS II", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4702336" }
        ]},
        { semester: "VIII Semestre", status: "pending", subjects: [
            { code: "470008", name: "PROYECTO DE SERVICIO COMUNITARIO", ht: "4", hp: "0", hl: "0", th: "4", uc: "0", pre: "470007" },
            { code: "4701328", name: "SIMULACION DIGITAL", ht: "1", hp: "2", hl: "0", th: "3", uc: "2", pre: "4703347" },
            { code: "4701338", name: "ELECTIVA V", ht: "3", hp: "0", hl: "0", th: "3", uc: "3", pre: "139 UCA" },
            { code: "4702328", name: "SISTEMAS Y PROCEDIMIENTOS ADMINISTRATIVOS", ht: "2", hp: "0", hl: "0", th: "2", uc: "2", pre: "4701325" },
            { code: "4702338", name: "SISTEMAS II", ht: "2", hp: "3", hl: "0", th: "5", uc: "3", pre: "4701327" },
            { code: "4703338", name: "SISTEMAS DE INFORMACION", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4701326" },
            { code: "4704338", name: "INVESTIGACION DE OPERACIONES II", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4704337" }
        ]},
        { semester: "IX Semestre", status: "pending", subjects: [
            { code: "4701329", name: "ETICA Y DEONTOLOGIA PROFESIONAL", ht: "2", hp: "0", hl: "0", th: "2", uc: "2", pre: "155 UCA" },
            { code: "4701339", name: "ELECTIVA VI", ht: "3", hp: "0", hl: "0", th: "3", uc: "3", pre: "155 UCA" },
            { code: "4701449", name: "PROYECTO DE INVESTIGACION", ht: "2", hp: "6", hl: "0", th: "8", uc: "4", pre: "HASTA EL 8VO. SEM. APROB./155 UCA" },
            { code: "4702329", name: "ADMINISTRACION DE SISTEMAS DE INFORMACION", ht: "2", hp: "0", hl: "0", th: "2", uc: "2", pre: "4703338" },
            { code: "4702339", name: "DISEÑO Y EVALUACION DE PROYECTOS", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4704338" },
            { code: "4703339", name: "OPTIMIZACION DE SISTEMAS Y FUNCIONES", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4704338" },
            { code: "4704339", name: "AUDITORIA Y EVALUACION DE SISTEMAS", ht: "2", hp: "2", hl: "0", th: "4", uc: "3", pre: "4702338" }
        ]},
        { semester: "X Semestre", status: "pending", subjects: [
            { code: "4714610", name: "TRABAJO DE GRADO", ht: "2", hp: "12", hl: "0", th: "14", uc: "6", pre: "175 UCA" },
            { code: "4714810", name: "PASANTIA", ht: "0", hp: "20", hl: "0", th: "20", uc: "8", pre: "175 UCA" }
        ]}
    ]
};

const weekDays = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

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
        profileButton: document.querySelector("#profile-button"),
        profileModal: document.querySelector("#profile-modal"),
        profileForm: document.querySelector("#profile-form"),
        profileCloseButton: document.querySelector("#profile-close-button"),
        profileAvatarPreview: document.querySelector("#profile-avatar-preview"),
        profilePhotoInput: document.querySelector("#profile-photo-input"),
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
    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);

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
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
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
    elements.profileBirthdate.value = dashboardData.student.birthdate || "";
    elements.profileDocument.value = dashboardData.student.document || "";
    elements.profileCareer.value = dashboardData.student.career || "";
    elements.profilePhotoInput.value = "";
    elements.profileAvatarPreview.dataset.photo = dashboardData.student.photo || "";
    renderAvatar(elements.profileAvatarPreview, dashboardData.student);
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

    const updatedProfile = {
        birthdate: elements.profileBirthdate.value,
        document: elements.profileDocument.value.trim(),
        career: elements.profileCareer.value.trim() || dashboardData.student.career,
        photo: elements.profileAvatarPreview.dataset.photo || ""
    };

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
    const map = {
        schedule: dashboardData.schedule,
        notifications: dashboardData.notifications,
        grades: dashboardData.grades,
        messages: dashboardData.messages,
        news: dashboardData.news,
        pensum: dashboardData.pensum
    };
    const data = map[id] || { message: 'No hay datos exportables para este panel.' };
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
    const container = article.querySelector('.stack-list, .grades-list, .news-grid, .pensum-list, .schedule-grid, .stats-grid');
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
        window.location.href = "../index.html";
    });
}

function renderDashboard() {
    const elements = getElements();

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
