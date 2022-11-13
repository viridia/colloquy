import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient();

export interface IBoardInfo {
  id: string;
  title?: string;
  exists: boolean;
}

// TODO: replace with graphql query.
export async function getBoardInfo(_request: Request): Promise<IBoardInfo> {
  const boardId = 'local';
  const board = await db.board.findUnique({
    where: {
      id: boardId,
    },
  });

  return {
    id: boardId,
    title: board?.name,
    exists: Boolean(board),
  };
}
