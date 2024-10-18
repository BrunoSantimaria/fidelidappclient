# Usa la imagen base de Caddy
FROM caddy:latest

# Copia los archivos de build de Vite (de la carpeta dist)
COPY dist /usr/share/caddy

# Copia el archivo Caddyfile al contenedor
COPY Caddyfile /Caddyfile

# Expone el puerto 80 (o el puerto que configures en Caddyfile)
EXPOSE 80

# Caddy ya se ejecuta por defecto cuando el contenedor inicia
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]