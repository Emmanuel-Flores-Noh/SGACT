---
name: fundacion-identidad
description: Identidad visual del Sistema de Gestión y Automatización de Constancias (SGACT) — qué color, tipografía, radio, sombra o espaciado corresponde; qué significa cada color de estado de un trámite; cómo se vuelven tokens del tema de Tailwind; y el contraste mínimo. Úsalo antes de elegir cualquier valor visual en el frontend React, al añadir o cambiar un token, y al revisar si una pantalla respeta la identidad del sistema.
---

# SGACT — identidad visual

Este skill responde **¿qué se ve y por qué?** en el Sistema de Gestión y Automatización de
Constancias (SGACT). Decide valores y reglas; no describe el comportamiento de las pantallas ni
lista componentes.

Es un **punto de inicio**: los valores aquí son la base del sistema. Si se ajusta uno, se cambia
en el tema y en este archivo en el mismo cambio.

---

## 1. Paleta: rol de cada color

El azul y el dorado son de la familia institucional de la UADY (ver
[references/identidad-institucional.md](references/identidad-institucional.md)). No se ajustan
"a ojo".

| Rol | Token | Cuándo |
| --- | --- | --- |
| Identidad primaria | `--color-azul-institucional` `#01457C` | Barras, encabezados, acciones primarias, fondos profundos |
| Texto sobre claro | `--color-azul-texto` `#00437C` | Títulos y texto enfático; **no** para párrafos largos (usa `--tinta`) |
| Estado presionado/foco | `--color-azul-institucional-enfoque` `#013763` | `hover`/`active` de superficies azules, barras laterales |
| Acento institucional | `--color-dorado-encabezado` `#C99213` | Realce, no acción. Un solo elemento dorado por pantalla |
| Texto/fondo neutro | `--tinta`, `--gris-700/500/300/200/100/050`, `--color-blanco` | Todo lo demás |

**Prohibido:** hex suelto en un componente o en una clase arbitraria de Tailwind
(`bg-[#01457C]`). Si el color no existe como token, se añade el token primero (§6).

### Neutros

| Token | Valor | Uso |
| --- | --- | --- |
| `--tinta` | `#1f2933` | Texto de cuerpo |
| `--gris-700` | `#3d4550` | Etiquetas, texto secundario fuerte |
| `--gris-500` | `#636b75` | Texto secundario, placeholders |
| `--gris-300` | `#8a929c` | Bordes de control (≥3:1 sobre blanco) |
| `--gris-200` | `#d9dde2` | Divisores, bordes decorativos |
| `--gris-100` | `#eef0f3` | Fondos de fila, zonas deshabilitadas |
| `--gris-050` | `#f7f8fa` | Fondo de página |

### Chasis y acentos

El chasis (barra superior, pie, acceso, panel de alumno y de revisor) es siempre azul
institucional y **no** lleva acento. El dorado es el único acento definido; si una superficie
necesita distinguirse por color (por ejemplo, un procedimiento del catálogo), se añade primero un
token de acento con nombre semántico y se anota aquí.

---

## 2. Tipografía

- Familia: `--font-sgact` (Open Sans → Segoe UI → Helvetica Neue → Arial). **Sin webfont de
  red**: la app debe funcionar sin CDN.
- Escala en uso: 26px (título de banner) · 20px · 15–16px (cuerpo) · 13–14px (secundario) ·
  12px (metadatos, mayúsculas).
- Pesos: 800 títulos de banner · 700 encabezados y etiquetas · 600 énfasis · 400 cuerpo.
- Mayúsculas + `letter-spacing: .5px` solo en etiquetas cortas (badges, encabezados de
  columna). Nunca en frases.

## 3. Forma

| Uso | Token |
| --- | --- |
| Tarjetas, contenedores, tablas | `--radio` (12px) |
| Inputs, botones, chips | `--radio-sm` (8px) |
| Elevación de reposo | `--sombra-sm` |
| Elemento destacado / hover de tarjeta | `--sombra-md` |
| Modal, overlay, tarjeta de acceso | `--sombra-lg` |

## 4. Color de estado (semántica, no decoración)

El eje que separa los roles es si el trámite ya tiene un veredicto:

| Significado | Tokens | Estados del SGACT |
| --- | --- | --- |
| Éxito / concluido | `--ok-600` texto, `--ok-050` fondo, `--ok-200` borde | **Finalizado** (constancia firmada, descarga habilitada) |
| Error / rechazado | `--err-600`, `--err-050`, `--err-200` | Pago rechazado, validación de formulario |
| **Sin veredicto todavía** | `--azul-600`, `--azul-100` | **En confirmación de pago**, **En trámite** |
| Atención — hay un plazo encima | `--warn-600`, `--warn-050`, `--warn-200` | Constancia próxima a archivarse, dato faltante |
| Inactivo | `--gris-500` texto, `--gris-100` fondo | **Archivado** (archivo eliminado, sin descarga) |

