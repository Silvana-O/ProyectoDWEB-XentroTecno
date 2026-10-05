const productos = [

    {
        id: "p1",
        nombre: "JBL TUNE 780",
        descripcion: "Auriculares inalámbricos over-ear con cancelación de ruido, micrófono y conectividad Bluetooth.",
        categoria: "Audio",
        precio: 149,
        stock: 10,
        imagen: "img/auricular.jpg",
        marca: "JBL",
        modelo: "TUNE 780",
        caracteristicas: [
            "Conectividad inalámbrica",
            "Bluetooth 5.0",
            "Cancelación de ruido",
            "Micrófono integrado",
            "Modo manos libres",
            "Formato over-ear",
            "Asistentes de voz: Siri y Google Assistant",
            "Controles de reproducción, volumen, llamadas y canciones",
            "Conector mini jack",
            "Color blanco"
        ]
    },

    {
        id: "p2",
        nombre: "Lenovo IdeaPad 5X 2-in-1 Gen 11",
        descripcion: "Notebook convertible diseñada para trabajo, estudio y entretenimiento, con funciones de inteligencia artificial y pantalla táctil.",
        categoria: "Notebooks",
        precio: 1380,
        stock: 5,
        imagen: "img/lenovo-ideapad-5x.jpg",
        marca: "Lenovo",
        modelo: "IdeaPad 5X 2-in-1 Gen 11 (14\" Snapdragon)",
        caracteristicas: [
            "Procesador Snapdragon X2 Plus X2P-42-100",
            "Windows 11 Home Arm64",
            "16 GB de memoria LPDDR5X",
            "512 GB SSD M.2 PCIe Gen4",
            "Pantalla táctil de 14 pulgadas WUXGA (1920 x 1200)",
            "Gráficos integrados",
            "Cámara FHD IR 1080p con micrófono doble",
            "Batería de 60 Wh",
            "Wi-Fi 7 y Bluetooth 5.4",
            "Bisagra de 360°",
            "Teclado retroiluminado en español",
            "Color Luna Grey"
        ]
    },

    {
        id: "p3",
        nombre: "Lenovo IdeaPad Slim 3i",
        descripcion: "Notebook Lenovo diseñada para trabajo, estudio y uso cotidiano, con procesador Intel Core i5 y pantalla Full HD de 15,6 pulgadas.",
        categoria: "Notebooks",
        precio: 699,
        stock: 7,
        imagen: "img/notebook.jpg",
        marca: "Lenovo",
        modelo: "IdeaPad Slim 3i",
        caracteristicas: [
            "Procesador Intel Core i5-1355U",
            "16 GB de memoria RAM",
            "256 GB SSD",
            "Pantalla IPS de 15,6 pulgadas",
            "Resolución Full HD (1920 x 1080)",
            "Gráficos Intel Graphics integrados",
            "Windows 11 Home",
            "Cámara web integrada",
            "Micrófono integrado",
            "Wi-Fi y Bluetooth",
            "Salida para auriculares",
            "Pad numérico",
            "Color gris"
        ]
    },

    {
        id: "p4",
        nombre: "Logitech MX Master 3S",
        descripcion: "Mouse inalámbrico ergonómico de alta precisión, diseñado para trabajo y uso cotidiano.",
        categoria: "Periféricos",
        precio: 119,
        stock: 15,
        imagen: "img/mouse.jpg",
        marca: "Logitech",
        modelo: "MX Master 3S",
        caracteristicas: [
            "Sensor óptico Darkfield",
            "Resolución de 8000 dpi",
            "Conectividad inalámbrica",
            "Bluetooth",
            "7 botones",
            "Velocidad máxima de 7 ips",
            "Diseñado para usuarios diestros",
            "Peso de 141 g",
            "Compatible con Windows, macOS, Linux, Chrome OS, iPadOS y Android",
            "Sin cable",
            "Color grafito"
        ]
    },

    {
        id: "p5",
        nombre: "LG UltraWide 34WQ500-B",
        descripcion: "Monitor UltraWide de 34 pulgadas con panel IPS, resolución 2560 x 1080 y frecuencia de actualización de hasta 100 Hz.",
        categoria: "Monitores",
        precio: 329,
        stock: 8,
        imagen: "img/monitor.jpg",
        marca: "LG",
        modelo: "UltraWide 34WQ500-B",
        caracteristicas: [
            "Pantalla de 34 pulgadas",
            "Panel IPS LED",
            "Resolución 2560 x 1080",
            "Relación de aspecto 21:9",
            "Frecuencia de actualización de hasta 100 Hz",
            "Tiempo de respuesta de 5 ms",
            "Tecnología AMD FreeSync",
            "Pantalla antirreflejo",
            "Ángulo de visión de 178° horizontal y vertical",
            "Montaje VESA",
            "Reducción de luz azul",
            "Tecnología sin parpadeo",
            "Estabilización de negro",
            "Soporte reclinable",
            "Color negro"
        ]
    },

    {

        id: "p6",
        nombre: "Sony WH-CH720N",
        descripcion: "Auriculares inalámbricos over-ear con cancelación de ruido y batería de larga duración.",
        categoria: "Audio",
        precio: 129,
        stock: 12,
        imagen: "img/sony-wh-ch720n.jpg",
        marca: "Sony",
        modelo: "WH-CH720N",
        caracteristicas: [
            "Conectividad inalámbrica",
            "Bluetooth",
            "Cancelación de ruido",
            "Micrófono integrado",
            "Batería de larga duración",
            "Formato over-ear",
            "Control mediante botones",
            "Compatible con dispositivos móviles",
            "Color negro"
        ]
    },

    {
        id: "p7",
        nombre: "HyperX Cloud III",
        descripcion: "Auriculares gaming con micrófono desmontable y sonido envolvente para videojuegos y entretenimiento.",
        categoria: "Audio",
        precio: 99,
        stock: 10,
        imagen: "img/hyperx-cloud-iii.jpg",
        marca: "HyperX",
        modelo: "Cloud III",
        caracteristicas: [
            "Conexión mediante cable",
            "Sonido envolvente",
            "Micrófono desmontable",
            "Almohadillas de espuma viscoelástica",
            "Controles de volumen",
            "Compatible con PC y consolas",
            "Diseño over-ear",
            "Color negro"
        ]
    },

    {
        id: "p8",
        nombre: "HP Pavilion 15",
        descripcion: "Notebook para estudio, trabajo y uso cotidiano, con procesador Intel Core y almacenamiento SSD.",
        categoria: "Notebooks",
        precio: 849,
        stock: 6,
        imagen: "img/hp-pavilion-15.jpg",
        marca: "HP",
        modelo: "Pavilion 15",
        caracteristicas: [
            "Procesador Intel Core i5",
            "16 GB de memoria RAM",
            "512 GB SSD",
            "Pantalla de 15,6 pulgadas",
            "Resolución Full HD",
            "Gráficos integrados",
            "Windows 11 Home",
            "Cámara web HD",
            "Wi-Fi y Bluetooth",
            "Color plateado"
        ]
    },

    {
        id: "p9",
        nombre: "ASUS Vivobook 15",
        descripcion: "Notebook liviana para productividad, estudio y entretenimiento, con pantalla Full HD y almacenamiento SSD.",
        categoria: "Notebooks",
        precio: 779,
        stock: 8,
        imagen: "img/asus-vivobook-15.jpg",
        marca: "ASUS",
        modelo: "Vivobook 15",
        caracteristicas: [
            "Procesador Intel Core i5",
            "16 GB de memoria RAM",
            "512 GB SSD",
            "Pantalla de 15,6 pulgadas",
            "Resolución Full HD",
            "Gráficos integrados",
            "Windows 11",
            "Cámara HD",
            "Wi-Fi y Bluetooth",
            "Teclado en español",
            "Color azul oscuro"
        ]
    },

    {
        id: "p10",
        nombre: "Logitech K380",
        descripcion: "Teclado inalámbrico compacto y silencioso, ideal para trabajar y estudiar con distintos dispositivos.",
        categoria: "Periféricos",
        precio: 49,
        stock: 20,
        imagen: "img/logitech-k380.jpg",
        marca: "Logitech",
        modelo: "K380",
        caracteristicas: [
            "Conectividad Bluetooth",
            "Diseño compacto",
            "Teclas silenciosas",
            "Conexión con varios dispositivos",
            "Cambio rápido entre dispositivos",
            "Compatible con Windows y macOS",
            "Batería de larga duración",
            "Color gris"
        ]
    },

    {
        id: "p11",
        nombre: "Logitech G203 LIGHTSYNC",
        descripcion: "Mouse gaming con sensor de alta precisión e iluminación RGB personalizable.",
        categoria: "Periféricos",
        precio: 39,
        stock: 18,
        imagen: "img/logitech-g203.jpg",
        marca: "Logitech",
        modelo: "G203 LIGHTSYNC",
        caracteristicas: [
            "Sensor óptico de alta precisión",
            "Resolución de hasta 8000 dpi",
            "6 botones programables",
            "Iluminación RGB",
            "Conexión mediante USB",
            "Diseño ergonómico",
            "Compatible con Windows y macOS",
            "Color negro"
        ]
    },

    {
        id: "p12",
        nombre: "Redragon K552 Kumara",
        descripcion: "Teclado mecánico compacto para gaming y productividad, con retroiluminación y estructura resistente.",
        categoria: "Periféricos",
        precio: 59,
        stock: 14,
        imagen: "img/redragon-k552.jpg",
        marca: "Redragon",
        modelo: "K552 Kumara",
        caracteristicas: [
            "Teclado mecánico",
            "Formato compacto",
            "Retroiluminación",
            "Conexión USB",
            "Switches mecánicos",
            "Estructura metálica",
            "Diseño orientado a gaming",
            "Color negro"
        ]
    },

    {
        id: "p13",
        nombre: "Samsung Essential Monitor 24",
        descripcion: "Monitor de 24 pulgadas con resolución Full HD, diseñado para trabajo, estudio y entretenimiento.",
        categoria: "Monitores",
        precio: 159,
        stock: 10,
        imagen: "img/samsung-monitor-24.jpg",
        marca: "Samsung",
        modelo: "Essential Monitor 24",
        caracteristicas: [
            "Pantalla de 24 pulgadas",
            "Panel LED",
            "Resolución Full HD",
            "Frecuencia de actualización de 75 Hz",
            "Modo protección ocular",
            "Conexión HDMI",
            "Diseño de marco delgado",
            "Montaje VESA",
            "Color negro"
        ]
    },

    {
        id: "p14",
        nombre: "AOC Gaming 24G2",
        descripcion: "Monitor gaming de 24 pulgadas con panel IPS y alta frecuencia de actualización para una experiencia fluida.",
        categoria: "Monitores",
        precio: 219,
        stock: 9,
        imagen: "img/aoc-24g2.jpg",
        marca: "AOC",
        modelo: "24G2",
        caracteristicas: [
            "Pantalla de 24 pulgadas",
            "Panel IPS",
            "Resolución Full HD",
            "Frecuencia de actualización de 144 Hz",
            "Tiempo de respuesta de 1 ms",
            "Tecnología AMD FreeSync",
            "Conexión HDMI y DisplayPort",
            "Montaje VESA",
            "Soporte ajustable",
            "Color negro y rojo"
        ]
    },

    {
        id: "p15",
        nombre: "Anker PowerCore 10000",
        descripcion: "Batería portátil compacta para cargar smartphones, auriculares y otros dispositivos mediante USB.",
        categoria: "Accesorios",
        precio: 35,
        stock: 20,
        imagen: "img/anker-powercore-10000.jpg",
        marca: "Anker",
        modelo: "PowerCore 10000",
        caracteristicas: [
            "Capacidad de 10000 mAh",
            "Puerto USB",
            "Diseño compacto",
            "Protección contra sobrecarga",
            "Protección contra cortocircuitos",
            "Compatible con smartphones y dispositivos USB",
            "Indicador de carga",
            "Color negro"
        ]
    }

];


