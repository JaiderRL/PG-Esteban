# Elementa — Tabla periódica interactiva

Elementa es una aplicación web educativa en español para explorar los 118 elementos químicos. Permite consultar sus propiedades, estructura atómica, historia, usos y curiosidades mediante una tabla periódica y una vista de lista.

El proyecto utiliza HTML, CSS y JavaScript sin frameworks ni dependencias externas de ejecución. Los datos están incluidos en archivos locales: no necesita un servidor de aplicación, una base de datos ni una conexión a una API para mostrar los elementos.

## Cómo abrir el proyecto

1. Conserva `index.html` junto a las carpetas `css`, `js` y `data`.
2. Abre `index.html` en un navegador moderno.
3. Busca un elemento o selecciona una tarjeta para consultar su ficha.

También puedes abrirlo desde PowerShell, situado en la carpeta del proyecto:

```powershell
Start-Process .\index.html
```

No hace falta instalar paquetes ni compilar la aplicación. La consulta de datos locales funciona sin conexión; abrir los enlaces externos de referencia sí requiere Internet. El navegador debe admitir JavaScript moderno y el elemento HTML `<dialog>`.

## Funcionalidades

- **Tabla completa:** muestra los 118 elementos, los grupos y períodos, con lantánidos y actínidos en filas separadas.
- **Búsqueda:** acepta nombres en español, símbolos, números atómicos y alias incluidos en los datos. Ignora diferencias de mayúsculas y tildes; por ejemplo, `oxigeno`, `O` y `8` permiten encontrar oxígeno.
- **Sugerencias:** ofrece hasta seis resultados mientras escribes. Las coincidencias exactas de número atómico o símbolo tienen prioridad.
- **Filtros por familia:** permite seleccionar varias categorías y combinarlas con la búsqueda. Incluye metales alcalinos, alcalinotérreos, de transición y postransición; metaloides, no metales, halógenos, gases nobles, lantánidos y actínidos.
- **Dos vistas:** la tabla atenúa los elementos que no coinciden con los filtros; la lista muestra los resultados coincidentes.
- **Ficha de detalle:** presenta identidad, configuración electrónica, distribución por capas, electronegatividad, estado físico, densidad, puntos de fusión y ebullición, historia, origen del nombre, usos y curiosidades. Incluye un enlace a la referencia del elemento en PubChem.
- **Elemento del día:** selecciona un elemento según la fecha local del equipo. También hay un botón para explorar un elemento aleatorio.
- **Tema claro y oscuro:** parte de la preferencia del sistema y guarda la elección del usuario en `localStorage`, bajo la clave `elementa-theme`, cuando el navegador lo permite.
- **Diseño adaptable:** ajusta la interfaz a distintos tamaños de pantalla y permite desplazar horizontalmente la tabla en móviles.
- **Interacción por teclado:** incluye navegación por tarjetas, sugerencias, gestión del foco en el diálogo y adaptación a la preferencia de movimiento reducido.
- **Enlaces a elementos:** al cargar una dirección como `index.html#elemento-8`, abre la ficha del oxígeno.

### Controles de teclado

| Control | Acción |
| --- | --- |
| `Ctrl + K` o `Cmd + K` | Lleva el foco al buscador y selecciona su texto. |
| Flechas arriba y abajo en el buscador | Recorren las sugerencias. |
| `Enter` en el buscador | Abre la sugerencia seleccionada o la primera disponible. |
| Flechas sobre una tarjeta | Desplazan el foco entre elementos disponibles de la tabla. |
| `Enter` o espacio sobre un botón o tarjeta | Activa el control. |
| `Escape` | Oculta las sugerencias o cierra la ficha, según el contexto. |

## Estructura del proyecto

```text
Esteban/
├── index.html
├── readme.md
├── source-elements.json
├── pubchem-snapshot.json
├── css/
│   └── styles.css
├── data/
│   └── editorial-es.js
├── js/
│   ├── elements-data.js
│   └── app.js
├── scripts/
│   ├── build-elements-data.ps1
│   └── browser-smoke-test.ps1
├── screenshots/
│   ├── desktop.png
│   ├── desktop-light.png
│   ├── dialog-dark.png
│   ├── dialog-final.png
│   ├── grid-dark.png
│   ├── grid-final.png
│   ├── mobile.png
│   ├── smoke-detail.png
│   └── table-light.png
├── .browser-debug/
├── .browser-dialog/
├── .browser-dialog-reduced/
├── .browser-grid/
├── .browser-grid-2/
├── .browser-mobile/
├── .browser-smoke/
├── .browser-table/
├── .browser-test/
├── .browser-test-2/
└── .browser-test-light/
```

