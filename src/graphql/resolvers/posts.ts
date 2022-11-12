import { Post as PostRecord } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { PermissionLevel } from '../../auth/session';
import { db } from '../../db/client';
import { QueryContext } from '../schema';
import { Post, PostStatus, Resolvers } from '../types';
import slugify from 'slugify';

const decodePost = (t: PostRecord): Post => ({
  id: t.id,
  authorId: t.authorId,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
  editedAt: t.editedAt,
  postedAt: t.postedAt,
  body: null,
  title: t.title,
  slug: t.slug,
  status: t.status as PostStatus,
  tags: t.tags
});

const posts: Resolvers<QueryContext> = {
  Query: {
    topics(_parent, _args, _context) {
      return db.post
        .findMany({
          where: {
            // boardId: context.session.boardId,
            parent: null,
          },
        })
        .then(topics => topics.map(decodePost));
    },
  },

  // TODO: Implement Post mutations.
  Mutation: {
    createTopic: async (_parent, { channel, post }, context) => {
      if (context.session.permission < PermissionLevel.VISITOR) {
        throw new GraphQLError('Permission denied');
      }
      return db.post.create({
        data: {
          title: post.title,
          body: post.body,
          author: {
            connect: {
              id: context.session.userId!,
            },
          },
          slug: slugify(post.title),
          toChannels: {
            connect: {
              id: channel,
            },
          },
          ...post,
        },
      }).then(decodePost);
    },

  //   modifyChannel: async (_parent, { channelId, channel }, context) => {
  //     if (context.session.permission < PermissionLevel.STAFF) {
  //       throw new GraphQLError('Permission denied');
  //     }
  //     return db.channel.update({
  //       where: {
  //         id: channelId,
  //       },
  //       data: {
  //         ...channel,
  //       },
  //     });
  //   },
  },
};

export default posts;
