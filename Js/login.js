"use strict";

const VALID_IDENTITIES = [
    { documentType: "V", documentNumber: "24485562", role: "student", name: "John Lennon" },
    { documentType: "V", documentNumber: "11111111", role: "teacher", name: "Profesora. Laura Salazar" },
    { documentType: "V", documentNumber: "99999999", role: "admin", name: "Admin PSM" },
    { documentType: "E", documentNumber: "87654321", role: "student", name: "Estudiante Invitado" }
];
const VALID_PASSWORD = "123456";
const NETWORK_DELAY_MS = 1500;
const REDIRECT_URL = "Pages/dashboard.html";

function getDomElements() {
    return {
        form: document.querySelector("#login-form"),
        documentType: document.querySelector("#document-type"),
        documentNumber: document.querySelector("#document-number"),
        passwordInput: document.querySelector("#password"),
        loginButton: document.querySelector("#login-button"),
        errorBox: document.querySelector("#error-box"),
        togglePasswordButton: document.querySelector("#toggle-password"),
        forgotPasswordLink: document.querySelector("#forgot-password")
    };
}

function validateCredentials(documentNumber, password) {
    if (!documentNumber || !password) {
        return "Ingresa tu cedula y contrasena para continuar.";
    }

    if (!/^\d{6,10}$/.test(documentNumber)) {
        return "La cedula debe contener solo numeros y tener entre 6 y 10 digitos.";
    }

    return "";
}

function showError(errorBox, message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
}

function hideError(errorBox) {
    errorBox.textContent = "";
    errorBox.hidden = true;
}

function setLoadingState(elements, isLoading) {
    const controls = [elements.documentType, elements.documentNumber, elements.passwordInput];

    elements.loginButton.disabled = isLoading;
    elements.loginButton.classList.toggle("is-loading", isLoading);
    elements.loginButton.innerHTML = isLoading
        ? '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i><span>Validando...</span>'
        : '<i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i><span>Iniciar sesion</span>';

    controls.forEach((control) => {
        control.disabled = isLoading;
    });
}

function authenticateUser(documentType, documentNumber, password) {
    return new Promise((resolve) => {
        window.setTimeout(() => {
            const validIdentity = VALID_IDENTITIES.find((identity) => {
                return identity.documentType === documentType && identity.documentNumber === documentNumber;
            });
            const hasValidPassword = password === VALID_PASSWORD;

            if (!validIdentity || !hasValidPassword) {
                resolve({ success: false, token: null });
                return;
            }

            resolve({
                success: true,
                token: createFakeJwt(`${documentType}-${documentNumber}`),
                user: validIdentity
            });
        }, NETWORK_DELAY_MS);
    });
}

function createFakeJwt(subject) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ sub: subject, scope: "university-login", iat: Date.now() }));
    const signature = btoa("psm-local-signature");

    return `${header}.${payload}.${signature}`;
}

function saveSessionToken(token, user) {
    localStorage.setItem("psm_auth_token", token);
    localStorage.setItem("psm_user_role", user.role);
    localStorage.setItem("psm_user_name", user.name);
    localStorage.setItem("psm_user_document", `${user.documentType}-${user.documentNumber}`);
}

function redirectAfterLogin() {
    window.location.href = REDIRECT_URL;
}

function togglePasswordVisibility(elements) {
    const isPassword = elements.passwordInput.type === "password";

    elements.passwordInput.type = isPassword ? "text" : "password";
    elements.togglePasswordButton.setAttribute("aria-label", isPassword ? "Ocultar contrasena" : "Mostrar contrasena");
    elements.togglePasswordButton.innerHTML = isPassword
        ? '<i class="fa-solid fa-eye-slash" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-eye" aria-hidden="true"></i>';
}

function handleForgotPassword(event, elements) {
    event.preventDefault();
    showError(elements.errorBox, "Para recuperar tu contrasena, contacta al departamento de control de estudios o soporte PSM.");
}

async function handleSubmit(event, elements) {
    event.preventDefault();

    const documentType = elements.documentType.value;
    const documentNumber = elements.documentNumber.value.trim();
    const password = elements.passwordInput.value.trim();
    const validationMessage = validateCredentials(documentNumber, password);

    hideError(elements.errorBox);

    if (validationMessage) {
        showError(elements.errorBox, validationMessage);
        return;
    }

    setLoadingState(elements, true);

    try {
        const authResult = await authenticateUser(documentType, documentNumber, password);

        if (!authResult.success) {
            showError(elements.errorBox, "Cedula o contrasena incorrecta.");
            return;
        }

        saveSessionToken(authResult.token, authResult.user);
        redirectAfterLogin();
    } catch (error) {
        showError(elements.errorBox, "No se pudo procesar el inicio de sesion. Intenta nuevamente.");
    } finally {
        setLoadingState(elements, false);
    }
}

function initLoginModule() {
    const elements = getDomElements();
    const requiredElements = Object.values(elements);

    if (requiredElements.some((element) => !element)) {
        throw new Error("No se encontraron todos los elementos requeridos para inicializar el login.");
    }

    elements.form.addEventListener("submit", (event) => handleSubmit(event, elements));
    elements.togglePasswordButton.addEventListener("click", () => togglePasswordVisibility(elements));
    elements.forgotPasswordLink.addEventListener("click", (event) => handleForgotPassword(event, elements));
}

document.addEventListener("DOMContentLoaded", initLoginModule);
