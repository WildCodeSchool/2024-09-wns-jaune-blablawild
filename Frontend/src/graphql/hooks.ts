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
  departure_city: Scalars['String']['input'];
  departure_time: Scalars['DateTimeISO']['input'];
  driverId: Scalars['String']['input'];
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
  getPopularTrip: Array<Trip>;
  getTrip: Array<Trip>;
};


export type QueryGetTripArgs = {
  data: FilterTripInput;
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
  driver: User;
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

export type GetPopularTripQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPopularTripQuery = { __typename?: 'Query', getPopularTrip: Array<{ __typename?: 'Trip', departure_city: string, arrival_city: string, price: number }> };

export type GetTripQueryVariables = Exact<{
  data: FilterTripInput;
}>;


export type GetTripQuery = { __typename?: 'Query', getTrip: Array<{ __typename?: 'Trip', id: string, departure_time: any, departure_city: string, arrival_city: string, price: number, driver: { __typename?: 'User', id: string, firstname: string, lastname: string }, passengers?: Array<{ __typename?: 'User', id: string, firstname: string, lastname: string }> | null }> };


export const GetPopularTripDocument = gql`
    query GetPopularTrip {
  getPopularTrip {
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