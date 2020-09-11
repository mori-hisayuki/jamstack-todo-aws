const AWS = require('aws-sdk')
const {v4: uuid} = require('uuid')

var credentials = new AWS.SharedIniFileCredentials({profile: 'application_develop'})
AWS.config.credentials = credentials
AWS.config.region = 'ap-northeast-1'

const table = 'todos'
const doClient = new AWS.DynamoDB.DocumentClient()

run = async () => {
    const params = {
        TableName: table,
        Item: {
            pk: 'user#1',
            sk: `todo#${uuid()}`,
            data: {
                createdAt: Date.now(),
                updatedAt: Date.now(),
                done: false
            }
        }
    }
    const result = await doClient.put(params).promise().catch(err => console.log(err))
    console.log(result)
}

run()