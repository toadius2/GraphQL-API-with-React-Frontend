const {
    GraphQLSchema,
    GraphQLObjectType,
} = require('graphql');

const { getProducts } = require('./queries');
const {
    login,
    addProduct,
    updateProduct,
    deleteProduct,
} = require('./mutations');

const RootQuery = new GraphQLObjectType({
    name: 'rootQuery',
    description: 'This is the root query which holds all possible READ entrypoints for the GraphQL API',
    fields: () => ({
        getProducts: getProducts,
    }),
});

const RootMutation = new GraphQLObjectType({
    name: 'rootMutation',
    description: 'This is the root mutation which holds all possible WRITE entrypoints for the GraphQL API',
    fields: () => ({
        login,
        addProduct,
        updateProduct,git
        deleteProduct,
    }),
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});

module.exports = { schema };
