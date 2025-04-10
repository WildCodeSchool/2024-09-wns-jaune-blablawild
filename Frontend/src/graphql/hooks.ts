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
  sortBy?: InputMaybe<SortOption>;
  startDate: Scalars['DateTimeISO']['input'];
  timeOptions?: InputMaybe<Array<TimeOption>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createTrip: Scalars['String']['output'];
  signup: Scalars['String']['output'];
};


export type MutationCreateTripArgs = {
  data: CreateTripInput;
};


export type MutationSignupArgs = {
  data: NewUserInput;
};

export type NewUserInput = {
  email: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getPopularTrip: Array<Trip>;
  getTrip: Array<Trip>;
  getTripByUser: Array<Trip>;
  getUsers: Array<User>;
};


export type QueryGetTripArgs = {
  data: FilterTripInput;
};


export type QueryGetTripByUserArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
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

/** Options for sorting trips */
export enum SortOption {
  Price = 'PRICE',
  Time = 'TIME'
}

/** Options for filtering by time of day */
export enum TimeOption {
  After_18 = 'After_18',
  Before_6 = 'Before_6',
  From_6To_12 = 'From_6To_12',
  From_12To_18 = 'From_12To_18'
}

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
  image?: Maybe<Scalars['String']['output']>;
  lastname: Scalars['String']['output'];
  passenger_trips?: Maybe<Array<Trip>>;
  password: Scalars['String']['output'];
  pot: Scalars['Float']['output'];
  received_review?: Maybe<Array<Review>>;
  sent_review?: Maybe<Array<Review>>;
  transaction_received?: Maybe<Array<Transaction>>;
  transaction_sent?: Maybe<Array<Transaction>>;
};

export type CreateTripMutationVariables = Exact<{
  data: CreateTripInput;
}>;


export type CreateTripMutation = { __typename?: 'Mutation', createTrip: string };

export type SignupMutationVariables = Exact<{
  data: NewUserInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: string };

export type GetPopularTripQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPopularTripQuery = { __typename?: 'Query', getPopularTrip: Array<{ __typename?: 'Trip', id: string, departure_city: string, arrival_city: string, price: number }> };

export type GetTripQueryVariables = Exact<{
  data: FilterTripInput;
}>;


export type GetTripQuery = { __typename?: 'Query', getTrip: Array<{ __typename?: 'Trip', id: string, departure_time: any, departure_city: string, arrival_city: string, price: number, driver?: { __typename?: 'User', id: string, firstname: string, lastname: string } | null, passengers?: Array<{ __typename?: 'User', id: string, firstname: string, lastname: string }> | null }> };

export type GetTripByUserQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTripByUserQuery = { __typename?: 'Query', getTripByUser: Array<{ __typename?: 'Trip', id: string, departure_time: any, departure_city: string, arrival_city: string, price: number, passengers?: Array<{ __typename?: 'User', id: string, firstname: string }> | null }> };


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
export const SignupDocument = gql`
    mutation Signup($data: NewUserInput!) {
  signup(data: $data)
}
    `;
export type SignupMutationFn = Apollo.MutationFunction<SignupMutation, SignupMutationVariables>;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupMutation, { data, loading, error }] = useSignupMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSignupMutation(baseOptions?: Apollo.MutationHookOptions<SignupMutation, SignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, options);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = Apollo.MutationResult<SignupMutation>;
export type SignupMutationOptions = Apollo.BaseMutationOptions<SignupMutation, SignupMutationVariables>;
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
export const GetTripByUserDocument = gql`
    query GetTripByUser($userId: String!, $filter: String) {
  getTripByUser(userId: $userId, filter: $filter) {
    id
    departure_time
    departure_city
    arrival_city
    price
    passengers {
      id
      firstname
    }
  }
}
    `;

/**
 * __useGetTripByUserQuery__
 *
 * To run a query within a React component, call `useGetTripByUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTripByUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTripByUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetTripByUserQuery(baseOptions: Apollo.QueryHookOptions<GetTripByUserQuery, GetTripByUserQueryVariables> & ({ variables: GetTripByUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTripByUserQuery, GetTripByUserQueryVariables>(GetTripByUserDocument, options);
      }
export function useGetTripByUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTripByUserQuery, GetTripByUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTripByUserQuery, GetTripByUserQueryVariables>(GetTripByUserDocument, options);
        }
export function useGetTripByUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTripByUserQuery, GetTripByUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTripByUserQuery, GetTripByUserQueryVariables>(GetTripByUserDocument, options);
        }
export type GetTripByUserQueryHookResult = ReturnType<typeof useGetTripByUserQuery>;
export type GetTripByUserLazyQueryHookResult = ReturnType<typeof useGetTripByUserLazyQuery>;
export type GetTripByUserSuspenseQueryHookResult = ReturnType<typeof useGetTripByUserSuspenseQuery>;
export type GetTripByUserQueryResult = Apollo.QueryResult<GetTripByUserQuery, GetTripByUserQueryVariables>;