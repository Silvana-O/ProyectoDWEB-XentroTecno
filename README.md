# Xentro Tecno

## Estudiante

Silvana Ottonelli

## Descripción del proyecto

Xentro Tecno es un e-commerce dedicado a la venta de productos tecnológicos. El sitio permite explorar una selección de notebooks, monitores, periféricos, audio y accesorios tecnológicos, ofreciendo una interfaz moderna, clara y adaptable a distintos dispositivos.

Este proyecto fue desarrollado como parte del Taller Integrador de Sistemas – Desarrollo Web.

## Público objetivo

* Estudiantes.
* Profesionales.
* Personas interesadas en tecnología.
* Usuarios que buscan productos informáticos para estudio, trabajo o entretenimiento.

## Categorías de productos

* Notebooks
* Monitores
* Periféricos
* Audio
* Accesorios tecnológicos

## Tecnologías utilizadas

* HTML5
* CSS3
* Bootstrap 5
* JavaScript
* Git
* GitHub

## Estructura del proyecto

```text
/

├── index.html
├── catalogo.html
├── producto.html
├── carrito.html
├── perfil.html
├── admin.html
│
├── css/
│   └── styles.css
│
├── js/
│   ├── base.js
│   ├── productos.js
│   ├── catalogo.js
│   ├── producto.js
│   └── carrito.js
│
└── img/
```

## Instrucciones de ejecución

1. Clonar el repositorio.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Ejecutar el proyecto utilizando Live Server.
4. Acceder a `index.html` desde el navegador.

## Funcionalidades desarrolladas en el Sprint 1

* Personalización de la identidad visual.
* Barra de navegación responsive.
* Hero principal.
* Productos destacados estáticos.
* Sección de beneficios.
* Footer.
* Diseño responsive.
* Uso de HTML semántico.
* Estilos personalizados mediante CSS y Bootstrap.
* Navegación entre las páginas del proyecto.

## Funcionalidades desarrolladas en el Sprint 2

### Catálogo dinámico

Los productos se representan mediante objetos JavaScript almacenados en un array dentro de `js/productos.js`.

Cada producto contiene información como:

* ID.
* Nombre.
* Descripción.
* Categoría.
* Precio.
* Stock.
* Imagen.

El catálogo se genera dinámicamente a partir de este array.

### Búsqueda y filtros

El catálogo permite:

* Buscar productos por nombre.
* Filtrar productos por categoría.
* Combinar búsqueda y filtro.
* Mostrar un mensaje cuando no existen resultados.
* Limpiar los filtros y volver a mostrar todos los productos.

Estas funcionalidades se gestionan mediante `js/catalogo.js`.

### Detalle dinámico de productos

La página `producto.html` utiliza el parámetro `id` de la URL para identificar el producto seleccionado.

Ejemplo:

```text
producto.html?id=p1
```

A partir del ID se obtiene la información correspondiente desde el array de productos.

La página muestra:

* Imagen.
* Nombre.
* Descripción.
* Categoría.
* Precio.
* Stock disponible.
* Selector de cantidad.

También se valida que la cantidad ingresada no sea menor que 1 ni superior al stock disponible.

Esta funcionalidad se implementa en `js/producto.js`.

### Carrito de compras

El carrito permite:

* Agregar productos desde el catálogo.
* Agregar productos desde la página de detalle.
* Aumentar la cantidad de un producto.
* Disminuir la cantidad.
* Eliminar productos.
* Controlar que la cantidad no supere el stock disponible.
* Mostrar el subtotal de cada producto.
* Calcular el total general.
* Mostrar un mensaje cuando el carrito está vacío.
* Continuar comprando y regresar al catálogo.
* Acceder al carrito después de agregar un producto.

La lógica del carrito se encuentra en `js/carrito.js`.

### Persistencia mediante LocalStorage

Los productos agregados al carrito se almacenan en `localStorage`, permitiendo conservar la información aunque se recargue la página o se cierre y vuelva a abrir el navegador.

Para guardar y recuperar la información se utilizan:

* `JSON.stringify()`
* `JSON.parse()`
* `localStorage.setItem()`
* `localStorage.getItem()`

Los datos almacenados corresponden a los productos seleccionados y sus respectivas cantidades.

El stock original de los productos no se modifica al agregarlos al carrito. La validación impide seleccionar una cantidad superior al stock disponible, pero el stock no se descuenta hasta una eventual confirmación de compra.

## Organización de los archivos JavaScript

* `base.js`: funcionalidades generales compartidas por las páginas.
* `productos.js`: contiene el array con los productos.
* `catalogo.js`: genera el catálogo y gestiona búsqueda, filtros y agregado al carrito.
* `producto.js`: gestiona el detalle dinámico de cada producto y el agregado al carrito.
* `carrito.js`: gestiona los productos almacenados en el carrito, cantidades, eliminación y cálculo de totales.

## Decisiones de diseño

* Se seleccionó una identidad visual basada principalmente en tonos azules, celestes y turquesa para transmitir confianza, tecnología e innovación.
* Se utilizó Bootstrap para facilitar el diseño responsive.
* Se eligieron imágenes representativas de productos tecnológicos.
* La interfaz fue diseñada para ser simple, clara y fácil de navegar.
* Las funcionalidades se fueron incorporando progresivamente de acuerdo con los objetivos establecidos para cada sprint.

## Funcionalidades pendientes

Las siguientes funcionalidades corresponden a próximos sprints:

* Inicio de sesión.
* Registro de usuarios.
* Firebase Authentication.
* Cloud Firestore.
* Panel de administración.
* Operaciones CRUD.
* Gestión de usuarios y roles.
* Otras funcionalidades definidas para las siguientes etapas del proyecto.

## Estado del proyecto

### Sprint 1

Completado.

### Sprint 2

Completado:

* Catálogo dinámico.
* Búsqueda y filtros.
* Detalle dinámico de productos.
* Validación de stock.
* Carrito de compras.
* Modificación y eliminación de productos.
* Cálculo de subtotales y total.
* Persistencia mediante LocalStorage.
* Agregado de productos desde catálogo y detalle.

### Próximo sprint

Se continuará con las funcionalidades correspondientes a autenticación, usuarios, Firebase y administración, de acuerdo con la planificación del proyecto.
