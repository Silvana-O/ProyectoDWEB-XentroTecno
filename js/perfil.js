import { auth, db } from "./firebase/config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const nombreUsuario =
    document.querySelector("#nombreUsuario");

const emailUsuario =
    document.querySelector("#emailUsuario");

const btnCerrarSesion =
    document.querySelector("#btnCerrarSesion");

const contenedorPedidos =
    document.querySelector("#contenedorPedidos");

const mensajePedidos =
    document.querySelector("#mensajePedidos");


// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearFecha(fecha) {

    if (!fecha) {
        return "Fecha no disponible";
    }


    const fechaJS =
        fecha.toDate
            ? fecha.toDate()
            : new Date(fecha);


    return fechaJS.toLocaleDateString(
        "es-UY",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ==========================================
// MOSTRAR PEDIDOS
// ==========================================

function mostrarPedidos(pedidos) {

    contenedorPedidos.innerHTML = "";


    if (pedidos.length === 0) {

        mensajePedidos.className =
            "alert alert-info text-center";

        mensajePedidos.textContent =
            "Todavía no realizaste ninguna compra.";

        return;
    }


    mensajePedidos.classList.add("d-none");


    pedidos.forEach(pedido => {

        const datos =
            pedido.data();


        const tarjeta =
            document.createElement("div");


        tarjeta.classList.add(
            "card",
            "border",
            "shadow-sm"
        );


        let productosHTML = "";


        datos.productos.forEach(producto => {

            productosHTML += `
                <div class="border-bottom py-2">

                    <div class="d-flex justify-content-between">

                        <span class="fw-semibold">
                            ${producto.nombre}
                        </span>

                        <span>
                            USD ${producto.subtotal}
                        </span>

                    </div>

                    <small class="text-muted">
                        Cantidad: ${producto.cantidad}
                        · Precio unitario: USD ${producto.precio}
                    </small>

                </div>
            `;

        });


        tarjeta.innerHTML = `
            <div class="card-body">

                <div class="d-flex flex-column flex-md-row
                            justify-content-between
                            align-items-md-center
                            mb-3">

                    <div>

                        <h3 class="h5 mb-1">
                            Pedido #${
                                datos.numeroPedido
                                    ? String(datos.numeroPedido).padStart(6, "0")
                                    : pedido.id
                            }
                        </h3>

                        <small class="text-muted">
                            ${formatearFecha(datos.fecha)}
                        </small>

                    </div>

                    <span class="badge text-bg-success mt-2 mt-md-0">
                        ${datos.estado}
                    </span>

                </div>


                <div class="mb-3">

                    <h4 class="h6">
                        Productos
                    </h4>

                    ${productosHTML}

                </div>


                <div class="text-end border-top pt-3">

                    <span class="fw-semibold">
                        Total:
                    </span>

                    <strong>
                        USD ${datos.total}
                    </strong>

                </div>

            </div>
        `;


        contenedorPedidos.appendChild(tarjeta);

    });

}


// ==========================================
// CARGAR HISTORIAL DE PEDIDOS
// ==========================================

async function cargarPedidos(uid) {

    try {

        const referenciaPedidos =
            collection(db, "pedidos");


        const consultaPedidos =
            query(
                referenciaPedidos,
                where("usuarioId", "==", uid)
            );


        const snapshot =
            await getDocs(consultaPedidos);


        console.log(
            "Pedidos del usuario:",
            snapshot.docs
        );


        mostrarPedidos(snapshot.docs);


    } catch (error) {

        console.error(
            "Error al cargar los pedidos:",
            error
        );


        mensajePedidos.className =
            "alert alert-danger text-center";

        mensajePedidos.textContent =
            "No se pudo cargar el historial de pedidos. Intentá nuevamente más tarde.";

    }

}


// ==========================================
// COMPROBAR SESIÓN
// ==========================================

onAuthStateChanged(auth, async (usuario) => {

    if (!usuario) {

        window.location.href = "login.html";

        return;
    }


    // ======================================
    // MOSTRAR CORREO
    // ======================================

    if (emailUsuario) {

        emailUsuario.textContent =
            usuario.email;

    }


    // ======================================
    // CARGAR DATOS DEL USUARIO
    // ======================================

    try {

        const referenciaUsuario =
            doc(
                db,
                "usuarios",
                usuario.uid
            );


        const documentoUsuario =
            await getDoc(
                referenciaUsuario
            );


        if (documentoUsuario.exists()) {

            const datos =
                documentoUsuario.data();


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


    // ======================================
    // CARGAR HISTORIAL
    // ======================================

    await cargarPedidos(usuario.uid);

});


// ==========================================
// CERRAR SESIÓN
// ==========================================

btnCerrarSesion?.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

            window.location.href =
                "login.html";

        } catch (error) {

            console.error(
                "Error al cerrar sesión:",
                error
            );

        }

    }
);