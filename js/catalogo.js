
import { db } from "./firebase/config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {

    const contenedor = document.querySelector("#contenedorProductos");
    const buscador = document.querySelector("#buscador");
    const filtroCategoria = document.querySelector("#filtroCategoria");
    const btnLimpiarFiltros = document.querySelector("#btnLimpiarFiltros");
    const mensajeSinResultados = document.querySelector("#mensajeSinResultados");

    
    let productos = [];

    // ==========================================
    // CARGAR PRODUCTOS DESDE FIRESTORE
    // ==========================================

    async function cargarProductos() {
        try {
            const referenciaProductos = collection(db, "productos");
            const snapshot = await getDocs(referenciaProductos);

            
            productos = snapshot.docs
                .map((documento) => ({
                    id: documento.id,
                    ...documento.data()
                }))
                .filter((producto) => producto.disponibilidad === true);

            crearOpcionesCategorias();
            mostrarProductos(productos);

        } catch (error) {
            console.error("Error al cargar los productos desde Firestore:", error);

            contenedor.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        No se pudieron cargar los productos. Intentá nuevamente más tarde.
                    </div>
                </div>
            `;
        }
    }

    // ==========================================
    // CREAR OPCIONES DE CATEGORÍAS
    // ==========================================

    function crearOpcionesCategorias() {
        filtroCategoria.innerHTML = `
            <option value="">Todas las categorías</option>
        `;

        const categorias = [
            ...new Set(productos.map(producto => producto.categoria).filter(Boolean))
        ];

        categorias.sort((a, b) => a.localeCompare(b, "es"));

        categorias.forEach(categoria => {
            const opcion = document.createElement("option");
            opcion.value = categoria;
            opcion.textContent = categoria;
            filtroCategoria.appendChild(opcion);
        });
    }

    // ==========================================
    // MOSTRAR PRODUCTOS
    // ==========================================

    function mostrarProductos(listaProductos) {
        contenedor.innerHTML = "";

        if (listaProductos.length === 0) {
            mensajeSinResultados.classList.remove("d-none");
            return;
        }

        mensajeSinResultados.classList.add("d-none");

        listaProductos.forEach(producto => {
            const tarjeta = document.createElement("div");

            tarjeta.classList.add(
                "col-12",
                "col-md-6",
                "col-lg-4"
            );

            tarjeta.innerHTML = `
                <div class="card h-100 shadow-sm">

                    <img
                        src="${escaparHTML(producto.imagen || "")}"
                        class="card-img-top"
                        alt="${escaparHTML(producto.nombre || "Producto")}"
                    >

                    <div class="card-body d-flex flex-column">

                        <span class="badge text-bg-secondary align-self-start mb-2">
                            ${escaparHTML(producto.categoria || "")}
                        </span>

                        <h2 class="card-title h5">
                            ${escaparHTML(producto.nombre || "Producto")}
                        </h2>

                        <p class="card-text">
                            ${escaparHTML(producto.descripcion || "")}
                        </p>

                        <p class="fw-bold fs-5 mt-auto">
                            USD ${Number(producto.precio || 0).toFixed(2)}
                        </p>

                        <p class="mb-0">
                            Stock disponible: ${Number(producto.stock) || 0}
                        </p>

                        <div class="d-grid gap-2 mt-3">

                            <a
                                href="producto.html?id=${encodeURIComponent(producto.id)}"
                                class="btn btn-primary"
                            >
                                Ver detalle
                            </a>

                            <button
                                type="button"
                                class="btn btn-outline-primary btn-agregar-carrito"
                                data-id="${escaparHTML(producto.id)}"
                                ${Number(producto.stock) <= 0 ? "disabled" : ""}
                            >
                                ${Number(producto.stock) <= 0
                                    ? "Producto sin stock"
                                    : "Agregar al carrito"}
                            </button>

                        </div>

                        <div
                            class="mensaje-carrito small mt-2"
                            aria-live="polite"
                        ></div>

                    </div>
                </div>
            `;

            contenedor.appendChild(tarjeta);
        });

        configurarBotonesAgregar();
    }

    // ==========================================
    // AGREGAR PRODUCTOS AL CARRITO
    // ==========================================

    function configurarBotonesAgregar() {
        const botones = contenedor.querySelectorAll(".btn-agregar-carrito");

        botones.forEach(boton => {
            boton.addEventListener("click", () => {
                agregarAlCarrito(boton);
            });
        });
    }

    function agregarAlCarrito(boton) {
        const id = boton.dataset.id;

        // Busca en la variable compartida con los productos cargados.
        const producto = productos.find(item => item.id === id);

        const mensaje = boton
            .closest(".card-body")
            .querySelector(".mensaje-carrito");

        if (!producto) {
            mensaje.textContent = "No se encontró el producto. Recargá la página.";
            mensaje.className = "mensaje-carrito small mt-2 text-danger";
            return;
        }

        // Verificar disponibilidad.
        if (producto.disponibilidad !== true) {
            mensaje.textContent = "Este producto no está disponible para la compra.";
            mensaje.className = "mensaje-carrito small mt-2 text-danger";
            return;
        }

        const stock = Number(producto.stock);

        if (!Number.isInteger(stock) || stock <= 0) {
            mensaje.textContent = "Este producto no tiene stock disponible.";
            mensaje.className = "mensaje-carrito small mt-2 text-danger";
            boton.disabled = true;
            boton.textContent = "Producto sin stock";
            return;
        }

        let carrito;

        try {
            carrito = JSON.parse(localStorage.getItem("carrito")) || [];

            if (!Array.isArray(carrito)) {
                throw new Error("El formato del carrito no es válido.");
            }
        } catch (error) {
            console.error("Error al leer el carrito:", error);
            mensaje.textContent = "No se pudo leer el carrito. Recargá la página.";
            mensaje.className = "mensaje-carrito small mt-2 text-danger";
            return;
        }

        const productoExistente = carrito.find(item => item.id === producto.id);

        if (productoExistente) {
            const cantidadExistente = Number(productoExistente.cantidad);

            if (!Number.isInteger(cantidadExistente) || cantidadExistente < 1) {
                mensaje.textContent = "La cantidad guardada en el carrito no es válida.";
                mensaje.className = "mensaje-carrito small mt-2 text-danger";
                return;
            }

            const nuevaCantidad = cantidadExistente + 1;

            if (nuevaCantidad > stock) {
                mensaje.textContent =
                    `No podés agregar más unidades. El stock disponible es ${stock}.`;
                mensaje.className = "mensaje-carrito small mt-2 text-danger";
                return;
            }

            productoExistente.cantidad = nuevaCantidad;

        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: Number(producto.precio),
                imagen: producto.imagen || "",
                cantidad: 1
            });
        }

        try {
            localStorage.setItem("carrito", JSON.stringify(carrito));

            mensaje.textContent = "Producto agregado al carrito.";
            mensaje.className = "mensaje-carrito small mt-2 text-success";

            const textoOriginal = stock <= 0
                ? "Producto sin stock"
                : "Agregar al carrito";

            boton.textContent = "Agregado al carrito";

            setTimeout(() => {
                if (document.body.contains(boton)) {
                    boton.textContent = textoOriginal;
                }
            }, 1500);

        } catch (error) {
            console.error("Error al guardar el carrito:", error);
            mensaje.textContent = "No se pudo guardar el producto en el carrito.";
            mensaje.className = "mensaje-carrito small mt-2 text-danger";
        }
    }

    // ==========================================
    // NORMALIZAR TEXTO PARA BÚSQUEDAS
    // ==========================================

    function normalizarTexto(texto) {
        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // ==========================================
    // APLICAR BÚSQUEDA Y FILTROS
    // ==========================================

    function aplicarFiltros() {
        const textoBuscado = normalizarTexto(buscador.value.trim());
        const categoriaSeleccionada = filtroCategoria.value;

        const productosFiltrados = productos.filter(producto => {
            const nombre = normalizarTexto(producto.nombre);
            const descripcion = normalizarTexto(producto.descripcion);
            const categoria = normalizarTexto(producto.categoria);
            const marca = normalizarTexto(producto.marca);
            const modelo = normalizarTexto(producto.modelo);

            let textoParaBuscar = `
                ${nombre}
                ${descripcion}
                ${categoria}
                ${marca}
                ${modelo}
            `;

            // Sinónimos para monitores.
            if (
                categoria.includes("monitor") ||
                nombre.includes("ultrawide")
            ) {
                textoParaBuscar += " monitor pantalla display ";
            }

            // Sinónimos para mouse.
            if (
                nombre.includes("mouse") ||
                modelo.includes("mouse")
            ) {
                textoParaBuscar += " mouse raton ";
            }

            // Sinónimos para notebooks.
            if (
                categoria.includes("notebook") ||
                nombre.includes("notebook")
            ) {
                textoParaBuscar += " notebook laptop computadora ordenador ";
            }

            const coincideTexto = textoParaBuscar.includes(textoBuscado);

            const coincideCategoria =
                categoriaSeleccionada === "" ||
                producto.categoria === categoriaSeleccionada;

            return coincideTexto && coincideCategoria;
        });

        mostrarProductos(productosFiltrados);
    }

    // ==========================================
    // EVENTOS
    // ==========================================

    buscador.addEventListener("input", aplicarFiltros);

    filtroCategoria.addEventListener("change", aplicarFiltros);

    btnLimpiarFiltros.addEventListener("click", () => {
        buscador.value = "";
        filtroCategoria.value = "";
        mostrarProductos(productos);
    });

    // ==========================================
    // ESCAPAR TEXTO HTML
    // ==========================================

    function escaparHTML(valor) {
        return String(valor).replace(/[&<>"']/g, caracter => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[caracter]);
    }

    // Iniciar carga.
    await cargarProductos();
});
