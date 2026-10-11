**# Xentro Tecno**

**## Estudiante**

Silvana Ottonelli

**## Descripción del proyecto**

Xentro Tecno es un e-commerce dedicado a la venta de productos tecnológicos. El sitio permite explorar una selección de notebooks, monitores, periféricos, audio y accesorios tecnológicos, ofreciendo una interfaz moderna, clara y adaptable a distintos dispositivos.

Este proyecto fue desarrollado como parte del proyecto académico de Desarrollo Web. A lo largo de los distintos sprints, evolucionó desde un catálogo dinámico con almacenamiento local hasta una aplicación integrada con Firebase, con autenticación de usuarios, gestión de productos, administración de pedidos y un proceso de compra con pago simulado.

**## Público objetivo**

* Estudiantes.
* Profesionales.
* Personas interesadas en tecnología.
* Usuarios que buscan productos informáticos para estudio, trabajo o entretenimiento.

**## Categorías de productos**

* Notebooks.
* Monitores.
* Periféricos.
* Audio.
* Accesorios tecnológicos.

**## Tecnologías utilizadas**

* HTML5.
* CSS3.
* Bootstrap 5.3.3.
* JavaScript.
* Firebase Authentication.
* Cloud Firestore.
* LocalStorage.
* Git.
* GitHub.

**## Estructura del proyecto**

```text
/

├── index.html
├── catalogo.html
├── producto.html
├── carrito.html
├── login.html
├── perfil.html
├── admin.html
├── pago.html
├── confirmacion.html
├── firestore.rules
│
├── css/
│   └── styles.css
│
├── js/
│   ├── base.js
│   ├── productos.js
│   ├── catalogo.js
│   ├── producto.js
│   ├── carrito.js
│   ├── auth.js
│   ├── auth-nav.js
│   ├── perfil.js
│   ├── admin.js
│   ├── admin-productos.js
│   ├── pago.js
│   ├── confirmacion.js
│   │
│   └── firebase/
│       ├── config.js
│       └── exportar-productos.js
│
├── img/
│   └── Imágenes de productos
│
└── README.md
```

**## Funcionalidades desarrolladas en el Sprint 1**

* Personalización de la identidad visual.
* Barra de navegación responsive.
* Hero principal.
* Productos destacados.
* Sección de beneficios.
* Footer.
* Diseño responsive.
* Uso de HTML semántico.
* Estilos personalizados mediante CSS y Bootstrap.
* Navegación entre las páginas del proyecto.

**## Funcionalidades desarrolladas en el Sprint 2**

**### Catálogo dinámico**

Inicialmente, los productos se representaban mediante objetos JavaScript almacenados en un array dentro de `js/productos.js`. Posteriormente, el catálogo se amplió y se integró con Cloud Firestore para consultar los productos almacenados en la base de datos.

Cada producto contiene información como:

* ID.
* Nombre.
* Descripción.
* Categoría.
* Precio.
* Stock.
* Disponibilidad.
* Imagen.
* Marca.
* Modelo.
* Características.

El catálogo se genera dinámicamente a partir de los datos disponibles.

**### Búsqueda y filtros**

El catálogo permite:

* Buscar productos por nombre.
* Buscar por descripción, categoría, marca y modelo.
* Reconocer términos equivalentes, como monitor/pantalla, mouse/ratón y notebook/laptop.
* Filtrar productos por categoría.
* Combinar la búsqueda con los filtros.
* Mostrar un mensaje cuando no existen resultados.
* Limpiar los filtros y volver a mostrar los productos.

Estas funcionalidades se gestionan mediante `js/catalogo.js`.

**### Detalle dinámico de productos**

La página `producto.html` utiliza el parámetro `id` de la URL para identificar el producto seleccionado.

Ejemplo:

```text
producto.html?id=p1
```

A partir del identificador se obtiene la información correspondiente al producto.

La página permite consultar:

* Imagen.
* Nombre.
* Descripción.
* Categoría.
* Precio.
* Stock disponible.
* Marca.
* Modelo.
* Características.

También permite seleccionar cantidades y continuar con el proceso de compra, respetando las validaciones de stock implementadas.

Esta funcionalidad se implementa en `js/producto.js`.

**### Carrito de compras**

El carrito permite:

