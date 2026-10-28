-- Datos de prueba / seed para MariaDB

INSERT INTO carreras (nombre) VALUES ("Licenciatura en ingenieria de software"), ("Licenciatura en ciencias de la computacion");

INSERT INTO roles (nombre) VALUES ("Alumno"), ("Revisor");


INSERT INTO usuarios (matricula, correo, nombres, apellido_paterno, apellido_materno, password, carrera_id, rol_id) VALUES
    ('a20203669', 'a20203669@alumnos.uady.mx', 'Emmanuel Adrian', 'Flores', 'Noh', 'Prueba', 1, 1);

INSERT INTO usuarios (correo, nombres, apellido_paterno, apellido_materno, password, rol_id) VALUES
    ('prueba@prueba.com', "Pablo", "Romero", "Munoz", "Prueba", 2);

INSERT INTO procedimientos (nombre, descripcion, costo, vigencia_meses, archivo_plantilla) VALUES
    ('Constancia de estudios', 'Acredita que eres alumno inscrito en la Facultad de Matemáticas durante el periodo escolar vigente.', 150, 6, 'constancia.hbs');


INSERT INTO peticiones_tramite (alumno_id, procedimiento_id, estado, fecha_solicitud) VALUES
    (1, 1, 'En confirmación de pago', '2026-04-01 10:00:00');
