import { buildSchema } from 'graphql';
import schemaString from '../../graphql/schema.graphql?raw';
import { makeExecutableSchema } from '@graphql-tools/schema';
import accounts from './resolvers/accounts';
import channels from './resolvers/channels';
import { IServerSession } from '../auth/session';

export const schema = makeExecutableSchema({
  typeDefs: buildSchema(schemaString),
  resolvers: [accounts, channels],
});

export interface QueryContext {
  session: IServerSession;
  board: string;
}
