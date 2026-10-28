# Manual de usuario de Elementa

## 1. ¿Qué es Elementa?

Elementa es una aplicación educativa para explorar los 118 elementos químicos de la tabla periódica. Está en español y permite buscar elementos, filtrar por familia, comparar la tabla con una lista y abrir una ficha con información de cada elemento.

El proyecto está pensado para consulta y aprendizaje. No requiere crear una cuenta, instalar una aplicación ni conectarse a una base de datos. Sus datos vienen incluidos en la carpeta. La aplicación funciona sin Internet; los enlaces de referencia que llevan a PubChem sí necesitan conexión.

## 2. Requisitos

- Un computador o teléfono con un navegador web moderno. En Windows se puede usar Microsoft Edge, Google Chrome o Firefox.
- La carpeta del proyecto completa. No se deben separar `index.html` de las carpetas `css`, `js` y `data`.
- JavaScript activado en el navegador.

No es necesario instalar programas, paquetes ni extensiones para usar la aplicación. El archivo `index.html` es la página de inicio.

## 3. Cómo abrir la aplicación

### En Windows

1. Abre el Explorador de archivos y entra en la carpeta del proyecto.
2. Haz doble clic en `index.html`.
3. Si Windows pregunta con qué programa abrirlo, elige Edge, Chrome o Firefox.

También puedes abrir PowerShell en la carpeta del proyecto y escribir:

```powershell
Start-Process .\index.html
```

### En otros sistemas

Abre `index.html` con el navegador que tengas instalado. Si el navegador restringe alguna función al abrir archivos directamente, sirve la carpeta con cualquier servidor web estático y visita la dirección local que este indique. No se necesita un servidor de aplicación.

Al abrirse correctamente verás la portada, un elemento destacado, el buscador y la tabla periódica. Si aparece un aviso de que no se pudieron cargar los datos, revisa que no hayas movido ni renombrado las carpetas y archivos del proyecto.

## 4. Recorrido por la pantalla

- **Encabezado:** contiene la marca Elementa, el escudo de la Institución Educativa John F. Kennedy y el control para cambiar entre tema claro y oscuro.
- **Presentación:** introduce la aplicación y ofrece un botón para elegir un elemento al azar.
- **Elemento destacado:** muestra el elemento del día. Pulsa su tarjeta para abrir su ficha. La selección se calcula con la fecha local del dispositivo.
- **Buscador:** encuentra elementos por nombre, símbolo químico, número atómico o alias disponible. Mientras escribes pueden aparecer sugerencias.
- **Controles de vista:** permiten alternar entre la tabla periódica y una lista de resultados.
- **Filtros por familia:** muestran categorías químicas que se pueden combinar entre sí y con la búsqueda. Al seleccionar una familia aparece una explicación breve de lo que la caracteriza.
- **Tabla o lista:** cada elemento aparece como una tarjeta seleccionable. El espacio libre de la parte superior de la tabla muestra el escudo y el nombre de la institución.
- **Leyenda y guía:** ayudan a interpretar los colores y los datos que aparecen en las tarjetas. Cada familia de la leyenda se puede pulsar para ver qué es.
- **Pie de página:** incluye el escudo y el nombre de la institución.
- **Ficha del elemento:** una ventana con propiedades, historia, usos y curiosidades. Se abre al seleccionar una tarjeta.

## 5. Tareas frecuentes

### Buscar un elemento

1. Selecciona el campo que dice «Busca: Oxígeno, O o 8…».
2. Escribe el nombre, símbolo o número atómico. Por ejemplo: `oxigeno`, `O` o `8`.
3. Selecciona una sugerencia, o pulsa `Enter` para abrir el resultado seleccionado o el primero disponible.
4. Para borrar la búsqueda, usa el botón de limpiar que aparece junto al campo. También puedes borrar el texto manualmente.

La búsqueda ignora mayúsculas y tildes. Si no hay coincidencias, la página lo indica y ofrece volver a mostrar todos los elementos.

### Filtrar por familia

Selecciona una o varias categorías en el área de filtros. La búsqueda y los filtros se aplican al mismo tiempo. En la tabla, los elementos que no coinciden quedan atenuados; en la lista aparecen los resultados coincidentes. Usa el botón para restablecer los filtros cuando quieras empezar de nuevo.

