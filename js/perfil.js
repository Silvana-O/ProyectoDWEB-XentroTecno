
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
// ESCAPAR TEXTO HTML
// ==========================================

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caracter]);
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
// MOSTRAR PEDIDOS Y ENLACES DE RESEÑAS
// ==========================================

function mostrarPedidos(pedidos, productosResenados) {
    if (!contenedorPedidos || !mensajePedidos) {
        return;
    }

    contenedorPedidos.innerHTML = "";

    if (pedidos.length === 0) {
        mensajePedidos.className =
            "alert alert-info perfil-orders-message";

        mensajePedidos.textContent =
            "Todavía no realizaste ninguna compra.";

        mensajePedidos.classList.remove("d-none");
        return;
    }

    mensajePedidos.classList.add("d-none");

    pedidos.forEach(pedido => {
        const datos = pedido.data();

        const tarjeta = document.createElement("div");
        tarjeta.classList.add("card", "border", "shadow-sm", "mb-3");

        const productos = Array.isArray(datos.productos)
            ? datos.productos
            : [];

        const compraAprobada =
            datos.estado === "aprobado_simulado";

        let productosHTML = "";

        productos.forEach(producto => {
            const nombre = escaparHTML(
                producto.nombre || "Producto"
            );

            const subtotal = escaparHTML(
                producto.subtotal ?? 0
            );

            const cantidad = escaparHTML(
                producto.cantidad ?? 0
            );

            const precio = escaparHTML(
                producto.precio ?? 0
            );

            const productoId = producto.productoId
                ? String(producto.productoId)
                : "";

            let enlaceResena = "";

            if (compraAprobada && productoId) {
                if (productosResenados.has(productoId)) {
                    enlaceResena = `
                        <span class="badge text-bg-success mt-2">
                            Reseña enviada
                        </span>
                    `;
                } else {
                    const urlProducto =
                        `producto.html?id=${encodeURIComponent(productoId)}#resenas`;

                    enlaceResena = `
                        <div class="mt-2">
                            <a
                                href="${urlProducto}"
                                class="btn btn-outline-primary btn-sm"
                                aria-label="Dejar una reseña de ${nombre}">
                                Dejar reseña
                            </a>
                        </div>
                    `;
                }
            }

            productosHTML += `
                <div class="border-bottom py-3">
                    <div class="d-flex justify-content-between gap-3">
                        <span class="fw-semibold">${nombre}</span>

                        <span class="text-nowrap">
                            USD ${subtotal}
                        </span>
                    </div>

                    <small class="text-muted">
                        Cantidad: ${cantidad}
                        · Precio unitario: USD ${precio}
                    </small>

                    ${enlaceResena}
                </div>
            `;
        });

        const numeroPedido = datos.numeroPedido
            ? String(datos.numeroPedido).padStart(6, "0")
            : pedido.id;

        const estado = escaparHTML(
            datos.estado ?? "Sin estado"
        );

        tarjeta.innerHTML = `
            <div class="card-body">
                <div class="d-flex flex-column flex-md-row
                            justify-content-between
                            align-items-md-center mb-3">

                    <div>
                        <h3 class="h5 mb-1">
                            Pedido #${escaparHTML(numeroPedido)}
                        </h3>

                        <small class="text-muted">
                            ${escaparHTML(formatearFecha(datos.fecha))}
                        </small>
                    </div>

                    <span class="badge text-bg-success mt-2 mt-md-0">
                        ${estado}
                    </span>
                </div>

                <div class="mb-3">
                    <h4 class="h6">Productos</h4>
                    ${productosHTML}
                </div>

                <div class="text-end border-top pt-3">
                    <span class="fw-semibold">Total:</span>
                    <strong> USD ${escaparHTML(datos.total ?? 0)}</strong>
                </div>
            </div>
        `;

        contenedorPedidos.appendChild(tarjeta);
    });
}

// ==========================================
// CARGAR RESEÑAS DEL USUARIO
// ==========================================

async function cargarProductosResenados(uid) {
    const productosResenados = new Set();

    const consultaResenas = query(
        collection(db, "resenas"),
        where("usuarioId", "==", uid)
    );

    const snapshotResenas = await getDocs(consultaResenas);

    snapshotResenas.forEach(documento => {
        const datos = documento.data();

        if (datos.productoId) {
            productosResenados.add(String(datos.productoId));
        }
    });

    return productosResenados;
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
        const consultaPedidos = query(
            collection(db, "pedidos"),
            where("usuarioId", "==", uid)
        );

        const [snapshotPedidos, productosResenados] =
            await Promise.all([
                getDocs(consultaPedidos),
                cargarProductosResenados(uid)
            ]);

        mostrarPedidos(
            snapshotPedidos.docs,
            productosResenados
        );

    } catch (error) {
        console.error(
            "Error al cargar pedidos o reseñas:",
            error
        );

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

onAuthStateChanged(auth, async usuario => {
    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

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

    await cargarPedidos(usuario.uid);
});
