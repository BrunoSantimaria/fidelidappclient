# Usa una imagen base con Node.js
FROM node:18 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install --force

# Copia el resto de los archivos de tu aplicación al contenedor
COPY . .

# Ejecuta el build de Vite
RUN npm run build

# Usa una imagen de Nginx para servir los archivos estáticos
FROM nginx:alpine

# Copia los archivos generados por Vite en la carpeta dist
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Ejecuta Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]