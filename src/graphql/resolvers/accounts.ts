import type { Session } from 'solid-start/session/sessions';
import { db } from '../../db/client';
import { Resolvers } from '../types';

const accounts: Resolvers<{ session: Session }> = {
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
