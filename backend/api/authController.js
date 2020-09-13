const { User } = require('./models');
const jwt = require('jsonwebtoken');


const login = async (req, res) => {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ msg: 'Missing Authorization Header' });
    }
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    if (username && password) {
        console.log(username, password);
        try {
            const user = await User.findOne({
                where: {
                    email: username,
                },
            });
            if (user) {
                if (user.password === password) {
                    // generate jwt token 
                    const token = jwt.sign({ id: user.id, role: user.role }, "top-secret-key");
                    return res.status(200).json({ token: token });
                } else {
                    console.log('Bad Request: Incorrect Password');
                    return res.status(400).json({ msg: 'Bad Request: Incorrect Password' });
                }
            }
            else {
                console.log('Bad Request: User not found');
                return res.status(400).json({ msg: 'Bad Request: User not found' });
            }


        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: 'Internal server error' });
        }
    }
    console.log('Bad Request: Email and password don\'t match');
    return res.status(400).json({ msg: 'Bad Request: Email and password don\'t match' });
};


module.exports = { login }