> [!warning] «En trámite» es azul, no ámbar
> El ámbar dice *se pasó o está por pasarse un plazo*; el azul dice *todavía no hay
> resultado*. Pueden ir juntos (un trámite «Finalizado» que además «Se archiva pronto»): son dos
> distintivos, no uno.
>
> El `--azul-600` **no es el azul de identidad** (`#01457C`, §1). Son dos azules con dos
> trabajos: uno es identidad, el otro es estado.

Los tokens de estado aún no tienen valor: se definen en el tema la primera vez que una pantalla
los necesite, se miden (§5) y se anotan en esta tabla.

Regla: **un estado nunca se comunica solo con color.** Siempre color + texto (y en tablas,
además, posición o ícono).

El mapeo de cada estado del trámite del backend a uno de estos roles vive en **un solo lugar**
del frontend (un componente `Badge` o una tabla compartida), no repartido por pantallas.

## 5. Contraste

Mínimo WCAG **AA**: 4.5:1 texto normal, 3:1 texto ≥18px o ≥14px bold, 3:1 bordes de control y
anillo de foco.

- Válidas: `--color-azul-institucional` sobre blanco · blanco sobre
  `--color-azul-institucional` · `--tinta` sobre `--gris-050` · `--gris-300` como borde sobre
  blanco.
- A evitar: `--color-dorado-encabezado` como **texto** sobre blanco (2.9:1), y **blanco sobre
  dorado** (2.76:1). El dorado va como fondo o borde, con texto **oscuro** encima — también en
  `hover` y en `focus-visible`.

> [!warning] «Negrita» no basta para bajar el umbral a 3:1 — hacen falta 14px
> Un distintivo de `12px/700` sigue pidiendo 4.5:1. AA condiciona la excepción a **≥14px** en
> negrita o ≥18px sin ella.

Al definir los tokens de estado, mide cada pareja texto/fondo al tamaño del distintivo. Si no
alcanza AA, **decide una vez** (subir el tamaño o ajustar el tono en el tema) y anótalo aquí; no
lo arregles componente por componente.

No se juzga a ojo: mide con una herramienta de contraste (las DevTools del navegador o axe) en
la pantalla real.

---

## 6. Los tokens en el frontend

El frontend usa Tailwind v3. Los tokens viven en dos archivos que se cambian juntos:

- `frontend/src/index.css`: los valores, como variables CSS en `:root`. Es la **única** fuente
  de color, tipografía, radio y sombra.
- `frontend/tailwind.config.ts`: expone cada variable como utilidad. `theme.colors`,
  `borderRadius` y `boxShadow` **reemplazan** la paleta por omisión (no van en `extend`), así que
  `bg-gray-50` o `text-white` no existen; se usa `bg-gris-050`, `text-blanco`.

```css
:root {
  --color-azul-institucional: #01457C;
  --font-sgact: "Open Sans", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  --radio-sm: 8px;
  --radio: 12px;
}
```

```ts
colors: { 'azul-institucional': 'var(--color-azul-institucional)' },
fontFamily: { sgact: 'var(--font-sgact)' },
borderRadius: { sm: 'var(--radio-sm)', DEFAULT: 'var(--radio)' },
extend: { fontSize: { banner: '26px' }, screens: { escritorio: '920px' } },
```

- Uso: `bg-azul-institucional`, `text-azul-texto`, `rounded` (12px), `rounded-sm` (8px),
  `shadow-lg`, `font-sgact`, `text-banner`.
- Un token nuevo: nombre **semántico por rol** (`--color-tramite-archivado`), nunca por
  apariencia (`--color-gris-2`). Se añade en ambos archivos y en la tabla de este skill en el
  mismo cambio.
- Nada de valores arbitrarios de diseño en las clases. Si te falta uno, te falta un token.

## 7. Antes de dar por buena una decisión visual

- [ ] El valor sale de un token; si es nuevo, tiene nombre semántico y está en este skill
- [ ] Ningún hex ni valor arbitrario (`[#…]`, `[13px]`) en un componente
- [ ] El estado se comunica con color **y** texto, y su rol sale del mapeo único (§4)
- [ ] El contraste cumple AA medido, no a ojo (§5), también en `hover` y `focus-visible`
- [ ] El chasis va en azul institucional, sin acento
