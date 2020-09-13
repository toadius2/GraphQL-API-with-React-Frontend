const {
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
} = require('graphql');

const jwt = require('jsonwebtoken');

const { UserType, ProductType } = require('./types');
const { User, Product } = require('../models');

const login = {
    type: UserType,
    description: 'The mutation that enables login',
    args: {
        email: {
            name: 'email',
            type: new GraphQLNonNull(GraphQLString),
        },
        password: {
            name: 'password',
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    resolve: async (value, { email, password }, context) => {
        const user = await User.findOne({
            where: {
                email: email,
                password: password
            },
        });
        if (user) {
            //return JSON.parse({ "token": jwt.sign({ "id": user.id }, "top-secret-key") });
            return user;
        }
        else {
            throw new Error('Bad Request: Username/Password incorrect');
        }
    }
};


const addProduct = {
    type: ProductType,
    description: 'The mutation that allows you to add a new product',
    args: {
        name: {
            name: 'name',
            type: new GraphQLNonNull(GraphQLString),
        },
        description: {
            name: 'description',
            type: new GraphQLNonNull(GraphQLString),
        },
        price: {
            name: 'price',
            type: new GraphQLNonNull(GraphQLInt),
        },
    },
    resolve: async (value, { name, description, price }, context) => {
        const newProduct = await Product.create({
            id: null,
            name: name,
            description: description,
            price: price,
            owner: context.user.id,
        });
        return newProduct;
    }
};

const updateProduct = {
    type: ProductType,
    description: 'The mutation that allows you to update an existing product',
    args: {
        id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLInt),
        },
        name: {
            name: 'name',
            type: new GraphQLNonNull(GraphQLString),
        },
        description: {
            name: 'description',
            type: new GraphQLNonNull(GraphQLString),
        },
        price: {
            name: 'price',
            type: new GraphQLNonNull(GraphQLInt),
        },
    },
    resolve: async (value, { id, name, description, price }, context) => {
        const foundProduct = await Product.findOne({
            where: {
                id: id,
                owner: context.user.id
            }
        })

        if (!foundProduct) {
            throw new Error(`Product with id: ${id} not found!`);
        }

        foundProduct.update({
            name: name,
            description: description,
            price: price
        })
        // write query to update product
        return foundProduct;
        //foundProd.update(updatedNote);
    },
};

const deleteProduct = {
    type: ProductType,
    description: 'The mutation that allows you to delete an existing product',
    args: {
        id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLInt),
        },
    },
    resolve: async (value, { id }, context) => {
        let foundProduct = null;
        if (context.user.role === 'admin') {
            foundProduct = await Product.findOne({
                where: {
                    id: id,
                }
            });
        } else {
            foundProduct = await Product.findOne({
                where: {
                    id: id,
                    owner: context.user.id
                }
            });
        }

        if (!foundProduct) {
            throw new Error(`Product with id: ${id} not found!`);
        }

        await Product.destroy({
            where: {
                id,
            },
        });

        return foundProduct;
    },
};


module.exports = {
    login,
    addProduct,
    updateProduct,
    deleteProduct,
};
