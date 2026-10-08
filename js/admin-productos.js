import { db } from "./firebase/config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const tablaProductos = document.querySelector("#tablaProductos");


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