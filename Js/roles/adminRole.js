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
                type: "table",
                columns: ["Usuario", "Rol", "Estado", "Ultimo acceso"],
                rows: [
                    ["John Lennon", "Estudiante", "Activo", "Hoy"],
                    ["Prof. Laura Salazar", "Profesor", "Activo", "Hace 1 h"],
                    ["Control de Estudios", "Admin", "Activo", "Ayer"],
                    ["Invitado PSM", "Estudiante", "Pendiente", "Sin acceso"]
                ]
            },
            {
                id: "academic-admin",
                kicker: "Oferta academica",
                title: "Materias y secciones",
                type: "cards",
                items: [
                    { title: "Ingenieria de Sistemas", meta: "10 semestres | Pensum activo", text: "68 secciones publicadas para el periodo.", status: "Operativo" },
                    { title: "Programacion II", meta: "4 secciones", text: "2 laboratorios asignados, 126 inscritos.", status: "Alta demanda" },
                    { title: "Matematica I", meta: "6 secciones", text: "Cupos disponibles para nuevo ingreso.", status: "Disponible" }
                ]
            },
            {
                id: "enrollments-admin",
                kicker: "Control de estudios",
                title: "Inscripciones por revisar",
                type: "people",
                items: [
                    { name: "Ana Rivas", detail: "Solicitud de cambio de seccion", badge: "Revisar" },
                    { name: "Luis Romero", detail: "Carga academica excede limite", badge: "Alerta" },
                    { name: "Maria Torres", detail: "Documento pendiente", badge: "Pendiente" }
                ]
            },
            {
                id: "reports-admin",
                kicker: "Indicadores",
                title: "Reportes rapidos",
                type: "metrics",
                items: [
                    { label: "Solvencia general", value: "91%" },
                    { label: "Ocupacion de cupos", value: "78%" },
                    { label: "Promedio institucional", value: "15.9" },
                    { label: "Retencion estimada", value: "87%" }
                ]
            },
            {
                id: "news-admin",
                kicker: "Comunicacion",
                title: "Publicaciones institucionales",
                type: "actions",
                items: [
                    { title: "Crear noticia", text: "Subir flyer, titulo, fecha y descripcion.", icon: "fa-plus" },
                    { title: "Programar aviso", text: "Publicar para estudiantes, profesores o todos.", icon: "fa-clock" },
                    { title: "Revisar destacados", text: "Ordenar banners y noticias visibles.", icon: "fa-star" }
                ]
            },
            {
                id: "audit-admin",
                kicker: "Seguridad",
                title: "Auditoria reciente",
                type: "timeline",
                items: [
                    { title: "Rol actualizado", text: "Control de Estudios cambio permisos de usuario.", icon: "fa-user-shield" },
                    { title: "Nota modificada", text: "Programacion II | Acta preliminar actualizada.", icon: "fa-pen" },
                    { title: "Noticia publicada", text: "Jornada de investigacion estudiantil.", icon: "fa-newspaper" }
                ]
            }
        ],
        notificationsCount: 6
    };
