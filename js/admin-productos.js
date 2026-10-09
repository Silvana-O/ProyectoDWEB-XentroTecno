import { db } from "./firebase/config.js";

import {
    collection,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const tablaProductos = document.querySelector("#tablaProductos");
let productoEditandoId = null;

async function cargarProductos() {

    try {

        const productosRef = collection(db, "productos");
        const productosSnap = await getDocs(productosRef);

        tablaProductos.innerHTML = "";

        if (productosSnap.empty) {

            tablaProductos.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        No hay productos registrados.
                    </td>
                </tr>
            `;

            return;
        }


        productosSnap.forEach((documento) => {

            const producto = documento.data();

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>
                    <strong>${producto.nombre || "Sin nombre"}</strong>
                    <br>
                    <small class="text-muted">
                        ${producto.modelo || ""}
                    </small>
                </td>

                <td>${producto.categoria || "-"}</td>

                <td>${producto.marca || "-"}</td>

                <td>USD ${producto.precio ?? 0}</td>

                <td>${producto.stock ?? 0}</td>

                <td>
                    ${
                        producto.disponibilidad
                            ? `<span class="badge text-bg-success">Disponible</span>`
                            : `<span class="badge text-bg-secondary">No disponible</span>`
                    }
                </td>

                <td>
                    <button
                        class="btn btn-sm btn-outline-primary btn-editar"
                        data-id="${documento.id}">
                        Editar
                    </button>

                    <button
                        class="btn btn-sm btn-outline-danger btn-eliminar"
                        data-id="${documento.id}">
                        Eliminar
                    </button>
                </td>
            `;

            tablaProductos.appendChild(fila);

        });

        console.log(
            `Productos cargados correctamente: ${productosSnap.size}`
        );

    } catch (error) {

        console.error("Error al cargar productos:", error);

        tablaProductos.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    No se pudieron cargar los productos.
                </td>
            </tr>
        `;
    }
}


cargarProductos();

const btnNuevoProducto = document.querySelector("#btnNuevoProducto");
const formularioProducto = document.querySelector("#formularioProducto");
const btnCancelarProducto = document.querySelector("#btnCancelarProducto");

btnNuevoProducto.addEventListener("click", () => {
    formularioProducto.classList.remove("d-none");
});

btnCancelarProducto.addEventListener("click", () => {
    formularioProducto.classList.add("d-none");

    formProducto.reset();

    productoEditandoId = null;

    document.querySelector("#disponibilidad").checked = true;

    document.querySelector("#formularioProducto h3").textContent =
        "Nuevo producto";

    document.querySelector(
        '#formProducto button[type="submit"]'
    ).textContent = "Guardar producto";

    mensajeProducto.innerHTML = "";
});

const formProducto = document.querySelector("#formProducto");
const mensajeProducto = document.querySelector("#mensajeProducto");

formProducto.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const caracteristicasTexto =
            document.querySelector("#caracteristicas").value;

        const caracteristicas = caracteristicasTexto
            .split("\n")
            .map(caracteristica => caracteristica.trim())
            .filter(caracteristica => caracteristica !== "");

        const producto = {
            nombre: document.querySelector("#nombre").value.trim(),
            categoria: document.querySelector("#categoria").value,
            marca: document.querySelector("#marca").value.trim(),
            modelo: document.querySelector("#modelo").value.trim(),
            descripcion: document.querySelector("#descripcion").value.trim(),
            precio: Number(document.querySelector("#precio").value),
            stock: Number(document.querySelector("#stock").value),
            imagen: document.querySelector("#imagen").value.trim(),
            caracteristicas: caracteristicas,
            disponibilidad: document.querySelector("#disponibilidad").checked
        };

        if (productoEditandoId) {
            await updateDoc(
                doc(db, "productos", productoEditandoId),
                producto
            );
        } else {
            await addDoc(collection(db, "productos"), producto);
        }

        const mensaje = productoEditandoId
            ? "Producto actualizado correctamente."
            : "Producto agregado correctamente.";

        mensajeProducto.innerHTML = `
            <div class="alert alert-success">
                ${mensaje}
            </div>
        `;

        formProducto.reset();

        productoEditandoId = null;

        document.querySelector("#disponibilidad").checked = true;

        document.querySelector("#formularioProducto h3").textContent =
            "Nuevo producto";

        document.querySelector(
            '#formProducto button[type="submit"]'
        ).textContent = "Guardar producto";

        await cargarProductos();
        formularioProducto.classList.add("d-none");
        mensajeProducto.innerHTML = "";

    } catch (error) {

        console.error("Error al guardar el producto:", error);

        mensajeProducto.innerHTML = `
            <div class="alert alert-danger">
                No se pudo guardar el producto.
            </div>
        `;
    }
});

tablaProductos.addEventListener("click", async (event) => {
    const botonEditar = event.target.closest(".btn-editar");

    if (!botonEditar) {
        return;
    }

    const id = botonEditar.dataset.id;

    try {
        const productosSnap = await getDocs(collection(db, "productos"));

        const documento = productosSnap.docs.find(
            producto => producto.id === id
        );

        if (!documento) {
            alert("No se encontró el producto.");
            return;
        }

        const producto = documento.data();

        productoEditandoId = id;

        document.querySelector("#nombre").value = producto.nombre || "";
        document.querySelector("#categoria").value = producto.categoria || "";
        document.querySelector("#marca").value = producto.marca || "";
        document.querySelector("#modelo").value = producto.modelo || "";
        document.querySelector("#descripcion").value = producto.descripcion || "";
        document.querySelector("#precio").value = producto.precio ?? 0;
        document.querySelector("#stock").value = producto.stock ?? 0;
        document.querySelector("#imagen").value = producto.imagen || "";
        document.querySelector("#caracteristicas").value =
            (producto.caracteristicas || []).join("\n");
        document.querySelector("#disponibilidad").checked =
            producto.disponibilidad ?? true;

        document.querySelector("#formularioProducto").classList.remove("d-none");

        document.querySelector("#formularioProducto h3").textContent =
            "Editar producto";

        document.querySelector(
            '#formProducto button[type="submit"]'
        ).textContent = "Guardar cambios";

        mensajeProducto.innerHTML = "";

        document.querySelector("#formularioProducto").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {
        console.error("Error al cargar el producto:", error);
        alert("No se pudieron cargar los datos del producto.");
    }
});

tablaProductos.addEventListener("click", async (event) => {
    const botonEliminar = event.target.closest(".btn-eliminar");

    if (!botonEliminar) {
        return;
    }

    const id = botonEliminar.dataset.id;

    const confirmar = confirm(
        "¿Estás segura de que querés eliminar este producto? Esta acción no se puede deshacer."
    );

    if (!confirmar) {
        return;
    }

    try {
        await deleteDoc(doc(db, "productos", id));

        alert("Producto eliminado correctamente.");

        await cargarProductos();

    } catch (error) {
        console.error("Error al eliminar el producto:", error);

        alert("No se pudo eliminar el producto.");
    }
});