import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';

export const articleSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Article',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        }
      }
    }
  })
});
