# Proyecto Integrador: Aplicaciones Web
**FACULTAD DE MATEMÁTICAS — UNIVERSIDAD AUTÓNOMA DE YUCATÁN**
**Sistema:** SGACT
**Fecha:** Octubre 2026

## 1. Nombre de la Aplicación y Descripción General

**Nombre oficial del sistema:** Sistema de Gestión y Automatización de Constancias (SGACT).

**Descripción del problema:** Actualmente, el proceso de solicitud, trámite, firma y entrega de constancias de estudio en la Facultad de Matemáticas de la UADY involucra una alta carga operativa manual y presencial. Los alumnos deben realizar múltiples pasos desconectados entre la solicitud de trámites escolares, la comprobación de pagos institucionales y la espera de validación por parte del personal administrativo (revisores). Esto genera cuellos de botella en periodos de inscripción, becas o convocatorias, además de dificultar el seguimiento en tiempo real del estatus de las peticiones.

**Propósito Fundamental**
Automatizar de punta a punta el flujo de solicitudes de constancias de estudio mediante una plataforma web centralizada, permitiendo a los alumnos gestionar trámites y pagos en línea, y brindando a los revisores herramientas dinámicas de validación y firma digitalizada.

## 2. Objetivos del Proyecto

*   **Optimizar tiempos:** Reducir el tiempo de espera de los alumnos mediante un portal web autogestionable y transparente.
*   **Trazabilidad de trámites:** Implementar una máquina de estados clara para cada solicitud (En confirmación de pago, En trámite, Finalizado y Archivado).
*   **Firma electrónica institucional:** Proveer a los revisores métodos flexibles para firmar documentos (trazado con mouse o plantillas preconfiguradas).
*   **Cumplimiento normativo:** Automatizar el ciclo de vida de los documentos, incluyendo la expiración y borrado temporal por políticas de validez (6 meses).

## 3. Funcionalidad Principal y Flujos de Usuario

La arquitectura funcional divide las operaciones según el rol del usuario autenticado:

**Módulo de Alumnos:** Acceso mediante matrícula, correo institucional y nombre completo. Permite consultar el catálogo de procedimientos disponibles (enfocado inicialmente en constancias de estudio), iniciar solicitudes, ser redirigido a una pasarela de pago y consultar el historial con estatus en tiempo real y descarga de archivos finalizados.

| Estado del Trámite | Descripción y Responsable |
| :--- | :--- |
| **En confirmación de pago** | El alumno ha realizado el pago y el sistema espera la validación de la transacción. |
| **En trámite** | Pago confirmado. El expediente se encuentra en la bandeja del revisor asignado. |
| **Finalizado** | El revisor concluyó el trámite, anexó la constancia firmada y habilitó la descarga. |
| **Archivado** | El documento superó su periodo de validez legal (6 meses), eliminándose el archivo del servidor. |

**Módulo de Revisores y Firma Digital**
El personal administrativo visualiza una bandeja de peticiones pendientes. Al atender una solicitud rutinaria de constancia, el sistema carga una plantilla oficial donde el revisor puede estampar su firma de dos formas: dibujando directamente con el mouse en un lienzo interactivo o seleccionando una firma preconfigurada en su perfil. Al aprobar, el servidor genera el PDF sellado y actualiza el estado a *Finalizado*.

## 4. Requerimientos de Software y Datos

El sistema implementa autenticación robusta mediante sesiones de usuario, control de roles (Alumno / Revisor) y operaciones CRUD completas para gestionar catálogos, solicitudes, pagos y bitácoras de auditoría de firmas.

## 5. Diseño de Base de Datos (Integración Relacional)

Para cumplir con los lineamientos del curso, la arquitectura relacional se compone de seis tablas principales que aseguran la normalización y el manejo transaccional de los trámites:

| Tabla | Campos Principales | Propósito |
| :--- | :--- | :--- |
| **usuarios** | `matricula`, `correo`, `nombre_completo`, `rol`, `password` | Almacena credenciales y datos de alumnos y revisores. |
| **procedimientos** | `id`, `nombre`, `descripcion`, `costo`, `duracion_validez_meses` | Catálogo de trámites disponibles (ej. Constancia de estudios). |
| **peticiones_tramite** | `id`, `alumno_id`, `procedimiento_id`, `estado`, `fecha_solicitud` | Registra cada solicitud individual realizada por los alumnos. |
| **pagos** | `id`, `peticion_id`, `metodo_pago`, `monto`, `estado_pago`, `fecha` | Controla el registro y estatus de las transacciones financieras. |
| **firmas_revisores** | `id`, `revisor_id`, `tipo_firma`, `ruta_archivo`, `preconfigurada` | Almacena las configuraciones de firma o trazos de los revisores. |
| **historial_estados** | `id`, `peticion_id`, `estado_anterior`, `estado_nuevo`, `fecha` | Auditoría del ciclo de vida y cambios de estatus de los trámites. |

## 6. Integración Futura del FrontEnd y BackEnd

**Arquitectura de integración:** El sistema se desarrollará bajo un esquema modular. El FrontEnd empleará interfaces dinámicas responsivas renderizadas en servidor con plantillas estructuradas y componentes estilizados, comunicándose mediante formularios y peticiones asíncronas para la captura de firmas (Canvas API) y simulación de pagos.

El BackEnd gestionará la lógica de negocio mediante controladores dedicados al procesamiento de solicitudes, generación dinámica de documentos PDF institucionales aplicando las firmas digitales almacenadas, y el manejo seguro de sesiones de usuario para mantener el estado de autenticación durante toda la navegación en el portal de la Facultad de Matemáticas UADY.