Las carpetas de capturas y perfiles de navegador son artefactos de pruebas presentes al redactar este documento. Su contenido puede cambiar al repetir pruebas o realizar una limpieza.

### Archivos de la raíz

| Archivo | Contenido y función |
| --- | --- |
| `index.html` | Punto de entrada. Define la cabecera, presentación, elemento del día, buscador, filtros, vistas de tabla y lista, leyenda, guía de lectura, pie de página y diálogo de detalle. Incluye una plantilla de tarjeta que JavaScript utiliza para generar los elementos. Carga los estilos y los tres archivos JavaScript en el orden necesario. |
| `readme.md` | Documentación del funcionamiento, organización, uso y mantenimiento del proyecto. |
| `source-elements.json` | Fuente tabular local que el generador identifica como procedente de Periodic-Table-JSON. Contiene nombres, símbolos, posiciones en la tabla, capas electrónicas, configuración, descubridores y otros campos. Actualmente contiene 119 registros; el generador selecciona únicamente los de número atómico menor o igual a 118. Las referencias a imágenes que contiene no se cargan en la interfaz actual. |
| `pubchem-snapshot.json` | Copia local de propiedades de 118 elementos identificada por el proyecto como fuente PubChem. El generador utiliza, entre otros campos, electronegatividad, densidad, temperaturas y año de descubrimiento. No se actualiza automáticamente desde Internet. |

### `css/`: presentación visual

`styles.css` contiene los estilos de toda la aplicación: variables de color, temas claro y oscuro, tipografía, distribución de la página, tarjetas, filtros, buscador, lista, diálogo, animaciones y estados de foco. Incluye reglas para diferentes anchos de pantalla y para la preferencia `prefers-reduced-motion`.

Utiliza una pila de fuentes del sistema; no descarga una fuente externa. Los iconos de la interfaz están definidos como SVG dentro del HTML.

### `data/`: textos editoriales

`editorial-es.js` define `window.ELEMENT_EDITORIAL`, un objeto indexado por símbolo químico. Cada entrada contiene:

| Campo | Contenido |
| --- | --- |
| `origin` | Explicación breve del origen del nombre. |
| `uses` | Lista de usos principales. |
| `facts` | Lista de curiosidades. |

Estos textos se mantienen separados de las propiedades numéricas. Para corregir un uso o una curiosidad, edita este archivo; no necesitas regenerar los datos tabulares.

### `js/`: datos preparados y comportamiento

**`elements-data.js`** define `window.PERIODIC_ELEMENTS`, el arreglo de 118 elementos que consume la aplicación. Es un archivo generado por `scripts/build-elements-data.ps1` y ya está incluido para poder abrir la página directamente.

Sus campos se organizan así:

| Campos | Significado |
| --- | --- |
| `atomicNumber`, `symbol`, `name`, `aliases` | Identificación y términos utilizados en la búsqueda. |
| `atomicMass` | Etiqueta de masa; se almacena como texto para conservar formatos como `[98]`. |
| `category`, `group`, `period`, `block` | Clasificación y ubicación química. |
| `gridColumn`, `gridRow` | Posición utilizada para construir la tabla visual. |
| `state`, `stateStatus` | Estado físico y clasificación del dato como medido, estimado o desconocido. |
| `electronConfiguration`, `configurationStatus`, `shells` | Configuración electrónica, clasificación como medida o predicha y cantidad de electrones por capa. |
| `electronegativity`, `density`, `meltingPoint`, `boilingPoint` | Propiedades físicas y atómicas. |
| `discoveryYear`, `discoveryLabel`, `discoveredBy` | Información del descubrimiento, incluyendo etiquetas como «Antigüedad». |
| `description`, `sourceUrl` | Descripción breve en español y enlace de referencia. |

**`app.js`** contiene la lógica de la interfaz. Lee ambos objetos globales, valida los datos, construye tarjetas y filtros, procesa búsquedas, genera sugerencias, alterna vistas, abre y cierra fichas, aplica el tema y gestiona los eventos del ratón y teclado. También calcula el elemento del día e interpreta el enlace inicial `#elemento-N`.

Al iniciar verifica que existan 118 registros, números atómicos y símbolos únicos, orden consecutivo, categorías válidas, capas cuya suma corresponda al número atómico y contenido editorial para cada símbolo. Si detecta problemas, muestra un mensaje en la página y los detalles en la consola del navegador.

### `scripts/`: generación y pruebas

**`build-elements-data.ps1`** combina las dos fuentes JSON locales y genera `js/elements-data.js`. Incorpora nombres en español, alias, etiquetas de masa, categorías, correcciones de descubridores y descripciones. También establece cómo representar datos desconocidos, estimados o predichos.

