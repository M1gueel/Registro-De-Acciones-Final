CREATE TABLE acciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fechaCompra DATE NOT NULL,
    precioCompra DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL
);
