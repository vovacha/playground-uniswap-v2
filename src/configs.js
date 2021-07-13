const dotenv = require('dotenv')

const envName = process.env.FRONTRUN_ENV
const fileName = `configs/${envName}.env`
dotenv.config({'path': fileName, 'debug': true})

module.exports = {
    privateKey: process.env.PLAYGROUND_PRIVATE_KEY,
    nodeUrl: process.env.PLAYGROUND_NODE_URL,
}
