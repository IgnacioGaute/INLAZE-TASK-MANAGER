<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
<a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
<a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
<a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

---

## 📌 Descripción

Aplicación fullstack construida con NestJS (backend) y Next.js (frontend) para la gestión de tareas, con soporte para roles de usuario, comentarios en tareas y notificaciones en tiempo real usando WebSocket.

---

## 🚀 Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone [https://github.com/tu-usuario/nombre-del-repo.git](https://github.com/IgnacioGaute/INLAZE-TASK-MANAGER.git)

# 2. Instalar dependencias en backend y frontend
cd backend && pnpm install
cd ../frontend && pnpm install

# 3. Crear los archivos .env
Backend: backend/.env
Frontend: frontend/.env

# 4. Levantar base de datos con Docker
cd backend
docker-compose up -d

# 5. Iniciar backend y frontend en modo desarrollo (en ventanas separadas)
pnpm dev  # desde backend
pnpm dev  # desde frontend

# 6. Funcionalidades principales
Registro e inicio de sesión con JWT
Tabla de proyectos con link a sus respectivas tareas
Panel de tareas asignadas a usuario/s y o grupo/s
Comentarios en tareas
Notificaciones en tiempo real al comentar
Gestión de usuarios y grupos (sólo admin)
Control de acceso por roles (USER, ADMIN)
Diseño moderno y responsive con Next.js

# 7. Tecnologías Utilizadas
Backend: Node.js + NestJS
Frontend: React + Next.js
Base de Datos: PostgreSQL (usando contenedor Docker)
Sockets: WebSocket con Socket.io
ORM: TypeORM
Gestor de paquetes: pnpm
Librería de componentes: Shadcn


## ⚙️ Decisiones Técnicas y Desafíos Superados

# Arquitectura Modular en NestJS
Se optó por una arquitectura modular para organizar el backend en módulos funcionales independientes (AuthModule, ProjectsModule, TasksModule, NotificationsModule, etc.). Esto facilita la escalabilidad y el mantenimiento del código, y permite reutilizar servicios entre módulos mediante la inyección de dependencias.

# Autenticación con JWT y Control de Acceso por Roles
Se implementó un sistema de autenticación basado en JWT para proteger las rutas del backend mediante guards personalizados. Además, se desarrolló un RoleGuard que permite restringir el acceso a ciertas rutas según el rol del usuario (ADMIN o USER). Esto se utiliza, por ejemplo, para limitar la gestión de usuarios y grupos exclusivamente a administradores.

# Comunicación en Tiempo Real con WebSockets
Uno de los principales desafíos fue integrar notificaciones en tiempo real usando Socket.io. Se configuró el gateway en NestJS para emitir eventos personalizados (como nuevos comentarios), y en el frontend se manejó la reconexión y escucha eficiente desde múltiples componentes.

# Reutilización de Servicios y Dependencias Cruzadas
Para evitar problemas comunes como errores de circular dependencies, se diseñaron los servicios de forma que los repositorios fueran inyectados correctamente, y se reexportaron módulos donde fue necesario. Un desafío fue que NotificationsService requería entidades como UserRepository, lo cual se solucionó importando los módulos correctos y usando forwardRef en algunos casos.

# Validaciones y DTOs Centralizados
Se definieron DTOs (Data Transfer Objects) en el backend usando class-validator, lo cual permite una validación automática de los datos recibidos en las rutas. Esto mejoró la robustez del API y la calidad de los errores devueltos al frontend.

# Uso de Docker para Base de Datos
Se utilizó Docker para contenerizar la base de datos PostgreSQL, lo que facilita su puesta en marcha sin necesidad de instalaciones locales ni configuraciones manuales. Con un simple comando docker-compose up -d, la base queda lista para usarse en desarrollo o testing, asegurando portabilidad y consistencia del entorno entre distintos equipos.

# Diseño Visual con Tailwind CSS y Shadcn/UI
Para la interfaz del frontend se usó Tailwind CSS, permitiendo un desarrollo ágil y altamente personalizable mediante clases utilitarias. Además, se integró Shadcn/UI, una librería basada en Radix UI con estilos ya integrados a Tailwind, lo que aceleró la construcción de componentes accesibles, modernos y coherentes visualmente, como botones, formularios, dropdowns, etc.
Esto permitió mantener un diseño limpio, responsive y reutilizable a lo largo de la aplicación.
