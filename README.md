# DriveUp a carpooling app

This is a project done as part of a school projet.

## Tech used

### Client : 

- React 18 with Typescript
- Tailwind CSS 
- Apollo Client for graphql Query's and Mutations
- Zustand for state managment
- React Router for navigation
- Vitest for unit and integration testing

### Server : 

- Node.js with TypeScript
- Apollo Server for GraphQL API
- TypeORM as ORM
- PostgreSQL as database
- Jest for testing

### Development Tools :

- Docker for containerization
- GitHub Actions for CI/CD
- Playwright for E2E testing

### Prerequisites :

- Docker and Docker Compose
- Node.js (v18 or higher)
- pnpm (for client)
- npm (for server)

## Installation & setUp :

With docker (recommended)

1 Clone repository

2 Create environment file look at .env.sample for more infomration

3 Install dependencies 

```bash
cd client
pnpm install
```

```bash
cd server
npm install
```

4 Start the application

⚠️ You have to be at the root of the project

```bash
# For development environment
make dev

# For production environment
make build

# For testing environment
make test

# To stop all containers
make stop

# To clean Docker system (removes all containers, images, volumes)
make clean
```

The application will be available at : 

- FrontEnd : http://localhost:7000/ 
- Apollo playground : http://localhost:7000/API
- DataBase visualizer : http://localhost:7000/visualizer
