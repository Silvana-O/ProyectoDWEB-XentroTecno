import { auth } from "./firebase/config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const btnLogin = document.querySelector("#btnLoginPlaceholder");


onAuthStateChanged(auth, (usuario) => {

    if (!btnLogin) return;


    if (usuario) {

        // Usuario autenticado
        btnLogin.textContent = "Cerrar sesión";
        btnLogin.classList.remove("btn-outline-light");
        btnLogin.classList.add("btn-outline-warning");

        btnLogin.onclick = async () => {

            try {

                await signOut(auth);

                window.location.href = "index.html";

            } catch (error) {

                console.error(
                    "Error al cerrar sesión:",
                    error
                );

            }

        };

    } else {

        // Usuario no autenticado
        btnLogin.textContent = "Ingresar";
        btnLogin.classList.remove("btn-outline-warning");
        btnLogin.classList.add("btn-outline-light");

        btnLogin.onclick = () => {
            window.location.href = "login.html";
        };

    }

});