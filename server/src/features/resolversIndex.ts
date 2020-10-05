import { LctnQueries } from './lctn';
import { GsrsQueries } from './gsrs';

// import GraphQLJSON from 'graphql-type-json';

const rootResolver = {
  // JSON: GraphQLJSON,
  Query: {
    ...LctnQueries,
    ...GsrsQueries
    // Add other queries here
  }
};

export default rootResolver;