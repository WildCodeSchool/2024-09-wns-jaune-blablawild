import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
};

export type CreateTripInput = {
  arrival_city: Scalars['String']['input'];
  capacity: Scalars['Float']['input'];
  departure_city: Scalars['String']['input'];
  departure_time: Scalars['DateTimeISO']['input'];
  driverId?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
};

export type FilterTripInput = {
  arrival: Scalars['String']['input'];
  departure: Scalars['String']['input'];
  endDate: Scalars['DateTimeISO']['input'];
  passengers: Scalars['Float']['input'];
  startDate: Scalars['DateTimeISO']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTrip: Scalars['String']['output'];
};


export type MutationCreateTripArgs = {
  data: CreateTripInput;
};

export type Query = {
  __typename?: 'Query';
  getCheapestTrips: Array<Trip>;
  getEarliestTrips: Array<Trip>;
  getPopularTrip: Array<Trip>;
  getTrip: Array<Trip>;
  getTripsByTime: Array<Trip>;
};


export type QueryGetCheapestTripsArgs = {
  arrival_city: Scalars['String']['input'];
  date: Scalars['DateTimeISO']['input'];
  departure_city: Scalars['String']['input'];
};


export type QueryGetEarliestTripsArgs = {
  arrival_city: Scalars['String']['input'];
  date: Scalars['DateTimeISO']['input'];
  departure_city: Scalars['String']['input'];
};


export type QueryGetTripArgs = {
  data: FilterTripInput;
};


export type QueryGetTripsByTimeArgs = {
  arrival_city: Scalars['String']['input'];
  date: Scalars['DateTimeISO']['input'];
  departure_city: Scalars['String']['input'];
  time: Scalars['String']['input'];
};

export type Review = {
  __typename?: 'Review';
  comment: Scalars['String']['output'];
  date: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  notation: Scalars['Float']['output'];
  receiver: User;
  sender: User;
  trip: Trip;
};

export type Transaction = {
  __typename?: 'Transaction';
  created_at: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  method: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  receiver: User;
  sender: User;
  status: Scalars['String']['output'];
  trip: Trip;
};

export type Trip = {
  __typename?: 'Trip';
  arrival_city: Scalars['String']['output'];
  capacity: Scalars['Float']['output'];
  departure_city: Scalars['String']['output'];
  departure_time: Scalars['DateTimeISO']['output'];
  driver?: Maybe<User>;
  id: Scalars['ID']['output'];
  passengers?: Maybe<Array<User>>;
  price: Scalars['Float']['output'];
  reviews?: Maybe<Array<Review>>;
  status: TripStatus;
  transactions?: Maybe<Array<Transaction>>;
};

/** Le statut d'un trajet (ouvert, fermé, complet) */
export enum TripStatus {
  Close = 'CLOSE',
  Full = 'FULL',
  Open = 'OPEN'
}

export type User = {
  __typename?: 'User';
  driver_trips?: Maybe<Array<Trip>>;
  email: Scalars['String']['output'];
  firstname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  lastname: Scalars['String']['output'];
  passenger_trips?: Maybe<Array<Trip>>;
  password: Scalars['String']['output'];
  pot: Scalars['Float']['output'];
  received_review?: Maybe<Array<Review>>;
  role: Scalars['String']['output'];
  sent_review?: Maybe<Array<Review>>;
  transaction_received?: Maybe<Array<Transaction>>;
  transaction_sent?: Maybe<Array<Transaction>>;
};

export type CreateTripMutationVariables = Exact<{
  data: CreateTripInput;
}>;


export type CreateTripMutation = { __typename?: 'Mutation', createTrip: string };

export type GetCheapestTripsQueryVariables = Exact<{
  date: Scalars['DateTimeISO']['input'];
  arrivalCity: Scalars['String']['input'];
  departureCity: Scalars['String']['input'];
}>;


