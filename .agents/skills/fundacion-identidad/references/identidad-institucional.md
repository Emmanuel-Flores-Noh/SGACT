# Identidad institucional — SGACT

El Sistema de Gestión y Automatización de Constancias (SGACT) es una aplicación de la Facultad de
Matemáticas de la Universidad Autónoma de Yucatán (UADY). Este archivo recoge lo que se sabe de la
identidad institucional para **validar que un color o un ajuste nuevo es coherente con ella**
antes de añadirlo al tema. Si el sitio institucional cambia de diseño, vuelve a inspeccionar su
CSS antes de confiar en este archivo.

## Fuente

- `uady.mx` y `matematicas.uady.mx` sirven **el mismo bundle de estilos**: comparten una
  plataforma institucional única, así que lo que se encuentre en uno aplica al otro.
- Los colores se leyeron del CSS servido (clases `.uady-azul` / `.uady-dorado`), no de
  descripciones genéricas.

## Colores institucionales

| Rol | Institucional (UADY) | Token del SGACT |
| --- | --- | --- |
| Azul | `#002e5f` | `--color-azul-institucional` `#01457C` (identidad) · `--color-azul-institucional-enfoque` `#013763` (fondos profundos, presionado) |
| Dorado | `#c79316` | `--color-dorado-encabezado` `#C99213` |

Los tokens del SGACT pertenecen a la misma familia que los institucionales: el dorado es
prácticamente el mismo, y el azul de enfoque es cercano al azul UADY. El azul de identidad del
SGACT es un poco más claro, lo que da más margen de contraste en botones y estados `hover`.

Si se decide igualar exactamente el azul institucional (`#002e5f`), se cambia el token en el tema
y en el skill en el mismo cambio, y se vuelve a medir el contraste (§5 del skill). No se cambia
"a ojo" en un componente.

## Tipografía

- **Sitio institucional:** Roboto, "Helvetica Neue", sans-serif.
- **SGACT:** Open Sans → Segoe UI → Helvetica Neue → Arial, **sin cargar webfont de red**: la app
  no depende de un CDN.

No agregues una carga de Google Fonts solo por "fidelidad"; igualar la tipografía institucional
es una decisión a confirmar con el usuario.

## Qué NO está verificado (no asumir, no inventar valores)

- **Componentes del sitio institucional** (botones, tarjetas, encabezados): es una SPA y solo se
  confirmaron sus tokens de color y tipografía.
- Los patrones propios del SGACT (acceso, catálogo de procedimientos, bandeja del revisor, firma,
  distintivos de estado) **no tienen contraparte** en el sitio institucional, que es de difusión,
  no una aplicación autenticada. No hay nada que "armonizar" ahí.

## Cómo usar este archivo

No copies el layout del sitio institucional. Úsalo solo para comprobar la coherencia de un color
o una tipografía nueva. Si se necesita certeza sobre algo no verificado arriba, hay que
inspeccionar el sitio con un navegador, no suponerlo desde este documento.
