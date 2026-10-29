# Xentro Tecno

## 1. Información del proyecto

**Estudiante:** Silvana Ottonelli

**Asignatura:** Desarrollo Web

**Tipo de proyecto:** E-commerce de productos tecnológicos

**Sitio web:** https://xentrotecno-e95f2.web.app/

## 2. Descripción

Xentro Tecno es una aplicación web de comercio electrónico orientada a la venta de productos tecnológicos. Permite explorar un catálogo de notebooks, monitores, periféricos, productos de audio y accesorios tecnológicos, consultar los detalles de cada producto, gestionar un carrito y realizar un proceso de compra con pago simulado.

El proyecto se desarrolló de forma progresiva a lo largo de distintos sprints, incorporando una interfaz responsive, búsqueda y filtros, autenticación de usuarios, almacenamiento de información en la nube, gestión de productos, historial de pedidos y validaciones del proceso de compra.

## 3. Público objetivo

- Estudiantes.
- Profesionales.
- Personas interesadas en la tecnología.
- Usuarios que buscan productos informáticos para estudiar, trabajar o entretenerse.

## 4. Tecnologías y servicios utilizados

- **HTML5:** estructura y contenido de las páginas.
- **CSS3:** estilos y personalización visual.
- **Bootstrap 5.3.3:** componentes y diseño responsive.
- **JavaScript:** lógica e interactividad de la aplicación.
- **Firebase Authentication:** registro e inicio de sesión.
- **Cloud Firestore:** almacenamiento y consulta de datos.
- **LocalStorage:** persistencia del carrito en el navegador.
- **Git y GitHub:** control de versiones y alojamiento del código.
- **Firebase Hosting:** publicación de la aplicación web.

