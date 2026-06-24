"use strict";

window.PSM_ROLES = window.PSM_ROLES || {};
window.PSM_ROLES.teacher = {
        identity: {
            name: "Prof. Laura Salazar",
            subtitle: "Docente | Ingenieria de Sistemas",
            initials: "LS"
        },
        topbarLabel: "Panel docente",
        hero: {
            status: "Periodo 2026-1 | 4 secciones activas",
            title: "Selecciona una seccion para trabajar",
            text: "Vista operativa para controlar secciones, evaluaciones, estudiantes en riesgo y comunicaciones academicas.",
            highlightLabel: "Proxima clase",
            highlightTitle: "Programacion II",
            highlightDetail: "Hoy, 2:30 PM | Laboratorio principal"
        },
        nav: [
            { href: "#overview", icon: "fa-house", label: "Inicio" },
            { href: "#teacher-sections", icon: "fa-chalkboard-user", label: "Secciones" },
            { href: "#attendance", icon: "fa-clipboard-check", label: "Asistencia" },
            { href: "#gradebook", icon: "fa-table-list", label: "Notas" },
            { href: "#evaluations", icon: "fa-calendar-check", label: "Evaluaciones" },
            { href: "#at-risk", icon: "fa-triangle-exclamation", label: "Alertas" },
            { href: "#teacher-messages", icon: "fa-envelope", label: "Mensajes" }
        ],
        stats: [
            { label: "Secciones activas", value: "4", icon: "fa-chalkboard-user", tone: "blue" },
            { label: "Estudiantes", value: "12", icon: "fa-users", tone: "sky" },
            { label: "Notas pendientes", value: "36", icon: "fa-pen-to-square", tone: "gold" },
            { label: "Riesgo academico", value: "2", icon: "fa-triangle-exclamation", tone: "red" }
        ],
        selectedSectionId: "prog-ii-a",
        gradePlan: [
            { key: "c1e1", label: "C1 Eval. 10%", weight: 10, cut: "Primer corte" },
            { key: "c1e2", label: "C1 Eval. 20%", weight: 20, cut: "Primer corte" },
            { key: "c2e1", label: "C2 Eval. 10%", weight: 10, cut: "Segundo corte" },
            { key: "c2e2", label: "C2 Eval. 20%", weight: 20, cut: "Segundo corte" },
            { key: "c3e1", label: "C3 Eval. 20%", weight: 20, cut: "Tercer corte" },
            { key: "c3e2", label: "C3 Eval. 20%", weight: 20, cut: "Tercer corte" }
        ],
        sections: [
            {
                id: "prog-ii-a",
                subject: "Programacion II",
                code: "INF-302",
                section: "A",
                period: "2026-1",
                room: "Laboratorio principal",
                schedule: "Martes y Jueves | 2:30 PM - 4:00 PM",
                status: "Notas abiertas",
                accent: "#0b3a6e",
                nextClass: "Jueves 25 Jun | Laboratorio practico",
                planning: [
                    { title: "Parcial practico", text: "Programacion II | Corte 2 | 26 Jun", icon: "fa-code" },
                    { title: "Entrega de laboratorio", text: "Arreglos, funciones y validaciones | 30 Jun", icon: "fa-laptop-code" },
                    { title: "Revision de notas", text: "Publicar observaciones del segundo corte", icon: "fa-clipboard-list" }
                ],
                students: [
                    { name: "Ana Rivas", document: "V-28111444", attendance: "Presente", grades: { c1e1: 18, c1e2: 19, c2e1: 17, c2e2: 18, c3e1: "", c3e2: "" } },
                    { name: "Carlos Mendez", document: "V-27333120", attendance: "Tarde", grades: { c1e1: 13, c1e2: 15, c2e1: 14, c2e2: "", c3e1: "", c3e2: "" } },
                    { name: "Maria Torres", document: "V-26678111", attendance: "Presente", grades: { c1e1: 20, c1e2: 18, c2e1: 19, c2e2: 20, c3e1: "", c3e2: "" } },
                    { name: "Luis Romero", document: "V-24485562", attendance: "Ausente", grades: { c1e1: 9, c1e2: 12, c2e1: 10, c2e2: "", c3e1: "", c3e2: "" } },
                    { name: "Daniela Prieto", document: "V-28222111", attendance: "Presente", grades: { c1e1: 16, c1e2: 17, c2e1: 15, c2e2: "", c3e1: "", c3e2: "" } },
                    { name: "Jose Vargas", document: "V-26999888", attendance: "Presente", grades: { c1e1: 14, c1e2: 13, c2e1: "", c2e2: "", c3e1: "", c3e2: "" } },
                    { name: "Lucia Fernandez", document: "V-28777666", attendance: "Tarde", grades: { c1e1: 18, c1e2: 18, c2e1: 17, c2e2: "", c3e1: "", c3e2: "" } },
                    { name: "Miguel Castro", document: "V-27123456", attendance: "Presente", grades: { c1e1: 12, c1e2: 14, c2e1: 13, c2e2: "", c3e1: "", c3e2: "" } },
                    { name: "Andrea Silva", document: "V-29001122", attendance: "Presente", grades: { c1e1: 19, c1e2: 20, c2e1: 18, c2e2: "", c3e1: "", c3e2: "" } },
                    { name: "Pedro Navas", document: "V-26333444", attendance: "Ausente", grades: { c1e1: 10, c1e2: 11, c2e1: "", c2e2: "", c3e1: "", c3e2: "" } },
                    { name: "Valentina Mora", document: "V-28555123", attendance: "Presente", grades: { c1e1: 17, c1e2: 16, c2e1: 18, c2e2: "", c3e1: "", c3e2: "" } },
                    { name: "Samuel Ortega", document: "V-27444555", attendance: "Tarde", grades: { c1e1: 15, c1e2: 14, c2e1: 15, c2e2: "", c3e1: "", c3e2: "" } },
                    { name: "Natalia Reyes", document: "V-28888999", attendance: "Presente", grades: { c1e1: 20, c1e2: 19, c2e1: 19, c2e2: "", c3e1: "", c3e2: "" } },
                    { name: "Emilio Paredes", document: "V-26777111", attendance: "Presente", grades: { c1e1: 13, c1e2: 12, c2e1: "", c2e2: "", c3e1: "", c3e2: "" } }
                ]
            },
            {
                id: "bd-b",
                subject: "Base de Datos",
                code: "INF-405",
                section: "B",
                period: "2026-1",
                room: "Aula B-12",
                schedule: "Lunes y Miercoles | 4:00 PM - 5:30 PM",
                status: "Asistencia al dia",
                accent: "#0e7090",
                nextClass: "Miercoles 24 Jun | Normalizacion",
                planning: [
                    { title: "Modelo relacional", text: "Base de Datos | Corte 2 | 01 Jul", icon: "fa-database" },
                    { title: "Practica SQL", text: "Consultas JOIN y agregaciones | 03 Jul", icon: "fa-table" },
                    { title: "Revision de DER", text: "Correccion de entidades y cardinalidad", icon: "fa-diagram-project" }
                ],
                students: [
                    { name: "Sofia Pena", document: "V-27990123", attendance: "Presente", grades: { c1e1: 16, c1e2: 17, c2e1: 15, c2e2: 16, c3e1: "", c3e2: "" } },
                    { name: "Diego Leon", document: "V-26555110", attendance: "Presente", grades: { c1e1: 18, c1e2: 16, c2e1: 17, c2e2: "", c3e1: "", c3e2: "" } },
                    { name: "Valeria Soto", document: "V-28444321", attendance: "Tarde", grades: { c1e1: 14, c1e2: 15, c2e1: "", c2e2: "", c3e1: "", c3e2: "" } }
                ]
            },
            {
                id: "intro-comp-c",
                subject: "Introduccion a Computacion",
                code: "INF-101",
                section: "C",
                period: "2026-1",
                room: "Aula A-03",
                schedule: "Miercoles | 1:45 PM - 4:00 PM",
                status: "Evaluacion pendiente",
                accent: "#d7af4f",
                nextClass: "Miercoles 24 Jun | Sistemas numericos",
                planning: [
                    { title: "Quiz de sistemas numericos", text: "Introduccion a Computacion | Corte 2 | 24 Jun", icon: "fa-microchip" },
                    { title: "Taller de hardware", text: "Componentes internos del computador | 01 Jul", icon: "fa-computer" },
                    { title: "Actividad guiada", text: "Conversion binario, decimal y hexadecimal", icon: "fa-calculator" }
                ],
                students: [
                    { name: "Gabriel Marin", document: "V-29111222", attendance: "Presente", grades: { c1e1: 17, c1e2: 18, c2e1: "", c2e2: "", c3e1: "", c3e2: "" } },
                    { name: "Camila Duarte", document: "V-28666777", attendance: "Presente", grades: { c1e1: 19, c1e2: 19, c2e1: "", c2e2: "", c3e1: "", c3e2: "" } },
                    { name: "Andres Farias", document: "V-27555777", attendance: "Ausente", grades: { c1e1: 11, c1e2: 10, c2e1: "", c2e2: "", c3e1: "", c3e2: "" } }
                ]
            },
            {
                id: "proyecto-sis",
                subject: "Proyecto de Sistemas",
                code: "INF-901",
                section: "U",
                period: "2026-1",
                room: "Sala de seminario",
                schedule: "Viernes | 3:00 PM - 5:30 PM",
                status: "Tutoria activa",
                accent: "#067647",
                nextClass: "Viernes 26 Jun | Revision de avances",
                planning: [
                    { title: "Defensa de avance", text: "Proyecto de Sistemas | Corte 2 | 05 Jul", icon: "fa-person-chalkboard" },
                    { title: "Entrega de documentacion", text: "Capitulo metodologico y prototipo", icon: "fa-file-lines" },
                    { title: "Tutoria por equipos", text: "Revision de alcance y riesgos", icon: "fa-users-gear" }
                ],
                students: [
                    { name: "Paola Herrera", document: "V-26222444", attendance: "Presente", grades: { c1e1: 18, c1e2: 18, c2e1: 17, c2e2: 18, c3e1: "", c3e2: "" } },
                    { name: "Ricardo Molina", document: "V-27111999", attendance: "Presente", grades: { c1e1: 15, c1e2: 16, c2e1: 15, c2e2: "", c3e1: "", c3e2: "" } }
                ]
            }
        ],
        panels: [
            {
                id: "teacher-sections",
                kicker: "Carga academica",
                title: "Mis secciones",
                type: "teacherSections"
            },
            {
                id: "section-context",
                kicker: "Asignatura activa",
                title: "Contexto de la seccion",
                type: "teacherContext"
            },
            {
                id: "attendance",
                kicker: "Clase activa",
                title: "Asistencia rapida",
                type: "teacherAttendance"
            },
            {
                id: "gradebook",
                kicker: "Plan de evaluacion",
                title: "Carga de notas",
                type: "teacherGradebook"
            },
            {
                id: "evaluations",
                kicker: "Planificacion",
                title: "Evaluaciones pendientes",
                type: "teacherPlanning"
            },
            {
                id: "at-risk",
                kicker: "Seguimiento",
                title: "Alumnos en riesgo",
                type: "teacherRisk"
            },
            {
                id: "teacher-messages",
                kicker: "Comunicacion",
                title: "Acciones rapidas",
                type: "actions",
                items: [
                    { title: "Enviar aviso a seccion", text: "Publica un mensaje para todos los inscritos.", icon: "fa-bullhorn" },
                    { title: "Solicitar aula laboratorio", text: "Reserva espacios para practicas evaluadas.", icon: "fa-computer" },
                    { title: "Exportar acta preliminar", text: "Genera respaldo local de notas cargadas.", icon: "fa-file-export" }
                ]
            }
        ],
        notificationsCount: 5
    };
