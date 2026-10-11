import { auth, db } from "./firebase/config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


document.addEventListener("DOMContentLoaded", () => {

    const btnLogin = document.querySelector("#btnLoginPlaceholder");
    const btnCerrarSesion = document.querySelector("#btnCerrarSesion");
    const menuUsuario = document.querySelector("#menuUsuario");

    if (!btnLogin || !menuUsuario) {
        console.error("No se encontró el botón o el menú del usuario.");
        return;
    }

    // Ocultar el menú hasta comprobar la sesión
    menuUsuario.classList.add("d-none");

    onAuthStateChanged(auth, async (usuario) => {

        if (usuario) {

            let nombreMostrar = "Mi cuenta";

            try {
                const referencia = doc(db, "usuarios", usuario.uid);
                const documento = await getDoc(referencia);

                if (documento.exists()) {
                    const datos = documento.data();

                    nombreMostrar = [
                        datos.nombre,
                        datos.apellido
                    ].filter(Boolean).join(" ") || "Mi cuenta";
                }
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
            }

            btnLogin.textContent = nombreMostrar;
            btnLogin.classList.remove("btn-outline-light");
            btnLogin.classList.add("btn-outline-warning");

            // Habilitar el menú desplegable
            btnLogin.setAttribute("data-bs-toggle", "dropdown");
            btnLogin.onclick = null;

            menuUsuario.classList.remove("d-none");

            // Inicializar Bootstrap
            bootstrap.Dropdown.getOrCreateInstance(btnLogin);

        } else {

            // Desactivar el menú desplegable
            bootstrap.Dropdown.getInstance(btnLogin)?.dispose();

            btnLogin.textContent = "Ingresar";
            btnLogin.classList.remove("btn-outline-warning");
            btnLogin.classList.add("btn-outline-light");

            btnLogin.removeAttribute("data-bs-toggle");
            btnLogin.onclick = () => {
                window.location.href = "login.html";
            };

            menuUsuario.classList.add("d-none");
        }
    });

    // Cerrar sesión
    btnCerrarSesion?.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            alert("No se pudo cerrar la sesión. Intenta nuevamente.");
        }
    });

});
