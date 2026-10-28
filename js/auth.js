
import { auth, db } from "./firebase/config.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const formLogin = document.querySelector("#formLogin");
const formRegistro = document.querySelector("#formRegistro");
const authMessage = document.querySelector("#authMessage");

const registerPassword = document.querySelector("#registerPassword");
const registerPasswordConfirm = document.querySelector("#registerPasswordConfirm");
const passwordLengthStatus = document.querySelector("#passwordLengthStatus");
const passwordMatchStatus = document.querySelector("#passwordMatchStatus");


// Mostrar mensajes generales
function mostrarMensaje(mensaje, tipo = "danger") {
    if (!authMessage) return;

    authMessage.textContent = mensaje;
    authMessage.className = `alert alert-${tipo} mt-4 mb-0`;
}


// Ocultar el mensaje anterior
function limpiarMensaje() {
    if (!authMessage) return;

    authMessage.textContent = "";
    authMessage.className = "alert d-none mt-4 mb-0";
}


// Traducir errores de Firebase
function obtenerMensajeError(error) {
    switch (error.code) {
        case "auth/email-already-in-use":
            return "Ya existe una cuenta registrada con ese correo.";

        case "auth/invalid-email":
            return "El correo electrónico no tiene un formato válido.";

        case "auth/weak-password":
            return "La contraseña debe tener al menos 6 caracteres.";

        case "auth/invalid-credential":
        case "auth/invalid-login-credentials":
            return "El correo o la contraseña son incorrectos.";

        case "auth/user-not-found":
            return "No existe una cuenta con ese correo.";

        case "auth/wrong-password":
            return "La contraseña es incorrecta.";

        case "auth/too-many-requests":
            return "Hubo demasiados intentos. Esperá un momento antes de volver a intentarlo.";

        case "auth/network-request-failed":
            return "No se pudo conectar. Revisá tu conexión a Internet.";

        default:
            return "Ocurrió un error. Intentá nuevamente.";
    }
}


// Bloquear temporalmente el botón mientras se procesa el formulario
function establecerCarga(formulario, cargando, textoCarga) {
    const boton = formulario?.querySelector('button[type="submit"]');

    if (!boton) return;

    if (cargando) {
        boton.dataset.textoOriginal = boton.textContent.trim();
        boton.textContent = textoCarga;
        boton.disabled = true;
        boton.setAttribute("aria-busy", "true");
    } else {
        boton.textContent = boton.dataset.textoOriginal || boton.textContent;
        boton.disabled = false;
        boton.removeAttribute("aria-busy");
        delete boton.dataset.textoOriginal;
    }
}


// Mostrar u ocultar contraseñas
document.querySelectorAll("[data-toggle-password]").forEach((boton) => {
    boton.addEventListener("click", () => {
        const idCampo = boton.dataset.togglePassword;
        const campo = document.getElementById(idCampo);

        if (!campo) return;

        const mostrar = campo.type === "password";

        campo.type = mostrar ? "text" : "password";
        boton.textContent = mostrar ? "Ocultar" : "Mostrar";
        boton.setAttribute(
            "aria-label",
            mostrar ? "Ocultar contraseña" : "Mostrar contraseña"
        );
        boton.setAttribute("aria-pressed", String(mostrar));
    });
});


// Actualizar el indicador de longitud de contraseña
function actualizarRequisitoPassword() {
    if (!registerPassword || !passwordLengthStatus) return;

    const cumple = registerPassword.value.length >= 6;

    passwordLengthStatus.classList.toggle("is-valid", cumple);
    passwordLengthStatus.classList.toggle(
        "is-invalid",
        registerPassword.value.length > 0 && !cumple
    );

    passwordLengthStatus.querySelector("span").textContent =
        cumple ? "✓" : "○";
}


// Comprobar que ambas contraseñas coincidan
function actualizarCoincidenciaPassword() {
    if (!registerPassword || !registerPasswordConfirm || !passwordMatchStatus) {
        return;
    }

    const confirmacion = registerPasswordConfirm.value;

    if (!confirmacion) {
        passwordMatchStatus.textContent = "";
        passwordMatchStatus.className = "auth-password-help mt-2";
        registerPasswordConfirm.setCustomValidity("");
        return;
    }

    const coincide = registerPassword.value === confirmacion;

    passwordMatchStatus.textContent = coincide
        ? "Las contraseñas coinciden."
        : "Las contraseñas no coinciden.";

    passwordMatchStatus.className = coincide
        ? "auth-password-help mt-2 auth-requirement is-valid"
        : "auth-password-help mt-2 auth-requirement is-invalid";

    registerPasswordConfirm.setCustomValidity(
        coincide ? "" : "Las contraseñas no coinciden."
    );
}


