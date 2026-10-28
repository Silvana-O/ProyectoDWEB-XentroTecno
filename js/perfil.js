
import { auth, db } from "./firebase/config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

// ==========================================
// ELEMENTOS DEL PERFIL
// ==========================================

const avatarUsuario = document.querySelector("#avatarUsuario");
const nombreUsuario = document.querySelector("#nombreUsuario");
const emailUsuario = document.querySelector("#emailUsuario");
const nombreCompletoPerfil = document.querySelector("#nombreCompletoPerfil");
const correoCompletoPerfil = document.querySelector("#correoCompletoPerfil");

const contenedorPedidos = document.querySelector("#contenedorPedidos");
const mensajePedidos = document.querySelector("#mensajePedidos");

// ==========================================
// GENERAR INICIALES DEL USUARIO
// ==========================================

function generarIniciales(nombre, apellido) {
    return [nombre, apellido]
        .filter(Boolean)
        .map(parte => parte.trim())
        .filter(Boolean)
        .map(parte => parte[0].toLocaleUpperCase("es"))
        .join("")
        .slice(0, 2);
}

// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearFecha(fecha) {
    if (!fecha) {
        return "Fecha no disponible";
    }

    const fechaJS = fecha.toDate
        ? fecha.toDate()
        : new Date(fecha);

    if (Number.isNaN(fechaJS.getTime())) {
        return "Fecha no disponible";
    }

    return fechaJS.toLocaleDateString("es-UY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// ==========================================
// MOSTRAR PEDIDOS
// ==========================================

function mostrarPedidos(pedidos) {
    if (!contenedorPedidos || !mensajePedidos) {
        return;
    }

    contenedorPedidos.innerHTML = "";

    if (pedidos.length === 0) {
        mensajePedidos.className =
            "alert alert-info perfil-orders-message";

        mensajePedidos.textContent =
            "Todavía no realizaste ninguna compra.";

        return;
    }

    mensajePedidos.classList.add("d-none");

    pedidos.forEach(pedido => {
        const datos = pedido.data();

        const tarjeta = document.createElement("div");
        tarjeta.classList.add("card", "border", "shadow-sm");

        let productosHTML = "";

        const productos = Array.isArray(datos.productos)
            ? datos.productos
            : [];

        productos.forEach(producto => {
            productosHTML += `
                <div class="border-bottom py-2">
                    <div class="d-flex justify-content-between gap-3">
                        <span class="fw-semibold">
                            ${producto.nombre ?? "Producto"}
                        </span>

                        <span>
                            USD ${producto.subtotal ?? 0}
                        </span>
                    </div>

                    <small class="text-muted">
                        Cantidad: ${producto.cantidad ?? 0}
                        · Precio unitario: USD ${producto.precio ?? 0}
                    </small>
                </div>
            `;
        });

        const numeroPedido = datos.numeroPedido
            ? String(datos.numeroPedido).padStart(6, "0")
            : pedido.id;

        tarjeta.innerHTML = `
            <div class="card-body">
                <div class="d-flex flex-column flex-md-row
                            justify-content-between
                            align-items-md-center mb-3">

                    <div>
                        <h3 class="h5 mb-1">
                            Pedido #${numeroPedido}
                        </h3>

                        <small class="text-muted">
                            ${formatearFecha(datos.fecha)}
                        </small>
                    </div>

                    <span class="badge text-bg-success mt-2 mt-md-0">
                        ${datos.estado ?? "Sin estado"}
                    </span>
                </div>

                <div class="mb-3">
                    <h4 class="h6">Productos</h4>
                    ${productosHTML}
                </div>

                <div class="text-end border-top pt-3">
                    <span class="fw-semibold">Total:</span>
                    <strong> USD ${datos.total ?? 0}</strong>
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
    if (!contenedorPedidos || !mensajePedidos) {
        return;
    }

    mensajePedidos.className =
        "alert alert-info perfil-orders-message";

    mensajePedidos.textContent = "Cargando pedidos...";
    mensajePedidos.classList.remove("d-none");

    try {
        const referenciaPedidos = collection(db, "pedidos");

        const consultaPedidos = query(
            referenciaPedidos,
            where("usuarioId", "==", uid)
        );

        const snapshot = await getDocs(consultaPedidos);

        mostrarPedidos(snapshot.docs);

    } catch (error) {
        console.error("Error al cargar los pedidos:", error);

        mensajePedidos.className =
            "alert alert-danger perfil-orders-message";

        mensajePedidos.textContent =
            "No se pudo cargar el historial de pedidos. Intentá nuevamente más tarde.";

        mensajePedidos.classList.remove("d-none");
    }
}

// ==========================================
// MOSTRAR DATOS DEL USUARIO
// ==========================================

function mostrarDatosUsuario(usuario, datos = {}) {
    const nombre = datos.nombre || "";
    const apellido = datos.apellido || "";

    const nombreCompleto = [nombre, apellido]
        .map(parte => parte.trim())
        .filter(Boolean)
        .join(" ");

    const nombreMostrar = nombreCompleto || "Usuario";
    const correo = usuario.email || "No disponible";

    if (nombreUsuario) {
        nombreUsuario.textContent = nombreMostrar;
    }

    if (emailUsuario) {
        emailUsuario.textContent = correo;
    }

    if (avatarUsuario) {
        avatarUsuario.textContent =
            generarIniciales(nombre, apellido) || "U";
    }

    if (nombreCompletoPerfil) {
        nombreCompletoPerfil.textContent =
            nombreCompleto || "No disponible";
    }

    if (correoCompletoPerfil) {
        correoCompletoPerfil.textContent = correo;
    }
}

// ==========================================
// COMPROBAR SESIÓN Y CARGAR PERFIL
// ==========================================

onAuthStateChanged(auth, async (usuario) => {
    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

    // Mostrar el correo inmediatamente.
    mostrarDatosUsuario(usuario);

    try {
        const referenciaUsuario = doc(
            db,
            "usuarios",
            usuario.uid
        );

        const documentoUsuario = await getDoc(referenciaUsuario);

        if (documentoUsuario.exists()) {
            mostrarDatosUsuario(
                usuario,
                documentoUsuario.data()
            );
        }

    } catch (error) {
        console.error(
            "Error al obtener los datos del usuario:",
            error
        );
    }

    // Cargar el historial de compras.
    await cargarPedidos(usuario.uid);
});