* Agregar productos desde el catálogo.
* Agregar productos desde la página de detalle.
* Aumentar y disminuir cantidades.
* Eliminar productos.
* Controlar que la cantidad seleccionada no supere el stock disponible.
* Mostrar el subtotal de cada producto.
* Calcular el total general.
* Mostrar un mensaje cuando el carrito está vacío.
* Continuar comprando y regresar al catálogo.
* Acceder al carrito después de agregar un producto.
* Continuar con el proceso de compra.

La lógica del carrito se encuentra en `js/carrito.js`.

**### Persistencia mediante LocalStorage**

Los productos agregados al carrito se almacenan en `localStorage`, permitiendo conservar la información aunque se recargue la página o se cierre y vuelva a abrir el navegador.

Para guardar y recuperar la información se utilizan:

* `JSON.stringify()`.
* `JSON.parse()`.
* `localStorage.setItem()`.
* `localStorage.getItem()`.

Los datos almacenados corresponden a los productos seleccionados y sus respectivas cantidades.

El stock original no se descuenta simplemente por agregar productos al carrito. La actualización del stock se integra con el proceso de compra.

**## Funcionalidades desarrolladas en el Sprint 3**

**### Registro e inicio de sesión**

La autenticación de usuarios se implementa mediante Firebase Authentication.

La página `login.html` centraliza las opciones de registro e inicio de sesión.

El sistema permite:

* Registrar usuarios con correo electrónico y contraseña.
* Validar los campos obligatorios.
* Comprobar que las contraseñas coincidan.
* Validar la longitud mínima de la contraseña.
* Iniciar sesión con credenciales registradas.
* Mantener la sesión mediante la persistencia configurada.
* Cerrar sesión.
* Mostrar mensajes ante errores de autenticación.
* Redirigir al usuario a las páginas correspondientes según el estado de su sesión.

Estas funcionalidades se gestionan mediante `js/auth.js`.

**### Integración con Cloud Firestore**

Se incorporó Cloud Firestore para almacenar y consultar información de la aplicación.

Las principales colecciones utilizadas son:

* `usuarios`: información complementaria de los usuarios y sus roles.
* `productos`: datos del catálogo y stock disponible.
* `pedidos`: información de las compras registradas.
* `contadores`: numeración correlativa de pedidos.
* `resenas`: reseñas y valoraciones de productos.

Los productos pueden incluir campos como nombre, descripción, categoría, precio, stock, disponibilidad, imagen, marca, modelo y características.

La configuración de Firebase se encuentra en `js/firebase/config.js`.

El archivo `js/firebase/exportar-productos.js` permite cargar en Firestore los productos definidos inicialmente en JavaScript.

**### Navegación según el estado de autenticación**

La navegación se adapta al estado de la sesión del usuario.

Permite:

* Mostrar las opciones correspondientes al usuario autenticado.
* Presentar información del usuario en el menú.
* Acceder a las secciones disponibles.
* Cerrar sesión desde el menú.
* Mantener una navegación coherente entre las páginas del sitio.

Esta funcionalidad se implementa mediante `js/auth-nav.js`.

**### Perfil de usuario**

La página `perfil.html` permite consultar los datos básicos del usuario autenticado.

Incluye:

* Nombre del usuario.
* Correo electrónico.
* Acceso al historial de pedidos.
* Opción para cerrar sesión.

Si el usuario no está autenticado, se lo redirige al inicio de sesión.

La lógica del perfil se encuentra en `js/perfil.js`.

**### Panel de administración**

La página `admin.html` incorpora funcionalidades para la administración de productos.

El sistema contempla:

* Visualización de los productos registrados.
* Alta de nuevos productos.
* Edición de productos existentes.
* Eliminación de productos.
* Gestión de nombres, categorías, marcas y modelos.
* Actualización de descripciones y características.
* Gestión de precios, imágenes, stock y disponibilidad.
* Presentación de los productos en una tabla adaptable a diferentes tamaños de pantalla.

La lógica de acceso administrativo se encuentra en `js/admin.js`, mientras que las operaciones sobre los productos se gestionan mediante `js/admin-productos.js`.

El acceso se vincula con el rol del usuario almacenado en Firestore. Los permisos también deben estar controlados mediante las reglas de seguridad de la base de datos.