export type GetCheapestTripsQuery = { __typename?: 'Query', getCheapestTrips: Array<{ __typename?: 'Trip', arrival_city: string, capacity: number, departure_city: string, departure_time: any, id: string, price: number, status: TripStatus, driver?: { __typename?: 'User', firstname: string, image: string, id: string } | null }> };

export type GetEarliestTripsQueryVariables = Exact<{
  date: Scalars['DateTimeISO']['input'];
  arrivalCity: Scalars['String']['input'];
  departureCity: Scalars['String']['input'];
}>;


export type GetEarliestTripsQuery = { __typename?: 'Query', getEarliestTrips: Array<{ __typename?: 'Trip', arrival_city: string, capacity: number, departure_city: string, departure_time: any, id: string, price: number, status: TripStatus, driver?: { __typename?: 'User', firstname: string, image: string, id: string } | null }> };

export type GetTripsByTimeQueryVariables = Exact<{
  date: Scalars['DateTimeISO']['input'];
  arrivalCity: Scalars['String']['input'];
  departureCity: Scalars['String']['input'];
  time: Scalars['String']['input'];
}>;


export type GetTripsByTimeQuery = { __typename?: 'Query', getTripsByTime: Array<{ __typename?: 'Trip', arrival_city: string, capacity: number, departure_city: string, departure_time: any, id: string, price: number, status: TripStatus, driver?: { __typename?: 'User', firstname: string, image: string, id: string } | null }> };

export type GetPopularTripQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPopularTripQuery = { __typename?: 'Query', getPopularTrip: Array<{ __typename?: 'Trip', id: string, departure_city: string, arrival_city: string, price: number }> };

export type GetTripQueryVariables = Exact<{
  data: FilterTripInput;
}>;


export type GetTripQuery = { __typename?: 'Query', getTrip: Array<{ __typename?: 'Trip', id: string, departure_time: any, departure_city: string, arrival_city: string, price: number, driver?: { __typename?: 'User', id: string, firstname: string, lastname: string } | null, passengers?: Array<{ __typename?: 'User', id: string, firstname: string, lastname: string }> | null }> };


export const CreateTripDocument = gql`
    mutation CreateTrip($data: CreateTripInput!) {
  createTrip(data: $data)
}
    `;
export type CreateTripMutationFn = Apollo.MutationFunction<CreateTripMutation, CreateTripMutationVariables>;

/**
 * __useCreateTripMutation__
 *
 * To run a mutation, you first call `useCreateTripMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTripMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTripMutation, { data, loading, error }] = useCreateTripMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateTripMutation(baseOptions?: Apollo.MutationHookOptions<CreateTripMutation, CreateTripMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTripMutation, CreateTripMutationVariables>(CreateTripDocument, options);
      }
export type CreateTripMutationHookResult = ReturnType<typeof useCreateTripMutation>;
export type CreateTripMutationResult = Apollo.MutationResult<CreateTripMutation>;
export type CreateTripMutationOptions = Apollo.BaseMutationOptions<CreateTripMutation, CreateTripMutationVariables>;
export const GetCheapestTripsDocument = gql`
    query GetCheapestTrips($date: DateTimeISO!, $arrivalCity: String!, $departureCity: String!) {
  getCheapestTrips(
    date: $date
    arrival_city: $arrivalCity
    departure_city: $departureCity
  ) {
    arrival_city
    capacity
    departure_city
    departure_time
    id
    price
    driver {
      firstname
      image
      id
    }
    status
  }
}
    `;

/**
 * __useGetCheapestTripsQuery__
 *
 * To run a query within a React component, call `useGetCheapestTripsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCheapestTripsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCheapestTripsQuery({
 *   variables: {
 *      date: // value for 'date'
 *      arrivalCity: // value for 'arrivalCity'
 *      departureCity: // value for 'departureCity'
 *   },
 * });
 */
