import { buildSchema } from 'graphql';
import schemaString from '../../graphql/schema.graphql?raw';
import { makeExecutableSchema } from '@graphql-tools/schema';
import accounts from './resolvers/accounts';
import channels from './resolvers/channels';
import posts from './resolvers/posts';
import { IServerSession } from '../auth/session';

export const schema = makeExecutableSchema({
  typeDefs: buildSchema(schemaString),
  resolvers: [accounts, channels, posts],
});

export interface QueryContext {
  session: IServerSession;
}
