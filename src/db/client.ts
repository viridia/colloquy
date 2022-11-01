import { Channel, Post, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchUsers() {
  return await prisma.user.findMany();
  // console.log(allUsers);
}

export async function fetchChannels() {
  // Filter by access.
  return await prisma.channel.findMany();
}

export async function createChannel(channelInput: Channel) {
  // Verify author?
  const channelRecord = await prisma.channel.create({
    data: channelInput,
  });
  return channelRecord;
}

type PostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'postedAt' | 'status' | 'numViews'>;

export async function postToChannel(postInput: PostInput, channel: string) {
  // Verify author
  // Verify channel access.
  // const channelRecord = await prisma.channel.findUnique({
  //   where: {
  //     id: channel,
  //   },
  // });
  const postRecord = await prisma.post.create({
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