## 5. Estructura del proyecto

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
├── firebase.json
├── .firebaserc
├── css/
│   └── styles.css
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
│   └── firebase/
│       ├── config.js
│       └── exportar-productos.js
├── img/
│   └── Imágenes de productos
└── README.md
```

## 6. Funcionalidades de la aplicación

### 6.1. Inicio y diseño visual

- Identidad visual propia para Xentro Tecno.
- Barra de navegación responsive.
- Sección principal de presentación.
- Productos destacados.
- Sección de beneficios.
- Pie de página con información y enlaces.
- Diseño adaptable a distintos tamaños de pantalla.
- Uso de HTML semántico, Bootstrap y estilos personalizados.

### 6.2. Catálogo de productos

El catálogo obtiene los productos almacenados en Cloud Firestore y presenta su información de forma dinámica.

Cada producto puede incluir:

- Nombre y descripción.
- Categoría.
- Precio.
- Stock disponible.
- Estado de disponibilidad.
- Imagen.
- Marca y modelo.
- Características.

El catálogo incorpora las siguientes funcionalidades:

- Búsqueda por nombre y otros datos del producto.
- Búsqueda por descripción, categoría, marca y modelo.
- Reconocimiento de términos equivalentes, como monitor/pantalla, mouse/ratón y notebook/laptop.
- Filtros por categoría.
- Combinación de búsqueda y filtros.
- Mensajes cuando no existen resultados.
- Visualización únicamente de productos habilitados para la venta.

### 6.3. Detalle de producto

La página `producto.html` presenta la información del producto seleccionado mediante el parámetro `id` de la URL.

Ejemplo:

```text
producto.html?id=p1
```

Permite consultar los datos del producto, seleccionar una cantidad y agregarlo al carrito, respetando las validaciones de disponibilidad y stock implementadas.

### 6.4. Carrito de compras

El carrito permite:

- Agregar productos desde el catálogo y desde su página de detalle.
- Aumentar o disminuir cantidades.
- Eliminar productos.
- Validar las cantidades según el stock disponible.
- Calcular subtotales y el importe total.
- Mostrar un mensaje cuando está vacío.
- Continuar comprando o avanzar al proceso de compra.
- Mantener los productos seleccionados al recargar la página.

La información del carrito se conserva mediante `LocalStorage`. Los datos guardados identifican los productos seleccionados y sus cantidades; los precios, las imágenes y el stock se consultan desde Firestore.

Agregar productos al carrito no descuenta por sí mismo el stock. La actualización se gestiona durante el proceso de compra.

### 6.5. Registro, inicio y cierre de sesión

La autenticación se implementa mediante Firebase Authentication.

La aplicación permite:

- Registrar usuarios con correo electrónico y contraseña.
- Validar los campos del formulario.
- Comprobar que las contraseñas coincidan.
- Validar la longitud mínima de la contraseña.
- Iniciar sesión con credenciales registradas.
- Mantener la sesión según la persistencia configurada.
- Cerrar sesión.
- Mostrar mensajes ante errores de autenticación.

### 6.6. Navegación según el usuario

La navegación se adapta al estado de autenticación.

Cuando el usuario inicia sesión, se actualizan las opciones disponibles y se muestra su información en el menú. También se habilita el acceso a las secciones que correspondan a su rol.

La aplicación diferencia entre clientes y administradores. La protección de las páginas y de las operaciones administrativas debe complementarse con las reglas de seguridad de Firestore.

### 6.7. Perfil e historial de pedidos

La página `perfil.html` permite consultar la información básica del usuario autenticado y acceder a su historial de compras.

El perfil incluye:

- Nombre del usuario.
- Correo electrónico.
- Historial de pedidos.
- Acceso a las funcionalidades relacionadas con las compras y reseñas disponibles.
- Opción para cerrar sesión.

El historial permite consultar información de los pedidos, como su número, fecha, estado, productos, cantidades, precios, subtotales e importe total.

Los pedidos deben consultarse asociados al usuario autenticado.

### 6.8. Panel de administración

La página `admin.html` incorpora herramientas para gestionar el catálogo de productos.

El panel permite:

- Consultar los productos registrados.
- Crear productos.
- Editar productos existentes.
- Eliminar productos.
- Modificar nombres, categorías, marcas y modelos.
- Actualizar descripciones y características.
- Gestionar precios, imágenes, stock y disponibilidad.
- Visualizar los productos en una tabla adaptable.

Las operaciones se implementan mediante JavaScript y se conectan con Cloud Firestore.

El acceso al panel está restringido a usuarios con rol de administrador. La aplicación verifica la autenticación y los permisos antes de mostrar el contenido administrativo, y redirige a los usuarios que no están autorizados.

### 6.9. Proceso de compra

El proceso de compra integra el carrito con Firestore y contempla:

- Recuperación de los productos seleccionados.
- Validación de cantidades.
- Comprobación del stock disponible.
- Verificación del precio vigente.
- Comprobación de que los productos estén habilitados para la venta.
- Registro del pedido.
- Asignación de un número correlativo.
- Actualización del stock.
- Continuación al proceso de pago simulado.

Las validaciones buscan evitar que se registren compras con productos deshabilitados, cantidades superiores al stock o precios que no coincidan con los datos vigentes.

### 6.10. Pago simulado y confirmación

La página `pago.html` forma parte del flujo de compra y permite realizar una simulación del pago con fines académicos.

La aplicación no realiza cobros financieros reales.

Después del proceso, `confirmacion.html` consulta y presenta la información del pedido, incluyendo el número de compra, los productos, las cantidades y el importe total, de acuerdo con los datos registrados.

### 6.11. Reseñas de productos

La aplicación incorpora la colección `resenas` en Firestore para almacenar reseñas y valoraciones relacionadas con los productos.

Se realizaron mejoras para facilitar el acceso a las reseñas desde el historial de pedidos, identificar productos que ya fueron reseñados y evitar la duplicación del mensaje de confirmación.

Las operaciones disponibles están sujetas a las validaciones de la aplicación y a las reglas de seguridad configuradas para la colección.

## 7. Roles de usuario

La aplicación contempla dos roles:

**Cliente**

- Consultar el catálogo y los detalles de los productos.
- Buscar y filtrar productos.
- Gestionar el carrito.
- Realizar el proceso de compra simulado.
- Consultar su perfil e historial de pedidos.
- Acceder a las funcionalidades de reseñas disponibles.

**Administrador**

- Acceder al panel de administración.
- Consultar los productos registrados.
- Crear, editar y eliminar productos.
- Modificar precios, stock, disponibilidad e información descriptiva.

El rol se almacena en el documento correspondiente al usuario en Cloud Firestore. El registro público no debe permitir que una persona se asigne el rol de administrador a sí misma. Este rol se asigna únicamente a las cuentas autorizadas.

## 8. Base de datos y seguridad

La aplicación utiliza Cloud Firestore para almacenar y consultar la información.

Las principales colecciones son:

| Colección | Finalidad |
|---|---|
| `usuarios` | Información complementaria de los usuarios y sus roles. |
| `productos` | Datos del catálogo, precios, disponibilidad y stock. |
| `pedidos` | Información de las compras registradas. |
| `contadores` | Numeración correlativa de pedidos. |
| `resenas` | Reseñas y valoraciones de productos. |

La configuración de Firebase se encuentra en `js/firebase/config.js`.

El archivo `firestore.rules` contiene las reglas de acceso a la base de datos. Estas deben establecer permisos acordes con cada operación, incluyendo:

- Lectura del catálogo según los permisos definidos.
- Restricción de las operaciones administrativas sobre productos.
- Protección de la información de los usuarios.
- Acceso de cada cliente únicamente a sus propios pedidos.
- Validaciones para las operaciones de compra y actualización del stock.
- Permisos para crear y consultar reseñas.

Las validaciones realizadas en JavaScript mejoran la experiencia del usuario, pero no sustituyen las reglas de seguridad de Firestore.

## 9. Organización de los archivos JavaScript

| Archivo | Responsabilidad |
|---|---|
| `base.js` | Funcionalidades generales compartidas por las páginas. |
| `productos.js` | Datos iniciales del catálogo. |
| `catalogo.js` | Consulta, visualización, búsqueda y filtros del catálogo. |
| `producto.js` | Detalle dinámico de los productos. |
| `carrito.js` | Gestión del carrito, cantidades y cálculos. |
| `auth.js` | Registro, inicio de sesión y cierre de sesión. |
| `auth-nav.js` | Actualización de la navegación según la sesión y el usuario. |
| `perfil.js` | Información del perfil e historial de pedidos. |
| `admin.js` | Verificación de autenticación y permisos administrativos. |
| `admin-productos.js` | Operaciones de administración del catálogo. |
| `pago.js` | Lógica del pago simulado. |
| `confirmacion.js` | Consulta y presentación del pedido confirmado. |
| `firebase/config.js` | Inicialización de Firebase y acceso a sus servicios. |
| `firebase/exportar-productos.js` | Herramienta para cargar los productos iniciales en Firestore. |

## 10. Desarrollo por sprints

### Sprint 1: estructura y diseño

- Creación de la identidad visual.
- Estructura de las páginas.
- Navegación entre secciones.
- Productos destacados.
- Sección de beneficios y pie de página.
- Estilos personalizados y diseño responsive.

### Sprint 2: catálogo y carrito

- Catálogo dinámico.
- Búsqueda y filtros.
- Detalle dinámico de productos.
- Validaciones de stock.
- Carrito de compras.
- Modificación y eliminación de productos del carrito.
- Cálculo de subtotales y total.
- Persistencia del carrito mediante LocalStorage.

### Sprint 3: autenticación e integración con Firebase

- Registro e inicio de sesión.
- Integración con Firebase Authentication.
- Integración con Cloud Firestore.
- Migración del catálogo a la base de datos.
- Navegación según el estado de autenticación.
- Perfil e historial de pedidos.
- Panel administrativo y operaciones CRUD.
- Reglas de seguridad de Firestore.
- Registro y numeración de pedidos.
- Proceso de compra y pago simulado.
- Confirmación de compra.
- Incorporación de reseñas de productos.
- Mejoras de navegación y diseño responsive.

### Sprint 4: mejoras y validaciones

- Mejora visual de la página de perfil.
- Mejoras en el acceso a las reseñas desde el historial de pedidos.
- Corrección de la identificación de productos ya reseñados.
- Corrección de la duplicación del mensaje de confirmación.
- Corrección del funcionamiento de la incorporación de productos al carrito.
- Ajuste del catálogo para mostrar únicamente productos habilitados.
- Validaciones para impedir la compra de productos deshabilitados.
- Refuerzo de las comprobaciones de precio y stock durante el proceso de compra.
- Revisión de las reglas de Firestore relacionadas con el stock y las operaciones de compra.
- Mejoras en la protección del panel administrativo.
- Actualización de la documentación del proyecto.
- Publicación de la aplicación mediante Firebase Hosting.

## 11. Decisiones de diseño

- Se utilizó una identidad visual basada en tonos azules, celestes y turquesa.
- Se incorporó la tipografía Poppins para mantener una presentación coherente.
- Se empleó Bootstrap para facilitar la adaptación a distintos dispositivos.
- Se diseñó una interfaz clara y orientada a la navegación por productos.
- Se separó la lógica JavaScript en archivos específicos para facilitar el mantenimiento.
- Se incorporó Firebase para la autenticación y la persistencia de datos en la nube.
- Se utilizaron reglas de Firestore como mecanismo de control de acceso a los datos.
- Las funcionalidades se incorporaron progresivamente según los objetivos de cada sprint.

## 12. Limitaciones conocidas

- El proceso de pago es una simulación académica y no realiza cobros reales.
- La aplicación está desarrollada con fines educativos y no constituye por sí sola una plataforma preparada para operar como comercio electrónico de producción.
- La seguridad de las operaciones depende de la correcta configuración y publicación de las reglas de Firestore.
- El funcionamiento integral debe comprobarse en el entorno publicado, incluyendo autenticación, permisos, compras, actualización de stock, reseñas y navegación en dispositivos móviles.
- La recuperación de contraseña, la verificación de correo electrónico y los pagos reales no forman parte del alcance documentado del proyecto.

## 13. Cuentas de evaluación

Para comprobar los permisos de los distintos roles, se deben utilizar cuentas creadas exclusivamente para la evaluación.

| Rol | Correo electrónico | 
|---|---|
| Cliente | cliente_prueba@gmail.com |
| Administrador | admin_prueba@gmail.com | 

Las contraseñas se deben compartir por un medio acordado con el docente y no publicarse en el repositorio.

## 14. Publicación

La aplicación está publicada mediante Firebase Hosting.

**Enlace al sitio web:** https://xentrotecno-e95f2.web.app/

**Proyecto de Firebase:** `xentrotecno-e95f2`

La URL pública permite acceder a la aplicación desplegada. Los cambios realizados en el código deben publicarse nuevamente en Firebase Hosting para que se reflejen en el sitio.


