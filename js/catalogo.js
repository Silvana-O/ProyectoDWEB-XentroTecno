document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.querySelector("#contenedorProductos");
    const buscador = document.querySelector("#buscador");
    const filtroCategoria = document.querySelector("#filtroCategoria");
    const btnLimpiarFiltros = document.querySelector("#btnLimpiarFiltros");
    const mensajeSinResultados = document.querySelector("#mensajeSinResultados");


    // Crear las opciones de categorías
    const categorias = [...new Set(productos.map(producto => producto.categoria))];

    categorias.forEach(categoria => {

        const opcion = document.createElement("option");

        opcion.value = categoria;
        opcion.textContent = categoria;

        filtroCategoria.appendChild(opcion);

    });


    // Mostrar productos
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
                        src="${producto.imagen}"
                        class="card-img-top"
                        alt="${producto.nombre}"
                    >

                    <div class="card-body d-flex flex-column">

                        <span class="badge text-bg-secondary align-self-start mb-2">
                            ${producto.categoria}
                        </span>

                        <h2 class="card-title h5">
                            ${producto.nombre}
                        </h2>

                        <p class="card-text">
                            ${producto.descripcion}
                        </p>

                        <p class="fw-bold fs-5 mt-auto">
                            USD ${producto.precio}
                        </p>

                        <p class="mb-0">
                            Stock disponible: ${producto.stock}
                        </p>

                        <div class="d-grid gap-2 mt-3">

                            <a
                                href="producto.html?id=${producto.id}"
                                class="btn btn-primary"
                            >
                                Ver detalle
                            </a>

                            <button
                                type="button"
                                class="btn btn-outline-primary btn-agregar-carrito"
                                data-id="${producto.id}"
                            >
                                Agregar al carrito
                            </button>

                        </div>

                    </div>

                </div>
            `;

            contenedor.appendChild(tarjeta);

        });


        configurarBotonesAgregar();

    }


    // Agregar producto al carrito
    function configurarBotonesAgregar() {

        const botones =
            document.querySelectorAll(".btn-agregar-carrito");


        botones.forEach(boton => {

            boton.addEventListener("click", () => {

                const id = boton.dataset.id;

                const producto = productos.find(
                    producto => producto.id === id
                );


                if (!producto) {
                    return;
                }


                let carrito = JSON.parse(
                    localStorage.getItem("carrito")
                ) || [];


                const productoExistente = carrito.find(
                    item => item.id === producto.id
                );


                if (productoExistente) {

                    const nuevaCantidad =
                        productoExistente.cantidad + 1;


                    if (nuevaCantidad > producto.stock) {

                        alert(
                            `No podés agregar más unidades. El stock disponible es ${producto.stock}.`
                        );

                        return;
                    }


                    productoExistente.cantidad = nuevaCantidad;

                } else {

                    carrito.push({
                        id: producto.id,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        imagen: producto.imagen,
                        cantidad: 1
                    });

                }


                localStorage.setItem(
                    "carrito",
                    JSON.stringify(carrito)
                );


                boton.textContent = "Agregado al carrito";

                setTimeout(() => {

                    boton.textContent = "Agregar al carrito";

                }, 1500);

            });

        });

    }


    // Aplicar búsqueda y filtro

    function normalizarTexto(texto) {

        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    }

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

            // Sinónimos para monitores
            if (
                categoria.includes("monitor") ||
                nombre.includes("ultrawide")
            ) {
                textoParaBuscar += `
                    monitor
                    pantalla
                    display
                `;
            }

            // Sinónimos para mouse
            if (
                categoria.includes("periferico") ||
                nombre.includes("mouse")
            ) {
                textoParaBuscar += `
                    mouse
                    raton
                `;
            }

            // Sinónimos para notebooks
            if (
                categoria.includes("notebook") ||
                nombre.includes("notebook")
            ) {
                textoParaBuscar += `
                    notebook
                    laptop
                    computadora
                    ordenador
                `;
            }

            const coincideTexto =
                textoParaBuscar.includes(textoBuscado);

            const coincideCategoria =
                categoriaSeleccionada === "" ||
                producto.categoria === categoriaSeleccionada;

            return coincideTexto && coincideCategoria;

        });

        mostrarProductos(productosFiltrados);
    }


    // Evento del buscador
    buscador.addEventListener("input", aplicarFiltros);


    // Evento del filtro de categoría
    filtroCategoria.addEventListener("change", aplicarFiltros);


    // Limpiar filtros
    btnLimpiarFiltros.addEventListener("click", () => {

        buscador.value = "";
        filtroCategoria.value = "";

        mostrarProductos(productos);

    });


    // Mostrar todos los productos al cargar
    mostrarProductos(productos);

});