Las familias disponibles incluyen metales alcalinos, alcalinotérreos, metales de transición y postransición, metaloides, no metales, halógenos, gases nobles, lantánidos y actínidos. La leyenda de la página muestra sus colores.

### Saber qué es cada familia

Hay dos formas de ver la explicación de una familia:

- **Desde los filtros:** al pulsar una familia, debajo de los filtros aparece un recuadro con su nombre, la cantidad de elementos que la forman y una descripción corta. Si eliges varias, se muestra la última que seleccionaste.
- **Desde la leyenda «Familias químicas»:** pulsa el nombre de una familia y se abre una pequeña ventana con su explicación. El botón **Ver en la tabla** aplica ese filtro y te lleva a la tabla. Para cerrar la ventana, pulsa la ×, haz clic fuera de ella, pulsa `Escape` o vuelve a pulsar la misma familia.

### Cambiar entre tabla y lista

Pulsa **Tabla** para ver la disposición periódica de los elementos o **Lista** para recorrer los resultados en filas. La tabla puede desplazarse horizontalmente en pantallas estrechas; en un teléfono, desliza dentro de la zona de la tabla.

### Consultar una ficha

Selecciona cualquier tarjeta en la tabla o lista. La ficha puede incluir:

- Nombre, símbolo, número atómico, masa y familia.
- Posición en la tabla, configuración electrónica y distribución de electrones por capas.
- Electronegatividad, densidad, estado físico y temperaturas de fusión y ebullición, cuando hay datos disponibles.
- Información sobre el descubrimiento, el origen del nombre, usos y curiosidades.
- Un enlace a PubChem para consultar una referencia externa.

Para cerrar la ficha, pulsa el botón de cierre, haz clic fuera de la ventana o pulsa `Escape`. Al cerrarla, el foco vuelve al elemento desde el que la abriste.

### Explorar un elemento aleatorio

Pulsa **Descubrir un elemento** (o el botón equivalente de elemento aleatorio en la portada). La aplicación selecciona un elemento al azar y abre su ficha.

### Cambiar el tema

Pulsa el botón de tema del encabezado para cambiar entre claro y oscuro. Inicialmente se toma en cuenta la preferencia de apariencia del sistema. Si el navegador permite guardar preferencias para archivos locales, Elementa recuerda la elección en ese navegador.

## 6. Controles de teclado y accesibilidad

| Tecla o combinación | Acción |
| --- | --- |
| `Ctrl + K` en Windows/Linux o `Cmd + K` en macOS | Lleva el foco al buscador y selecciona el texto. |
| Flecha arriba/abajo en el buscador | Recorre las sugerencias disponibles. |
| `Enter` en el buscador | Abre la sugerencia elegida o la primera disponible. |
| Flechas sobre una tarjeta de la tabla | Mueve el foco entre elementos. |
| `Enter` o espacio sobre un botón/tarjeta | Activa el control enfocado. |
| `Escape` | Cierra sugerencias, la explicación de una familia o la ficha abierta. |

Los controles tienen nombres accesibles para lectores de pantalla, y la página contempla la preferencia del sistema por movimiento reducido. También puedes recorrer botones y enlaces con `Tab` y `Mayús + Tab`.

## 7. Cómo interpretar algunos datos

- **Número atómico:** cantidad de protones del átomo; identifica al elemento.
- **Símbolo:** abreviatura química, por ejemplo `O` para oxígeno.
- **Masa atómica:** valor mostrado en unidades de masa atómica (`u`). Algunos elementos sin peso atómico estándar aparecen con un número másico entre corchetes.
- **Configuración electrónica y capas:** describen cómo se distribuyen los electrones. La visualización por capas es una representación simplificada.
- **Electronegatividad:** medida de la tendencia de un átomo a atraer electrones en un enlace; se presenta según la escala de Pauling cuando está disponible.
- **Densidad:** se expresa en gramos por centímetro cúbico (`g/cm³`) según el conjunto de datos del proyecto.
- **Temperaturas:** el conjunto almacena temperaturas en kelvin; la interfaz puede presentar también la conversión a grados Celsius.
- **Datos estimados, predichos o desconocidos:** no todos los valores se han medido directamente. La ficha señala el estado de algunos datos; un espacio sin valor no significa cero.

