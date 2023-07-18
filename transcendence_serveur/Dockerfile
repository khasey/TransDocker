# On utilise une image Docker officielle Node.js comme image de base
FROM node:latest

# On définit le répertoire de travail dans le conteneur
WORKDIR /app

# On copie les fichiers package.json et package-lock.json dans le répertoire de travail du conteneur
COPY package*.json ./

# On installe les dépendances du projet dans le conteneur
RUN npm install

# On copie le reste du code de l'application dans le conteneur
COPY . .

# On indique que le conteneur doit écouter sur le port 3000 au moment de l'exécution
EXPOSE 3001

# On détermine la commande à exécuter au moment de l'exécution du conteneur
CMD [ "npm", "start" ]

