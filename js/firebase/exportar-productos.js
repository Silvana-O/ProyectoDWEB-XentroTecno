import { db } from "./config.js";
import productos from "../productos.js";

import {
    collection,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

async function exportarProductos() {
    try {
        for (const producto of productos) {
            await setDoc(doc(collection(db, "productos"), producto.id), {
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                categoria: producto.categoria,
                precio: producto.precio,
                stock: producto.stock,
                disponibilidad: producto.stock > 0,
                imagen: producto.imagen,
                marca: producto.marca,
                modelo: producto.modelo,
                caracteristicas: producto.caracteristicas
            });

            console.log(`Producto exportado: ${producto.id} - ${producto.nombre}`);
        }

        console.log("Todos los productos fueron exportados correctamente.");
    } catch (error) {
        console.error("Error al exportar los productos:", error);
    }
}

exportarProductos();