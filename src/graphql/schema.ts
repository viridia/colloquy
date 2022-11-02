import { buildSchema } from 'graphql';
import schemaString from '../../graphql/schema.graphql?raw';
import { makeExecutableSchema } from '@graphql-tools/schema';
import channel from './resolvers/channel';

export const schema = makeExecutableSchema({
  typeDefs: buildSchema(schemaString),
  resolvers: [
    channel
  ]
});