registerPassword?.addEventListener("input", () => {
    actualizarRequisitoPassword();
    actualizarCoincidenciaPassword();
});

registerPasswordConfirm?.addEventListener("input", actualizarCoincidenciaPassword);


// Limpiar mensajes cuando el usuario vuelve a editar los campos
[formLogin, formRegistro].forEach((formulario) => {
    formulario?.addEventListener("input", limpiarMensaje);
});


// REGISTRO
formRegistro?.addEventListener("submit", async (event) => {
    event.preventDefault();
    limpiarMensaje();

    const nombre = document.querySelector("#registerNombre").value.trim();
    const apellido = document.querySelector("#registerApellido").value.trim();
    const email = document.querySelector("#registerEmail").value.trim();
    const password = registerPassword.value;
    const passwordConfirm = registerPasswordConfirm.value;

    if (!nombre || !apellido) {
        mostrarMensaje("Ingresá tu nombre y apellido.", "warning");
        return;
    }

    if (password.length < 6) {
        mostrarMensaje(
            "La contraseña debe tener al menos 6 caracteres.",
            "warning"
        );
        registerPassword.focus();
        return;
    }

    if (password !== passwordConfirm) {
        mostrarMensaje("Las contraseñas no coinciden.", "warning");
        registerPasswordConfirm.focus();
        return;
    }

    establecerCarga(formRegistro, true, "Creando cuenta...");

    try {
        const credenciales = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const usuario = credenciales.user;

        // Crear el documento del usuario en Firestore
        await setDoc(doc(db, "usuarios", usuario.uid), {
            uid: usuario.uid,
            nombre,
            apellido,
            email: usuario.email,
            rol: "cliente",
            fechaRegistro: serverTimestamp()
        });

        formRegistro.reset();
        actualizarRequisitoPassword();
        actualizarCoincidenciaPassword();

        // Volver a ocultar los campos de contraseña
        document.querySelectorAll(
            '#formRegistro [data-toggle-password]'
        ).forEach((boton) => {
            const campo = document.getElementById(boton.dataset.togglePassword);

            if (campo) campo.type = "password";

            boton.textContent = "Mostrar";
            boton.setAttribute("aria-label", "Mostrar contraseña");
            boton.setAttribute("aria-pressed", "false");
        });

        mostrarMensaje(
            "Cuenta creada correctamente. Ya podés iniciar sesión.",
            "success"
        );

        const loginTab = document.querySelector("#login-tab");

        if (loginTab) {
            bootstrap.Tab.getOrCreateInstance(loginTab).show();
        }

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        mostrarMensaje(obtenerMensajeError(error));

    } finally {
        establecerCarga(formRegistro, false);
    }
});


// INICIO DE SESIÓN
formLogin?.addEventListener("submit", async (event) => {
    event.preventDefault();
    limpiarMensaje();

    const email = document.querySelector("#loginEmail").value.trim();
    const password = document.querySelector("#loginPassword").value;

    establecerCarga(formLogin, true, "Ingresando...");

    try {
        await setPersistence(auth, browserLocalPersistence);

        await signInWithEmailAndPassword(auth, email, password);

        mostrarMensaje("Inicio de sesión correcto.", "success");
        formLogin.reset();

        // Restablecer los controles de visibilidad de contraseña
        document.querySelectorAll(
            '#formLogin [data-toggle-password]'
        ).forEach((boton) => {
            const campo = document.getElementById(boton.dataset.togglePassword);

            if (campo) campo.type = "password";

            boton.textContent = "Mostrar";
            boton.setAttribute("aria-label", "Mostrar contraseña");
            boton.setAttribute("aria-pressed", "false");
        });

        window.location.href = "perfil.html";

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        mostrarMensaje(obtenerMensajeError(error));

    } finally {
        establecerCarga(formLogin, false);
    }
});


// Estado inicial del indicador
actualizarRequisitoPassword();
actualizarCoincidenciaPassword();
