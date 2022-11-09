import { getGraphQLParameters, processRequest } from 'graphql-helix';
import { APIEvent } from 'solid-start';
import { getSessionStorage } from '../../auth/session';
import { schema } from '../../graphql/schema';

export function GET({ request, params }: APIEvent) {
  console.log('GET', params, request);
  return new Response('Hello World');
}

export async function POST({ request }: APIEvent) {
  const storage = getSessionStorage();
  const session = await storage.getSession(request.headers.get('Cookie'));

  // Convert request properties into a form that graphql-helix likes.
  const body = await request.json();
  const url = new URL(request.url);
  const requestData = {
    body,
    headers: request.headers,
    method: request.method,
    query: url.search,
  };

  const { query, variables, operationName } = getGraphQLParameters(requestData);
  const result = await processRequest({
    schema,
    query,
    variables,
    operationName,
    request: requestData,
    contextFactory: () => ({ session, board: 'local' }),
  });

  if (result.type === 'RESPONSE') {
    const headers: Record<string, string> = {};
    result.headers.forEach(({ name, value }) => {
      headers[name] = value;
    });
    return new Response(JSON.stringify(result.payload), { status: result.status, headers });
  } else {
    // TODO
    return new Response(undefined, { status: 500 });
  }
}
