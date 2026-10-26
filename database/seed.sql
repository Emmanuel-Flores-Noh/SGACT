-- Datos de prueba / seed para MariaDB
INSERT INTO usuarios (matricula, correo, nombres, apellido_paterno, apellido_materno, password, rol) VALUES
    ('a20203669', 'a20203669@alumnos.uady.mx', 'Emmanuel Adrian', 'Flores', 'Noh', 'Prueba', 'Alumno');

INSERT INTO procedimientos (nombre, descripcion, costo, vigencia_meses) VALUES
    ('Constancia de estudios', 'Acredita que eres alumno inscrito en la Facultad de Matemáticas durante el periodo escolar vigente.', 150, 6);