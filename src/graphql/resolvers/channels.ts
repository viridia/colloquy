import { db } from '../../db/client';
import { RootType } from '../schema';
import { Resolvers } from '../types';

const channels: Resolvers<RootType> = {
  Query: {
    channels() {
      return db.channel.findMany();
    },
  },

  Mutation: {
    createChannel: async (_parent, { channel }, context) => {
      return db.channel.create({
        data: {
          public: true,
          board: {
            connect: {
              name: context.board,
            },
          },
          ...channel,
        },
      });
    },
  },
};

export default channels;