Los contenidos son material educativo integrado en el proyecto, no una conexión en tiempo real a una fuente científica. Para trabajos que requieran precisión especializada, contrasta las propiedades con referencias científicas actualizadas.

## 8. Compartir un elemento

La dirección de la página puede incluir el número atómico del elemento. Por ejemplo, `index.html#elemento-8` abre la ficha del oxígeno al cargar la página. Sustituye `8` por otro número entre 1 y 118 para compartir otro elemento.

## 9. Tecnologías utilizadas

Elementa está construida con tecnologías web estándar. Cada una cumple una función distinta:

| Tecnología | Función en este proyecto |
| --- | --- |
| HTML5 | Define la estructura de la página: encabezado, buscador, filtros, tabla, tarjetas y ventana de detalle. |
| CSS | Controla la apariencia: colores, tipografía, espacios, animaciones, temas claro y oscuro, y adaptación a móviles. |
| JavaScript moderno | Da vida a la página: prepara las tarjetas, busca elementos, aplica filtros, cambia vistas y temas, y responde al teclado y al ratón. |
| JSON | Guarda los datos originales de elementos químicos de forma estructurada para que el generador los procese. |
| SVG | Dibuja iconos de la interfaz sin depender de imágenes externas. |
| APIs del navegador | JavaScript usa funciones incluidas en el navegador, como eventos de teclado y ratón, ventanas de diálogo y almacenamiento local opcional para recordar el tema. |
| PowerShell | Ejecuta el script de mantenimiento que combina los archivos JSON y genera el archivo JavaScript de datos. |
| Microsoft Edge, CDP y WebSocket | Permiten que la prueba automatizada opcional controle el navegador, compruebe algunas interacciones y guarde capturas. CDP es el protocolo de depuración de Chrome/Edge y WebSocket es el canal de comunicación que usa la prueba. |

No se utiliza un framework de interfaz, servidor de aplicación, base de datos ni servicio de inicio de sesión. La página lee datos preparados incluidos en los archivos JavaScript. Por eso se puede abrir localmente; solo los enlaces externos necesitan Internet.

## 10. Archivos y carpetas

La carpeta principal (raíz) reúne la página, los datos fuente y la documentación. Dentro hay estas carpetas:

| Carpeta | Función |
| --- | --- |
| `css/` | Guarda las hojas de estilo. `styles.css` define colores, tipografía, distribución, adaptación a móviles y temas claro/oscuro. |
| `data/` | Contiene textos editoriales en español: origen de los nombres, usos y curiosidades de cada elemento. |
| `img/` | Contiene `logo-jfk.png`, el escudo de la institución que aparece en el encabezado, la tabla, el pie de página y la pestaña del navegador. |
| `js/` | Contiene el comportamiento de la aplicación (`app.js`) y los 118 registros preparados que consume la página (`elements-data.js`). |
| `scripts/` | Incluye herramientas opcionales de mantenimiento: el generador de datos y la prueba automatizada del navegador. |
| `screenshots/` | Conserva capturas de pantalla tomadas durante revisiones y pruebas. La aplicación no las necesita para funcionar. |
| `.browser-debug/` | Perfil de Edge separado usado durante una sesión de depuración. |
| `.browser-dialog/` | Perfil separado usado al revisar la ventana de detalle de un elemento. |
| `.browser-dialog-reduced/` | Perfil separado usado al revisar la ventana con ajustes de movimiento reducido. |
| `.browser-grid/` | Perfil separado usado durante una revisión de la cuadrícula periódica. |
| `.browser-grid-2/` | Otro perfil separado de revisión de la cuadrícula. |
| `.browser-mobile/` | Perfil separado usado al revisar la página en tamaño de pantalla móvil. |
| `.browser-smoke/` | Perfil temporal que utiliza el script `browser-smoke-test.ps1` para su comprobación automatizada en Edge. |
| `.browser-table/` | Perfil separado usado al revisar la vista de tabla. |
| `.browser-test/` | Perfil separado de una sesión de pruebas del navegador. |
| `.browser-test-2/` | Otro perfil separado de pruebas. |
| `.browser-test-light/` | Perfil separado usado al revisar la interfaz con tema claro. |

