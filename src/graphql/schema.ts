import { buildSchema } from 'graphql';
import schemaString from '../../graphql/schema.graphql?raw';
import { makeExecutableSchema } from '@graphql-tools/schema';
import accounts from './resolvers/accounts';
import channels from './resolvers/channels';
import { Session } from 'solid-start/session/sessions';

export const schema = makeExecutableSchema({
  typeDefs: buildSchema(schemaString),
  resolvers: [accounts, channels],
});

export interface RootType {
  session: Session;
  board: string;
}
