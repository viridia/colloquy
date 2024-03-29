import { getGraphQLParameters, processRequest } from 'graphql-helix';
import { APIEvent } from 'solid-start';
import { getServerSession } from '../../auth/session';
import { schema } from '../../graphql/schema';

export async function GET({ request }: APIEvent) {
  const session = await getServerSession(request);

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
    contextFactory: () => ({ session }),
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

export async function POST({ request }: APIEvent) {
  const session = await getServerSession(request);

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
    contextFactory: () => ({ session }),
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
