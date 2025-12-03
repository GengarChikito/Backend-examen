# 📦 Backend - Sistema de Ventas (API RESTful)

Este es el Backend para el sistema de gestión de ventas "TiendaApp". Está construido con *NestJS* y utiliza *MySQL* como base de datos. Proporciona una API robusta para la gestión de productos, usuarios, autenticación y registro de ventas con control de stock.

## 🚀 Tecnologías Utilizadas

* *Framework:* [NestJS](https://nestjs.com/) (Node.js)
* *Lenguaje:* TypeScript
* *Base de Datos:* MySQL
* *ORM:* TypeORM
* *Autenticación:* JWT (JSON Web Tokens) & Passport
* *Documentación:* Swagger (OpenAPI)
* *Testing:* Jest (100% Cobertura Unitaria)

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1.  *Node.js* (v18 o superior)
2.  *MySQL Server* (Corriendo en el puerto 3306)
3.  *npm* (Gestor de paquetes)

---

## 🛠️ Instalación y Configuración

1.  *Clonar el repositorio:*
    bash
    git clone <https://github.com/Juan-Fernandez-Jaime/Backend>
    cd backend


2.  *Instalar dependencias:*
    bash
    npm install


3.  *Configurar Base de Datos:*
    * Asegúrate de tener un servidor MySQL corriendo.
    * Crea una base de datos vacía llamada evaluacion_db (o el nombre que prefieras).
    * Nota: Por defecto, el proyecto busca conectar a localhost con usuario root y contraseña 1234. Puedes cambiar esto en src/app.module.ts.

---

## ▶️ Ejecución del Proyecto

### Modo Desarrollo (Recomendado)
Este modo activa el *"Hot Reload"* (recarga automática) y ejecuta el *Seed* (llenado de datos) si la base de datos está vacía.

```bash
npm run start