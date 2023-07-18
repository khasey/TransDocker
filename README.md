################################# - initializing - ########################################   
    Set up your development environment: Make sure you have Node.js, npm/yarn, and Docker installed on your machine. Also install NestJS CLI (npm i -g @nestjs/cli) and create-nest-app for NestJS app creation and setup.

    Initialize Backend Project (NestJS + PostgreSQL):
        Use NestJS CLI to create a new project.
        Setup TypeORM with PostgreSQL. Define entities corresponding to your database tables like users, games, messages etc.
        Create modules, services, and controllers for each entity.
        Implement the game logic and user authentication (consider using Passport.js).
        Setup WebSocket gateway for real-time game and chat functionality.

    Initialize Frontend Project (Next.js):
        Use Create Next App (npx create-next-app) to create a new Next.js application.
        Setup Redux or any other state management tool you prefer (like Zustand or Recoil).
        Create pages for home, game room, user profile, etc.
        Create components for the Pong game, chat, and other UI elements.
        Setup WebSocket connection using socket.io-client for real-time game and chat functionality.

    Dockerize Your Applications:
        Create a Dockerfile for both frontend and backend applications.
        Create a docker-compose.yml file to orchestrate your services.

    Testing and Debugging:
        Make sure to test your application thoroughly. You can use Jest for both backend and frontend testing.
        Debug any issues that come up and handle all errors to ensure smooth user experience.

    Deploying Your Application:
        Once everything is working as expected, you can deploy your Docker containers to a server. You can use any cloud provider like AWS, Google Cloud, or Azure for this.

################################# - work - ######################################## 

    NestJS Backend: You need to implement your game logic, define your entities (user, game, message, etc.), create modules, services, and controllers for each entity, and set up your WebSocket gateway for real-time communication.

    Next.js Frontend: You need to design and create your pages and components (Pong game, chat, etc.), set up Redux or another state management library, and implement the WebSocket client for real-time communication.

    Docker: You need to complete your Dockerfiles and docker-compose file, ensuring they correctly build and link your applications and PostgreSQL database.

    Testing: All components should be thoroughly tested to ensure a smooth user experience. Jest is a good choice for testing both your frontend and backend.

############################## - backend - ########################################

    Modélisation de la base de données : Commencez par définir les modèles de vos tables dans votre base de données. Vous devez savoir quels types d'entités votre application doit manipuler. Par exemple, dans le contexte d'un jeu de Pong, vous pourriez avoir des utilisateurs, des parties, etc.

    Configuration de TypeORM : Vous devrez ensuite configurer TypeORM pour qu'il sache comment communiquer avec votre base de données PostgreSQL. Cela comprend la création d'un fichier de configuration TypeORM et le paramétrage de vos entités.

    Création des Entités : Créez des entités TypeORM pour chaque type d'entité dont votre application a besoin. Ces entités définiront la structure des tables de votre base de données.

    Création des Repositories : Les repositories sont utilisés pour interagir avec votre base de données. Vous aurez probablement besoin d'un repository pour chaque entité.

    Création des Services : Les services contiennent la logique métier de votre application. Vous aurez probablement besoin d'un service pour chaque entité.

    Création des Contrôleurs : Les contrôleurs sont responsables de la manipulation des requêtes et des réponses HTTP. Vous aurez probablement besoin d'un contrôleur pour chaque entité.

    Création des Modules : Les modules sont un moyen efficace d'organiser votre application en séparant celle-ci en plusieurs modules indépendants.

    Sécurité : Vous devrez également vous assurer que votre application est sécurisée. Cela peut inclure l'implémentation de l'authentification et de l'autorisation, la validation des données entrantes, etc.
    
############################## - prisma - ######################################## 
npx prisma db push 
