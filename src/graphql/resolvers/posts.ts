import { Channel, Post as PostRecord, User } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { PermissionLevel } from '../../auth/session';
import { db } from '../../db/client';
import { QueryContext } from '../schema';
import { Post, PostStatus, Resolvers, UserAccount } from '../types';
import slugify from 'slugify';
import graphqlFields from 'graphql-fields';
import gravatar from 'gravatar';

const decodeUser = (t: User): UserAccount => ({
  username: t.username,
  displayName: t.displayName,
  avatar: t.email ? gravatar.url(t.email) : undefined,
});

const decodePost = (
  t: PostRecord & { toChannels?: Channel[]; author?: User; replies?: PostRecord[] }
): Post => ({
  id: t.id,
  authorId: t.authorId,
  author: t.author ? decodeUser(t.author) : undefined,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
  editedAt: t.editedAt,
  postedAt: t.postedAt,
  body: t.body,
  title: t.title,
  slug: t.slug,
  status: t.status as PostStatus,
  tags: t.tags,
  numViews: t.numViews,
  respondents: [],
  parent: t.parentId,
  channels: t.toChannels,
  replies: [],
  // replies: t.replies ? t.replies.map(decodePost) : [],
});

const posts: Resolvers<QueryContext> = {
  Query: {
    topics(_parent, { filters }, _context, info) {
      const fields = graphqlFields(info);
      console.log('filters', filters);
      return db.post
        .findMany({
          where: {
            parent: null,
          },
          orderBy: {
            updatedAt: 'desc',
          },
          include: {
            toChannels: !!fields.channels,
            author: !!fields.author,
          },
        })
        .then(topics => topics.map(decodePost));
    },

    thread(_parent, { postId }, _context, info) {
      const fields = graphqlFields(info);
      return db.post
        .findUnique({
          where: {
            id: postId,
          },
          include: {
            author: true,
            toChannels: !!fields.channels,
            replies: {
              include: {
                author: true,
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        })
        .then(post => decodePost(post));
    },
  },

  // TODO: Implement Post mutations.
  Mutation: {
    createTopic: async (_parent, { channel, post }, context) => {
      if (context.session.permission < PermissionLevel.VISITOR) {
        throw new GraphQLError('Permission denied');
      }
      return db.post
        .create({
          data: {
            title: post.title,
            body: post.body,
            author: {
              connect: {
                id: context.session.userId!,
              },
            },
            slug: slugify(post.title.slice(0, 64), {
              lower: true,
            }),
            toChannels: {
              connect: {
                id: channel,
              },
            },
            ...post,
          },
        })
        .then(decodePost);
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