**### Reglas de seguridad de Firestore**

El archivo `firestore.rules` define los permisos de acceso a las colecciones de la base de datos.

Las reglas contemplan:

* Acceso a la información de los usuarios.
* Lectura pública del catálogo.
* Restricciones para las operaciones administrativas sobre productos.
* Acceso de los usuarios a sus propios pedidos.
* Validaciones relacionadas con el registro de compras y la actualización del stock.
* Permisos para las reseñas.

Las reglas constituyen una capa de protección independiente de las validaciones realizadas en JavaScript.

**## Funcionalidades desarrolladas posteriormente**

**### Proceso de compra**

Se incorporó un flujo de compra integrado con Firestore para registrar los pedidos y gestionar la actualización del stock.

El proceso contempla:

* Recuperación de los productos seleccionados.
* Validación de las cantidades y del stock disponible.
* Cálculo de los importes de la compra.
* Registro del pedido en Firestore.
* Asignación de un número correlativo al pedido.
* Actualización del stock de los productos.
* Continuación hacia el proceso de pago simulado.

**### Pago simulado**

La página `pago.html`, junto con `js/pago.js`, forma parte del proceso de compra.

La funcionalidad permite realizar una simulación del pago con fines académicos, sin efectuar cargos financieros reales.

El flujo contempla el registro del resultado de la operación y su integración con la confirmación del pedido.

**### Confirmación de compra**

La página `confirmacion.html` presenta los datos del pedido después del proceso de compra.

Incluye:

* Recuperación del identificador del pedido.
* Consulta de la información almacenada en Firestore.
* Verificación de que el pedido corresponde al usuario autenticado.
* Comprobación del estado del pedido.
* Visualización del número de pedido.
* Presentación de los productos y sus cantidades.
* Visualización del importe total.

Esta funcionalidad se implementa mediante `js/confirmacion.js`.

**### Historial de pedidos**

El perfil del usuario incorpora un historial de compras consultado desde Firestore.

Permite visualizar información como:

* Número de pedido.
* Fecha.
* Estado.
* Productos incluidos.
* Cantidades.
* Precios y subtotales.
* Importe total.

Los pedidos se consultan según la identificación del usuario autenticado.

**### Reseñas de productos**

Se incorporó la colección `resenas` en Firestore para almacenar reseñas y valoraciones relacionadas con los productos.

Las operaciones permitidas dependen de las reglas de seguridad configuradas para esta colección.

**## Organización de los archivos JavaScript**

* `base.js`: funcionalidades generales compartidas por las páginas.
* `productos.js`: contiene el array de productos utilizado como catálogo inicial.
* `catalogo.js`: consulta y genera el catálogo, y gestiona las búsquedas y los filtros.
* `producto.js`: gestiona el detalle dinámico de cada producto.
* `carrito.js`: administra el carrito, las cantidades y los cálculos de los importes.
* `auth.js`: gestiona el registro y el inicio de sesión.
* `auth-nav.js`: actualiza la navegación según el estado de autenticación.
* `perfil.js`: muestra la información del usuario y su historial de pedidos.
* `admin.js`: gestiona el control de acceso a la sección administrativa.
* `admin-productos.js`: implementa las operaciones de administración del catálogo.
* `pago.js`: gestiona la lógica del pago simulado.
* `confirmacion.js`: consulta y muestra los datos del pedido confirmado.
* `firebase/config.js`: inicializa Firebase y exporta los servicios de autenticación y base de datos.
* `firebase/exportar-productos.js`: permite cargar los productos iniciales en Firestore.

**## Decisiones de diseño**

* Se seleccionó una identidad visual basada principalmente en tonos azules, celestes y turquesa para transmitir confianza, tecnología e innovación.
* Se utilizó Bootstrap para facilitar el diseño responsive.
* Se eligió la tipografía Poppins para mantener una identidad visual coherente.
* Se seleccionaron imágenes representativas de productos tecnológicos.
* Se trabajó en una interfaz simple, clara y fácil de navegar.
* Se incorporaron componentes adaptables a dispositivos móviles.
* Se separaron las funcionalidades en archivos JavaScript para facilitar su organización y mantenimiento.
* Se incorporó Firebase para la autenticación y la persistencia de datos en la nube.
* Se utilizaron reglas de seguridad de Firestore para establecer permisos de acceso.
* Las funcionalidades se incorporaron progresivamente de acuerdo con los objetivos establecidos para cada sprint.

