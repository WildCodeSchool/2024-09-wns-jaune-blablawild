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
  depature_city: Scalars['String']['input'];
  depature_time: Scalars['DateTimeISO']['input'];
  driverId: Scalars['String']['input'];
  price: Scalars['Float']['input'];
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
  getTrip: Array<Trip>;
  getTripById: Array<Trip>;
};


export type QueryGetTripByIdArgs = {
  tripId: Scalars['String']['input'];
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
  depature_city: Scalars['String']['output'];
  depature_time: Scalars['DateTimeISO']['output'];
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

export type GetTripByIdQueryVariables = Exact<{
  tripId: Scalars['String']['input'];
}>;


export type GetTripByIdQuery = { __typename?: 'Query', getTripById: Array<{ __typename?: 'Trip', id: string }> };


export const GetTripByIdDocument = gql`
    query GetTripById($tripId: String!) {
  getTripById(tripId: $tripId) {
    id
  }
}
    `;

/**
 * __useGetTripByIdQuery__
 *
 * To run a query within a React component, call `useGetTripByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTripByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTripByIdQuery({
 *   variables: {
 *      tripId: // value for 'tripId'
 *   },
 * });
 */
export function useGetTripByIdQuery(baseOptions: Apollo.QueryHookOptions<GetTripByIdQuery, GetTripByIdQueryVariables> & ({ variables: GetTripByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTripByIdQuery, GetTripByIdQueryVariables>(GetTripByIdDocument, options);
      }
export function useGetTripByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTripByIdQuery, GetTripByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTripByIdQuery, GetTripByIdQueryVariables>(GetTripByIdDocument, options);
        }
export function useGetTripByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTripByIdQuery, GetTripByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTripByIdQuery, GetTripByIdQueryVariables>(GetTripByIdDocument, options);
        }
export type GetTripByIdQueryHookResult = ReturnType<typeof useGetTripByIdQuery>;
export type GetTripByIdLazyQueryHookResult = ReturnType<typeof useGetTripByIdLazyQuery>;
export type GetTripByIdSuspenseQueryHookResult = ReturnType<typeof useGetTripByIdSuspenseQuery>;
export type GetTripByIdQueryResult = Apollo.QueryResult<GetTripByIdQuery, GetTripByIdQueryVariables>;