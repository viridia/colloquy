import { Channel, Post, PrismaClient } from '@prisma/client';

export const db = new PrismaClient();

export async function fetchUsers() {
  return await db.user.findMany();
  // console.log(allUsers);
}

export function fetchChannels(): Promise<Channel[]> {
  // Filter by access.
  return db.channel.findMany();
}

// export async function createChannel(channelInput: ChannelInput) {
//   // Verify author?
//   const channelRecord = await db.channel.create({
//     data: { public: true, ...channelInput },
//   });
//   return channelRecord;
// }

type PostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'postedAt' | 'status' | 'numViews'>;

export async function postToChannel(postInput: PostInput, channel: string) {
  // Verify author
  // Verify channel access.
  // const channelRecord = await prisma.channel.findUnique({
  //   where: {
  //     id: channel,
  //   },
  // });
  const postRecord = await db.post.create({
    data: {
      ...postInput,
      status: 'QUEUED',
    },
  });
  // Generate slug. Make sure its unique
  // Need to add to relations.
  //  Channel OR users
  //  Tags
  //  Mentions
  //  PostReplies / Threads

  // // List of transitive descendants of this post
  // origin Post[] @relation("Threads")

  // // A reference to the originating post in this thread.
  // thread   Post? @relation("Threads", fields: [threadId], references: [id])
  // threadId Int?
}