export function useGetCheapestTripsQuery(baseOptions: Apollo.QueryHookOptions<GetCheapestTripsQuery, GetCheapestTripsQueryVariables> & ({ variables: GetCheapestTripsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCheapestTripsQuery, GetCheapestTripsQueryVariables>(GetCheapestTripsDocument, options);
      }
export function useGetCheapestTripsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCheapestTripsQuery, GetCheapestTripsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCheapestTripsQuery, GetCheapestTripsQueryVariables>(GetCheapestTripsDocument, options);
        }
export function useGetCheapestTripsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCheapestTripsQuery, GetCheapestTripsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCheapestTripsQuery, GetCheapestTripsQueryVariables>(GetCheapestTripsDocument, options);
        }
export type GetCheapestTripsQueryHookResult = ReturnType<typeof useGetCheapestTripsQuery>;
export type GetCheapestTripsLazyQueryHookResult = ReturnType<typeof useGetCheapestTripsLazyQuery>;
export type GetCheapestTripsSuspenseQueryHookResult = ReturnType<typeof useGetCheapestTripsSuspenseQuery>;
export type GetCheapestTripsQueryResult = Apollo.QueryResult<GetCheapestTripsQuery, GetCheapestTripsQueryVariables>;
export const GetEarliestTripsDocument = gql`
    query GetEarliestTrips($date: DateTimeISO!, $arrivalCity: String!, $departureCity: String!) {
  getEarliestTrips(
    date: $date
    arrival_city: $arrivalCity
    departure_city: $departureCity
  ) {
    arrival_city
    capacity
    departure_city
    departure_time
    id
    price
    driver {
      firstname
      image
      id
    }
    status
  }
}
    `;

/**
 * __useGetEarliestTripsQuery__
 *
 * To run a query within a React component, call `useGetEarliestTripsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEarliestTripsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEarliestTripsQuery({
 *   variables: {
 *      date: // value for 'date'
 *      arrivalCity: // value for 'arrivalCity'
 *      departureCity: // value for 'departureCity'
 *   },
 * });
 */
export function useGetEarliestTripsQuery(baseOptions: Apollo.QueryHookOptions<GetEarliestTripsQuery, GetEarliestTripsQueryVariables> & ({ variables: GetEarliestTripsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEarliestTripsQuery, GetEarliestTripsQueryVariables>(GetEarliestTripsDocument, options);
      }
export function useGetEarliestTripsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEarliestTripsQuery, GetEarliestTripsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEarliestTripsQuery, GetEarliestTripsQueryVariables>(GetEarliestTripsDocument, options);
        }
export function useGetEarliestTripsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEarliestTripsQuery, GetEarliestTripsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEarliestTripsQuery, GetEarliestTripsQueryVariables>(GetEarliestTripsDocument, options);
        }
export type GetEarliestTripsQueryHookResult = ReturnType<typeof useGetEarliestTripsQuery>;
export type GetEarliestTripsLazyQueryHookResult = ReturnType<typeof useGetEarliestTripsLazyQuery>;
export type GetEarliestTripsSuspenseQueryHookResult = ReturnType<typeof useGetEarliestTripsSuspenseQuery>;
export type GetEarliestTripsQueryResult = Apollo.QueryResult<GetEarliestTripsQuery, GetEarliestTripsQueryVariables>;
export const GetTripsByTimeDocument = gql`
    query GetTripsByTime($date: DateTimeISO!, $arrivalCity: String!, $departureCity: String!, $time: String!) {
  getTripsByTime(
    date: $date
    arrival_city: $arrivalCity
    departure_city: $departureCity
    time: $time
  ) {
    arrival_city
    capacity
    departure_city
    departure_time
    id
    price
    driver {
      firstname
      image
      id
    }
    status
  }
}
    `;

/**
 * __useGetTripsByTimeQuery__
 *
 * To run a query within a React component, call `useGetTripsByTimeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTripsByTimeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTripsByTimeQuery({
 *   variables: {
 *      date: // value for 'date'
 *      arrivalCity: // value for 'arrivalCity'
 *      departureCity: // value for 'departureCity'
 *      time: // value for 'time'
 *   },
 * });
 */
