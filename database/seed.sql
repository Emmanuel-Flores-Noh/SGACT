-- Datos de prueba / seed para MariaDB

INSERT INTO carreras (nombre) VALUES ("Licenciatura en ingenieria de software"), ("Licenciatura en ciencias de la computacion");

INSERT INTO roles (nombre) VALUES ("Alumno"), ("Revisor");


INSERT INTO usuarios (matricula, correo, nombres, apellido_paterno, apellido_materno, password, carrera_id, rol_id) VALUES
    ('a20203669', 'a20203669@alumnos.uady.mx', 'Emmanuel Adrian', 'Flores', 'Noh', 'Prueba', 1, 1),
    ('a20203182', 'a20203182@alumnos.uady.mx', 'María Guadalupe', 'Hernández', 'Sánchez', 'pass3182', 1, 1),
    ('a20202211', 'a20202211@alumnos.uady.mx', 'José Luis', 'González', 'Rodríguez', 'pass2211', 2, 1),
    ('a20202304', 'a20202304@alumnos.uady.mx', 'Ana Paula', 'López', 'Rodríguez', 'pass2304', 1, 1),
    ('a20201150', 'a20201150@alumnos.uady.mx', 'Juan Carlos', 'González', 'Rodríguez', 'pass1150', 2, 1),
    ('a20201926', 'a20201926@alumnos.uady.mx', 'Juan Carlos', 'Martínez', 'Ramírez', 'pass1926', 1, 1),
    ('a20203631', 'a20203631@alumnos.uady.mx', 'María del Carmen', 'Hernández', 'Sánchez', 'pass3631', 2, 1),
    ('a20202132', 'a20202132@alumnos.uady.mx', 'María Guadalupe', 'Martínez', 'Pérez', 'pass2132', 1, 1),
    ('a20203466', 'a20203466@alumnos.uady.mx', 'Luis Miguel', 'López', 'Sánchez', 'pass3466', 2, 1);

INSERT INTO usuarios (correo, nombres, apellido_paterno, apellido_materno, password, rol_id) VALUES
    ('prueba@prueba.com', 'Pablo', 'Romero', 'Muñoz', 'Prueba', 2),
    ('a20202162@uady.mx', 'José Manuel', 'López', 'Pérez', 'pass2162', 2),
    ('a20202836@uady.mx', 'José Luis', 'González', 'Pérez', 'pass2836', 2);

INSERT INTO procedimientos (nombre, descripcion, costo, vigencia_meses) VALUES
    ('Constancia de estudios', 'Acredita que eres alumno inscrito en la Facultad de Matemáticas durante el periodo escolar vigente.', 150, 6);

INSERT INTO peticiones_tramite (alumno_id, procedimiento_id, estado, fecha_solicitud) VALUES
    (1, 1, 'Finalizado', '2026-10-25 00:19:27'),
    (2, 1, 'En trámite', '2026-10-21 00:19:27'),
    (3, 1, 'Finalizado', '2026-10-14 00:19:27'),
    (3, 1, 'En confirmación de pago', '2026-10-18 00:19:27'),
    (4, 1, 'Archivado', '2026-10-17 00:19:27'),
    (4, 1, 'En trámite', '2026-10-25 00:19:27'),
    (5, 1, 'En trámite', '2026-10-17 00:19:27'),
    (5, 1, 'Finalizado', '2026-10-27 00:19:27'),
    (6, 1, 'En confirmación de pago', '2026-10-26 00:19:27'),
    (6, 1, 'En trámite', '2026-10-19 00:19:27'),
    (7, 1, 'Archivado', '2026-10-27 00:19:27'),
    (7, 1, 'En trámite', '2026-10-22 00:19:27'),
    (8, 1, 'Finalizado', '2026-10-19 00:19:27'),
    (8, 1, 'En trámite', '2026-10-19 00:19:27'),
    (9, 1, 'En confirmación de pago', '2026-10-23 00:19:27'),
    (9, 1, 'Finalizado', '2026-10-20 00:19:27');

