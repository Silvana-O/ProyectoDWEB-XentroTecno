document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.querySelector("#productoDetalle");

    // Obtener el id del producto desde la URL
    const parametros = new URLSearchParams(window.location.search);
    const idProducto = parametros.get("id");

    // Buscar el producto correspondiente
    const producto = productos.find(
        producto => producto.id === idProducto
    );

    // Verificar si el producto existe
    if (!producto) {

        contenedor.innerHTML = `
            <div class="alert alert-warning text-center">
                <h2 class="h5">Producto no encontrado</h2>
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

        return;
    }

    // Mostrar el detalle del producto
    contenedor.innerHTML = `
        <div class="row g-4 align-items-center">

            <!-- IMAGEN -->
            <div class="col-12 col-md-6">

                <div class="text-center">

                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                        class="img-fluid rounded shadow-sm"
                    >

                </div>

            </div>

            <!-- INFORMACIÓN -->
            <div class="col-12 col-md-6">

                <span class="badge text-bg-secondary mb-3">
                    ${producto.categoria}
                </span>

                <h2 class="mb-3">
                    ${producto.nombre}
                </h2>

                <p class="lead">
                    ${producto.descripcion}
                </p>

                <p class="fs-3 fw-bold mb-3">
                    USD ${producto.precio}
                </p>

                <p>
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
                >
                    Agregar al carrito
                </button>

            </div>

        </div>

        <!-- VOLVER AL CATÁLOGO -->
        <div class="text-center mt-4">

            <a
                href="catalogo.html"
                class="btn btn-outline-primary"
            >
                Volver al catálogo
            </a>

        </div>
    `;

    // Obtener el campo de cantidad y el mensaje
    const cantidadInput = document.querySelector("#cantidadProducto");
    const mensajeCantidad = document.querySelector("#mensajeCantidad");

    // Validar la cantidad ingresada
    cantidadInput.addEventListener("input", () => {

        const cantidad = Number(cantidadInput.value);

        if (cantidad < 1) {

            mensajeCantidad.textContent =
                "La cantidad mínima es 1.";

        } else if (cantidad > producto.stock) {

            mensajeCantidad.textContent =
                `La cantidad no puede superar el stock disponible (${producto.stock}).`;

        } else {

            mensajeCantidad.textContent = "";

        }

    });

});