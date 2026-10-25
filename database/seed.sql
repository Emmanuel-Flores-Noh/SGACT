-- Datos de prueba / seed para MariaDB
INSERT INTO usuarios (matricula, correo, nombres, apellido_paterno, apellido_materno, password, rol) VALUES
    ('a20203669', 'a20203669@alumnos.uady.mx', 'Emmanuel Adrian', 'Flores', 'Noh', 'Prueba', 'Alumno');
INSERT INTO procedimientos (nombre, descripcion, costo, vigencia_meses) VALUES
    ('Constancia de estudios', 'Acredita que eres alumno inscrito en la Facultad de Matemáticas durante el periodo escolar vigente.', 150, 6);
INSERT INTO peticiones_tramite (alumno_id, procedimiento_id, estado, fecha_solicitud) VALUES
    (1, 1, 'En confirmación de pago', '2026-04-01 10:00:00');