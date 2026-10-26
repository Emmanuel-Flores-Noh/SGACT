CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(9),
    correo VARCHAR(50),
    nombres VARCHAR(80),
    apellido_paterno VARCHAR(20),
    apellido_materno VARCHAR(20),
    password VARCHAR(50),
    -- Alumno o Revisor
    rol VARCHAR(10),
    login_cookie VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS procedimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion VARCHAR(200),
    costo FLOAT,
    vigencia_meses INT
);

CREATE TABLE IF NOT EXISTS firmas_revisores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    revisor_id INT,
    tipo_firma VARCHAR(20),
    ruta_archivo VARCHAR(50),
    preconfigurada BOOLEAN,
    CONSTRAINT fk_revisor_firma FOREIGN KEY (revisor_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS peticiones_tramite (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumno_id INT,
    procedimiento_id INT,
    estado VARCHAR(50),
    fecha_solicitud DATETIME,
    CONSTRAINT fk_peticion_alumno FOREIGN KEY (alumno_id) REFERENCES usuarios(id),
    CONSTRAINT fk_peticion_procedimiento FOREIGN KEY (procedimiento_id) REFERENCES procedimientos(id)
);

CREATE TABLE IF NOT EXISTS pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    peticion_id INT,
    metodo_pago VARCHAR(50),
    monto FLOAT,
    estado_pago VARCHAR(50),
    fecha DATETIME,
    CONSTRAINT fk_pago_peticion FOREIGN KEY (peticion_id) REFERENCES peticiones_tramite(id)
);

CREATE TABLE IF NOT EXISTS historial_estados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    peticion_id INT,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50),
    fecha DATETIME,
    CONSTRAINT fk_historial_peticion FOREIGN KEY (peticion_id) REFERENCES peticiones_tramite(id)
);