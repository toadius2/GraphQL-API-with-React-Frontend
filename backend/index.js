const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const http = require('http');
const jwt = require('jsonwebtoken');
const expressJwt = require("express-jwt");
const multer = require("multer");


const { schema } = require('./api/graphql');
const auth = require('./api/authorizationPolicy');
const { User, Product } = require('./api/models');
const authController = require('./api/authController');
const sequelize = require('./config/database');

const api = express();
const server = http.Server(api);

api.use(cors());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());
api.use(expressJwt({ secret: "top-secret-key", algorithms: ["HS256"], credentialsRequired: false }));

api.post('/graphql', (req, res, next) => auth(req, res, next));
api.get('/login', (req, res) => authController.login(req, res));

const upload = multer({
    dest: "./images"
});

api.get('/test', (req, res) => {
    Product.findAll().then(result => {
        res.json(result);
    });
});

api.post('/upload-image', upload.single("file"), (req, res) => {
    const parts = req.header('Authorization').split(' ');

    if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];
        if (/^Bearer$/.test(scheme)) {
            tokenToVerify = credentials;
        } else {
            return res.status(401).json({ msg: 'Format for Authorization: Bearer [token]' });
        }
        const decodedToken = jwt.decode(credentials);
        console.log(req);
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "./images/" + decodedToken.id + ".png");

        if (path.extname(req.file.originalname).toLowerCase() === ".png") {
            fs.rename(tempPath, targetPath, err => {
                if (err) return handleError(err, res);
                res.status(200).json({ 'status': 'success' });
            });
        } else {
            fs.unlink(tempPath, err => {
                if (err) return handleError(err, res);
                res.status(403).json({ 'status': 'failed' });
            });

        }
    }
    else {
        return res.status(401).json({ msg: 'Format for Authorization: Bearer [token]' });
    }
});


const graphQLServer = new ApolloServer({
    schema,
    context: ({ req }) => {
        const user = req.user || null;
        return { user };
    }
});

graphQLServer.applyMiddleware({
    app: api,
    cors: {
        origin: true,
        credentials: true,
        methods: ['POST'],
        allowedHeaders: [
            'X-Requested-With',
            'X-HTTP-Method-Override',
            'Content-Type',
            'Accept',
            'Authorization',
            'Access-Control-Allow-Origin',
        ],
    },
    playground: {
        settings: {
            'editor.theme': 'light',
        },
    },
});

server.listen(8080, async () => {
    await sequelize.sync({ force: false });
    User.count().then(count => {
        if (count <= 0) {
            try {
                User.create({ id: null, firstName: 'Adam', lastName: 'Wolf', email: 'adamwolf@gmail.com', password: 'password', role: 'admin' });
                User.create({ id: null, firstName: 'Hritik', lastName: 'Wadhwa', email: 'hritikwadhwa@gmail.com', password: 'password', role: 'regular-user' });
                User.create({ id: null, firstName: 'Hardik', lastName: 'Chugh', email: 'hardikchugh@gmail.com', password: 'password', role: 'regular-user' });
                User.create({ id: null, firstName: 'Bhavna', lastName: 'Singh', email: 'bhavnasingh@gmail.com', password: 'password', role: 'regular-user' });
                User.create({ id: null, firstName: 'Akshay', lastName: 'Singh', email: 'akshaywadhwa@gmail.com', password: 'password', role: 'regular-user' });
            }
            catch (ex) {
                console.log(ex);
            }
        }
    })
    console.log(`Server running at localhost:8080`);
});