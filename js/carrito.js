import { auth, db } from "./firebase/config.js";

import {
    collection,
    getDocs,
    doc,
    runTransaction,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


document.addEventListener("DOMContentLoaded", async () => {

    const contenedorCarrito =
        document.querySelector("#contenedorCarrito");

    const mensajeCarritoVacio =
        document.querySelector("#mensajeCarritoVacio");

    const resumenCarrito =
        document.querySelector("#resumenCarrito");

    const btnConfirmarCompra =
        document.querySelector("#btnConfirmarCompra");


    let carrito = JSON.parse(
        localStorage.getItem("carrito")
    ) || [];


    let productos = [];


    // ==========================================
    // CARGAR PRODUCTOS DESDE FIRESTORE
    // ==========================================

    async function cargarProductos() {

        try {

            const referenciaProductos =
                collection(db, "productos");

            const snapshot =
                await getDocs(referenciaProductos);


            productos = snapshot.docs.map(documento => ({
                id: documento.id,
                ...documento.data()
            }));


            console.log(
                "Productos cargados desde Firestore:",
                productos
            );


            mostrarCarrito();


        } catch (error) {

            console.error(
                "Error al cargar los productos desde Firestore:",
                error
            );


            contenedorCarrito.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger text-center">
                        No se pudieron cargar los productos del carrito.
                        Intentá nuevamente más tarde.
                    </div>
                </div>
            `;

        }

    }


    // ==========================================
    // GUARDAR CARRITO EN LOCALSTORAGE
    // ==========================================

    function guardarCarrito() {

        localStorage.setItem(
            "carrito",
            JSON.stringify(carrito)
        );

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
                acumulado + item.precio * item.cantidad,
            0
        );


        document.querySelector("#totalCarrito").textContent =
            `USD ${total}`;


        carrito.forEach(item => {

            const producto =
                productos.find(
                    producto => producto.id === item.id
                );


            if (!producto) {
                return;
            }


            const tarjeta =
                document.createElement("div");


            tarjeta.classList.add("col-12");


            tarjeta.innerHTML = `
                <div class="card shadow-sm">

                    <div class="card-body">

                        <div class="row align-items-center g-3">

                            <div class="col-12 col-md-2 text-center">

                                <img
                                    src="${item.imagen}"
                                    alt="${item.nombre}"
                                    class="img-fluid rounded"
                                    style="max-height: 120px;"
                                >

                            </div>


                            <div class="col-12 col-md-3">

                                <h2 class="h5 mb-1">
                                    ${item.nombre}
                                </h2>

                                <p class="mb-0">
                                    Precio: USD ${item.precio}
                                </p>

                            </div>


                            <div class="col-12 col-md-4">

                                <div class="d-flex align-items-center gap-2">

                                    <button
                                        type="button"
                                        class="btn btn-outline-primary btn-disminuir"
                                        data-id="${item.id}"
                                    >
                                        −
                                    </button>

                                    <span class="fw-semibold">
                                        ${item.cantidad}
                                    </span>

                                    <button
                                        type="button"
                                        class="btn btn-outline-primary btn-aumentar"
                                        data-id="${item.id}"
                                    >
                                        +
                                    </button>

                                    <button
                                        type="button"
                                        class="btn btn-outline-danger btn-eliminar"
                                        data-id="${item.id}"
                                    >
                                        Eliminar
                                    </button>

                                </div>

                                <small class="text-muted">
                                    Stock disponible: ${producto.stock}
                                </small>

                            </div>


                            <div class="col-12 col-md-3 text-md-end">

                                <p class="fw-bold mb-0">
                                    USD ${item.precio * item.cantidad}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>
            `;


            contenedorCarrito.appendChild(tarjeta);

        });


        configurarEventos();

    }


    // ==========================================
    // CONFIGURAR BOTONES DEL CARRITO
    // ==========================================

    function configurarEventos() {

        const botonesAumentar =
            document.querySelectorAll(".btn-aumentar");

        const botonesDisminuir =
            document.querySelectorAll(".btn-disminuir");

        const botonesEliminar =
            document.querySelectorAll(".btn-eliminar");


        // ======================================
        // AUMENTAR CANTIDAD
        // ======================================

        botonesAumentar.forEach(boton => {

            boton.addEventListener("click", () => {

                const id =
                    boton.dataset.id;


                const item =
                    carrito.find(
                        producto => producto.id === id
                    );


                const producto =
                    productos.find(
                        producto => producto.id === id
                    );


                if (item && producto) {

                    if (item.cantidad < producto.stock) {

                        item.cantidad++;

                        guardarCarrito();

                        mostrarCarrito();

                    } else {

                        alert(
                            "Ya alcanzaste el stock máximo disponible para este producto."
                        );

                    }

                }

            });

        });


        // ======================================
        // DISMINUIR CANTIDAD
        // ======================================

        botonesDisminuir.forEach(boton => {

            boton.addEventListener("click", () => {

                const id =
                    boton.dataset.id;


                const item =
                    carrito.find(
                        producto => producto.id === id
                    );


                if (item) {

                    if (item.cantidad > 1) {

                        item.cantidad--;

                    } else {

                        carrito =
                            carrito.filter(
                                producto =>
                                    producto.id !== id
                            );

                    }


                    guardarCarrito();

                    mostrarCarrito();

                }

            });

        });


        // ======================================
        // ELIMINAR PRODUCTO
        // ======================================

        botonesEliminar.forEach(boton => {

            boton.addEventListener("click", () => {

                const id =
                    boton.dataset.id;


                carrito =
                    carrito.filter(
                        producto =>
                            producto.id !== id
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

        // Verificar sesión
        const usuario = auth.currentUser;


        if (!usuario) {

            alert(
                "Debés iniciar sesión para confirmar la compra."
            );

            window.location.href = "login.html";

            return;
        }


        // Verificar que haya productos
        if (carrito.length === 0) {

            alert(
                "No hay productos en el carrito."
            );

            return;
        }


        // Desactivar botón mientras se procesa
        btnConfirmarCompra.disabled = true;

        btnConfirmarCompra.textContent =
            "Procesando compra...";


        try {

            // Crear referencia para el nuevo pedido
            const pedidoRef =
                doc(collection(db, "pedidos"));


            // Ejecutar transacción
            const resultado =
                await runTransaction(
                    db,
                    async transaction => {

                        const productosPedido = [];

                        let total = 0;


                        // Verificar nuevamente cada producto
                        for (const item of carrito) {

                            const productoRef =
                                doc(db, "productos", item.id);


                            const productoSnapshot =
                                await transaction.get(
                                    productoRef
                                );


                            // Verificar que exista
                            if (!productoSnapshot.exists()) {

                                throw new Error(
                                    `El producto "${item.nombre}" ya no está disponible.`
                                );

                            }


                            const producto =
                                productoSnapshot.data();


                            // Verificar cantidad
                            if (
                                !Number.isInteger(item.cantidad) ||
                                item.cantidad < 1
                            ) {

                                throw new Error(
                                    `La cantidad seleccionada para "${item.nombre}" no es válida.`
                                );

                            }


                            // Verificar stock actualizado
                            if (
                                producto.stock < item.cantidad
                            ) {

                                throw new Error(
                                    `No hay suficiente stock de "${producto.nombre}". Stock disponible: ${producto.stock}.`
                                );

                            }


                            // Usar el precio actual de Firestore
                            const precio =
                                Number(producto.precio);


                            const cantidad =
                                Number(item.cantidad);


                            const subtotal =
                                precio * cantidad;


                            total += subtotal;


                            // Guardar información del producto
                            // dentro del pedido
                            productosPedido.push({

                                productoId: item.id,

                                nombre: producto.nombre,

                                precio: precio,

                                cantidad: cantidad,

                                subtotal: subtotal

                            });


                            // Actualizar stock
                            const nuevoStock =
                                producto.stock - cantidad;


                            transaction.update(
                                productoRef,
                                {
                                    stock: nuevoStock,
                                    disponibilidad: nuevoStock > 0
                                }
                            );

                        }


                        // Crear pedido
                        transaction.set(
                            pedidoRef,
                            {
                                usuarioId: usuario.uid,

                                productos: productosPedido,

                                total: total,

                                fecha: serverTimestamp(),

                                estado: "confirmado"
                            }
                        );


                        return {
                            total: total
                        };

                    }
                );


            // ==================================
            // COMPRA REALIZADA CORRECTAMENTE
            // ==================================

            carrito = [];

            localStorage.removeItem("carrito");


            // Ocultar los mensajes normales
            mensajeCarritoVacio.classList.add("d-none");
            resumenCarrito.classList.add("d-none");


            // Mostrar confirmación en el lugar del carrito
            contenedorCarrito.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-success text-center">

                        <h2 class="h5 mb-2">
                            Compra realizada correctamente
                        </h2>

                        <p class="mb-2">
                            Tu pedido fue registrado correctamente.
                        </p>

                        <p class="mb-0">
                            Total:
                            <strong>
                                USD ${resultado.total}
                            </strong>
                        </p>

                    </div>
                </div>
            `;


            console.log(
                "Pedido registrado correctamente:",
                pedidoRef.id
            );


        } catch (error) {

            console.error(
                "Error al confirmar la compra:",
                error
            );


            alert(
                error.message ||
                "No se pudo completar la compra. Intentá nuevamente."
            );


        } finally {

            // Volver a habilitar el botón
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
    // CARGAR PRODUCTOS Y MOSTRAR CARRITO
    // ==========================================

    await cargarProductos();

});