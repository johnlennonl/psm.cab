"use strict";

const STORAGE_KEY = "psm_student_roadmap_done";

const modules = [
    {
        id: "solicitudes",
        title: "Solicitudes estudiantiles",
        phase: "Fase 1",
        priority: "alta",
        icon: "fa-file-signature",
        summary: "Gestion de constancias, retiros, cambios de seccion y estado de solicitudes.",
        description: "Este modulo vuelve real la comunicacion con control de estudios: el estudiante crea solicitudes, adjunta datos y consulta su estado sin depender de mensajes sueltos.",
        impact: "Muy alto",
        supabase: "Tablas: requests, request_events, profiles",
        features: ["Crear solicitud", "Ver estado", "Historial de cambios", "Adjuntar soporte"]
    },
    {
        id: "pagos",
        title: "Pagos y solvencia",
        phase: "Fase 1",
        priority: "alta",
        icon: "fa-receipt",
        summary: "Solvencia, cuotas, comprobantes y bloqueo administrativo visible.",
        description: "Permite que el estudiante entienda su estado administrativo, suba comprobantes y vea si tiene algun bloqueo antes de inscribir o solicitar documentos.",
        impact: "Muy alto",
        supabase: "Tablas: payments, invoices, account_status",
        features: ["Subir comprobante", "Estado de solvencia", "Historial", "Alertas de deuda"]
    },
    {
        id: "aula",
        title: "Aula virtual y materiales",
        phase: "Fase 2",
        priority: "alta",
        icon: "fa-folder-open",
        summary: "Materiales por materia, tareas, enlaces, guias y entregas.",
        description: "Conecta directamente con el panel de profesor. Cada materia puede tener recursos, actividades y fechas de entrega visibles para el estudiante.",
        impact: "Alto",
        supabase: "Tablas: courses, materials, assignments",
        features: ["Recursos por materia", "Tareas", "Entregas", "Archivos y enlaces"]
    },
    {
        id: "asistencia",
        title: "Asistencia academica",
        phase: "Fase 2",
        priority: "alta",
        icon: "fa-user-check",
        summary: "Porcentaje de asistencia, faltas y riesgo por materia.",
        description: "El estudiante puede anticipar riesgos por inasistencia y ver un resumen claro de faltas justificadas o pendientes.",
        impact: "Alto",
        supabase: "Tablas: attendance, sections, enrollments",
        features: ["Porcentaje", "Faltas", "Justificativos", "Riesgo"]
    },
    {
        id: "calendario",
        title: "Calendario academico oficial",
        phase: "Fase 2",
        priority: "media",
        icon: "fa-calendar-week",
        summary: "Cortes, examenes, retiros, inscripciones, feriados y eventos PSM.",
        description: "Complementa el horario semanal con fechas oficiales de la institucion y permite planificar recordatorios con mejor contexto.",
        impact: "Medio alto",
        supabase: "Tablas: academic_calendar, calendar_events",
        features: ["Fechas oficiales", "Filtros", "Recordatorios", "Exportacion"]
    },
    {
        id: "progreso",
        title: "Progreso de carrera",
        phase: "Fase 3",
        priority: "media",
        icon: "fa-route",
        summary: "Porcentaje global, materias aprobadas, cursando, pendientes y bloqueadas.",
        description: "Convierte el pensum en una vista de avance real. Ayuda al estudiante a saber que le falta y que materias dependen de prelaciones.",
        impact: "Medio alto",
        supabase: "Tablas: curriculum, course_progress, grades",
        features: ["Porcentaje", "Prelaciones", "Semestres", "Materias bloqueadas"]
    },
    {
        id: "documentos",
        title: "Centro de documentos",
        phase: "Fase 3",
        priority: "media",
        icon: "fa-folder-tree",
        summary: "Constancias generadas, recaudos, descargas y documentos personales.",
        description: "Un espacio unico para descargar documentos emitidos y subir recaudos necesarios para procesos administrativos.",
        impact: "Medio",
        supabase: "Buckets: documents, profile_files",
        features: ["Descargas", "Recaudos", "Validacion", "Historial"]
    },
    {
        id: "perfil",
        title: "Perfil academico completo",
        phase: "Fase 3",
        priority: "media",
        icon: "fa-id-card",
        summary: "Datos personales, contacto, carrera, turno, seccion y emergencia.",
        description: "Fortalece el perfil actual para que sirva como base de registro, solicitudes y control institucional.",
        impact: "Medio",
        supabase: "Tabla: profiles",
        features: ["Contacto", "Carrera", "Emergencia", "Foto"]
    },
    {
        id: "soporte",
        title: "Soporte y tickets",
        phase: "Fase 4",
        priority: "media",
        icon: "fa-headset",
        summary: "Tickets por categoria: notas, pagos, acceso, inscripcion o documentos.",
        description: "Ordena problemas que hoy se resolverian por mensajes. Cada ticket tiene categoria, prioridad, estado y respuesta institucional.",
        impact: "Medio",
        supabase: "Tablas: tickets, ticket_replies",
        features: ["Crear ticket", "Estado", "Respuesta", "Prioridad"]
    },
    {
        id: "carnet",
        title: "Carnet digital con QR",
        phase: "Fase visual",
        priority: "visual",
        icon: "fa-qrcode",
        summary: "Credencial estudiantil con foto, carrera, estado y codigo QR.",
        description: "Un modulo visualmente brutal que puede servir para identificacion, biblioteca, eventos o validacion de estado activo.",
        impact: "Visual alto",
        supabase: "Tabla: digital_credentials",
        features: ["QR", "Foto", "Estado", "Carrera"]
    },
    {
        id: "logros",
        title: "Logros academicos",
        phase: "Fase visual",
        priority: "visual",
        icon: "fa-award",
        summary: "Reconocimientos por promedio, asistencia, avance y constancia.",
        description: "No tiene que ser competitivo; puede destacar hitos personales para hacer el portal mas humano y motivador.",
        impact: "Visual medio",
        supabase: "Tablas: achievements, student_metrics",
        features: ["Promedio", "Asistencia", "Avance", "Hitos"]
    },
    {
        id: "busqueda",
        title: "Busqueda global real",
        phase: "Fase 4",
        priority: "media",
        icon: "fa-magnifying-glass-chart",
        summary: "Buscar materias, mensajes, noticias, documentos, solicitudes y pagos.",
        description: "Aprovecha la barra que ya existe en el dashboard y la convierte en una herramienta funcional para navegar todo el portal.",
        impact: "Medio alto",
        supabase: "Vistas o RPC de busqueda",
        features: ["Resultados", "Filtros", "Atajos", "Historial"]
    }
];

