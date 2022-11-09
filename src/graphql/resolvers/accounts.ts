import { db } from '../../db/client';
import { Resolvers } from '../types';

const accounts: Resolvers = {
  Query: {
    account(_, { username }) {
      return db.user
        .findUnique({
          where: {
            username,
          },
        })
        .then(user =>
          user
            ? {
                username: user.username,
                displayName: user.displayName,
                avatar: '', // TODO
              }
            : null
        );
    },
  },

  // Mutation: {
  //   createChannel: async (_parent, { channel }) => {
  //     return db.channel.create({ data: { public: true, ...channel } });
  //   },
  // },
};

export default accounts;
