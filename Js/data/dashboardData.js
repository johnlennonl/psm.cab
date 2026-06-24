"use strict";

window.PSM_DASHBOARD_DATA = {
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

window.PSM_WEEK_DAYS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
