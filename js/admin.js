import { auth, db } from "./firebase/config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


onAuthStateChanged(auth, async (user) => {

    // Si no hay usuario autenticado
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    try {

        // Buscar los datos del usuario en Firestore
        const usuarioRef = doc(db, "usuarios", user.uid);
        const usuarioSnap = await getDoc(usuarioRef);

        // Si no existe el documento
        if (!usuarioSnap.exists()) {
            window.location.href = "index.html";
            return;
        }

        // Obtener los datos del usuario
        const usuario = usuarioSnap.data();

        // Comprobar el rol
        if (usuario.rol !== "admin") {
            window.location.href = "index.html";
            return;
        }

        // Si llegó hasta acá, es administrador
        console.log("Acceso autorizado: administrador");

    } catch (error) {

        console.error("Error al verificar el rol:", error);

        window.location.href = "index.html";
    }

});