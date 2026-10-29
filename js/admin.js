
import { auth, db } from "./firebase/config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const contenidoAdmin = document.querySelector("main");

// Promesa que permite esperar la autorización antes de cargar los productos.
window.adminAutorizado = new Promise((resolve) => {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {
            contenidoAdmin?.classList.add("d-none");

            resolve(false);

            alert("Debes iniciar sesión para acceder al panel de administración.");
            window.location.replace("index.html");
            return;
        }

        try {
            const usuarioRef = doc(db, "usuarios", user.uid);
            const usuarioSnap = await getDoc(usuarioRef);

            if (!usuarioSnap.exists()) {
                contenidoAdmin?.classList.add("d-none");

                resolve(false);

                alert("No se encontraron los datos del usuario.");
                window.location.replace("index.html");
                return;
            }

            const usuario = usuarioSnap.data();

            if (usuario.rol !== "admin") {
                contenidoAdmin?.classList.add("d-none");

                resolve(false);

                alert("Acceso denegado. No tienes permisos para acceder al panel de administración.");
                window.location.replace("index.html");
                return;
            }

            // El usuario está autorizado.
            contenidoAdmin?.classList.remove("d-none");

            console.log("Acceso autorizado: administrador.");

            resolve(true);

        } catch (error) {
            console.error("Error al verificar el rol:", error);

            contenidoAdmin?.classList.add("d-none");

            resolve(false);

            alert("No se pudo verificar el acceso al panel.");
            window.location.replace("index.html");
        }

    });

});
