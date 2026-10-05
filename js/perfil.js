import { auth, db } from "./firebase/config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const nombreUsuario = document.querySelector("#nombreUsuario");
const emailUsuario = document.querySelector("#emailUsuario");
const btnCerrarSesion = document.querySelector("#btnCerrarSesion");


onAuthStateChanged(auth, async (usuario) => {

    // Usuario no autenticado
    if (!usuario) {
        window.location.href = "login.html";
        return;
    }


    // Mostrar correo de Authentication
    if (emailUsuario) {
        emailUsuario.textContent = usuario.email;
    }


    // Obtener datos del usuario desde Firestore
    try {

        const referenciaUsuario =
            doc(db, "usuarios", usuario.uid);

        const documentoUsuario =
            await getDoc(referenciaUsuario);


        if (documentoUsuario.exists()) {

            const datos = documentoUsuario.data();

            if (nombreUsuario) {
                nombreUsuario.textContent =
                    `${datos.nombre} ${datos.apellido}`;
            }

        } else {

            if (nombreUsuario) {
                nombreUsuario.textContent =
                    "Usuario";
            }
        }

    } catch (error) {

        console.error(
            "Error al obtener los datos del usuario:",
            error
        );

        if (nombreUsuario) {
            nombreUsuario.textContent =
                "Usuario";
        }
    }

});


// Cerrar sesión
btnCerrarSesion?.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "login.html";

    } catch (error) {

        console.error(
            "Error al cerrar sesión:",
            error
        );

    }

});