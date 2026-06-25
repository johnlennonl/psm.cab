"use strict";

window.PSM_ROLES = window.PSM_ROLES || {};
window.PSM_ROLES.admin = {
        identity: {
            name: "Admin PSM",
            subtitle: "Control institucional",
            initials: "AP"
        },
        topbarLabel: "Panel administrativo",
        hero: {
            status: "Operacion academica 2026-1",
            title: "Control central para usuarios, secciones y gestion institucional",
            text: "Panel preparado para administrar perfiles, inscripciones, noticias, reportes y auditoria desde una sola consola.",
            highlightLabel: "Pendiente critico",
            highlightTitle: "12 inscripciones por validar",
            highlightDetail: "Control de estudios | Prioridad alta"
        },
        nav: [
            { href: "#overview", icon: "fa-house", label: "Inicio" },
            { href: "#users-admin", icon: "fa-users-gear", label: "Usuarios" },
            { href: "#academic-admin", icon: "fa-layer-group", label: "Academico" },
            { href: "#enrollments-admin", icon: "fa-file-signature", label: "Inscripciones" },
            { href: "#reports-admin", icon: "fa-chart-pie", label: "Reportes" },
            { href: "#news-admin", icon: "fa-newspaper", label: "Noticias" },
            { href: "#audit-admin", icon: "fa-shield-halved", label: "Auditoria" }
        ],
        stats: [
            { label: "Usuarios activos", value: "842", icon: "fa-users", tone: "blue" },
            { label: "Secciones abiertas", value: "68", icon: "fa-layer-group", tone: "sky" },
            { label: "Solicitudes", value: "27", icon: "fa-inbox", tone: "gold" },
            { label: "Alertas", value: "6", icon: "fa-shield-halved", tone: "red" }
        ],
        panels: [
            {
                id: "users-admin",
                kicker: "Directorio",
                title: "Usuarios y roles",
                type: "adminUsers",
                filters: ["Todos", "Estudiantes", "Profesores", "Administrativos", "Pendientes"],
                users: [
                    { name: "John Lennon", document: "V-24485562", role: "Estudiante", area: "Ingenieria de Sistemas", status: "Activo", access: "Hoy", risk: "Solvente" },
                    { name: "Profesora. Laura Salazar", document: "V-11111111", role: "Profesor", area: "Departamento de Sistemas", status: "Activo", access: "Hace 1 h", risk: "4 secciones" },
                    { name: "Control de Estudios", document: "ADM-002", role: "Administrativo", area: "Secretaria academica", status: "Activo", access: "Ayer", risk: "Permisos altos" },
                    { name: "Invitado PSM", document: "TMP-104", role: "Estudiante", area: "Nuevo ingreso", status: "Pendiente", access: "Sin acceso", risk: "Validar cedula" }
                ]
            },
            {
                id: "academic-admin",
                kicker: "Oferta academica",
                title: "Materias y secciones",
                type: "adminAcademic",
                items: [
                    { title: "Ingenieria de Sistemas", meta: "10 semestres | Pensum activo", text: "68 secciones publicadas para el periodo.", status: "Operativo", progress: 78 },
                    { title: "Programacion II", meta: "4 secciones | 126 inscritos", text: "2 laboratorios asignados y cupos con alta demanda.", status: "Alta demanda", progress: 92 },
                    { title: "Matematica I", meta: "6 secciones | Nuevo ingreso", text: "Cupos disponibles y profesores asignados.", status: "Disponible", progress: 61 }
                ]
            },
            {
                id: "enrollments-admin",
                kicker: "Control de estudios",
                title: "Solicitudes por revisar",
                type: "adminRequests",
                requests: [
                    { name: "Ana Rivas", detail: "Solicitud de cambio de seccion", badge: "Revisar", priority: "Media", time: "Hoy 10:24 AM" },
                    { name: "Luis Romero", detail: "Carga academica excede limite", badge: "Alerta", priority: "Alta", time: "Hoy 9:10 AM" },
                    { name: "Profesora. Laura Salazar", detail: "Solicitud de laboratorio para Programacion II", badge: "Pendiente", priority: "Alta", time: "Ayer 4:45 PM" },
                    { name: "Maria Torres", detail: "Documento pendiente de inscripcion", badge: "Pendiente", priority: "Baja", time: "Ayer" }
                ]
            },
            {
                id: "reports-admin",
                kicker: "Indicadores",
                title: "Reportes rapidos",
                type: "adminMetrics",
                items: [
                    { label: "Solvencia general", value: "91%", trend: "+4%", tone: "green" },
                    { label: "Ocupacion de cupos", value: "78%", trend: "+12 secciones", tone: "blue" },
                    { label: "Promedio institucional", value: "15.9", trend: "estable", tone: "gold" },
                    { label: "Retencion estimada", value: "87%", trend: "+2%", tone: "green" }
                ]
            },
            {
                id: "news-admin",
                kicker: "Comunicacion",
                title: "Publicaciones institucionales",
                type: "adminNews",
                publications: [
                    { title: "Jornada de investigacion estudiantil", audience: "Todos", status: "Publicado", date: "24 Jun", icon: "fa-newspaper" },
                    { title: "Recordatorio de inscripciones", audience: "Estudiantes", status: "Programado", date: "26 Jun", icon: "fa-clock" },
                    { title: "Convocatoria docente", audience: "Profesores", status: "Borrador", date: "Sin fecha", icon: "fa-pen-to-square" }
                ]
            },
            {
                id: "audit-admin",
                kicker: "Seguridad",
                title: "Auditoria reciente",
                type: "adminAudit",
                items: [
                    { title: "Rol actualizado", text: "Control de Estudios cambio permisos de usuario.", icon: "fa-user-shield", time: "Hoy 11:02 AM" },
                    { title: "Nota modificada", text: "Programacion II | Acta preliminar actualizada.", icon: "fa-pen", time: "Hoy 9:40 AM" },
                    { title: "Noticia publicada", text: "Jornada de investigacion estudiantil.", icon: "fa-newspaper", time: "Ayer" }
                ]
            }
        ],
        notificationsCount: 6
    };
