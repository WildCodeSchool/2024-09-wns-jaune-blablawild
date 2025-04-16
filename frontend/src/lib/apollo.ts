import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:7100/api",
  cache: new InMemoryCache(),
});

export default client;