const state = {
    filter: "all",
    query: "",
    selectedId: modules[0].id,
    done: loadDone()
};

const elements = {
    grid: document.querySelector("#module-grid"),
    search: document.querySelector("#module-search"),
    filterButtons: document.querySelectorAll("[data-filter]"),
    progressPercent: document.querySelector("#progress-percent"),
    progressBar: document.querySelector("#progress-bar"),
    progressCopy: document.querySelector("#progress-copy"),
    markPriority: document.querySelector("#mark-priority"),
    resetProgress: document.querySelector("#reset-progress"),
    detailPhase: document.querySelector("#detail-phase"),
    detailTitle: document.querySelector("#detail-title"),
    detailDescription: document.querySelector("#detail-description"),
    detailFeatures: document.querySelector("#detail-features"),
    detailImpact: document.querySelector("#detail-impact"),
    detailSupabase: document.querySelector("#detail-supabase")
};

function loadDone() {
    try {
        return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
        return new Set();
    }
}

function saveDone() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.done]));
}

function getVisibleModules() {
    const query = state.query.trim().toLowerCase();

    return modules.filter((module) => {
        const matchesFilter = state.filter === "all" || module.priority === state.filter;
        const searchable = [module.title, module.phase, module.priority, module.summary, module.description, module.features.join(" ")]
            .join(" ")
            .toLowerCase();

        return matchesFilter && (!query || searchable.includes(query));
    });
}

function renderModules() {
    const visibleModules = getVisibleModules();

    if (!visibleModules.length) {
        elements.grid.innerHTML = '<div class="empty-state">No hay modulos que coincidan con esa busqueda.</div>';
        return;
    }

    elements.grid.innerHTML = visibleModules.map((module) => {
        const isDone = state.done.has(module.id);
        const isSelected = state.selectedId === module.id;

        return `
            <article class="module-card${isDone ? " is-done" : ""}${isSelected ? " is-selected" : ""}" data-module-id="${module.id}">
                <span class="module-icon"><i class="fa-solid ${module.icon}" aria-hidden="true"></i></span>
                <div class="module-content">
                    <div class="module-meta">
                        <span>${module.phase}</span>
                        <span>${module.priority}</span>
                    </div>
                    <h3>${module.title}</h3>
                    <p>${module.summary}</p>
                    <div class="module-actions">
                        <button type="button" data-action="select" data-id="${module.id}"><i class="fa-solid fa-eye" aria-hidden="true"></i>Ver detalle</button>
                        <button type="button" data-action="toggle" data-id="${module.id}"><i class="fa-solid ${isDone ? "fa-check" : "fa-plus"}" aria-hidden="true"></i>${isDone ? "Hecho" : "Pendiente"}</button>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}

function renderDetail() {
    const module = modules.find((item) => item.id === state.selectedId) || modules[0];

    elements.detailPhase.textContent = `${module.phase} | ${module.priority}`;
    elements.detailTitle.textContent = module.title;
    elements.detailDescription.textContent = module.description;
    elements.detailFeatures.innerHTML = module.features.map((feature) => `<span><i class="fa-solid fa-check" aria-hidden="true"></i>${feature}</span>`).join("");
    elements.detailImpact.innerHTML = `<i class="fa-solid fa-signal" aria-hidden="true"></i>${module.impact}`;
    elements.detailSupabase.innerHTML = `<i class="fa-solid fa-database" aria-hidden="true"></i>${module.supabase}`;
}

function renderProgress() {
    const percent = Math.round((state.done.size / modules.length) * 100);

    elements.progressPercent.textContent = `${percent}%`;
    elements.progressBar.style.width = `${percent}%`;
    elements.progressCopy.textContent = `${state.done.size} de ${modules.length} pasos marcados como elaborados.`;
}

function render() {
    renderModules();
    renderDetail();
    renderProgress();
}

elements.grid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    const card = event.target.closest("[data-module-id]");

    if (!button && card) {
        state.selectedId = card.dataset.moduleId;
        render();
        return;
    }

    if (!button) {
        return;
    }

    const id = button.dataset.id;
    state.selectedId = id;

    if (button.dataset.action === "toggle") {
        if (state.done.has(id)) {
            state.done.delete(id);
        } else {
            state.done.add(id);
        }

        saveDone();
    }

    render();
});

elements.search.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderModules();
});

elements.filterButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        state.filter = event.currentTarget.dataset.filter;
        elements.filterButtons.forEach((filterButton) => filterButton.classList.toggle("is-active", filterButton === event.currentTarget));
        renderModules();
    });
});

elements.markPriority.addEventListener("click", () => {
    modules
        .filter((module) => module.priority === "alta")
        .forEach((module) => state.done.add(module.id));
    saveDone();
    render();
});

elements.resetProgress.addEventListener("click", () => {
    state.done.clear();
    saveDone();
    render();
});

render();