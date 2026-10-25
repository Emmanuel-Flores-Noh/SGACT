# Definicion de tecnologias

El proyecto utiliza la arquitectura por capas para dividir responsabilidades dependiendo de su funcionalidad, tambien, las capas superiores no podran interactuar directamente con las capas inferiores al menos que sea su inmediata
Tambien, para automatizar y aislar el proyecto se utilizara un docker file para cada capa, y, un docker compose en la raiz del proyecto.

# Estructura de carpetas

* backend: Todo el codigo del servidor web
* frontend: Todo el codigo correspondiente a las vistas y el contrato de la API.
* database: Todo el codigo correspondiente a la base de datos y su acceso.

# backend
El backend se hostea mediante express js

# frontend 
El backend esta conformado por React, junto con React router, y para los estilos se utilizara tailwind

# database
La base de datos se hostea por mariaDB
