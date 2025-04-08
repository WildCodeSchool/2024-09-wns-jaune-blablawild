import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { dataSource } from "./config/db";
import { TripResolver } from "./resolvers/tripResolver";
import { FiltersResolver } from "./resolvers/filtersResolver";
import { UserResolver } from "./resolvers/userResolver";
async function StartGraphQLServer() {
  await dataSource.initialize();
  const schema = await buildSchema({
    resolvers: [TripResolver, FiltersResolver, UserResolver],
  });

  const server = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4100 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

StartGraphQLServer();