export function useGetTripsByTimeQuery(baseOptions: Apollo.QueryHookOptions<GetTripsByTimeQuery, GetTripsByTimeQueryVariables> & ({ variables: GetTripsByTimeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTripsByTimeQuery, GetTripsByTimeQueryVariables>(GetTripsByTimeDocument, options);
      }
export function useGetTripsByTimeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTripsByTimeQuery, GetTripsByTimeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTripsByTimeQuery, GetTripsByTimeQueryVariables>(GetTripsByTimeDocument, options);
        }
export function useGetTripsByTimeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTripsByTimeQuery, GetTripsByTimeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTripsByTimeQuery, GetTripsByTimeQueryVariables>(GetTripsByTimeDocument, options);
        }
export type GetTripsByTimeQueryHookResult = ReturnType<typeof useGetTripsByTimeQuery>;
export type GetTripsByTimeLazyQueryHookResult = ReturnType<typeof useGetTripsByTimeLazyQuery>;
export type GetTripsByTimeSuspenseQueryHookResult = ReturnType<typeof useGetTripsByTimeSuspenseQuery>;
export type GetTripsByTimeQueryResult = Apollo.QueryResult<GetTripsByTimeQuery, GetTripsByTimeQueryVariables>;
export const GetPopularTripDocument = gql`
    query GetPopularTrip {
  getPopularTrip {
    id
    departure_city
    arrival_city
    price
  }
}
    `;

/**
 * __useGetPopularTripQuery__
 *
 * To run a query within a React component, call `useGetPopularTripQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPopularTripQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPopularTripQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPopularTripQuery(baseOptions?: Apollo.QueryHookOptions<GetPopularTripQuery, GetPopularTripQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPopularTripQuery, GetPopularTripQueryVariables>(GetPopularTripDocument, options);
      }
export function useGetPopularTripLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPopularTripQuery, GetPopularTripQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPopularTripQuery, GetPopularTripQueryVariables>(GetPopularTripDocument, options);
        }
export function useGetPopularTripSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPopularTripQuery, GetPopularTripQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPopularTripQuery, GetPopularTripQueryVariables>(GetPopularTripDocument, options);
        }
export type GetPopularTripQueryHookResult = ReturnType<typeof useGetPopularTripQuery>;
export type GetPopularTripLazyQueryHookResult = ReturnType<typeof useGetPopularTripLazyQuery>;
export type GetPopularTripSuspenseQueryHookResult = ReturnType<typeof useGetPopularTripSuspenseQuery>;
export type GetPopularTripQueryResult = Apollo.QueryResult<GetPopularTripQuery, GetPopularTripQueryVariables>;
export const GetTripDocument = gql`
    query GetTrip($data: FilterTripInput!) {
  getTrip(data: $data) {
    id
    departure_time
    departure_city
    arrival_city
    driver {
      id
      firstname
      lastname
    }
    price
    passengers {
      id
      firstname
      lastname
    }
  }
}
    `;

/**
 * __useGetTripQuery__
 *
 * To run a query within a React component, call `useGetTripQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTripQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTripQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetTripQuery(baseOptions: Apollo.QueryHookOptions<GetTripQuery, GetTripQueryVariables> & ({ variables: GetTripQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTripQuery, GetTripQueryVariables>(GetTripDocument, options);
      }
export function useGetTripLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTripQuery, GetTripQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTripQuery, GetTripQueryVariables>(GetTripDocument, options);
        }
export function useGetTripSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTripQuery, GetTripQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTripQuery, GetTripQueryVariables>(GetTripDocument, options);
        }
export type GetTripQueryHookResult = ReturnType<typeof useGetTripQuery>;
export type GetTripLazyQueryHookResult = ReturnType<typeof useGetTripLazyQuery>;
export type GetTripSuspenseQueryHookResult = ReturnType<typeof useGetTripSuspenseQuery>;
export type GetTripQueryResult = Apollo.QueryResult<GetTripQuery, GetTripQueryVariables>;