Comprueba que ambas entradas utilizadas tengan 118 registros y que cada elemento tenga categoría. El script combina los registros por su posición en los arreglos: las fuentes deben mantenerse ordenadas por número atómico. No descarga ni actualiza las fuentes.

**`browser-smoke-test.ps1`** abre Microsoft Edge sin ventana visible y controla la página mediante el protocolo de depuración del navegador, usando WebSocket y el puerto local `9387`. Ejecuta comprobaciones funcionales, guarda capturas y dispone de un bloque `finally` para cerrar el proceso de Edge iniciado por el script.

El perfil de prueba se guarda en `.browser-smoke`, mediante la variable `$browserProfilePath`. Este nombre evita interferir con la variable automática `$PROFILE` de PowerShell. El script crea las carpetas del perfil y de capturas si no existen, pero las conserva al terminar.

### `screenshots/`: capturas de revisión

Contiene imágenes PNG de revisiones visuales. No son recursos utilizados por `index.html`.

| Archivo | Referencia indicada por el nombre |
| --- | --- |
| `desktop.png` | Vista de escritorio. |
| `desktop-light.png` | Vista de escritorio con tema claro. |
| `dialog-dark.png` | Ficha de detalle con tema oscuro. |
| `dialog-final.png` | Captura de revisión final del diálogo. |
| `grid-dark.png` | Cuadrícula con tema oscuro. |
| `grid-final.png` | Captura de revisión final de la cuadrícula. |
| `mobile.png` | Vista móvil. |
| `smoke-detail.png` | Captura de la ficha generada por la prueba automatizada. |
| `table-light.png` | Tabla con tema claro. |

El script de prueba actual también genera `smoke-mobile.png` si alcanza la comprobación móvil. Ese archivo no estaba presente al redactar este documento. Las capturas guardadas por sí solas no certifican que la versión actual haya superado todas las pruebas.

### `.browser-*`: perfiles temporales de navegador

Las once carpetas con prefijo `.browser-` enumeradas en el árbol contienen perfiles independientes usados durante pruebas. Sus nombres distinguen sesiones de depuración, diálogo, cuadrícula, móvil, tabla y variantes de tema. El script incluido utiliza específicamente `.browser-smoke`; las otras carpetas no tienen un generador asociado en los scripts actuales.

Dentro aparecen archivos y subcarpetas creados por Edge: `Default` contiene datos del perfil; `Local State` guarda configuración; `Cache`, `ShaderCache`, `GrShaderCache` o `GPUPersistentCache` pueden almacenar cachés; `Crashpad` contiene información de fallos; y otros directorios guardan componentes, diccionarios y metadatos del navegador. Son archivos administrados por Edge, no código del proyecto.

Estos perfiles pueden eliminarse cuando ningún navegador de pruebas los esté utilizando. `screenshots` también puede eliminarse si ya no necesitas conservar las evidencias visuales. La aplicación funciona sin ambas clases de carpetas; una nueva prueba puede volver a crearlas.

## Cómo se conectan los archivos

```text
source-elements.json ────┐
                        ├─ scripts/build-elements-data.ps1 ─→ js/elements-data.js
pubchem-snapshot.json ───┘

index.html
  ├─ css/styles.css              → aspecto de la página
  ├─ js/elements-data.js         → window.PERIODIC_ELEMENTS
  ├─ data/editorial-es.js        → window.ELEMENT_EDITORIAL
  └─ js/app.js                   → validación e interfaz interactiva
```

Los scripts de la página usan `defer` y se ejecutan en ese orden, una vez analizado el HTML. Los dos archivos de datos deben cargarse antes de `app.js`. El navegador consume los objetos JavaScript preparados; no lee directamente los JSON originales ni ejecuta PowerShell.

## Regenerar los datos

Desde PowerShell, en la raíz del proyecto:

```powershell
.\scripts\build-elements-data.ps1
```

También puedes indicar explícitamente los archivos:

```powershell
.\scripts\build-elements-data.ps1 -SourcePath "source-elements.json" -PubChemPath "pubchem-snapshot.json" -OutputPath "js/elements-data.js"
```

Las rutas se interpretan desde el directorio actual. El directorio de salida debe existir. El proceso sobrescribe el archivo de salida en UTF-8 sin BOM y, al terminar, informa que generó 118 elementos.

Para cambios duraderos en los datos tabulares, modifica las fuentes o las reglas del generador y vuelve a ejecutarlo. Los cambios manuales en `js/elements-data.js` se perderán al regenerarlo. Después, recarga la página y revisa la validación en la consola del navegador.

### Convenciones de datos

