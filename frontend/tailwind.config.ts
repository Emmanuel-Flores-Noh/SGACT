import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'azul-institucional': 'var(--color-azul-institucional)',
      'azul-texto': 'var(--color-azul-texto)',
      'azul-institucional-enfoque': 'var(--color-azul-institucional-enfoque)',
      'dorado-encabezado': 'var(--color-dorado-encabezado)',
      tinta: 'var(--tinta)',
      'gris-700': 'var(--gris-700)',
      'gris-500': 'var(--gris-500)',
      'gris-300': 'var(--gris-300)',
      'gris-200': 'var(--gris-200)',
      'gris-100': 'var(--gris-100)',
      'gris-050': 'var(--gris-050)',
      blanco: 'var(--color-blanco)',

      /* Tokens de estado */
      'ok-600': 'var(--ok-600)',
      'ok-200': 'var(--ok-200)',
      'ok-050': 'var(--ok-050)',

      'err-600': 'var(--err-600)',
      'err-200': 'var(--err-200)',
      'err-050': 'var(--err-050)',

      'warn-600': 'var(--warn-600)',
      'warn-200': 'var(--warn-200)',
      'warn-050': 'var(--warn-050)',

      'azul-600': 'var(--azul-600)',
      'azul-200': 'var(--azul-200)',
      'azul-050': 'var(--azul-050)',
    },
    fontFamily: {
      sgact: 'var(--font-sgact)',
    },
    borderRadius: {
      none: '0',
      sm: 'var(--radio-sm)',
      DEFAULT: 'var(--radio)',
      full: '9999px',
    },
    boxShadow: {
      none: 'none',
      sm: 'var(--sombra-sm)',
      md: 'var(--sombra-md)',
      lg: 'var(--sombra-lg)',
    },
    extend: {
      fontSize: {
        banner: '26px',
      },
      screens: {
        escritorio: '920px',
      },
    },
  },
  plugins: [],
} satisfies Config;
