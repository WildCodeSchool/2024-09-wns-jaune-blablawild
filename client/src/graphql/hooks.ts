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
  JSON: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type BookTripInput = {
  seatsCount?: InputMaybe<Scalars['Float']['input']>;
  tripId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type CancelTripBookingInput = {
  tripId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type CheckoutSession = {
  __typename?: 'CheckoutSession';
  expiresAt: Scalars['Float']['output'];
  message?: Maybe<Scalars['String']['output']>;
  sessionId: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
  transactionId?: Maybe<Scalars['ID']['output']>;
  url: Scalars['String']['output'];
};

export type CreateCheckoutSessionInput = {
  allowPromotionCodes?: Scalars['Boolean']['input'];
  cancelUrl?: InputMaybe<Scalars['String']['input']>;
  currency?: Scalars['String']['input'];
  customerEmail?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  method?: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  receiverId: Scalars['ID']['input'];
  senderId: Scalars['ID']['input'];
  successUrl?: InputMaybe<Scalars['String']['input']>;
  tripId: Scalars['ID']['input'];
};

export type CreateTripInput = {
  arrival_address: Scalars['String']['input'];
  arrival_city: Scalars['String']['input'];
  capacity: Scalars['Float']['input'];
  departure_address: Scalars['String']['input'];
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

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  bookTrip: Scalars['String']['output'];
  cancelTripBooking: Scalars['String']['output'];
  createCheckoutSession: CheckoutSession;
  createTrip: Scalars['String']['output'];
  leaveReview: Scalars['String']['output'];
  login: Scalars['String']['output'];
  patchProfile: Profile;
  signup: Scalars['String']['output'];
  updatePassword: Scalars['String']['output'];
  uploadProfileImage: Profile;
};


export type MutationBookTripArgs = {
  data: BookTripInput;
};


export type MutationCancelTripBookingArgs = {
  data: CancelTripBookingInput;
};


export type MutationCreateCheckoutSessionArgs = {
  input: CreateCheckoutSessionInput;
};


export type MutationCreateTripArgs = {
  data: CreateTripInput;
};


export type MutationLeaveReviewArgs = {
  data: ReviewInput;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationPatchProfileArgs = {
  profileInput: ProfileInput;
  userId: Scalars['String']['input'];
};


export type MutationSignupArgs = {
  data: NewUserInput;
};


export type MutationUpdatePasswordArgs = {
  data: UpdatePasswordInput;
};


export type MutationUploadProfileImageArgs = {
  file: Scalars['Upload']['input'];
  userId: Scalars['String']['input'];
};

export type NewUserInput = {
  email: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Profile = {
  __typename?: 'Profile';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type ProfileInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  getPopularTrip: Array<Trip>;
  getProfile: Profile;
  getReviewsByUser: Array<Review>;
  getTransactionBySessionId?: Maybe<Transaction>;
  getTrip: Array<Trip>;
  getTripById: Trip;
  getTripByUser: Array<Trip>;
  getUserById: User;
  getUsers: Array<User>;
};


export type QueryGetProfileArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetReviewsByUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetTransactionBySessionIdArgs = {
  sessionId: Scalars['String']['input'];
};


export type QueryGetTripArgs = {
  data: FilterTripInput;
};


export type QueryGetTripByIdArgs = {
  tripId: Scalars['String']['input'];
};


export type QueryGetTripByUserArgs = {
  asPassenger?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['String']['input'];
};

export type Review = {
  __typename?: 'Review';
  comment: Scalars['String']['output'];
  date: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  notation: Scalars['Float']['output'];
  receiver: User;
  reviewRequested: Scalars['Boolean']['output'];
  sender: User;
  trip: Trip;
};

export type ReviewInput = {
  comment: Scalars['String']['input'];
  date: Scalars['String']['input'];
  notation: Scalars['Float']['input'];
  receiver: Scalars['String']['input'];
  reviewRequested?: InputMaybe<Scalars['Boolean']['input']>;
  sender: Scalars['String']['input'];
  trip: Scalars['String']['input'];
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
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  isCompleted: Scalars['Boolean']['output'];
  isFailed: Scalars['Boolean']['output'];
  isPending: Scalars['Boolean']['output'];
  method: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  receiver: User;
  sender: User;
  status: Scalars['String']['output'];
  stripe_payment_intent_id?: Maybe<Scalars['String']['output']>;
  stripe_session_id?: Maybe<Scalars['String']['output']>;
  trip: Trip;
};

export type Trip = {
  __typename?: 'Trip';
  arrival_address?: Maybe<Scalars['String']['output']>;
  arrival_city: Scalars['String']['output'];
  capacity: Scalars['Float']['output'];
  departure_address?: Maybe<Scalars['String']['output']>;
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

export type UpdatePasswordInput = {
  confirmPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  driver_trips?: Maybe<Array<Trip>>;
  email: Scalars['String']['output'];
  firstname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastname: Scalars['String']['output'];
  passenger_trips?: Maybe<Array<Trip>>;
  password: Scalars['String']['output'];
  pot: Scalars['Float']['output'];
  profile?: Maybe<Profile>;
  received_review?: Maybe<Array<Review>>;
  sent_review?: Maybe<Array<Review>>;
  transaction_received?: Maybe<Array<Transaction>>;
  transaction_sent?: Maybe<Array<Transaction>>;
};

export type CreateTripMutationVariables = Exact<{
  data: CreateTripInput;
}>;


export type CreateTripMutation = { __typename?: 'Mutation', createTrip: string };

export type BookTripMutationVariables = Exact<{
  data: BookTripInput;
}>;


export type BookTripMutation = { __typename?: 'Mutation', bookTrip: string };

export type LeaveReviewMutationVariables = Exact<{
  data: ReviewInput;
}>;


export type LeaveReviewMutation = { __typename?: 'Mutation', leaveReview: string };

export type SignupMutationVariables = Exact<{
  data: NewUserInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: string };

export type LoginMutationVariables = Exact<{
  data: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: string };

export type PatchProfileMutationVariables = Exact<{
  profileInput: ProfileInput;
  userId: Scalars['String']['input'];
}>;


export type PatchProfileMutation = { __typename?: 'Mutation', patchProfile: { __typename?: 'Profile', description?: string | null, image?: string | null, phoneNumber?: string | null } };

export type UpdatePasswordMutationVariables = Exact<{
  data: UpdatePasswordInput;
}>;


export type UpdatePasswordMutation = { __typename?: 'Mutation', updatePassword: string };

export type GetTripByIdQueryVariables = Exact<{
  tripId: Scalars['String']['input'];
}>;


export type GetTripByIdQuery = { __typename?: 'Query', getTripById: { __typename?: 'Trip', id: string, departure_city: string, arrival_city: string, departure_time: any, price: number, capacity: number, status: TripStatus, passengers?: Array<{ __typename?: 'User', firstname: string, id: string, profile?: { __typename?: 'Profile', image?: string | null } | null }> | null, driver?: { __typename?: 'User', firstname: string, id: string, profile?: { __typename?: 'Profile', image?: string | null } | null } | null } };

export type GetPopularTripQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPopularTripQuery = { __typename?: 'Query', getPopularTrip: Array<{ __typename?: 'Trip', id: string, departure_city: string, arrival_city: string, price: number }> };

export type GetTripQueryVariables = Exact<{
  data: FilterTripInput;
}>;


export type GetTripQuery = { __typename?: 'Query', getTrip: Array<{ __typename?: 'Trip', id: string, departure_time: any, departure_city: string, capacity: number, arrival_city: string, price: number, driver?: { __typename?: 'User', id: string, firstname: string, lastname: string } | null, passengers?: Array<{ __typename?: 'User', id: string, firstname: string, lastname: string }> | null }> };

export type GetTripByUserQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  filter?: InputMaybe<Scalars['String']['input']>;
  asPassenger: Scalars['Boolean']['input'];
}>;


export type GetTripByUserQuery = { __typename?: 'Query', getTripByUser: Array<{ __typename?: 'Trip', id: string, departure_city: string, arrival_city: string, price: number, capacity: number, departure_time: any, status: TripStatus, passengers?: Array<{ __typename?: 'User', firstname: string, id: string }> | null, driver?: { __typename?: 'User', id: string, firstname: string } | null, reviews?: Array<{ __typename?: 'Review', comment: string, reviewRequested: boolean, id: string, notation: number, date: any, sender: { __typename?: 'User', firstname: string, id: string }, receiver: { __typename?: 'User', firstname: string, id: string } }> | null }> };

export type GetProfileQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetProfileQuery = { __typename?: 'Query', getProfile: { __typename?: 'Profile', id: string, phoneNumber?: string | null, image?: string | null, description?: string | null, user?: { __typename?: 'User', firstname: string, lastname: string, id: string } | null } };

export type GetReviewsByUserQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetReviewsByUserQuery = { __typename?: 'Query', getReviewsByUser: Array<{ __typename?: 'Review', comment: string, date: any, notation: number, id: string, sender: { __typename?: 'User', firstname: string, id: string, profile?: { __typename?: 'Profile', image?: string | null } | null }, receiver: { __typename?: 'User', firstname: string } }> };

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', getUserById: { __typename?: 'User', email: string, firstname: string, id: string, lastname: string, profile?: { __typename?: 'Profile', image?: string | null } | null } };


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
export const BookTripDocument = gql`
    mutation BookTrip($data: BookTripInput!) {
  bookTrip(data: $data)
}
    `;
export type BookTripMutationFn = Apollo.MutationFunction<BookTripMutation, BookTripMutationVariables>;

/**
 * __useBookTripMutation__
 *
 * To run a mutation, you first call `useBookTripMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBookTripMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bookTripMutation, { data, loading, error }] = useBookTripMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useBookTripMutation(baseOptions?: Apollo.MutationHookOptions<BookTripMutation, BookTripMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BookTripMutation, BookTripMutationVariables>(BookTripDocument, options);
      }
export type BookTripMutationHookResult = ReturnType<typeof useBookTripMutation>;
export type BookTripMutationResult = Apollo.MutationResult<BookTripMutation>;
export type BookTripMutationOptions = Apollo.BaseMutationOptions<BookTripMutation, BookTripMutationVariables>;
export const LeaveReviewDocument = gql`
    mutation LeaveReview($data: ReviewInput!) {
  leaveReview(data: $data)
}
    `;
export type LeaveReviewMutationFn = Apollo.MutationFunction<LeaveReviewMutation, LeaveReviewMutationVariables>;

/**
 * __useLeaveReviewMutation__
 *
 * To run a mutation, you first call `useLeaveReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveReviewMutation, { data, loading, error }] = useLeaveReviewMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLeaveReviewMutation(baseOptions?: Apollo.MutationHookOptions<LeaveReviewMutation, LeaveReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LeaveReviewMutation, LeaveReviewMutationVariables>(LeaveReviewDocument, options);
      }
export type LeaveReviewMutationHookResult = ReturnType<typeof useLeaveReviewMutation>;
export type LeaveReviewMutationResult = Apollo.MutationResult<LeaveReviewMutation>;
export type LeaveReviewMutationOptions = Apollo.BaseMutationOptions<LeaveReviewMutation, LeaveReviewMutationVariables>;
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
export const LoginDocument = gql`
    mutation Login($data: LoginInput!) {
  login(data: $data)
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const PatchProfileDocument = gql`
    mutation PatchProfile($profileInput: ProfileInput!, $userId: String!) {
  patchProfile(profileInput: $profileInput, userId: $userId) {
    description
    image
    phoneNumber
  }
}
    `;
export type PatchProfileMutationFn = Apollo.MutationFunction<PatchProfileMutation, PatchProfileMutationVariables>;

/**
 * __usePatchProfileMutation__
 *
 * To run a mutation, you first call `usePatchProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePatchProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [patchProfileMutation, { data, loading, error }] = usePatchProfileMutation({
 *   variables: {
 *      profileInput: // value for 'profileInput'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function usePatchProfileMutation(baseOptions?: Apollo.MutationHookOptions<PatchProfileMutation, PatchProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PatchProfileMutation, PatchProfileMutationVariables>(PatchProfileDocument, options);
      }
export type PatchProfileMutationHookResult = ReturnType<typeof usePatchProfileMutation>;
export type PatchProfileMutationResult = Apollo.MutationResult<PatchProfileMutation>;
export type PatchProfileMutationOptions = Apollo.BaseMutationOptions<PatchProfileMutation, PatchProfileMutationVariables>;
export const UpdatePasswordDocument = gql`
    mutation UpdatePassword($data: UpdatePasswordInput!) {
  updatePassword(data: $data)
}
    `;
export type UpdatePasswordMutationFn = Apollo.MutationFunction<UpdatePasswordMutation, UpdatePasswordMutationVariables>;

/**
 * __useUpdatePasswordMutation__
 *
 * To run a mutation, you first call `useUpdatePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePasswordMutation, { data, loading, error }] = useUpdatePasswordMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdatePasswordMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePasswordMutation, UpdatePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePasswordMutation, UpdatePasswordMutationVariables>(UpdatePasswordDocument, options);
      }
export type UpdatePasswordMutationHookResult = ReturnType<typeof useUpdatePasswordMutation>;
export type UpdatePasswordMutationResult = Apollo.MutationResult<UpdatePasswordMutation>;
export type UpdatePasswordMutationOptions = Apollo.BaseMutationOptions<UpdatePasswordMutation, UpdatePasswordMutationVariables>;
export const GetTripByIdDocument = gql`
    query GetTripById($tripId: String!) {
  getTripById(tripId: $tripId) {
    id
    departure_city
    arrival_city
    departure_time
    price
    capacity
    status
    passengers {
      firstname
      id
      profile {
        image
      }
    }
    driver {
      profile {
        image
      }
      firstname
      id
    }
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
    capacity
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
    query GetTripByUser($userId: String!, $filter: String, $asPassenger: Boolean!) {
  getTripByUser(userId: $userId, filter: $filter, asPassenger: $asPassenger) {
    id
    departure_city
    arrival_city
    price
    passengers {
      firstname
      id
    }
    driver {
      id
      firstname
    }
    capacity
    departure_time
    status
    reviews {
      comment
      reviewRequested
      id
      notation
      date
      sender {
        firstname
        id
      }
      receiver {
        firstname
        id
      }
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
 *      asPassenger: // value for 'asPassenger'
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
export const GetProfileDocument = gql`
    query GetProfile($userId: String!) {
  getProfile(userId: $userId) {
    id
    phoneNumber
    image
    description
    user {
      firstname
      lastname
      id
    }
  }
}
    `;

/**
 * __useGetProfileQuery__
 *
 * To run a query within a React component, call `useGetProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetProfileQuery(baseOptions: Apollo.QueryHookOptions<GetProfileQuery, GetProfileQueryVariables> & ({ variables: GetProfileQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
      }
export function useGetProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
        }
export function useGetProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
        }
export type GetProfileQueryHookResult = ReturnType<typeof useGetProfileQuery>;
export type GetProfileLazyQueryHookResult = ReturnType<typeof useGetProfileLazyQuery>;
export type GetProfileSuspenseQueryHookResult = ReturnType<typeof useGetProfileSuspenseQuery>;
export type GetProfileQueryResult = Apollo.QueryResult<GetProfileQuery, GetProfileQueryVariables>;
export const GetReviewsByUserDocument = gql`
    query GetReviewsByUser($userId: String!) {
  getReviewsByUser(userId: $userId) {
    comment
    date
    notation
    id
    sender {
      firstname
      id
      profile {
        image
      }
    }
    receiver {
      firstname
    }
  }
}
    `;

/**
 * __useGetReviewsByUserQuery__
 *
 * To run a query within a React component, call `useGetReviewsByUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReviewsByUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReviewsByUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetReviewsByUserQuery(baseOptions: Apollo.QueryHookOptions<GetReviewsByUserQuery, GetReviewsByUserQueryVariables> & ({ variables: GetReviewsByUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReviewsByUserQuery, GetReviewsByUserQueryVariables>(GetReviewsByUserDocument, options);
      }
export function useGetReviewsByUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReviewsByUserQuery, GetReviewsByUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReviewsByUserQuery, GetReviewsByUserQueryVariables>(GetReviewsByUserDocument, options);
        }
export function useGetReviewsByUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetReviewsByUserQuery, GetReviewsByUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetReviewsByUserQuery, GetReviewsByUserQueryVariables>(GetReviewsByUserDocument, options);
        }
export type GetReviewsByUserQueryHookResult = ReturnType<typeof useGetReviewsByUserQuery>;
export type GetReviewsByUserLazyQueryHookResult = ReturnType<typeof useGetReviewsByUserLazyQuery>;
export type GetReviewsByUserSuspenseQueryHookResult = ReturnType<typeof useGetReviewsByUserSuspenseQuery>;
export type GetReviewsByUserQueryResult = Apollo.QueryResult<GetReviewsByUserQuery, GetReviewsByUserQueryVariables>;
export const GetUserByIdDocument = gql`
    query GetUserById($id: String!) {
  getUserById(id: $id) {
    email
    firstname
    id
    profile {
      image
    }
    lastname
  }
}
    `;

/**
 * __useGetUserByIdQuery__
 *
 * To run a query within a React component, call `useGetUserByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserByIdQuery(baseOptions: Apollo.QueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables> & ({ variables: GetUserByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
      }
export function useGetUserByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
        }
export function useGetUserByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
        }
export type GetUserByIdQueryHookResult = ReturnType<typeof useGetUserByIdQuery>;
export type GetUserByIdLazyQueryHookResult = ReturnType<typeof useGetUserByIdLazyQuery>;
export type GetUserByIdSuspenseQueryHookResult = ReturnType<typeof useGetUserByIdSuspenseQuery>;
export type GetUserByIdQueryResult = Apollo.QueryResult<GetUserByIdQuery, GetUserByIdQueryVariables>;