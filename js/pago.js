
import { auth, db } from "./firebase/config.js";

import {
    collection,
    doc,
    getDocs,
    serverTimestamp,
    runTransaction
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


document.addEventListener("DOMContentLoaded", async () => {
    const resumenProductos = document.querySelector("#resumenProductos");
    const totalPago = document.querySelector("#totalPago");
    const formPago = document.querySelector("#formPago");
    const btnPagar = document.querySelector("#btnPagar");
    const mensajePago = document.querySelector("#mensajePago");

    // Permitir que JavaScript gestione las validaciones del formulario.
    formPago.noValidate = true;

    

    const datosTarjeta = document.querySelector("#datosTarjeta");
    const opcionTarjeta = document.querySelector("#pagoTarjeta");
    const opcionTransferencia = document.querySelector("#pagoTransferencia");

    const nombreTarjeta = document.querySelector("#nombreTarjeta");
    const numeroTarjeta = document.querySelector("#numeroTarjeta");
    const vencimiento = document.querySelector("#vencimiento");
    const cvv = document.querySelector("#cvv");

    // Borrar el mensaje de error al corregir cada campo.
    const configurarBorradoError = (campo, idError, esValido) => {
        const mensajeError = document.querySelector(`#${idError}`);

        campo.addEventListener("input", () => {
            if (esValido()) {
                mensajeError.textContent = "";
                campo.classList.remove("campo-invalido");
            }
        });
    };

    configurarBorradoError(
        nombreTarjeta,
        "errorNombreTarjeta",
        () => nombreTarjeta.value.trim() !== ""
    );

    configurarBorradoError(
        numeroTarjeta,
        "errorNumeroTarjeta",
        () => /^\d{16}$/.test(numeroTarjeta.value.replace(/\D/g, ""))
    );

    configurarBorradoError(
        vencimiento,
        "errorVencimiento",
        () => {
            const fecha = vencimiento.value.trim();

            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fecha)) {
                return false;
            }

            const [mes, anio] = fecha.split("/").map(Number);
            const ahora = new Date();
            const anioActual = ahora.getFullYear() % 100;
            const mesActual = ahora.getMonth() + 1;

            return anio > anioActual ||
                (anio === anioActual && mes >= mesActual);
        }
    );

    configurarBorradoError(
        cvv,
        "errorCvv",
        () => /^\d{3,4}$/.test(cvv.value.trim())
    );

    let carrito = [];
    let productosPedido = [];
    let total = 0;

    // Mostrar mensajes al usuario.
    function mostrarMensaje(mensaje, tipo = "danger") {
        mensajePago.textContent = mensaje;
        mensajePago.className = `alert alert-${tipo}`;
        mensajePago.setAttribute("role", "alert");
        mensajePago.setAttribute("aria-live", "assertive");

        mensajePago.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    // Bloquear el pago cuando no se puede preparar la compra.
    function bloquearPago(mensaje) {
        resumenProductos.innerHTML = "";
        totalPago.textContent = "USD 0.00";
        formPago.classList.add("d-none");
        mostrarMensaje(mensaje);
    }

    // Mostrar u ocultar los datos de tarjeta según el método elegido.
    function actualizarMetodoPago() {
        const usaTarjeta = opcionTarjeta.checked;

        datosTarjeta.classList.toggle("d-none", !usaTarjeta);

        nombreTarjeta.required = usaTarjeta;
        numeroTarjeta.required = usaTarjeta;
        vencimiento.required = usaTarjeta;
        cvv.required = usaTarjeta;

        // Limpiar errores cuando se elige transferencia.
        if (!usaTarjeta) {
            document.querySelectorAll(".error-campo").forEach((elemento) => {
                elemento.textContent = "";
            });

            document.querySelectorAll(".campo-invalido").forEach((elemento) => {
                elemento.classList.remove("campo-invalido");
            });
        }
    }

    opcionTarjeta.addEventListener("change", actualizarMetodoPago);
    opcionTransferencia.addEventListener("change", actualizarMetodoPago);

    // Formatear el número de tarjeta.
    numeroTarjeta.addEventListener("input", () => {
        const digitos = numeroTarjeta.value
            .replace(/\D/g, "")
            .slice(0, 16);

        numeroTarjeta.value = digitos.replace(
            /(\d{4})(?=\d)/g,
            "$1 "
        );
    });

    // Formatear el vencimiento como MM/AA.
    vencimiento.addEventListener("input", () => {
        const digitos = vencimiento.value
            .replace(/\D/g, "")
            .slice(0, 4);

        vencimiento.value = digitos.length > 2
            ? `${digitos.slice(0, 2)}/${digitos.slice(2)}`
            : digitos;
    });

    // Permitir únicamente números en el CVV.
    cvv.addEventListener("input", () => {
        cvv.value = cvv.value.replace(/\D/g, "").slice(0, 4);
    });

    actualizarMetodoPago();

    // Verificar que el usuario haya iniciado sesión.
    let usuario = auth.currentUser;

    if (!usuario) {
        const { onAuthStateChanged } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js"
        );

        usuario = await new Promise((resolve) => {
            const cancelar = onAuthStateChanged(auth, (user) => {
                cancelar();
                resolve(user);
            });
        });

        if (!usuario) {
            window.location.href = "login.html";
            return;
        }
    }

    // Leer el carrito de LocalStorage.
    try {
        carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        if (!Array.isArray(carrito)) {
            throw new Error("El formato del carrito no es válido.");
        }

        // Combinar productos repetidos por identificador.
        const cantidadesPorProducto = new Map();

        for (const item of carrito) {
            if (
                !item ||
                typeof item.id !== "string" ||
                !Number.isInteger(Number(item.cantidad)) ||
                Number(item.cantidad) <= 0
            ) {
                throw new Error("El carrito contiene un producto o una cantidad no válida.");
            }

            const cantidadActual = cantidadesPorProducto.get(item.id) || 0;
            cantidadesPorProducto.set(
                item.id,
                cantidadActual + Number(item.cantidad)
            );
        }

        carrito = Array.from(cantidadesPorProducto, ([id, cantidad]) => ({
            id,
            cantidad
        }));

    } catch (error) {
        console.error("Error al leer el carrito:", error);

        bloquearPago(
            error.message || "No se pudo leer el carrito. Volvé a la página del carrito."
        );
        return;
    }
    
    // Preparar el resumen con los precios y el stock actuales.
    try {
        const snapshot = await getDocs(collection(db, "productos"));

        const productos = snapshot.docs.map((documento) => ({
            id: documento.id,
            ...documento.data()
        }));

        productosPedido = carrito.map((item) => {
            const producto = productos.find(
                (elemento) => elemento.id === item.id
            );

            if (!producto) {
                throw new Error(
                    `El producto con identificador ${item.id} ya no existe.`
                );
            }

            const cantidad = Number(item.cantidad);
            const precio = Number(producto.precio);
            const stock = Number(producto.stock);

            if (!Number.isInteger(cantidad) || cantidad <= 0) {
                throw new Error(
                    `La cantidad de ${producto.nombre} no es válida.`
                );
            }

            if (!Number.isFinite(precio) || precio < 0) {
                throw new Error(
                    `El precio de ${producto.nombre} no es válido.`
                );
            }

            if (!Number.isInteger(stock) || stock < cantidad) {
                throw new Error(
                    `No hay stock suficiente de ${producto.nombre}.`
                );
            }

            return {
                productoId: producto.id,
                nombre: producto.nombre,
                imagen: producto.imagen || producto.URL_imagen || producto.imagen_url || "",
                precio,
                cantidad,
                subtotal: precio * cantidad
            };
        });

        total = productosPedido.reduce(
            (acumulado, item) => acumulado + item.subtotal,
            0
        );

        resumenProductos.innerHTML = productosPedido.map((item) => `
            <div class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">

                <img
                    src="${escaparHTML(item.imagen)}"
                    alt="${escaparHTML(item.nombre)}"
                    class="rounded border flex-shrink-0"
                    style="width: 85px; height: 85px; object-fit: contain; background-color: #fff;"
                    onerror="this.style.display='none'"
                >

                <div class="flex-grow-1 min-width-0">
                    <div class="fw-semibold">
                        ${escaparHTML(item.nombre)}
                    </div>

                    <small class="text-muted d-block">
                        Cantidad: ${item.cantidad}
                    </small>

                    <small class="text-muted d-block">
                        USD ${item.precio.toFixed(2)} por unidad
                    </small>
                </div>

                <strong class="text-nowrap">
                    USD ${item.subtotal.toFixed(2)}
                </strong>

            </div>
        `).join("");

        totalPago.textContent = `USD ${total.toFixed(2)}`;

    } catch (error) {
        console.error("Error al preparar el pago:", error);

        bloquearPago(
            error.message || "No se pudo cargar el resumen de la compra."
        );
        return;
    }

    // Procesar la compra de prueba.
    formPago.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const usuarioActual = auth.currentUser;

        if (!usuarioActual) {
            mostrarMensaje(
                "Tu sesión no está activa. Iniciá sesión nuevamente."
            );
            return;
        }

        const metodo = formPago.querySelector(
            'input[name="metodoPago"]:checked'
        )?.value;

        const resultado = document.querySelector(
            "#resultadoSimulado"
        )?.value;

        if (
            !["tarjeta", "transferencia"].includes(metodo) ||
            !["aprobado", "rechazado"].includes(resultado)
        ) {
            mostrarMensaje("Seleccioná un método y un resultado válido.");
            return;
        }

        
        // Validar los campos de tarjeta solo si se eligió ese método.
        if (metodo === "tarjeta") {
            const nombre = nombreTarjeta.value.trim();
            const numero = numeroTarjeta.value.replace(/\D/g, "");
            const fecha = vencimiento.value.trim();
            const codigo = cvv.value.trim();

            // Limpiar errores anteriores.
            document.querySelectorAll(".error-campo").forEach((elemento) => {
                elemento.textContent = "";
            });

            document.querySelectorAll(".campo-invalido").forEach((elemento) => {
                elemento.classList.remove("campo-invalido");
            });

            const mostrarErrorCampo = (campo, idError, mensaje) => {
                campo.classList.add("campo-invalido");
                document.querySelector(`#${idError}`).textContent = mensaje;
                campo.focus();
            };

            if (!nombre) {
                mostrarErrorCampo(
                    nombreTarjeta,
                    "errorNombreTarjeta",
                    "Ingresá el nombre del titular."
                );
                return;
            }

            if (!/^\d{16}$/.test(numero)) {
                mostrarErrorCampo(
                    numeroTarjeta,
                    "errorNumeroTarjeta",
                    "Ingresá un número de tarjeta de 16 dígitos."
                );
                return;
            }

            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fecha)) {
                mostrarErrorCampo(
                    vencimiento,
                    "errorVencimiento",
                    "Ingresá un vencimiento válido en formato MM/AA."
                );
                return;
            }

            const [mes, anio] = fecha.split("/").map(Number);
            const fechaActual = new Date();
            const anioActual = fechaActual.getFullYear() % 100;
            const mesActual = fechaActual.getMonth() + 1;

            if (
                anio < anioActual ||
                (anio === anioActual && mes < mesActual)
            ) {
                mostrarErrorCampo(
                    vencimiento,
                    "errorVencimiento",
                    "La tarjeta de prueba debe tener un vencimiento futuro."
                );
                return;
            }

            if (!/^\d{3,4}$/.test(codigo)) {
                mostrarErrorCampo(
                    cvv,
                    "errorCvv",
                    "Ingresá un código de seguridad de 3 o 4 dígitos."
                );
                return;
            }
        }

        if (btnPagar.disabled) {
            return;
        }

        btnPagar.disabled = true;
        btnPagar.textContent = "Procesando simulación...";

        try {
            // El rechazo de prueba no registra el pedido ni vacía el carrito.
            if (resultado === "rechazado") {
                mostrarMensaje(
                    "Pago rechazado en la simulación. Tu carrito se conserva y podés volver a intentarlo.",
                    "danger"
                );
                return;
            }

            
        
        const referenciaPedido = doc(collection(db, "pedidos"));
        const referenciaContador = doc(db, "contadores", "pedidos");

        await runTransaction(db, async (transaccion) => {
            const productosActuales = [];
            const stockProductos = {};

            // Leer el contador y obtener el próximo número.
            const snapshotContador = await transaccion.get(referenciaContador);

            const ultimoNumero = snapshotContador.exists()
                ? Number(snapshotContador.data().ultimoNumero) || 0
                : 0;

            const numeroPedido = ultimoNumero + 1;

            // Leer y validar todos los productos.
            for (const item of productosPedido) {
                const referenciaProducto = doc(
                    db,
                    "productos",
                    item.productoId
                );

                const snapshot = await transaccion.get(referenciaProducto);

                if (!snapshot.exists()) {
                    throw new Error(
                        `El producto ${item.nombre} ya no existe.`
                    );
                }

                const producto = snapshot.data();
                const stockActual = Number(producto.stock);
                const precioActual = Number(producto.precio);

                if (
                    !Number.isInteger(stockActual) ||
                    stockActual < item.cantidad
                ) {
                    throw new Error(
                        `No hay stock suficiente de ${item.nombre}.`
                    );
                }

                if (precioActual !== item.precio) {
                    throw new Error(
                        `El precio de ${item.nombre} cambió. Volvé al carrito y revisá el importe.`
                    );
                }

                productosActuales.push({
                    referenciaProducto,
                    stockActual,
                    cantidad: item.cantidad
                });

                stockProductos[item.productoId] = {
                    cantidad: item.cantidad,
                    precio: item.precio
                };
            }

            // Descontar el stock.
            for (const producto of productosActuales) {
                transaccion.update(producto.referenciaProducto, {
                    stock: producto.stockActual - producto.cantidad,
                    ultimoPedidoId: referenciaPedido.id
                });
            }

            // Actualizar el contador y vincularlo con el pedido.
            transaccion.set(referenciaContador, {
                ultimoNumero: numeroPedido,
                ultimoPedidoId: referenciaPedido.id
            });

            // Registrar el pedido con su número correlativo.
            transaccion.set(referenciaPedido, {
                numeroPedido,
                usuarioId: usuarioActual.uid,
                productos: productosPedido,
                stockProductos,
                total,
                metodoPago: metodo,
                estado: "aprobado_simulado",
                entorno: "simulacion",
                fecha: serverTimestamp()
            });
        });


        sessionStorage.setItem(
            "pedidoConfirmado",
            referenciaPedido.id
        );

        localStorage.removeItem("carrito");
        window.location.href = "confirmacion.html";


        } catch (error) {
            console.error("Error al registrar el pedido:", error);

            mostrarMensaje(
                error.message ||
                "No se pudo registrar el pedido. Tu carrito se conserva."
            );

        } finally {
            btnPagar.disabled = false;
            btnPagar.textContent = "Simular pago";
        }
    });
});

// Evitar que los nombres de productos inserten HTML en el resumen.
function escaparHTML(valor) {
    return String(valor).replace(/[&<>"']/g, (caracter) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caracter]);
}
