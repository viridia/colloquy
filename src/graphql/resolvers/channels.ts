import { GraphQLError } from 'graphql';
import { PermissionLevel } from '../../auth/session';
import { db } from '../../db/client';
import { QueryContext } from '../schema';
import { Resolvers } from '../types';

const channels: Resolvers<QueryContext> = {
  Query: {
    channels() {
      return db.channel.findMany();
    },
  },

  Mutation: {
    createChannel: async (_parent, { channel }, context) => {
      if (context.session.permission < PermissionLevel.STAFF) {
        throw new GraphQLError('Permission denied');
      }
      return db.channel.create({
        data: {
          public: true,
          board: {
            connect: {
              id: context.board,
            },
          },
          ...channel,
        },
      });
    },

    modifyChannel: async (_parent, { channelId, channel }, context) => {
      if (context.session.permission < PermissionLevel.STAFF) {
        throw new GraphQLError('Permission denied');
      }
      return db.channel.update({
        where: {
          id: channelId,
        },
        data: {
          ...channel,
        },
      });
    },
  },
};

export default channels;