- Las temperaturas se almacenan en kelvin y la interfaz muestra también su conversión a grados Celsius.
- La densidad del conjunto generado se expresa en `g/cm³` y la electronegatividad en la escala de Pauling.
- `null` representa un dato no determinado; no equivale a cero. En `group`, también representa las series f sin grupo asignado por este proyecto.
- Las masas entre corchetes representan el número másico de un isótopo representativo cuando no hay peso atómico estándar.
- El generador marca el estado de los elementos con número atómico 104 o superior como desconocido y su configuración electrónica como predicha; marca el estado del astato y francio como estimado.
- Las etiquetas y normalizaciones son decisiones del conjunto local. Los datos no se sincronizan en tiempo real con fuentes externas.

## Ejecutar la prueba de navegador

Necesitas Windows, PowerShell y Microsoft Edge instalado. El script tiene como valores predeterminados:

| Parámetro o ajuste | Valor |
| --- | --- |
| `EdgePath` | `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` |
| `PageUrl` | `file:///C:/Users/Usuario/Downloads/PG/Esteban/index.html` |
| Puerto de depuración | `9387`, definido dentro del script. |

Si el proyecto está en su ubicación original y Edge está en la ruta indicada:

```powershell
.\scripts\browser-smoke-test.ps1
```

Si moviste el proyecto, calcula la dirección desde su nueva raíz:

```powershell
$elementaPagePath = (Resolve-Path -LiteralPath .\index.html).Path
$elementaPageUrl = ([System.Uri]::new($elementaPagePath)).AbsoluteUri
.\scripts\browser-smoke-test.ps1 -PageUrl $elementaPageUrl
```

Puedes añadir `-EdgePath "C:\ruta\a\msedge.exe"` si tu instalación está en otro lugar. El script busca un objetivo de navegador con dirección `file:`, por lo que esta prueba está preparada para abrir el archivo local.

La prueba comprueba la generación de 118 tarjetas con números únicos, la búsqueda de oxígeno, la apertura y cierre de su ficha, propiedades de identidad, usos y curiosidades, el filtro de seis metales alcalinos y su vista de lista. También acciona el cambio de tema y comprueba que el tema resultante sea un valor válido. Finalmente, emula una pantalla de 390 × 844, comprueba el ancho y el desplazamiento de la tabla, y guarda capturas de detalle y móvil.

Las comprobaciones satisfactorias imprimen mensajes `OK`; una aserción fallida produce un error. Una ejecución completa termina con `Prueba de navegador completada correctamente.` Es una prueba básica de integración, no una verificación exhaustiva de todos los elementos, propiedades o navegadores.

## Mantenimiento y publicación

| Si quieres cambiar… | Edita… |
| --- | --- |
| Estructura, secciones o textos fijos de la página | `index.html` |
| Colores, tamaños, disposición o animaciones | `css/styles.css` |
| Búsqueda, filtros, vistas o comportamiento de la ficha | `js/app.js` |
| Origen del nombre, usos o curiosidades | `data/editorial-es.js` |
| Propiedades y normalización del conjunto de elementos | Los JSON y/o `scripts/build-elements-data.ps1`; después regenera los datos. |
| Comprobaciones automáticas de la interfaz | `scripts/browser-smoke-test.ps1` |

Para publicar la aplicación en un alojamiento de archivos estáticos, copia `index.html`, `css/styles.css`, `js/elements-data.js`, `js/app.js` y `data/editorial-es.js`, conservando sus rutas relativas. No hay un paso de compilación ni secretos o credenciales que configurar.

Conserva los JSON y `scripts` en la copia de desarrollo para poder mantener los datos y ejecutar pruebas. `readme.md` documenta el proyecto; `screenshots` y `.browser-*` no son necesarios para publicar la página.

## Problemas frecuentes

| Síntoma | Qué revisar |
| --- | --- |
| La página no muestra elementos o informa que no puede validar los datos | Abre la consola del navegador y comprueba que ambos archivos de datos carguen antes de `app.js`, que haya 118 elementos y que cada símbolo tenga contenido editorial. |
| La página aparece sin estilos | Confirma que `css/styles.css` conserve su ubicación relativa a `index.html`. |
| El tema elegido no se conserva al volver a abrir la página | El navegador puede restringir `localStorage` bajo `file://`; en ese caso se vuelve a utilizar la preferencia del sistema. |
| La prueba no inicia Edge | Revisa `EdgePath` y que el ejecutable exista. |
| La prueba no encuentra la página o el objetivo de depuración | Revisa `PageUrl`, usa una dirección `file:` válida y comprueba que el puerto `9387` esté disponible. |
| Una propiedad aparece como «No determinada» | Comprueba si su valor es `null` en los datos; la interfaz utiliza ese texto para los valores desconocidos. |
