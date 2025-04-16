import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { dataSource } from "./config/db";
import * as jwt from "jsonwebtoken";
import { TripResolver } from "./resolvers/tripResolver";
import { UserResolver } from "./resolvers/userResolver";
import { ReviewResolver } from "./resolvers/reviewsResolver";




async function StartGraphQLServer() {
  await dataSource.initialize();
  const schema = await buildSchema({
    resolvers: [TripResolver, UserResolver, ReviewResolver],
    authChecker: ({context}) => {
      if (context.user) return true;
      return false
    }
  });

  const server = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4100 },
    context: async ({req, res}) => {
      if (!process.env.JWT_SECRET) return { res };
      const token = req.headers.cookie?.split("token=")[1];

      if (!token) return {res};

      const tokenContent = jwt.verify(token, process.env.JWT_SECRET);

      return {
        res, 
        user: tokenContent,
      }
    }
  });

  console.log(`🚀  Server ready at: ${url}`);
}

StartGraphQLServer();
