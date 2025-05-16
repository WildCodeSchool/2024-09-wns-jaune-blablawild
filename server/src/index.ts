import "reflect-metadata";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import { dataSource } from "./config/db";
import { TripResolver } from "./resolvers/tripResolver";
import { UserResolver } from "./resolvers/userResolver";
import { ReviewResolver } from "./resolvers/reviewsResolver";
import { ProfileResolver } from "./resolvers/userProfileResolver";
import { expressMiddleware } from "@apollo/server/express4";
import { createServer } from "http";
import { checkToken } from "./services/UserServices";

async function StartGraphQLServer() {
  await dataSource.initialize();

  const schema = await buildSchema({
    resolvers: [TripResolver, UserResolver, ReviewResolver, ProfileResolver],
    authChecker: ({ context }) => {
      if (!context.user) return false;
      return true;
    },
  });

  const app = express();
  const httpServer = createServer(app)

  const options = {
    context: checkToken
  }; 

  const server = new ApolloServer({ 
    schema
   });

  await server.start()

  app.use(
    "/",
    express.json(),
    expressMiddleware(server, options)
  )

  // Démarrer le serveur HTTP
  httpServer.listen(4100, () => {
    console.log(`🚀 Server ready at http://localhost:4100/`);
  })
}
          
  StartGraphQLServer().catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
  });
          