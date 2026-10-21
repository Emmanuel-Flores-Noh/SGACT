# Casos de Uso: Sistema de Gestión y Automatización de Constancias (SGACT)

## 1. Actores del Sistema

*   **Alumno:** Estudiante de la Facultad de Matemáticas que ingresa al sistema para solicitar constancias, realizar pagos y descargar documentos.
*   **Revisor:** Personal académico o administrativo encargado de visualizar las peticiones de los alumnos, validar la información y firmar digitalmente las constancias.
*   **Sistema:** Entidad automática encargada de actualizar estados, procesar vigencias y archivar o eliminar documentos cuando expira su validez.

## 2. Catálogo de Casos de Uso

### CU-01: Autenticación de Usuarios
*   **Actor:** Alumnos y Revisores.
*   **Descripción:** Permite a los usuarios ingresar de forma segura al portal utilizando sus credenciales (matrícula o correo institucional y contraseña) para iniciar una sesión en el sistema.

### CU-02: Solicitar Trámite (Constancia)
*   **Actor:** Alumno.
*   **Descripción:** El alumno accede al catálogo de procedimientos disponibles y selecciona la opción para generar una nueva constancia de estudio.

### CU-03: Pagar Trámite
*   **Actor:** Alumno.
*   **Descripción:** Una vez solicitado el trámite, el sistema redirige al alumno a una pasarela web donde ingresa su método de pago. Al completarse, el trámite pasa al estado "En confirmación de pago".

### CU-04: Seguimiento de Trámites
*   **Actor:** Alumno.
*   **Descripción:** El alumno puede consultar en un panel interactivo la lista de sus procedimientos solicitados y visualizar su estado en tiempo real ("En confirmación de pago", "En trámite", "Finalizado", "Archivado").

### CU-05: Descargar Documento Finalizado
*   **Actor:** Alumno.
*   **Descripción:** Cuando un trámite alcanza el estado "Finalizado", el alumno puede utilizar un botón habilitado en el sistema para descargar la constancia digital firmada en formato PDF.

### CU-06: Consultar Bandeja de Peticiones Pendientes
*   **Actor:** Revisor.
*   **Descripción:** El revisor visualiza un listado con las solicitudes de los alumnos cuyo pago ha sido confirmado (estado "En trámite") y están pendientes de atención.

### CU-07: Atender y Firmar Constancia
*   **Actor:** Revisor.
*   **Descripción:** Al seleccionar una petición pendiente, el revisor abre una plantilla oficial de la constancia. El revisor estampa su firma mediante el uso del mouse (en un lienzo/canvas) o seleccionando una firma preconfigurada. Al finalizar, el sistema adjunta el documento firmado y cambia el estado a "Finalizado".

### CU-08: Archivar Documentos Expirados
*   **Actor:** Sistema.
*   **Descripción:** Proceso interno del sistema que monitorea la vigencia de las constancias. Al cumplirse 6 meses desde su emisión, el sistema cambia el estado a "Archivado", borra el documento de los servidores y deshabilita su opción de descarga.