**## Funcionalidades pendientes y mejoras**

Entre los aspectos que pueden requerir revisión o ampliación se encuentran:

* Verificación integral de las reglas de seguridad de Firestore.
* Protección del rol de administrador para impedir modificaciones no autorizadas.
* Validación de las operaciones sobre pedidos, contadores y reseñas.
* Revisión del tratamiento seguro de los datos mostrados en la interfaz.
* Pruebas integrales del proceso de compra, la actualización del stock y la confirmación del pedido.
* Verificación del funcionamiento de todas las páginas y de la navegación en dispositivos móviles.

La implementación de pagos reales y la adaptación del sistema para operar como un comercio electrónico de producción quedan fuera del alcance del pago simulado académico.

**## Estado del proyecto**

**### Sprint 1**

Completado.

* Identidad visual.
* Estructura de las páginas.
* Navegación.
* Productos destacados.
* Diseño responsive.
* Estilos personalizados.

**### Sprint 2**

Completado.

* Catálogo dinámico.
* Búsqueda y filtros.
* Detalle dinámico de productos.
* Validación de stock.
* Carrito de compras.
* Modificación y eliminación de productos.
* Cálculo de subtotales y total.
* Persistencia mediante LocalStorage.

**### Sprint 3 y funcionalidades posteriores**

Se incorporaron las siguientes funcionalidades:

* Registro e inicio de sesión.
* Integración con Firebase Authentication.
* Integración con Cloud Firestore.
* Migración de productos a la base de datos.
* Navegación según el estado de autenticación.
* Perfil e historial de pedidos.
* Panel de administración de productos.
* Operaciones CRUD del catálogo.
* Reglas de seguridad de Firestore.
* Registro y numeración de pedidos.
* Proceso de compra y pago simulado.
* Confirmación de compra.
* Colección para reseñas de productos.
* Mejoras en la navegación y en la interfaz responsive.


### Próximo sprint

Se continuará con las funcionalidades de acuerdo con la planificación del proyecto establecida por el docente.
No obstante se consideran las siguientes posibilidades de mejora:

**## Funcionalidades pendientes de mejora**

- **Diseño del perfil de usuario:** mejorar la presentación visual del perfil, organizar mejor los datos personales y destacar el historial de pedidos para facilitar su consulta.
- **Formulario de registro e inicio de sesión:** mejorar la apariencia de los formularios, la distribución de los campos y la adaptación a dispositivos móviles.
- **Visibilidad de la contraseña:** incorporar un botón con un ícono de ojo que permita mostrar u ocultar la contraseña mientras se escribe, tanto en el registro como en el inicio de sesión.
- **Criterios de contraseña:** informar claramente los requisitos de seguridad, como la longitud mínima y otros criterios definidos para las contraseñas, y validar su cumplimiento antes de registrar al usuario.
- **Validación de formularios:** mejorar los mensajes de error y las indicaciones junto a los campos para que el usuario pueda identificar y corregir los datos ingresados incorrectamente.
- **Recuperación de contraseña:** incorporar un mecanismo para restablecer la contraseña mediante el correo electrónico registrado.
- **Experiencia de usuario:** unificar los estilos, botones, mensajes de confirmación y alertas para mantener una apariencia coherente en todas las páginas.
- **Perfil y sesión:** mejorar la presentación de los datos de la cuenta, las opciones de cierre de sesión y la navegación entre el perfil, el catálogo y el historial de compras.
- **Seguridad y permisos:** revisar las reglas de Firestore para evitar modificaciones indebidas de roles, productos, pedidos y otros datos.
- **Gestión de productos:** continuar mejorando la administración del catálogo, el control del stock y la validación de los datos.
- **Proceso de compra:** mejorar el tratamiento de errores, la confirmación de pedidos y la actualización del stock.
- **Reseñas de productos:** reforzar las validaciones y los permisos para garantizar que los usuarios solo puedan gestionar sus propias reseñas.
- **Pruebas y mantenimiento:** comprobar el funcionamiento de las páginas y los formularios, corregir errores y verificar la adaptación del sitio a distintos tamaños de pantalla.
