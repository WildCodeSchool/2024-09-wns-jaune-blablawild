import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { dataSource } from "./config/db";
import { TripResolver } from "./resolvers/tripResolver";
async function StartGraphQLServer() {
  await dataSource.initialize();
  const schema = await buildSchema({
    resolvers: [TripResolver],
  });

  const server = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4100 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

StartGraphQLServer();
