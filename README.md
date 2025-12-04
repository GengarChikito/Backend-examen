# 🎮 Backend - Level-Up Gamer API

Backend desarrollado en **NestJS** para el sistema de punto de venta y e-commerce "Level-Up Gamer". Esta API gestiona la lógica de negocio, incluyendo gamificación, descuentos automáticos, control de stock y reseñas.

## 🚀 Tecnologías

* **Framework:** NestJS
* **Base de Datos:** MySQL (`examen_db`)
* **ORM:** TypeORM
* **Seguridad:** JWT & Bcrypt
* **Documentación:** Swagger

## ✨ Funcionalidades Principales

### 👤 Usuarios & Gamificación
* **Registro:** Validación de mayoría de edad (+18).
* **Sistema de Puntos (LevelUp):** Se acumula el 5% de cada compra como puntos.
* **Referidos:** Bonificación de puntos al registrarse con código de referido.
* **Descuento Duoc:** Detección automática de correos `@duoc.cl` para asignar un **20% de descuento** permanente.

### 🛒 Ventas & Boletas
* **Carro de Compras:** Validación de stock en tiempo real.
* **Cálculo de Totales:** Aplicación automática de descuentos y cálculo de IVA.
* **Historial:** Registro completo de transacciones con detalle de productos.

### ⭐ Reseñas
* **Sistema de Calificación:** Los usuarios pueden calificar (1-5 estrellas) y comentar los productos comprados.
* **Muro de la Fama:** Endpoint para listar las mejores opiniones de la comunidad.

### 📦 Catálogo
* **Gestión de Productos:** CRUD completo (Crear, Leer, Actualizar, Eliminar).
* **Categorías:** Soporte para múltiples categorías (Consolas, Accesorios, Ropa Gamer, etc.).

---

## 🛠️ Instalación y Puesta en Marcha

1.  **Base de Datos:**
    Asegúrate de tener MySQL corriendo y crea la base de datos:
    ```sql
    CREATE DATABASE examen_db;
    ```

2.  **Configuración:**
    Verifica las credenciales en `src/app.module.ts` (por defecto: `root` / `1234`).

3.  **Instalar Dependencias:**
    ```bash
    npm install
    ```

4.  **Iniciar Servidor:**
    ```bash
    npm run start
    ```
    *Al iniciar, el **Seed** poblará automáticamente la base de datos con usuarios y productos de prueba si está vacía.*

## 📄 Documentación API (Swagger)

Una vez corriendo, visita:
👉 **http://localhost:4000/api**