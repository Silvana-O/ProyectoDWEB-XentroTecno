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
                <a href="catalogo.html" class="btn btn-outline-primary">
                    Volver al catálogo
                </a>
            </div>
        `;

        return;
    }


    // Mostrar el detalle del producto
    contenedor.innerHTML = `
        <div class="row g-4 align-items-center">

            <div class="col-12 col-md-6">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                    class="img-fluid rounded shadow-sm"
                >

            </div>


            <div class="col-12 col-md-6">

                <span class="badge text-bg-secondary mb-3">
                    ${producto.categoria}
                </span>

                <h2>
                    ${producto.nombre}
                </h2>

                <p class="lead">
                    ${producto.descripcion}
                </p>

                <p class="fs-3 fw-bold">
                    USD ${producto.precio}
                </p>

                <p>
                    <strong>Stock disponible:</strong>
                    ${producto.stock}
                </p>

            </div>

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
});