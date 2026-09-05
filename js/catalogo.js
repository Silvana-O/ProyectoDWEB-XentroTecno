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

                        <a
                            href="producto.html?id=${producto.id}"
                            class="btn btn-primary mt-3"
                        >
                            Ver detalle
                        </a>

                    </div>

                </div>
            `;

            contenedor.appendChild(tarjeta);

        });
    }


    // Aplicar búsqueda y filtro
    function aplicarFiltros() {

        const textoBuscado = buscador.value.toLowerCase().trim();
        const categoriaSeleccionada = filtroCategoria.value;


        const productosFiltrados = productos.filter(producto => {

            const coincideNombre =
                producto.nombre.toLowerCase().includes(textoBuscado);

            const coincideCategoria =
                categoriaSeleccionada === "" ||
                producto.categoria === categoriaSeleccionada;

            return coincideNombre && coincideCategoria;

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