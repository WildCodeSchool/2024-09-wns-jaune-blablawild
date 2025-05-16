FROM mcr.microsoft.com/playwright:v1.52.0

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour optimiser le cache Docker
COPY package.json package-lock.json ./

# Installer les dépendances (sans réinstaller les navigateurs)
RUN npm i

# Copier le reste du projet
COPY . .

# Laisser le conteneur en veille
CMD ["tail", "-f", "/dev/null"]