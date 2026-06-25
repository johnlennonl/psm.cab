"use strict";

window.PSM_STUDENT_MODULES = window.PSM_STUDENT_MODULES || {};

window.PSM_STUDENT_MODULES.horarioAcademico = (() => {
    const REMINDERS_STORAGE_KEY = "psm_student_schedule_reminders";
    const REMINDER_ALERT_SESSION_KEY = "psm_student_schedule_alert_session";
    const DAY_INDEX = {
        Domingo: 0,
        Lunes: 1,
        Martes: 2,
        Miercoles: 3,
        Jueves: 4,
        Viernes: 5,
        Sabado: 6
    };

    function getSchedule(dashboardData) {
        return Array.isArray(dashboardData.schedule) ? dashboardData.schedule : [];
    }

    function parseTimeToMinutes(time) {
        const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);

        if (!match) {
            return 0;
        }

        let hours = Number(match[1]);
        const minutes = Number(match[2]);
        const period = match[3].toUpperCase();

        if (period === "PM" && hours !== 12) {
            hours += 12;
        }

        if (period === "AM" && hours === 12) {
            hours = 0;
        }

        return (hours * 60) + minutes;
    }

    function getClassTimeRange(classItem) {
        const [start = "", end = ""] = classItem.time.split(" - ");

        return {
            start: parseTimeToMinutes(start),
            end: parseTimeToMinutes(end || start)
        };
    }

    function getSortedSchedule(schedule) {
        return [...schedule].sort((firstClass, secondClass) => {
            const dayDifference = (DAY_INDEX[firstClass.day] ?? 9) - (DAY_INDEX[secondClass.day] ?? 9);

            if (dayDifference !== 0) {
                return dayDifference;
            }

            return getClassTimeRange(firstClass).start - getClassTimeRange(secondClass).start;
        });
    }

    function getNextClass(schedule, date = new Date()) {
        const sortedSchedule = getSortedSchedule(schedule);
        const currentDay = date.getDay();
        const currentMinutes = (date.getHours() * 60) + date.getMinutes();

        const candidates = sortedSchedule.map((classItem) => {
            const classDay = DAY_INDEX[classItem.day] ?? 0;
            const timeRange = getClassTimeRange(classItem);
            let daysUntil = (classDay - currentDay + 7) % 7;
            const isToday = daysUntil === 0;
            const isCurrent = isToday && currentMinutes >= timeRange.start && currentMinutes <= timeRange.end;

            if (isToday && currentMinutes > timeRange.end) {
                daysUntil = 7;
            }

            return {
                ...classItem,
                daysUntil,
                isCurrent,
                startsInMinutes: (daysUntil * 1440) + timeRange.start - currentMinutes
            };
        });

        return candidates.sort((firstClass, secondClass) => firstClass.startsInMinutes - secondClass.startsInMinutes)[0] || null;
    }

    function loadReminders() {
        try {
            return JSON.parse(localStorage.getItem(REMINDERS_STORAGE_KEY) || "[]");
        } catch (error) {
            localStorage.removeItem(REMINDERS_STORAGE_KEY);
            return [];
        }
    }

    function saveReminders(reminders) {
        localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
    }

    function getDateValue(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function getReminderExpiration(reminder) {
        if (!reminder.date) {
            return null;
        }

        if (reminder.time) {
            return new Date(`${reminder.date}T${reminder.time}`);
        }

        return new Date(`${reminder.date}T23:59:59`);
    }

    function isExpiredReminder(reminder, now = new Date()) {
        const expiration = getReminderExpiration(reminder);

        return expiration ? expiration.getTime() < now.getTime() : false;
    }

    function purgeExpiredReminders() {
        const reminders = loadReminders();
        const activeReminders = reminders.filter((reminder) => !isExpiredReminder(reminder));

        if (activeReminders.length !== reminders.length) {
            saveReminders(activeReminders);
        }

        return activeReminders;
    }

    function getReminderScheduleLabel(reminder) {
        const dateLabel = reminder.date || "Sin fecha";
        return reminder.time ? `${dateLabel} ${reminder.time}` : dateLabel;
    }

    function getDueReminders(now = new Date()) {
        const today = getDateValue(now);

        return purgeExpiredReminders().filter((reminder) => {
            return reminder.date === today && !reminder.acknowledgedAt;
        });
    }

    function getAlertSessionKey() {
        const token = localStorage.getItem("psm_auth_token") || "guest";

        return `${REMINDER_ALERT_SESSION_KEY}_${token}`;
    }

    function shouldShowStartupAlert() {
        let settings = {};

        try {
            settings = JSON.parse(localStorage.getItem("psm_dashboard_settings") || "{}");
        } catch (error) {
            localStorage.removeItem("psm_dashboard_settings");
        }

        if (settings.reminderAlerts === false) {
            return false;
        }

        const sessionKey = getAlertSessionKey();

        if (sessionStorage.getItem(sessionKey) === "shown") {
            return false;
        }

        sessionStorage.setItem(sessionKey, "shown");
        return true;
    }

    function acknowledgeReminders(reminderIds) {
        const ids = new Set(reminderIds);
        const now = new Date().toISOString();
        const reminders = loadReminders().map((reminder) => {
            if (!ids.has(reminder.id)) {
                return reminder;
            }

            return {
                ...reminder,
                acknowledgedAt: now
            };
        });

        saveReminders(reminders);
    }

    function getReminderCountForSubject(subject) {
        return purgeExpiredReminders().filter((reminder) => reminder.subject === subject).length;
    }

    function createClassCard(classItem) {
        const subjectReminders = purgeExpiredReminders().filter((reminder) => reminder.subject === classItem.subject);
        const reminderCount = subjectReminders.length;

        return `
            <article class="class-card student-class-card" style="--accent: ${classItem.accent}">
                <div>
                    <span class="student-class-mode">${classItem.mode}</span>
                    <strong>${classItem.subject}</strong>
                    <p><i class="fa-regular fa-clock" aria-hidden="true"></i>${classItem.time}</p>
                    <p><i class="fa-solid fa-location-dot" aria-hidden="true"></i>${classItem.room}</p>
                    <p><i class="fa-solid fa-user-tie" aria-hidden="true"></i>${classItem.teacher}</p>
                </div>
                ${reminderCount ? `<span class="student-class-reminder-count"><i class="fa-solid fa-bell" aria-hidden="true"></i>${reminderCount}</span>` : ""}
                ${subjectReminders.length ? `
                    <div class="student-class-reminders">
                        ${subjectReminders.slice(0, 2).map((reminder) => `
                            <span class="student-class-reminder">
                                <button class="student-class-reminder-preview" type="button" data-preview-reminder="${reminder.id}" aria-label="Previsualizar recordatorio">
                                    <i class="fa-solid fa-thumbtack" aria-hidden="true"></i>
                                    <span class="student-class-reminder-track"><span>${reminder.type} ${getReminderScheduleLabel(reminder)}: ${reminder.note}</span></span>
                                </button>
                                <button type="button" data-delete-reminder="${reminder.id}" aria-label="Eliminar recordatorio">
                                    <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                                </button>
                            </span>
                        `).join("")}
                    </div>
                ` : ""}
            </article>
        `;
    }

    function renderReminderItem(reminder) {
        return `
            <article class="student-reminder-item">
                <div>
                    <strong>${reminder.subject}</strong>
                    <p>${reminder.note}</p>
                    <span>${reminder.type}</span>
                </div>
                <button type="button" data-delete-reminder="${reminder.id}" aria-label="Eliminar recordatorio">
                    <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                </button>
            </article>
        `;
    }

    function render(elements, dashboardData, weekDays) {
        const schedule = getSchedule(dashboardData);
        const nextClass = getNextClass(schedule);
        const uniqueSubjects = [...new Set(schedule.map((item) => item.subject))];
        purgeExpiredReminders();

        elements.scheduleGrid.innerHTML = `
            <div class="student-schedule-dashboard">
                <div class="student-schedule-tools">
                    <section class="student-schedule-next" aria-label="Proxima clase detectada">
                        <div>
                            <span>${nextClass?.isCurrent ? "Clase en curso" : "Proxima clase"}</span>
                            <strong>${nextClass?.subject || "Sin clases programadas"}</strong>
                            <p>${nextClass ? `${nextClass.day}, ${nextClass.time} | ${nextClass.room}` : "Tu horario no tiene materias cargadas."}</p>
                        </div>
                    </section>

                    <section class="student-reminder-composer" aria-label="Crear recordatorio academico">
                        <div class="student-reminder-heading">
                            <div>
                                <span>Recordatorio</span>
                                <strong>Agregar alerta al calendario</strong>
                            </div>
                            <small>Selecciona la materia, fecha y motivo.</small>
                        </div>
                        <form id="student-reminder-form" class="student-reminder-form">
                            <select id="student-reminder-subject" aria-label="Materia">
                                ${uniqueSubjects.map((subject) => `<option value="${subject}">${subject}</option>`).join("")}
                            </select>
                            <select id="student-reminder-type" aria-label="Tipo de recordatorio">
                                <option value="Examen">Examen</option>
                                <option value="Entrega">Entrega</option>
                                <option value="Exposición">Exposición</option>
                                <option value="Tarea">Tarea</option>
                                <option value="Practica">Practica</option>
                                <option value="Nota">Nota</option>
                            </select>
                            <input id="student-reminder-date" type="date" aria-label="Fecha del recordatorio">
                            <input id="student-reminder-time" type="time" aria-label="Hora del recordatorio">
                            <input id="student-reminder-note" type="text" maxlength="72" placeholder="Ej: estudiar guia 2" aria-label="Nota del recordatorio">
                            <button type="submit"><i class="fa-solid fa-plus" aria-hidden="true"></i>Agregar</button>
                        </form>
                    </section>
                </div>

                <div class="student-schedule-days">
                    ${weekDays.map((day) => {
                        const classes = schedule.filter((item) => item.day === day);
                        const classCards = classes.length
                            ? classes.map((item) => createClassCard(item)).join("")
                            : '<span class="empty-day">Sin clases asignadas</span>';

                        return `
                            <section class="day-column student-day-column" aria-label="${day}">
                                <h3>${day}</h3>
                                ${classCards}
                            </section>
                        `;
                    }).join("")}
                </div>
            </div>
        `;

        bindEvents(elements, dashboardData, weekDays);
    }

    function bindEvents(elements, dashboardData, weekDays) {
        const form = elements.scheduleGrid.querySelector("#student-reminder-form");
        const exportButtons = document.querySelectorAll("#schedule [data-export-schedule-pdf], #schedule > .section-heading > .ghost-button");

        form?.addEventListener("submit", (event) => {
            event.preventDefault();

            const subject = elements.scheduleGrid.querySelector("#student-reminder-subject")?.value || "Materia";
            const type = elements.scheduleGrid.querySelector("#student-reminder-type")?.value || "Nota";
            const date = elements.scheduleGrid.querySelector("#student-reminder-date")?.value || "";
            const time = elements.scheduleGrid.querySelector("#student-reminder-time")?.value || "";
            const noteInput = elements.scheduleGrid.querySelector("#student-reminder-note");
            const note = noteInput?.value.trim();

            if (!note) {
                noteInput?.focus();
                return;
            }

            const reminders = loadReminders();
            reminders.unshift({
                id: String(Date.now()),
                subject,
                type,
                date,
                time,
                note
            });
            saveReminders(reminders.slice(0, 12));
            render(elements, dashboardData, weekDays);
        });

        elements.scheduleGrid.querySelectorAll("[data-delete-reminder]").forEach((button) => {
            button.addEventListener("click", (event) => {
                const id = event.currentTarget.dataset.deleteReminder;
                saveReminders(loadReminders().filter((reminder) => reminder.id !== id));
                render(elements, dashboardData, weekDays);
            });
        });

        elements.scheduleGrid.querySelectorAll("[data-preview-reminder]").forEach((button) => {
            button.addEventListener("click", (event) => {
                const reminder = loadReminders().find((item) => item.id === event.currentTarget.dataset.previewReminder);

                if (reminder) {
                    showReminderPreview(reminder);
                }
            });
        });

        exportButtons.forEach((button) => {
            if (button.dataset.scheduleExportBound === "true") {
                return;
            }

            button.dataset.scheduleExportBound = "true";
            button.addEventListener("click", () => exportSchedulePdf(dashboardData, weekDays));
        });
    }

    function showStartupReminderAlert(elements) {
        if (!shouldShowStartupAlert()) {
            return;
        }

        showReminderAlert(elements);
    }

    function showReminderPreview(reminder) {
        const existingPreview = document.querySelector(".student-reminder-preview");

        existingPreview?.remove();

        const previewElement = document.createElement("section");
        previewElement.className = "student-reminder-preview";
        previewElement.setAttribute("role", "dialog");
        previewElement.setAttribute("aria-modal", "true");
        previewElement.setAttribute("aria-label", "Previsualizacion del recordatorio");
        previewElement.innerHTML = `
            <div class="student-reminder-preview-backdrop" data-reminder-preview-close></div>
            <article class="student-reminder-preview-card">
                <button class="student-reminder-preview-close" type="button" data-reminder-preview-close aria-label="Cerrar previsualizacion">
                    <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                </button>
                <span class="student-reminder-preview-kicker">${reminder.type}</span>
                <h2>${reminder.subject}</h2>
                <p>${reminder.note}</p>
                <small>${getReminderScheduleLabel(reminder)}</small>
            </article>
        `;

        document.body.appendChild(previewElement);

        previewElement.querySelectorAll("[data-reminder-preview-close]").forEach((button) => {
            button.addEventListener("click", () => previewElement.remove());
        });
    }

    function showReminderAlert(elements) {
        const dueReminders = getDueReminders();
        const existingAlert = document.querySelector(".student-reminder-alert");

        existingAlert?.remove();

        if (!dueReminders.length) {
            return;
        }

        const alertElement = document.createElement("section");
        alertElement.className = "student-reminder-alert";
        alertElement.setAttribute("role", "dialog");
        alertElement.setAttribute("aria-modal", "true");
        alertElement.setAttribute("aria-label", "Recordatorios de hoy");
        alertElement.innerHTML = `
            <div class="student-reminder-alert-backdrop"></div>
            <article class="student-reminder-alert-card">
                <span class="student-reminder-alert-kicker">Agenda de hoy</span>
                <h2>Tienes ${dueReminders.length === 1 ? "un recordatorio" : `${dueReminders.length} recordatorios`}</h2>
                <div class="student-reminder-alert-list">
                    ${dueReminders.map((reminder) => `
                        <div class="student-reminder-alert-item">
                            <i class="fa-solid fa-bell" aria-hidden="true"></i>
                            <p>Hoy tienes <strong>${reminder.type}</strong>${reminder.note ? `: ${reminder.note}` : ""} de la materia <strong>${reminder.subject}</strong>${reminder.time ? ` a las <strong>${reminder.time}</strong>` : ""}.</p>
                        </div>
                    `).join("")}
                </div>
                <div class="student-reminder-alert-actions">
                    <button class="student-reminder-alert-secondary" type="button" data-reminder-scroll>Ver calendario</button>
                    <button class="student-reminder-alert-primary" type="button" data-reminder-accept>Aceptar</button>
                </div>
            </article>
        `;

        document.body.appendChild(alertElement);

        alertElement.querySelector("[data-reminder-scroll]").addEventListener("click", () => {
            document.querySelector("#schedule")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        alertElement.querySelector("[data-reminder-accept]").addEventListener("click", () => {
            acknowledgeReminders(dueReminders.map((reminder) => reminder.id));
            alertElement.remove();
            render(elements, window.PSM_DASHBOARD_DATA || {}, window.PSM_WEEK_DAYS || []);
        });
    }

    function renderNextClass(elements, dashboardData) {
        const nextClass = getNextClass(getSchedule(dashboardData));
        const nextClassLabel = document.querySelector(".hero-next-class span");

        if (!nextClass) {
            if (nextClassLabel) {
                nextClassLabel.textContent = "Horario";
            }
            elements.nextClassTitle.textContent = "Sin clases";
            elements.nextClassDetail.textContent = "No hay materias cargadas en tu calendario.";
            return;
        }

        if (nextClassLabel) {
            nextClassLabel.textContent = nextClass.isCurrent ? "Clase en curso" : "Proxima clase";
        }

        elements.nextClassTitle.textContent = nextClass.subject;
        elements.nextClassDetail.textContent = `${nextClass.day}, ${nextClass.time} | ${nextClass.room}`;
    }

    function exportSchedulePdf(dashboardData, weekDays) {
        const schedule = getSchedule(dashboardData);
        const reminders = loadReminders();
        const printWindow = window.open("", "_blank", "width=980,height=720");

        if (!printWindow) {
            return;
        }

        const daySections = weekDays.map((day) => {
            const classes = schedule.filter((item) => item.day === day);

            return `
                <section class="pdf-day">
                    <h2>${day}</h2>
                    ${classes.length ? classes.map((classItem) => `
                        <article>
                            <strong>${classItem.subject}</strong>
                            <p>${classItem.time} | ${classItem.room}</p>
                            <p>${classItem.teacher} | ${classItem.mode}</p>
                        </article>
                    `).join("") : "<p>Sin clases asignadas</p>"}
                </section>
            `;
        }).join("");

        printWindow.document.write(`
            <!doctype html>
            <html lang="es">
            <head>
                <meta charset="utf-8">
                <title>Horario academico PSM</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 32px; color: #061b33; }
                    header { border-bottom: 3px solid #0b3a6e; margin-bottom: 22px; padding-bottom: 14px; }
                    header span { color: #0b3a6e; font-size: 12px; font-weight: 800; text-transform: uppercase; }
                    h1 { margin: 6px 0 0; font-size: 28px; }
                    .pdf-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
                    .pdf-day { border: 1px solid #d8e1ec; border-radius: 10px; padding: 14px; break-inside: avoid; }
                    .pdf-day h2 { margin: 0 0 10px; font-size: 16px; color: #0b3a6e; }
                    article { border-left: 4px solid #d7af4f; padding: 8px 10px; margin-top: 8px; background: #f8fafc; }
                    article strong { display: block; margin-bottom: 5px; }
                    p { margin: 3px 0; color: #475467; font-size: 13px; }
                    .reminders { margin-top: 24px; }
                    .reminders h2 { color: #0b3a6e; font-size: 18px; }
                    @media print { body { margin: 18mm; } button { display: none; } }
                </style>
            </head>
            <body>
                <header>
                    <span>Politecnico Santiago Marino</span>
                    <h1>Horario academico</h1>
                    <p>Exportado el ${new Date().toLocaleDateString("es-VE")}</p>
                </header>
                <main class="pdf-grid">${daySections}</main>
                <section class="reminders">
                    <h2>Recordatorios</h2>
                    ${reminders.length ? reminders.map((reminder) => `<article><strong>${reminder.subject} | ${reminder.type} | ${getReminderScheduleLabel(reminder)}</strong><p>${reminder.note}</p></article>`).join("") : "<p>Sin recordatorios guardados.</p>"}
                </section>
                <script>window.addEventListener("load", () => { window.print(); });<\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    function cleanupExpiredReminders() {
        const totalReminders = loadReminders().length;
        const activeReminders = purgeExpiredReminders();

        return totalReminders - activeReminders.length;
    }

    return {
        render,
        renderNextClass,
        exportSchedulePdf,
        showStartupReminderAlert,
        cleanupExpiredReminders
    };
})();
