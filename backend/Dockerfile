FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-slim AS runner

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Instalar dependencias necesarias para Chromium / Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libnss3 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libdrm2 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Configurar Puppeteer para usar el binario de Chromium del sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copiar el resultado de la compilación TypeScript
COPY --from=builder /app/dist ./dist

# Copiar las plantillas Handlebars a la ruta original de src y a dist si aplica
COPY --from=builder /app/src/templates ./src/templates
COPY --from=builder /app/src/templates ./dist/templates

EXPOSE 3000

CMD ["node", "dist/index.js"]