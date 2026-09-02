document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.querySelector("#contenedorProductos");

    productos.forEach(producto => {

        const tarjeta = document.createElement("div");
        tarjeta.classList.add("col-12", "col-md-6", "col-lg-4");

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
                        USD${producto.precio}
                    </p>

                    <p class="mb-3">
                        Stock disponible: ${producto.stock}
                    </p>


                </div>
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });

});