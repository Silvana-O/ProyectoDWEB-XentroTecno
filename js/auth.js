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


// Mostrar mensajes
function mostrarMensaje(mensaje, tipo = "danger") {

    if (!authMessage) return;

    authMessage.textContent = mensaje;

    authMessage.className = `alert alert-${tipo} mt-4 mb-0`;
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

        default:
            return "Ocurrió un error. Intenta nuevamente.";
    }
}


// REGISTRO
formRegistro?.addEventListener("submit", async (event) => {

    event.preventDefault();

    const nombre = document.querySelector("#registerNombre").value.trim();
    const apellido = document.querySelector("#registerApellido").value.trim();
    const email = document.querySelector("#registerEmail").value.trim();
    const password = document.querySelector("#registerPassword").value;
    const passwordConfirm = document.querySelector("#registerPasswordConfirm").value;


    if (password !== passwordConfirm) {

        mostrarMensaje(
            "Las contraseñas no coinciden.",
            "warning"
        );

        return;
    }


    if (password.length < 6) {

        mostrarMensaje(
            "La contraseña debe tener al menos 6 caracteres.",
            "warning"
        );

        return;
    }


    try {

        const credenciales =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const usuario = credenciales.user;


        // Crear documento del usuario en Firestore
        await setDoc(
            doc(db, "usuarios", usuario.uid),
            {
                uid: usuario.uid,
                nombre: nombre,
                apellido: apellido,
                email: usuario.email,
                fechaRegistro: serverTimestamp()
            }
        );


        mostrarMensaje(
            "Cuenta creada correctamente. Ya puedes iniciar sesión.",
            "success"
        );


        formRegistro.reset();


        // Cambiar a la pestaña de inicio de sesión
        const loginTab =
            document.querySelector("#login-tab");

        if (loginTab) {
            bootstrap.Tab.getOrCreateInstance(loginTab).show();
        }

    } catch (error) {

        console.error(error);

        mostrarMensaje(
            obtenerMensajeError(error)
        );
    }

});


// INICIO DE SESIÓN
formLogin?.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.querySelector("#loginEmail").value.trim();

    const password =
        document.querySelector("#loginPassword").value;


    try {

        await setPersistence(auth, browserLocalPersistence);

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        mostrarMensaje(
            "Inicio de sesión correcto.",
            "success"
        );


        formLogin.reset();


        // Ir al perfil después de iniciar sesión
        setTimeout(() => {
            window.location.href = "perfil.html";
        }, 800);


    } catch (error) {

        console.error(error);

        mostrarMensaje(
            obtenerMensajeError(error)
        );
    }

});