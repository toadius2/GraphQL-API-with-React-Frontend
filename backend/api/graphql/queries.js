const {
    GraphQLInt,
    GraphQLString,
    GraphQLList,
} = require('graphql');

const { ProductType } = require('./types');
const { Product } = require('../models');

const getProducts = {
    type: new GraphQLList(ProductType),
    resolve: async (product, args, context) => {
        if (context.user.role === 'admin') {
            return new Promise((resolve, reject) => {
                Product.findAll().then(result => {
                    resolve(result);
                }).catch(err => {
                    reject();
                })
            });
        }
        else {
            return new Promise((resolve, reject) => {
                Product.findAll({
                    where: {
                        owner: context.user.id
                    }
                }).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject();
                })
            });
        }
    }
};




module.exports = { getProducts };