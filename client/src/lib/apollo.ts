import { useUserStore } from "@/store/useUserStore";
import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "/api",
  credentials: 'include'
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (
    (networkError && 'statusCode' in networkError && networkError.statusCode === 401) ||
    (graphQLErrors && graphQLErrors.some(err => 
      err.message === "Non autorisé" || 
      err.extensions?.code === "UNAUTHENTICATED"))
    ) {
      console.log("Logout appelé, nettoyage du store");
      useUserStore.getState().logout();
      window.location.href = "/";
    }
});

const authLink = setContext((_, { headers }) => {
  const token = useUserStore.getState().token;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: from([
    errorLink,
    authLink,
    httpLink
  ]),
  cache: new InMemoryCache(),
});

export default client;
