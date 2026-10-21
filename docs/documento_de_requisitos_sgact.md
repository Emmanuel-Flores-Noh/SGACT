# Documento de Requisitos: Sistema de Gestión y Automatización de Constancias (SGACT)

## 1. Requisitos Funcionales

*   **RF-01: Gestión de Roles y Accesos.** El sistema debe soportar y diferenciar al menos dos tipos de usuarios: Alumnos y Revisores (personal académico/administrativo).
*   **RF-02: Autenticación de Usuarios.** El sistema debe incorporar un mecanismo para identificar a los usuarios mediante sus credenciales (matrícula/correo institucional y contraseña).
*   **RF-03: Manejo de Sesiones.** El sistema debe utilizar sesiones para conservar el estado del usuario autenticado durante toda su navegación en el portal.
*   **RF-04: Operaciones CRUD Completas.** El sistema debe permitir registrar nueva información en la base de datos (CREATE), consultar y presentar información almacenada (READ), modificar registros (UPDATE) y eliminar o desactivar información según se requiera (DELETE).
*   **RF-05: Catálogo de Trámites.** Los alumnos deben poder visualizar una lista de los procedimientos disponibles para solicitar, enfocándose inicialmente en las constancias de estudio.
*   **RF-06: Procesamiento de Pago.** Al solicitar un trámite, el sistema debe redirigir al alumno a una pasarela donde pueda ingresar su método de pago y procesar la transacción.
*   **RF-07: Trazabilidad y Máquina de Estados.** El sistema debe asignar y actualizar automáticamente el estado de cada solicitud bajo cuatro fases: "En confirmación de pago", "En trámite", "Finalizado" y "Archivado".
*   **RF-08: Panel de Seguimiento para Alumnos.** Los alumnos deben contar con una interfaz donde puedan consultar el estado en tiempo real de sus peticiones activas.
*   **RF-09: Bandeja de Revisión.** Los revisores deben tener acceso a un listado de peticiones pendientes de atención que ya cuenten con el pago confirmado.
*   **RF-10: Firma Digital del Revisor.** El sistema debe proveer al revisor una plantilla oficial de la constancia en la que pueda estampar su firma, ya sea dibujando en un lienzo interactivo o seleccionando una firma preconfigurada en su perfil.
*   **RF-11: Finalización y Descarga de Documentos.** Tras la validación del revisor, el sistema debe adjuntar automáticamente el documento generado y habilitar un botón de descarga para el alumno.
*   **RF-12: Expiración Automática.** El sistema debe aplicar una política de validez de 6 meses a las constancias; pasado este tiempo, el estado debe cambiar a "Archivado" y el sistema debe eliminar el documento e impedir su descarga.

## 2. Requisitos No Funcionales

*   **RNF-01: Arquitectura FrontEnd y BackEnd.** El proyecto debe tener una estructura modular desacoplada o híbrida, separando las interfaces de usuario (FrontEnd) de la lógica de negocio y procesamiento (BackEnd).
*   **RNF-02: Base de Datos Relacional.** El sistema debe almacenar su información utilizando una base de datos relacional estructurada con al menos cinco tablas (ej. usuarios, procedimientos, peticiones_tramite, pagos, firmas_revisores, e historial_estados).
*   **RNF-03: Interfaz Responsiva.** El desarrollo del FrontEnd debe utilizar tecnologías web estándar y marcos de diseño responsivo para que la interfaz sea utilizable tanto en dispositivos móviles como de escritorio de manera adaptativa.
*   **RNF-04: Comunicación Cliente-Servidor.** El intercambio de datos entre el navegador y el servidor debe realizarse utilizando peticiones asíncronas en un formato de intercambio de datos estándar.
*   **RNF-05: Manuales del Sistema.** Se debe generar y entregar documentación formal del proyecto, la cual debe incluir un manual de usuario y un manual técnico.
*   **RNF-06: Seguridad de Contraseñas.** Las contraseñas de los usuarios no deben almacenarse en texto plano en la base de datos; deben ser encriptadas mediante algoritmos de hash seguros.
*   **RNF-07: Disponibilidad.** Al ser un portal académico, el sistema debe garantizar una alta disponibilidad para que los alumnos puedan consultar el estado de sus trámites en todo momento.
*   **RNF-08: Prevención de Inyecciones.** Todo formulario de entrada debe contar con validación tanto del lado del cliente como del servidor para prevenir ataques de inyección de código.
*   **RNF-09: Rendimiento en Cargas Simultáneas.** El sistema debe estar preparado para soportar el acceso simultáneo de usuarios durante el inicio y final de los periodos escolares.