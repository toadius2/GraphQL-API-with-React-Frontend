const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
} = require('graphql');

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'A user',
    fields: () => ({
        id: {
            type: GraphQLInt,
            resolve: (user) => user.id,
        },
        firstName: {
            type: GraphQLString,
            resolve: (user) => user.firstName,
        },
        lastName: {
            type: GraphQLString,
            resolve: (user) => user.lastName,
        },
        email: {
            type: GraphQLInt,
            resolve: (user) => user.email,
        },
        role: {
            type: GraphQLInt,
            resolve: (user) => user.role,
        },
    }),
});
const ProductType = new GraphQLObjectType({
    name: 'Product',
    description: 'A product',
    fields: () => ({
        id: {
            type: GraphQLInt,
            resolve: (product) => product.id,
        },
        name: {
            type: GraphQLString,
            resolve: (product) => product.name,
        },
        description: {
            type: GraphQLString,
            resolve: (product) => product.description,
        },
        price: {
            type: GraphQLInt,
            resolve: (product) => product.price,
        },
    }),
});

module.exports = { UserType, ProductType };
