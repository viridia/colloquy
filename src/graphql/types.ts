import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  JSONObject: any;
};

export type Channel = {
  __typename?: 'Channel';
  color: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  postDelay?: Maybe<Scalars['Int']>;
  public: Scalars['Boolean'];
};

export type ChannelInput = {
  color: Scalars['String'];
  description: Scalars['String'];
  name: Scalars['String'];
  postDelay?: InputMaybe<Scalars['Int']>;
  public?: InputMaybe<Scalars['Boolean']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createChannel?: Maybe<Channel>;
  createReply?: Maybe<Post>;
  createTopic?: Maybe<Post>;
  modifyChannel?: Maybe<Channel>;
};


export type MutationCreateChannelArgs = {
  channel: ChannelInput;
};


export type MutationCreateReplyArgs = {
  parent: Scalars['Int'];
  post?: InputMaybe<PostInput>;
};


export type MutationCreateTopicArgs = {
  channel: Scalars['String'];
  post?: InputMaybe<PostInput>;
};


export type MutationModifyChannelArgs = {
  channel: ChannelInput;
  channelId: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  author: UserAccount;
  authorId: Scalars['String'];
  body: Scalars['JSONObject'];
  channels?: Maybe<Array<Channel>>;
  createdAt: Scalars['DateTime'];
  editedAt: Scalars['DateTime'];
  id: Scalars['Int'];
  license?: Maybe<Scalars['String']>;
  numViews: Scalars['Int'];
  parent?: Maybe<Scalars['Int']>;
  postedAt: Scalars['DateTime'];
  replies: Array<Post>;
  respondents: Array<Scalars['String']>;
  slug: Scalars['String'];
  status: PostStatus;
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type PostInput = {
  body: Scalars['String'];
  license?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export enum PostStatus {
  Deleted = 'DELETED',
  Draft = 'DRAFT',
  Pending = 'PENDING',
  Published = 'PUBLISHED',
  Read = 'READ'
}

export type Query = {
  __typename?: 'Query';
  account?: Maybe<UserAccount>;
  channels: Array<Channel>;
  thread?: Maybe<Post>;
  topics: Array<Post>;
};


export type QueryAccountArgs = {
  username: Scalars['String'];
};


export type QueryThreadArgs = {
  postId: Scalars['Int'];
};


export type QueryTopicsArgs = {
  filters?: InputMaybe<TopicFiltersInput>;
};

export type TopicFiltersInput = {
  channel?: InputMaybe<Scalars['String']>;
};

export type UserAccount = {
  __typename?: 'UserAccount';
  avatar?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  username: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Channel: ResolverTypeWrapper<Channel>;
  ChannelInput: ChannelInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  PostInput: PostInput;
  PostStatus: PostStatus;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  TopicFiltersInput: TopicFiltersInput;
  UserAccount: ResolverTypeWrapper<UserAccount>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Channel: Channel;
  ChannelInput: ChannelInput;
  DateTime: Scalars['DateTime'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  JSONObject: Scalars['JSONObject'];
  Mutation: {};
  Post: Post;
  PostInput: PostInput;
  Query: {};
  String: Scalars['String'];
  TopicFiltersInput: TopicFiltersInput;
  UserAccount: UserAccount;
};

export type ChannelResolvers<ContextType = any, ParentType extends ResolversParentTypes['Channel'] = ResolversParentTypes['Channel']> = {
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postDelay?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  public?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createChannel?: Resolver<Maybe<ResolversTypes['Channel']>, ParentType, ContextType, RequireFields<MutationCreateChannelArgs, 'channel'>>;
  createReply?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationCreateReplyArgs, 'parent'>>;
  createTopic?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationCreateTopicArgs, 'channel'>>;
  modifyChannel?: Resolver<Maybe<ResolversTypes['Channel']>, ParentType, ContextType, RequireFields<MutationModifyChannelArgs, 'channel' | 'channelId'>>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  author?: Resolver<ResolversTypes['UserAccount'], ParentType, ContextType>;
  authorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  body?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  channels?: Resolver<Maybe<Array<ResolversTypes['Channel']>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  editedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  license?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  numViews?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  postedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  replies?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  respondents?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['PostStatus'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  account?: Resolver<Maybe<ResolversTypes['UserAccount']>, ParentType, ContextType, RequireFields<QueryAccountArgs, 'username'>>;
  channels?: Resolver<Array<ResolversTypes['Channel']>, ParentType, ContextType>;
  thread?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryThreadArgs, 'postId'>>;
  topics?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, Partial<QueryTopicsArgs>>;
};

export type UserAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserAccount'] = ResolversParentTypes['UserAccount']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Channel?: ChannelResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  UserAccount?: UserAccountResolvers<ContextType>;
};

