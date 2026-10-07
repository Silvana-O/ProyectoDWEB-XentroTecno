import { auth, db } from "./firebase/config.js";

import {
    collection,
    getDocs,
    doc,
    runTransaction,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {

    const contenedorCarrito = document.querySelector("#contenedorCarrito");
    const mensajeCarritoVacio = document.querySelector("#mensajeCarritoVacio");
    const resumenCarrito = document.querySelector("#resumenCarrito");
    const btnConfirmarCompra = document.querySelector("#btnConfirmarCompra");

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let productos = [];

    // ==========================================
    // CARGAR PRODUCTOS DESDE FIRESTORE
    // ==========================================

    async function cargarProductos() {
        try {
            const referenciaProductos = collection(db, "productos");
            const snapshot = await getDocs(referenciaProductos);

            productos = snapshot.docs.map((documento) => ({
                id: documento.id,
                ...documento.data()
            }));

            mostrarCarrito();

        } catch (error) {
            console.error("Error al cargar productos:", error);

            contenedorCarrito.innerHTML = `
                <div class="alert alert-danger text-center">
                    No se pudieron cargar los productos.
                </div>
            `;
        }
    }

    // ==========================================
    // GUARDAR CARRITO
    // ==========================================

    function guardarCarrito() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    // ==========================================
    // MOSTRAR CARRITO
    // ==========================================

    function mostrarCarrito() {

        contenedorCarrito.innerHTML = "";

        if (carrito.length === 0) {

            mensajeCarritoVacio.classList.remove("d-none");
            resumenCarrito.classList.add("d-none");

            return;
        }

        mensajeCarritoVacio.classList.add("d-none");
        resumenCarrito.classList.remove("d-none");

        const total = carrito.reduce(
            (acumulado, item) =>
                acumulado + Number(item.precio) * Number(item.cantidad),
            0
        );

        document.querySelector("#totalCarrito").textContent =
            `USD ${total.toFixed(2)}`;

        carrito.forEach((item) => {

            const producto = productos.find(
                (producto) => producto.id === item.id
            );

            if (!producto) {
                return;
            }

            const subtotal =
                Number(item.precio) * Number(item.cantidad);

            const tarjeta = document.createElement("div");

            tarjeta.className = "card border-0 shadow-sm";

            tarjeta.innerHTML = `
                <div class="card-body">
                    <div class="row align-items-center g-3">

                        <div class="col-12 col-md-2 text-center">
                            <img
                                src="${producto.imagen}"
                                alt="${producto.nombre}"
                                class="img-fluid rounded"
                                style="max-height: 120px; object-fit: contain;"
                            >
                        </div>

                        <div class="col-12 col-md-4">
                            <h3 class="h5 fw-bold mb-1">
                                ${producto.nombre}
                            </h3>

                            <p class="text-muted mb-1">
                                ${producto.categoria}
                            </p>

                            <p class="mb-0">
                                Precio unitario:
                                <strong>USD ${Number(producto.precio).toFixed(2)}</strong>
                            </p>
                        </div>

                        <div class="col-12 col-md-3">

                            <div class="d-flex align-items-center justify-content-center gap-2">

                                <button
                                    class="btn btn-outline-secondary btn-sm btn-disminuir"
                                    data-id="${item.id}"
                                >
                                    −
                                </button>

                                <span class="fw-bold">
                                    ${item.cantidad}
                                </span>

                                <button
                                    class="btn btn-outline-secondary btn-sm btn-aumentar"
                                    data-id="${item.id}"
                                    ${item.cantidad >= producto.stock ? "disabled" : ""}
                                >
                                    +
                                </button>

                            </div>

                            <small class="text-muted d-block text-center mt-2">
                                Stock disponible: ${producto.stock}
                            </small>

                        </div>

                        <div class="col-12 col-md-2 text-center">
                            <p class="mb-0 fw-bold">
                                USD ${subtotal.toFixed(2)}
                            </p>
                        </div>

                        <div class="col-12 col-md-1 text-center">

                            <button
                                class="btn btn-outline-danger btn-sm btn-eliminar"
                                data-id="${item.id}"
                                title="Eliminar producto"
                            >
                                Eliminar
                            </button>

                        </div>

                    </div>
                </div>
            `;

            contenedorCarrito.appendChild(tarjeta);
        });

        configurarEventos();
    }

    // ==========================================
    // EVENTOS DEL CARRITO
    // ==========================================

    function configurarEventos() {

        // AUMENTAR CANTIDAD
        document.querySelectorAll(".btn-aumentar").forEach((boton) => {

            boton.addEventListener("click", () => {

                const id = boton.dataset.id;

                const item = carrito.find(
                    (producto) => producto.id === id
                );

                const producto = productos.find(
                    (producto) => producto.id === id
                );

                if (!item || !producto) {
                    return;
                }

                if (item.cantidad < producto.stock) {

                    item.cantidad++;

                    guardarCarrito();
                    mostrarCarrito();

                } else {

                    alert(
                        `No hay más unidades disponibles de ${producto.nombre}.`
                    );
                }
            });
        });

        // DISMINUIR CANTIDAD
        document.querySelectorAll(".btn-disminuir").forEach((boton) => {

            boton.addEventListener("click", () => {

                const id = boton.dataset.id;

                const item = carrito.find(
                    (producto) => producto.id === id
                );

                if (!item) {
                    return;
                }

                if (item.cantidad > 1) {

                    item.cantidad--;

                } else {

                    carrito = carrito.filter(
                        (producto) => producto.id !== id
                    );
                }

                guardarCarrito();
                mostrarCarrito();
            });
        });

        // ELIMINAR PRODUCTO
        document.querySelectorAll(".btn-eliminar").forEach((boton) => {

            boton.addEventListener("click", () => {

                const id = boton.dataset.id;

                carrito = carrito.filter(
                    (producto) => producto.id !== id
                );

                guardarCarrito();
                mostrarCarrito();
            });
        });
    }

    // ==========================================
    // CONFIRMAR COMPRA
    // ==========================================

    async function confirmarCompra() {

        const usuario = auth.currentUser;

        if (!usuario) {

            alert("Debes iniciar sesión para confirmar la compra.");

            window.location.href = "login.html";

            return;
        }

        if (carrito.length === 0) {

            alert("El carrito está vacío.");

            return;
        }

        btnConfirmarCompra.disabled = true;
        btnConfirmarCompra.textContent = "Procesando compra...";

        try {

            const pedidoRef = doc(collection(db, "pedidos"));

            const resultado = await runTransaction(
                db,
                async (transaction) => {

                    // ==========================================
                    // OBTENER CONTADOR DE PEDIDOS
                    // ==========================================

                    const contadorRef = doc(
                        db,
                        "contadores",
                        "pedidos"
                    );

                    const contadorSnapshot =
                        await transaction.get(contadorRef);

                    const ultimoNumero =
                        contadorSnapshot.exists()
                            ? Number(
                                contadorSnapshot.data().ultimoNumero || 0
                            )
                            : 0;

                    const siguienteNumero =
                        ultimoNumero + 1;

                    // ==========================================
                    // LEER TODOS LOS PRODUCTOS
                    // ==========================================

                    const productosSnapshots = [];

                    for (const item of carrito) {

                        const productoRef = doc(
                            db,
                            "productos",
                            item.id
                        );

                        const productoSnapshot =
                            await transaction.get(productoRef);

                        productosSnapshots.push({
                            item,
                            productoRef,
                            productoSnapshot
                        });
                    }

                    // ==========================================
                    // VALIDAR PRODUCTOS Y CALCULAR TOTAL
                    // ==========================================

                    const productosPedido = [];

                    let total = 0;

                    for (const elemento of productosSnapshots) {

                        const {
                            item,
                            productoSnapshot
                        } = elemento;

                        if (!productoSnapshot.exists()) {

                            throw new Error(
                                `El producto ${item.id} ya no existe.`
                            );
                        }

                        const producto =
                            productoSnapshot.data();

                        const cantidad =
                            Number(item.cantidad);

                        const stock =
                            Number(producto.stock);

                        const precio =
                            Number(producto.precio);

                        if (
                            !Number.isInteger(cantidad) ||
                            cantidad <= 0
                        ) {

                            throw new Error(
                                `Cantidad inválida para ${producto.nombre}.`
                            );
                        }

                        if (stock < cantidad) {

                            throw new Error(
                                `No hay suficiente stock de ${producto.nombre}. Stock disponible: ${stock}.`
                            );
                        }

                        const subtotal =
                            precio * cantidad;

                        total += subtotal;

                        productosPedido.push({
                            productoId: item.id,
                            nombre: producto.nombre,
                            precio: precio,
                            cantidad: cantidad,
                            subtotal: subtotal
                        });
                    }

                    // ==========================================
                    // ACTUALIZAR CONTADOR
                    // ==========================================

                    if (contadorSnapshot.exists()) {

                        transaction.update(
                            contadorRef,
                            {
                                ultimoNumero: siguienteNumero
                            }
                        );

                    } else {

                        transaction.set(
                            contadorRef,
                            {
                                ultimoNumero: siguienteNumero
                            }
                        );
                    }

                    // ==========================================
                    // ACTUALIZAR STOCK
                    // ==========================================

                    for (const elemento of productosSnapshots) {

                        const {
                            item,
                            productoRef,
                            productoSnapshot
                        } = elemento;

                        const producto =
                            productoSnapshot.data();

                        const nuevoStock =
                            Number(producto.stock) -
                            Number(item.cantidad);

                        transaction.update(
                            productoRef,
                            {
                                stock: nuevoStock,
                                disponibilidad: nuevoStock > 0
                            }
                        );
                    }

                    // ==========================================
                    // CREAR PEDIDO
                    // ==========================================

                    transaction.set(
                        pedidoRef,
                        {
                            numeroPedido: siguienteNumero,
                            usuarioId: usuario.uid,
                            productos: productosPedido,
                            total: total,
                            fecha: serverTimestamp(),
                            estado: "confirmado"
                        }
                    );

                    return {
                        total: total,
                        numeroPedido: siguienteNumero
                    };
                }
            );

            // ==========================================
            // COMPRA REALIZADA CORRECTAMENTE
            // ==========================================

            carrito = [];

            localStorage.removeItem("carrito");

            mensajeCarritoVacio.classList.add("d-none");
            resumenCarrito.classList.add("d-none");

            contenedorCarrito.innerHTML = `
                <div class="alert alert-success text-center">
                    <h2 class="h4 mb-3">
                        Compra confirmada
                    </h2>

                    <p class="mb-2">
                        Tu pedido fue registrado correctamente.
                    </p>

                    <p class="fw-bold mb-2">
                        Pedido #${String(resultado.numeroPedido).padStart(6, "0")}
                    </p>

                    <p class="mb-0">
                        Total: USD ${resultado.total.toFixed(2)}
                    </p>
                </div>
            `;

        } catch (error) {

            console.error(
                "Error al confirmar la compra:",
                error
            );

            alert(
                error.message ||
                "No se pudo confirmar la compra."
            );

        } finally {

            btnConfirmarCompra.disabled = false;
            btnConfirmarCompra.textContent =
                "Confirmar compra";
        }
    }

    // ==========================================
    // EVENTO CONFIRMAR COMPRA
    // ==========================================

    btnConfirmarCompra?.addEventListener(
        "click",
        confirmarCompra
    );

    // ==========================================
    // INICIAR
    // ==========================================

    await cargarProductos();

});