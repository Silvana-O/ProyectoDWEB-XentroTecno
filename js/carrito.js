document.addEventListener("DOMContentLoaded", () => {

    const contenedorCarrito = document.querySelector("#contenedorCarrito");
    const mensajeCarritoVacio = document.querySelector("#mensajeCarritoVacio");
    const resumenCarrito = document.querySelector("#resumenCarrito");

    let carrito = JSON.parse(
        localStorage.getItem("carrito")
    ) || [];


    function guardarCarrito() {

        localStorage.setItem(
            "carrito",
            JSON.stringify(carrito)
        );

    }


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
            (acumulado, item) => acumulado + item.precio * item.cantidad,
            0
        );

        document.querySelector("#totalCarrito").textContent =
            `USD ${total}`;


        carrito.forEach(item => {

            const producto = productos.find(
                producto => producto.id === item.id
            );

            if (!producto) {
                return;
            }


            const tarjeta = document.createElement("div");

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


    function configurarEventos() {

        const botonesAumentar =
            document.querySelectorAll(".btn-aumentar");

        const botonesDisminuir =
            document.querySelectorAll(".btn-disminuir");

        const botonesEliminar =
            document.querySelectorAll(".btn-eliminar");


        botonesAumentar.forEach(boton => {

            boton.addEventListener("click", () => {

                const id = boton.dataset.id;

                const item = carrito.find(
                    producto => producto.id === id
                );

                const producto = productos.find(
                    producto => producto.id === id
                );


                if (item && producto) {

                    if (item.cantidad < producto.stock) {

                        item.cantidad++;

                        guardarCarrito();

                        mostrarCarrito();

                    } else {

                        alert("Ya alcanzaste el stock máximo disponible para este producto.");    

                    }


                }

            });

        });


        botonesDisminuir.forEach(boton => {

            boton.addEventListener("click", () => {

                const id = boton.dataset.id;

                const item = carrito.find(
                    producto => producto.id === id
                );


                if (item) {

                    if (item.cantidad > 1) {

                        item.cantidad--;

                    } else {

                        carrito = carrito.filter(
                            producto => producto.id !== id
                        );

                    }

                    guardarCarrito();

                    mostrarCarrito();

                }

            });

        });


        botonesEliminar.forEach(boton => {

            boton.addEventListener("click", () => {

                const id = boton.dataset.id;

                carrito = carrito.filter(
                    producto => producto.id !== id
                );

                guardarCarrito();

                mostrarCarrito();

            });

        });

    }


    mostrarCarrito();

});