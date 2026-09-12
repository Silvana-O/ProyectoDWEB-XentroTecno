document.addEventListener("DOMContentLoaded", () => {

    const p = document.body.dataset.page;

    document.querySelectorAll("[data-page]").forEach(a =>
        a.classList.toggle("active", a.dataset.page === p)
    );


    const t = document.querySelector("#appToast");
    const m = document.querySelector("#toastMessage");

    const show = x => {
        m.textContent = x;
        bootstrap.Toast.getOrCreateInstance(t).show();
    };


    document.querySelector("#btnLoginPlaceholder")?.addEventListener(
        "click",
        () => show("El inicio de sesión será desarrollado en el Sprint 3.")
    );


    document.querySelector("#btnProjectInfo")?.addEventListener(
        "click",
        () =>
            bootstrap.Modal.getOrCreateInstance(
                document.querySelector("#projectInfoModal")
            ).show()
    );

        // Actualizar cantidad de productos del carrito
    const contadorCarrito = document.querySelector("#contadorCarrito");

    if (contadorCarrito) {

        const carrito = JSON.parse(
            localStorage.getItem("carrito")
        ) || [];

        const cantidadTotal = carrito.reduce(
            (total, item) => total + item.cantidad,
            0
        );

        contadorCarrito.textContent = cantidadTotal;

    }

});