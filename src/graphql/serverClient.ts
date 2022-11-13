import { execute, parse } from 'graphql';
import { IServerSession } from '../auth/session';
import { schema } from './schema';

interface IRequestArgs {
  session: IServerSession;
  variables?: Record<string, unknown>;
  operationName: string;
  query: string;
}

/** Execute a GraphQL query on the server. */
export async function runQuery<Result = unknown>(args: IRequestArgs) {
  const result = await execute({
    schema,
    document: parse(args.query),
    variableValues: args.variables,
    contextValue: { session: args.session },
    operationName: args.operationName,
  });
  if (result.errors && result.errors.length > 0) {
    const firstError = result.errors[0];
    if (firstError instanceof Error) {
      throw firstError;
    }
    // console.log(typeof firstError);
    // console.log(firstError);
    throw new Error('GQL error');
  }
  return normalize(result?.data) as Result;
}

// Needed because graphql creates objects with null prototypes, which serialize weirdly.
function normalize<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map(normalize) as T;
  } else if (input && typeof input === 'object') {
    if (Object.getPrototypeOf(input) === null) {
      const output: Record<string, unknown> = {};
      for (const key in input) {
        output[key] = normalize(input[key]);
      }
      return output as T;
    } else {
      for (const key in input) {
        input[key] = normalize(input[key]);
      }
    }
    return input;
  } else {
    return input;
  }
}
