import { Channel } from '@prisma/client';
import { db } from '../../db/client';
import { Resolvers } from '../types';

const channels: Resolvers = {
  Query: {
    channels() {
      return db.channel.findMany();
    },
  },

  Mutation: {
    createChannel: async (_parent, { channel }) => {
      return db.channel.create({ data: channel as Channel });
    },
  },
};

export default channels;