-- 5. Pagos correspondientes a las peticiones (todos asociados al trámite de constancia por $150.0)
INSERT INTO pagos (peticion_id, metodo_pago, monto, estado_pago, fecha) VALUES 
    (1, 'Tarjeta de Crédito / Débito', 150.0, 'Confirmado', '2026-10-25 01:19:27'), 
    (2, 'Tarjeta de Crédito / Débito', 150.0, 'Confirmado', '2026-10-21 01:19:27'),
    (3, 'Tarjeta de Crédito / Débito', 150.0, 'completado', '2026-10-14 01:19:27'),
    (4, 'Tarjeta de Crédito / Débito', 150.0, 'pendiente', '2026-10-18 01:19:27'),
    (5, 'Tarjeta de Crédito / Débito', 150.0, 'completado', '2026-10-17 01:19:27'),
    (6, 'Tarjeta de Crédito / Débito', 150.0, 'completado', '2026-10-25 01:19:27'),
    (7, 'Tarjeta de Crédito / Débito', 150.0, 'completado', '2026-10-17 01:19:27'),
    (8, 'Tarjeta de Crédito / Débito', 150.0, 'completado', '2026-10-27 01:19:27'),
    (9, 'Tarjeta de Crédito / Débito', 150.0, 'fallido', '2026-10-26 01:19:27'),
    (10, 'Tarjeta de Crédito / Débito', 150.0, 'completado', '2026-10-19 01:19:27'),
    (11, 'Tarjeta de Crédito / Débito', 150.0, 'completado', '2026-10-27 01:19:27'),
    (12, 'Tarjeta de Crédito / Débito', 150.0, 'completado', '2026-10-22 01:19:27'),
    (13, 'Tarjeta de Crédito / Débito', 150.0, 'completado', '2026-10-19 01:19:27'),
    (14, 'Tarjeta de Crédito / Débito', 150.0, 'completado', '2026-10-19 01:19:27'),
    (15, 'Tarjeta de Crédito / Débito', 150.0, 'pendiente', '2026-10-23 01:19:27'),
    (16, 'Tarjeta de Crédito / Débito', 150.0, 'completado', '2026-10-20 01:19:27');

-- 6. Historial de estados (los 24 registros completos)
INSERT INTO historial_estados (peticion_id, estado_anterior, estado_nuevo, fecha) VALUES 
    (1, 'En confirmación de pago', 'En trámite', '2026-10-25 02:00:00'),
    (1, 'En trámite', 'Finalizado', '2026-10-26 10:00:00'),
    (1, 'Finalizado', 'Archivado', '2026-10-28 12:34:11'),
    (2, 'En confirmación de pago', 'En trámite', '2026-10-21 02:19:27'),
    (3, 'En confirmación de pago', 'En trámite', '2026-10-14 02:00:00'),
    (3, 'En trámite', 'Finalizado', '2026-10-16 12:00:00'),
    (4, 'En confirmación de pago', 'En confirmación de pago', '2026-10-18 01:00:00'),
    (5, 'En confirmación de pago', 'En trámite', '2026-10-17 02:00:00'),
    (5, 'En trámite', 'Archivado', '2026-10-20 14:00:00'),
    (6, 'En confirmación de pago', 'En trámite', '2026-10-25 02:19:27'),
    (7, 'En confirmación de pago', 'En trámite', '2026-10-17 02:19:27'),
    (8, 'En confirmación de pago', 'En trámite', '2026-10-27 02:00:00'),
    (8, 'En trámite', 'Finalizado', '2026-10-28 09:00:00'),
    (9, 'En confirmación de pago', 'En confirmación de pago', '2026-10-26 01:00:00'),
    (10, 'En confirmación de pago', 'En trámite', '2026-10-19 02:19:27'),
    (11, 'En confirmación de pago', 'En trámite', '2026-10-27 02:00:00'),
    (11, 'En trámite', 'Archivado', '2026-10-28 11:00:00'),
    (12, 'En confirmación de pago', 'En trámite', '2026-10-22 02:19:27'),
    (13, 'En confirmación de pago', 'En trámite', '2026-10-19 02:00:00'),
    (13, 'En trámite', 'Finalizado', '2026-10-22 15:00:00'),
    (14, 'En confirmación de pago', 'En trámite', '2026-10-19 02:19:27'),
    (15, 'En confirmación de pago', 'En confirmación de pago', '2026-10-23 01:00:00'),
    (16, 'En confirmación de pago', 'En trámite', '2026-10-20 02:00:00'),
    (16, 'En trámite', 'Finalizado', '2026-10-23 16:00:00');