import { auth, db } from "./firebase/config.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


document.addEventListener("DOMContentLoaded", async () => {

    const contenedor =
        document.querySelector("#productoDetalle");

    const parametros =
        new URLSearchParams(window.location.search);

    const idProducto =
        parametros.get("id");


    // ==========================================
    // VERIFICAR ID DEL PRODUCTO
    // ==========================================

    if (!idProducto) {

        mostrarProductoNoEncontrado();
        return;

    }


    let producto;


    // ==========================================
    // OBTENER PRODUCTO DESDE FIRESTORE
    // ==========================================

    try {

        const referenciaProducto =
            doc(db, "productos", idProducto);

        const documentoProducto =
            await getDoc(referenciaProducto);


        if (!documentoProducto.exists()) {

            mostrarProductoNoEncontrado();
            return;

        }


        producto = {
            id: documentoProducto.id,
            ...documentoProducto.data()
        };


        console.log(
            "Producto cargado desde Firestore:",
            producto
        );


    } catch (error) {

        console.error(
            "Error al cargar el producto desde Firestore:",
            error
        );


        contenedor.innerHTML = `
            <div class="alert alert-danger text-center">

                <h2 class="h5">
                    No se pudo cargar el producto
                </h2>

                <p class="mb-0">
                    Ocurrió un error al obtener la información.
                    Intentá nuevamente más tarde.
                </p>

            </div>

            <div class="text-center mt-4">

                <a
                    href="catalogo.html"
                    class="btn btn-outline-primary"
                >
                    Volver al catálogo
                </a>

            </div>
        `;

        return;

    }


    // ==========================================
    // MOSTRAR PRODUCTO
    // ==========================================

    mostrarProducto(producto);


    function mostrarProducto(producto) {

        const caracteristicas =
            Array.isArray(producto.caracteristicas)
                ? producto.caracteristicas
                : [];


        contenedor.innerHTML = `

            <!-- INFORMACIÓN PRINCIPAL -->

            <div class="row g-5 align-items-start">

                <!-- IMAGEN -->

                <div class="col-12 col-lg-6">

                    <div class="text-center p-3 bg-white rounded shadow-sm">

                        <img
                            src="${producto.imagen}"
                            alt="${producto.nombre}"
                            class="img-fluid rounded"
                        >

                    </div>

                </div>


                <!-- INFORMACIÓN DEL PRODUCTO -->

                <div class="col-12 col-lg-6">

                    <span class="badge text-bg-secondary mb-3">
                        ${producto.categoria}
                    </span>

                    <h2 class="mb-3">
                        ${producto.nombre}
                    </h2>

                    <p class="lead mb-4">
                        ${producto.descripcion}
                    </p>


                    <div class="border rounded p-4 mb-4">

                        <h3 class="h5 mb-3">
                            Información del producto
                        </h3>

                        <div class="row g-3">

                            <div class="col-12 col-sm-6">

                                <p class="mb-0">

                                    <strong>Marca</strong><br>

                                    ${producto.marca}

                                </p>

                            </div>


                            <div class="col-12 col-sm-6">

                                <p class="mb-0">

                                    <strong>Modelo</strong><br>

                                    ${producto.modelo}

                                </p>

                            </div>

                        </div>

                    </div>


                    <!-- PRECIO -->

                    <div class="mb-3">

                        <span class="fs-2 fw-bold">
                            USD ${producto.precio}
                        </span>

                    </div>


                    <!-- STOCK -->

                    <p class="mb-3">

                        <strong>Stock disponible:</strong>
                        ${producto.stock}

                    </p>


                    <!-- CANTIDAD -->

                    <div class="mb-3">

                        <label
                            for="cantidadProducto"
                            class="form-label fw-semibold"
                        >
                            Cantidad
                        </label>

                        <input
                            type="number"
                            id="cantidadProducto"
                            class="form-control"
                            value="1"
                            min="1"
                            max="${producto.stock}"
                        >

                        <div
                            id="mensajeCantidad"
                            class="text-danger small mt-2"
                        ></div>

                    </div>


                    <!-- BOTÓN -->

                    <button
                        type="button"
                        id="btnAgregarCarrito"
                        class="btn btn-primary w-100"
                        ${producto.stock <= 0 ? "disabled" : ""}
                    >
                        ${producto.stock <= 0
                            ? "Producto sin stock"
                            : "Agregar al carrito"}
                    </button>

                </div>

            </div>


            <!-- CARACTERÍSTICAS -->

            <div class="border rounded p-4 mt-5">

                <h3 class="h5 mb-3">
                    Características
                </h3>

                <div class="row row-cols-1 row-cols-md-2 g-2">

                    ${caracteristicas
                        .map(caracteristica => `
                            <div class="col">

                                <div class="p-2">

                                    <span class="me-2">
                                        •
                                    </span>

                                    ${caracteristica}

                                </div>

                            </div>
                        `)
                        .join("")}

                </div>

            </div>


            <!-- RESEÑAS -->

            <div class="border rounded p-4 mt-5">

                <h3 class="h5 mb-4">
                    Reseñas de clientes
                </h3>

                <div id="contenedorResenas">

                    <div class="alert alert-info text-center">
                        Cargando reseñas...
                    </div>

                </div>

            </div>


            <!-- FORMULARIO DE RESEÑA -->

            <div class="border rounded p-4 mt-4">

                <h3 class="h5 mb-4">
                    Dejá tu reseña
                </h3>

                <div id="mensajeResena"></div>

                <form id="formResena">

                    <div class="mb-3">

                        <label
                            for="puntuacionResena"
                            class="form-label fw-semibold"
                        >
                            Puntuación
                        </label>

                        <select
                            id="puntuacionResena"
                            class="form-select"
                            required
                        >

                            <option value="">
                                Seleccioná una puntuación
                            </option>

                            <option value="5">
                                5 - Excelente
                            </option>

                            <option value="4">
                                4 - Muy bueno
                            </option>

                            <option value="3">
                                3 - Bueno
                            </option>

                            <option value="2">
                                2 - Regular
                            </option>

                            <option value="1">
                                1 - Malo
                            </option>

                        </select>

                    </div>


                    <div class="mb-3">

                        <label
                            for="comentarioResena"
                            class="form-label fw-semibold"
                        >
                            Comentario
                        </label>

                        <textarea
                            id="comentarioResena"
                            class="form-control"
                            rows="4"
                            minlength="5"
                            maxlength="500"
                            placeholder="Escribí tu opinión sobre el producto..."
                            required
                        ></textarea>

                        <div class="form-text">
                            Entre 5 y 500 caracteres.
                        </div>

                    </div>


                    <button
                        type="submit"
                        id="btnPublicarResena"
                        class="btn btn-primary"
                    >
                        Publicar reseña
                    </button>

                </form>

            </div>


            <!-- VOLVER -->

            <div class="text-center mt-4">

                <a
                    href="catalogo.html"
                    class="btn btn-outline-primary"
                >
                    Ir al catálogo
                </a>

            </div>

        `;


        // ==========================================
        // ELEMENTOS DEL CARRITO
        // ==========================================

        const cantidadInput =
            document.querySelector("#cantidadProducto");

        const mensajeCantidad =
            document.querySelector("#mensajeCantidad");

        const btnAgregarCarrito =
            document.querySelector("#btnAgregarCarrito");


        // ==========================================
        // VALIDAR CANTIDAD
        // ==========================================

        cantidadInput.addEventListener("input", () => {

            const cantidad =
                Number(cantidadInput.value);


            mensajeCantidad.classList.remove(
                "text-success"
            );

            mensajeCantidad.classList.add(
                "text-danger"
            );


            if (cantidad < 1) {

                mensajeCantidad.textContent =
                    "La cantidad mínima es 1.";

            } else if (cantidad > producto.stock) {

                mensajeCantidad.textContent =
                    `La cantidad no puede superar el stock disponible (${producto.stock}).`;

            } else if (!Number.isInteger(cantidad)) {

                mensajeCantidad.textContent =
                    "Ingresá una cantidad entera.";

            } else {

                mensajeCantidad.textContent = "";

            }

        });


        // ==========================================
        // AGREGAR AL CARRITO
        // ==========================================

        btnAgregarCarrito.addEventListener(
            "click",
            () => {

                const cantidad =
                    Number(cantidadInput.value);


                if (
                    cantidad < 1 ||
                    cantidad > producto.stock ||
                    !Number.isInteger(cantidad)
                ) {

                    mensajeCantidad.classList.remove(
                        "text-success"
                    );

                    mensajeCantidad.classList.add(
                        "text-danger"
                    );

                    mensajeCantidad.textContent =
                        `Ingresá una cantidad válida entre 1 y ${producto.stock}.`;

                    return;

                }


                let carrito =
                    JSON.parse(
                        localStorage.getItem("carrito")
                    ) || [];


                const productoExistente =
                    carrito.find(
                        item => item.id === producto.id
                    );


                if (productoExistente) {

                    const nuevaCantidad =
                        productoExistente.cantidad +
                        cantidad;


                    if (nuevaCantidad > producto.stock) {

                        mensajeCantidad.classList.remove(
                            "text-success"
                        );

                        mensajeCantidad.classList.add(
                            "text-danger"
                        );

                        mensajeCantidad.textContent =
                            `No podés agregar esa cantidad. El stock disponible es ${producto.stock}.`;

                        return;

                    }


                    productoExistente.cantidad =
                        nuevaCantidad;

                } else {

                    carrito.push({

                        id: producto.id,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        imagen: producto.imagen,
                        cantidad: cantidad

                    });

                }


                localStorage.setItem(
                    "carrito",
                    JSON.stringify(carrito)
                );


                mensajeCantidad.classList.remove(
                    "text-danger"
                );

                mensajeCantidad.classList.add(
                    "text-success"
                );

                mensajeCantidad.textContent =
                    "Producto agregado al carrito.";


                let btnVerCarrito =
                    document.querySelector(
                        "#btnVerCarrito"
                    );


                if (!btnVerCarrito) {

                    btnVerCarrito =
                        document.createElement("a");

                    btnVerCarrito.id =
                        "btnVerCarrito";

                    btnVerCarrito.href =
                        "carrito.html";

                    btnVerCarrito.textContent =
                        "Ver carrito";

                    btnVerCarrito.classList.add(
                        "btn",
                        "btn-outline-primary",
                        "mt-2"
                    );


                    mensajeCantidad.insertAdjacentElement(
                        "afterend",
                        btnVerCarrito
                    );

                }

            }
        );


        // ==========================================
        // CONFIGURAR RESEÑAS
        // ==========================================

        configurarResenas(producto.id);

    }


    // ==========================================
    // CONFIGURAR RESEÑAS
    // ==========================================

    function configurarResenas(idProducto) {

        cargarResenas(idProducto);

        const formulario =
            document.querySelector("#formResena");

        const mensaje =
            document.querySelector("#mensajeResena");


        onAuthStateChanged(auth, async (usuario) => {

            if (!usuario) {

                formulario.innerHTML = `
                    <div class="alert alert-info mb-0">
                        Iniciá sesión para dejar una reseña.
                    </div>
                `;

                return;
            }


            // Verificar si el usuario compró el producto
            const comproProducto =
                await verificarCompraProducto(
                    usuario.uid,
                    idProducto
                );


            if (!comproProducto) {

                formulario.innerHTML = `
                    <div class="alert alert-secondary mb-0">
                        Solo podés dejar una reseña de productos que hayas comprado.
                    </div>
                `;

                return;
            }


            // Verificar si ya publicó una reseña
            const yaReseno =
                await verificarResenaExistente(
                    usuario.uid,
                    idProducto
                );


            if (yaReseno) {

                formulario.innerHTML = `
                    <div class="alert alert-success mb-0">
                        Ya publicaste una reseña para este producto.
                    </div>
                `;

                return;
            }


            formulario.addEventListener(
                "submit",
                async (evento) => {

                    evento.preventDefault();


                    const usuarioActual =
                        auth.currentUser;


                    if (!usuarioActual) {

                        mensaje.innerHTML = `
                            <div class="alert alert-warning">
                                Debés iniciar sesión para publicar una reseña.
                            </div>
                        `;

                        return;
                    }


                    const puntuacion =
                        Number(
                            document.querySelector(
                                "#puntuacionResena"
                            ).value
                        );


                    const comentario =
                        document.querySelector(
                            "#comentarioResena"
                        ).value.trim();


                    // ==========================================
                    // VALIDAR PUNTUACIÓN
                    // ==========================================

                    if (
                        !Number.isInteger(puntuacion) ||
                        puntuacion < 1 ||
                        puntuacion > 5
                    ) {

                        mensaje.innerHTML = `
                            <div class="alert alert-danger">
                                Seleccioná una puntuación entre 1 y 5.
                            </div>
                        `;

                        return;
                    }


                    // ==========================================
                    // VALIDAR COMENTARIO
                    // ==========================================

                    if (
                        comentario.length < 5 ||
                        comentario.length > 500
                    ) {

                        mensaje.innerHTML = `
                            <div class="alert alert-danger">
                                El comentario debe tener entre 5 y 500 caracteres.
                            </div>
                        `;

                        return;
                    }


                    const boton =
                        document.querySelector(
                            "#btnPublicarResena"
                        );


                    boton.disabled = true;
                    boton.textContent = "Publicando...";


                    try {

                        // ==========================================
                        // OBTENER DATOS DEL USUARIO
                        // ==========================================

                        let nombreUsuario =
                            usuarioActual.email;


                        try {

                            const referenciaUsuario =
                                doc(
                                    db,
                                    "usuarios",
                                    usuarioActual.uid
                                );


                            const documentoUsuario =
                                await getDoc(
                                    referenciaUsuario
                                );


                            if (documentoUsuario.exists()) {

                                const datosUsuario =
                                    documentoUsuario.data();


                                const nombre =
                                    datosUsuario.nombre || "";


                                const apellido =
                                    datosUsuario.apellido || "";


                                const nombreCompleto =
                                    `${nombre} ${apellido}`.trim();


                                if (nombreCompleto) {

                                    nombreUsuario =
                                        nombreCompleto;

                                }

                            }

                        } catch (errorUsuario) {

                            console.warn(
                                "No se pudieron obtener los datos del perfil:",
                                errorUsuario
                            );

                        }


                        // ==========================================
                        // GUARDAR RESEÑA
                        // ==========================================

                        await addDoc(
                            collection(db, "resenas"),
                            {
                                productoId: idProducto,
                                usuarioId: usuarioActual.uid,
                                nombreUsuario: nombreUsuario,
                                puntuacion: puntuacion,
                                comentario: comentario,
                                fecha: serverTimestamp()
                            }
                        );


                        formulario.reset();


                        mensaje.innerHTML = `
                            <div class="alert alert-success">
                                Tu reseña fue publicada correctamente.
                            </div>
                        `;


                        // Ocultar el formulario después de publicar
                        formulario.innerHTML = `
                            <div class="alert alert-success mb-0">
                                Tu reseña fue publicada correctamente.
                            </div>
                        `;


                        await cargarResenas(idProducto);


                    } catch (error) {

                        console.error(
                            "Error al publicar la reseña:",
                            error
                        );


                        mensaje.innerHTML = `
                            <div class="alert alert-danger">
                                No se pudo publicar la reseña.
                                Intentá nuevamente.
                            </div>
                        `;


                        boton.disabled = false;
                        boton.textContent =
                            "Publicar reseña";

                    }

                }
            );

        });

    }

    // ==========================================
    // VERIFICAR SI EL USUARIO COMPRÓ EL PRODUCTO
    // ==========================================

    async function verificarCompraProducto(
        usuarioId,
        idProducto
    ) {

        try {

            const referenciaPedidos =
                collection(db, "pedidos");


            const consulta =
                query(
                    referenciaPedidos,
                    where(
                        "usuarioId",
                        "==",
                        usuarioId
                    )
                );


            const snapshot =
                await getDocs(consulta);


            for (const documento of snapshot.docs) {

                const pedido =
                    documento.data();


                const productosPedido =
                    Array.isArray(pedido.productos)
                        ? pedido.productos
                        : [];


                const compro =
                    productosPedido.some(
                        producto =>
                            producto.productoId === idProducto
                    );


                if (compro) {

                    return true;

                }

            }


            return false;


        } catch (error) {

            console.error(
                "Error al verificar la compra del producto:",
                error
            );


            return false;

        }

    }


    // ==========================================
    // VERIFICAR SI YA PUBLICÓ UNA RESEÑA
    // ==========================================

    async function verificarResenaExistente(
        usuarioId,
        idProducto
    ) {

        try {

            const referenciaResenas =
                collection(db, "resenas");


            const consulta =
                query(
                    referenciaResenas,
                    where(
                        "usuarioId",
                        "==",
                        usuarioId
                    ),
                    where(
                        "productoId",
                        "==",
                        idProducto
                    )
                );


            const snapshot =
                await getDocs(consulta);


            return !snapshot.empty;


        } catch (error) {

            console.error(
                "Error al verificar la reseña existente:",
                error
            );


            return false;

        }

    }


    // ==========================================
    // CARGAR RESEÑAS
    // ==========================================

    async function cargarResenas(idProducto) {

        const contenedorResenas =
            document.querySelector(
                "#contenedorResenas"
            );


        try {

            const referenciaResenas =
                collection(db, "resenas");


            const consulta =
                query(
                    referenciaResenas,
                    where(
                        "productoId",
                        "==",
                        idProducto
                    )
                );


            const snapshot =
                await getDocs(consulta);


            if (snapshot.empty) {

                contenedorResenas.innerHTML = `
                    <div class="alert alert-light border text-center">
                        Este producto todavía no tiene reseñas.
                    </div>
                `;

                return;

            }


            const resenas =
                snapshot.docs.map((documento) => ({
                    id: documento.id,
                    ...documento.data()
                }));


            // Ordenar por fecha, de más reciente a más antigua
            resenas.sort((a, b) => {

                const fechaA =
                    a.fecha?.toDate
                        ? a.fecha.toDate()
                        : new Date(0);

                const fechaB =
                    b.fecha?.toDate
                        ? b.fecha.toDate()
                        : new Date(0);

                return fechaB - fechaA;

            });


            contenedorResenas.innerHTML =
                resenas
                    .map((resena) => {

                        const estrellas =
                            "★".repeat(
                                Number(resena.puntuacion)
                            ) +
                            "☆".repeat(
                                5 - Number(resena.puntuacion)
                            );


                        const fecha =
                            resena.fecha?.toDate
                                ? resena.fecha
                                    .toDate()
                                    .toLocaleDateString(
                                        "es-UY"
                                    )
                                : "Fecha no disponible";


                        return `
                            <div class="border rounded p-3 mb-3">

                                <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">

                                    <div>

                                        <strong>
                                            ${resena.nombreUsuario || "Usuario"}
                                        </strong>

                                        <div class="text-warning">
                                            ${estrellas}
                                        </div>

                                    </div>

                                    <small class="text-muted">
                                        ${fecha}
                                    </small>

                                </div>


                                <p class="mb-0 mt-3">
                                    ${resena.comentario}
                                </p>

                            </div>
                        `;

                    })
                    .join("");


        } catch (error) {

            console.error(
                "Error al cargar las reseñas:",
                error
            );


            contenedorResenas.innerHTML = `
                <div class="alert alert-danger">
                    No se pudieron cargar las reseñas.
                </div>
            `;

        }

    }


    // ==========================================
    // PRODUCTO NO ENCONTRADO
    // ==========================================

    function mostrarProductoNoEncontrado() {

        contenedor.innerHTML = `
            <div class="alert alert-warning text-center">

                <h2 class="h5">
                    Producto no encontrado
                </h2>

                <p class="mb-0">
                    El producto que estás buscando no existe.
                </p>

            </div>

            <div class="text-center mt-4">

                <a
                    href="catalogo.html"
                    class="btn btn-outline-primary"
                >
                    Volver al catálogo
                </a>

            </div>
        `;

    }

});