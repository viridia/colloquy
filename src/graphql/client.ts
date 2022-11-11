import { DocumentNode } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import { createContext } from 'solid-js';
import { IServerSession } from '../auth/session';

/** Variant of gql which removes excess whitespace */
export const gql = (query: TemplateStringsArray) =>
  query
    .join(' ')
    .replace(/#.+\r?\n|\r/g, '')
    .replace(/\r?\n|\r/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

export const graphQLClient = new GraphQLClient('/_/graphql', {
  headers: {
    authorization: 'Bearer MY_TOKEN',
  },
});

export const GraphQLContext = createContext<GraphQLClient>();

interface GraphQLError {
  message: string;
}

interface ErrorResponse {
  errors: GraphQLError[];
  error: string;
  status: number;
}

/** Extract error message from a GraphQL response. */
export function decodeErrors(response: ErrorResponse) {
  if (!response) {
    return 'Unknown error (null)';
  }

  // Error format for Status 200
  if (Array.isArray(response.errors) && response.errors.length > 0) {
    const firstError = response.errors[0];
    if (firstError.message) {
      return firstError.message;
    }
  }

  console.log(response);

  // Error format for Status >400
  if (typeof response.error === 'string') {
    try {
      const error = JSON.parse(response.error);
      if (Array.isArray(error.errors) && error.errors.length > 0) {
        const firstError = error.errors[0];
        if (firstError.message) {
          return firstError.message;
        }
      }
    } catch (e) {
      // Fall through
    }
  }

  if (typeof response.status === 'number') {
    switch (response.status) {
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Permission denied';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Internal server error';
      default:
        return `HTTP error code: ${response.status}`;
    }
  }

  return 'Unknown error';
}

export interface IExecuteArgs {
  session: IServerSession,
  query: string | DocumentNode,
  variables: Record<string, unknown>
}
