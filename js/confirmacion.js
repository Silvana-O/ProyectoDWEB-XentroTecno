
import { auth, db } from "./firebase/config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const numeroPedido = document.querySelector("#numeroPedido");
    const totalCompra = document.querySelector("#totalCompra");
    const productosCompra = document.querySelector("#productosCompra");

    onAuthStateChanged(auth, async (usuario) => {
        if (!usuario) {
            window.location.href = "login.html";
            return;
        }

        const pedidoId = sessionStorage.getItem("pedidoConfirmado");

        if (!pedidoId) {
            mostrarError(
                "No hay una compra confirmada para mostrar. Podés consultar tus pedidos desde tu perfil."
            );
            return;
        }

        try {
            const referenciaPedido = doc(db, "pedidos", pedidoId);
            const documentoPedido = await getDoc(referenciaPedido);

            if (
                !documentoPedido.exists() ||
                documentoPedido.data().usuarioId !== usuario.uid ||
                documentoPedido.data().estado !== "aprobado_simulado"
            ) {
                throw new Error(
                    "No se encontró una compra confirmada para tu cuenta."
                );
            }

            const pedido = documentoPedido.data();

            // Mostrar el número correlativo si ya está guardado.
            if (Number.isInteger(pedido.numeroPedido)) {
                numeroPedido.textContent = String(
                    pedido.numeroPedido
                ).padStart(4, "0");
            } else {
                numeroPedido.textContent = "Pendiente de asignación";
            }

            // Mostrar nombre y cantidad de los productos comprados.
            productosCompra.replaceChildren();

            if (Array.isArray(pedido.productos) && pedido.productos.length > 0) {
                pedido.productos.forEach((producto) => {
                    const elemento = document.createElement("li");
                    elemento.textContent =
                        `${producto.nombre} — Cantidad: ${producto.cantidad}`;
                    productosCompra.appendChild(elemento);
                });
            } else {
                const elemento = document.createElement("li");
                elemento.textContent = "No hay productos para mostrar.";
                productosCompra.appendChild(elemento);
            }

            totalCompra.textContent =
                `USD ${Number(pedido.total).toFixed(2)}`;

        } catch (error) {
            console.error("Error al consultar el pedido:", error);
            mostrarError(
                "No se pudo recuperar la información de la compra. Podés volver al catálogo."
            );
        }
    });

    function mostrarError(texto) {
        numeroPedido.textContent = "No disponible";
        totalCompra.textContent = "No disponible";

        if (productosCompra) {
            productosCompra.replaceChildren();
        }

        const mensaje = document.createElement("p");
        mensaje.className = "alert alert-warning mt-3";
        mensaje.textContent = texto;
        totalCompra.parentElement.after(mensaje);
    }
});
