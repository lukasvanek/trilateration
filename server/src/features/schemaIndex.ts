import { gql } from 'apollo-server-express';
import { ApolloServerExpressConfig } from 'apollo-server-express';
import resolvers from './resolversIndex';
import LctnSchema from './lctn/schema';

const MainTypeDefs = gql`

  type Query {
    lctns: [Lctn],
    lctnsOfProfile(guid: String): [Lctn],
    profile(guid: String): Profile
  }

`;

const schema: ApolloServerExpressConfig = {
  typeDefs: [MainTypeDefs, LctnSchema],
  resolvers,
  introspection: true,
  context: async ({ req, connection, payload }: any) => {
    if (connection) {
      return { isAuth: payload.authToken };
    }
    return { isAuth: req.isAuth };
  },
  playground: true
};

export default schema;