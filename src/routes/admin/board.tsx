import { Alert, Button, Card, createFormValidation, FormField, Input, Page } from 'dolmen/dist/mjs';
import { Show, Suspense } from 'solid-js';
import { FormError, useRouteData } from 'solid-start';
import { createServerAction$, createServerData$ } from 'solid-start/server';
import { getServerSession, PermissionLevel } from '../../auth/session';
import { boardNameSchema } from '../../auth/validation';
import { db, getBoardInfo } from '../../db/client';

// TODO: Replace with GQL query.
export function routeData() {
  return createServerData$(async (_, { request }) => {
    return await getBoardInfo(request);
  });
}

export default function BoardConfigPage() {
  const board = useRouteData<typeof routeData>();

  const [createBoard, { Form }] = createServerAction$(async (formData: FormData, { request }) => {
    const session = await getServerSession(request);
    const board = await getBoardInfo(request);

    const boardName = formData.get('boardName') as string;
    const action = formData.get('action') as string;
    const valid = boardNameSchema.safeParse(boardName);
    if (valid.success === false) {
      const issue = valid.error.issues[0];
      console.log(issue);
      throw new FormError('Validation failed');
    }

    if (action === 'rename') {
      if (session.permission < PermissionLevel.STAFF) {
        throw new FormError('Permission denied');
      }
    }

    try {
      if (action === 'rename') {
        // Rename board
        await db.board.update({
          where: {
            id: board.id,
          },
          data: {
            name: boardName,
          },
        });
      } else {
        // Create board
        await db.board.create({
          data: {
            id: board.id,
            name: boardName,
            members: {
              create: {
                rank: 'ADMIN',
                userId: session.userId,
              },
            },
          },
        });
      }
    } catch (e) {
      console.error('board config', e);
      throw new FormError('Database update returned an error');
    }
  });

  const { errors, formProps } = createFormValidation<{
    boardName: string;
  }>({
    boardName: data => {
      const valid = boardNameSchema.safeParse(data);
      if (valid.success === false) {
        const issue = valid.error.issues[0];
        return issue.message;
      }
      return undefined;
    },
  });

  return (
    <Page.Content>
      <Suspense>
        <Card w="20rem">
          <Form {...formProps}>
            <Card.Content gap="xl">
              <FormField
                title="Board name"
                description="Name of this bulletin board"
                error={errors.boardName}
              >
                <Input name="boardName" max={48} value={board()?.title} />
              </FormField>
              <Button color="primary" disabled={createBoard.error} alignSelf="end">
                <Show when={board()?.exists} fallback={<span>Create</span>}>
                  <span>Rename</span>
                </Show>
              </Button>
              <input type="hidden" name="action" value={board()?.exists ? 'rename' : 'create'} />
              <Alert when={Boolean(createBoard.error)} severity="error">
                {createBoard.error.formError}
              </Alert>
            </Card.Content>
          </Form>
        </Card>
      </Suspense>
    </Page.Content>
  );
}

// {"name":"FormError","status":400,"formError":"Action failed","fields":{},"fieldErrors":{}}
