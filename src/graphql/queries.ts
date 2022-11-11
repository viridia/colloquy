import { gql } from './client';

export const channelsQuery = gql`
  query Channels {
    channels {
      id
      name
      description
      color
      public
    }
  }
`;
