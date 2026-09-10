document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.querySelector("#productoDetalle");

    const parametros = new URLSearchParams(window.location.search);
    const idProducto = parametros.get("id");

    const producto = productos.find(
        producto => producto.id === idProducto
    );

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

    contenedor.innerHTML = `
        <div class="row g-4 align-items-center">

            <div class="col-12 col-md-6">

                <div class="text-center">

                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                        class="img-fluid rounded shadow-sm"
                    >

                </div>

            </div>

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

                <button
                    type="button"
                    id="btnAgregarCarrito"
                    class="btn btn-primary w-100"
                >
                    Agregar al carrito
                </button>

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

    const cantidadInput = document.querySelector("#cantidadProducto");
    const mensajeCantidad = document.querySelector("#mensajeCantidad");
    const btnAgregarCarrito = document.querySelector("#btnAgregarCarrito");

    cantidadInput.addEventListener("input", () => {

        const cantidad = Number(cantidadInput.value);

        mensajeCantidad.classList.remove("text-success");
        mensajeCantidad.classList.add("text-danger");

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

    btnAgregarCarrito.addEventListener("click", () => {

        const cantidad = Number(cantidadInput.value);

        if (
            cantidad < 1 ||
            cantidad > producto.stock ||
            !Number.isInteger(cantidad)
        ) {

            mensajeCantidad.classList.remove("text-success");
            mensajeCantidad.classList.add("text-danger");

            mensajeCantidad.textContent =
                `Ingresá una cantidad válida entre 1 y ${producto.stock}.`;

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
                productoExistente.cantidad + cantidad;

            if (nuevaCantidad > producto.stock) {

                mensajeCantidad.classList.remove("text-success");
                mensajeCantidad.classList.add("text-danger");

                mensajeCantidad.textContent =
                    `No podés agregar esa cantidad. El stock disponible es ${producto.stock}.`;

                return;
            }

            productoExistente.cantidad = nuevaCantidad;

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

        mensajeCantidad.classList.remove("text-danger");
        mensajeCantidad.classList.add("text-success");

        mensajeCantidad.textContent =
            "Producto agregado al carrito.";

        let btnVerCarrito = document.querySelector("#btnVerCarrito");

        if (!btnVerCarrito) {
            btnVerCarrito = document.createElement("a");

            btnVerCarrito.id = "btnVerCarrito";
            btnVerCarrito.href = "carrito.html";
            btnVerCarrito.textContent = "Ver carrito";

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

    });

});