Las carpetas `.browser-*` contienen datos que Edge crea para guardar el estado de cada perfil, no código de Elementa. Son auxiliares de pruebas y no se requieren para abrir la aplicación. Los perfiles están separados para que las distintas sesiones no compartan sus ajustes.

Estos archivos de la raíz también cumplen funciones importantes:

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Punto de entrada: estructura de la interfaz y enlaces a los estilos y scripts. |
| `source-elements.json` | Fuente local de información estructural de los elementos utilizada por el generador. |
| `pubchem-snapshot.json` | Copia local de propiedades atribuida a PubChem; no se actualiza automáticamente. |
| `readme.md` | Documentación técnica con instrucciones detalladas de mantenimiento y prueba. |
| `MANUAL-USUARIO.md` | Versión de texto de este manual. |
| `MANUAL-USUARIO-ELEMENTA.docx` | Versión de este manual para abrir o editar en Word. |

## 11. Mantenimiento básico (para quien administra el proyecto)

### Corregir un texto editorial

Edita el símbolo correspondiente en `data/editorial-es.js`. Allí se encuentran `origin` (origen del nombre), `uses` (usos) y `facts` (curiosidades). Guarda el archivo y vuelve a cargar la página.

### Cambiar colores o distribución

Edita `css/styles.css`. Para modificar secciones fijas, como títulos, instrucciones o textos de la página, edita `index.html`.

### Cambiar la explicación de una familia

Las descripciones de cada familia están en `js/app.js`, en la lista `categories`, dentro del campo `description`. Guarda el archivo y vuelve a cargar la página.

### Cambiar datos químicos

Los registros que lee la interfaz se generan desde `source-elements.json`, `pubchem-snapshot.json` y las reglas de `scripts/build-elements-data.ps1`. Después de cambiar una fuente o regla, abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
.\scripts\build-elements-data.ps1
```

El proceso actualiza `js/elements-data.js`; los cambios manuales hechos directamente en ese archivo podrían perderse al generarlo de nuevo. El generador requiere que las fuentes contengan los 118 registros esperados y estén alineadas por número atómico. Revisa la página después de regenerar.

### Ejecutar la prueba de navegador

En Windows, con Microsoft Edge instalado, se puede ejecutar:

```powershell
.\scripts\browser-smoke-test.ps1
```

El script comprueba algunos casos de búsqueda, ficha, filtros, tema y pantalla móvil. Si el proyecto está en otra ubicación, consulta `readme.md` para pasarle su nueva dirección local. Esta prueba no cubre todos los datos ni todos los navegadores.

### Publicar la página

Para alojarla como sitio estático, conserva las rutas relativas y publica `index.html`, `css/styles.css`, `js/app.js`, `js/elements-data.js`, `data/editorial-es.js` e `img/logo-jfk.png`. Las fuentes JSON y los scripts solo son necesarios si se planea mantener y regenerar los datos. No hace falta publicar los perfiles `.browser-*` ni las capturas.

## 12. Problemas comunes

| Problema | Qué hacer |
| --- | --- |
| La página aparece sin estilos | Confirma que `css/styles.css` siga en la carpeta `css` junto a `index.html`. |
| No aparece la tabla o se muestra un error de datos | Comprueba que los archivos de `js` y `data` estén presentes y no se hayan renombrado. Recarga la página. |
| La búsqueda no encuentra algo | Prueba el símbolo o número atómico, borra filtros activos o usa el botón de restablecer. |
| No puedo ver todas las columnas en el teléfono | Desliza horizontalmente dentro de la tabla o cambia a la vista Lista. |
| El enlace de PubChem no abre | Necesitas conexión a Internet para visitar referencias externas. |
| El cambio de tema no se recuerda | Algunos navegadores no conservan almacenamiento para páginas abiertas como archivos locales. La aplicación seguirá funcionando. |
| El script de prueba no inicia Edge | Revisa que Edge esté instalado y que `EdgePath` apunte al ejecutable correcto; consulta los parámetros en `readme.md`. |

---

**Versión del manual:** 1.0  
**Proyecto:** Elementa — Tabla periódica interactiva  
**Fecha:** 1 de octubre de 2026
