const faunadb = require('faunadb')
const q = faunadb.query

let client = new faunadb.Client({secret: process.env.FAUNA})

async function run() {
//    const results = await client.query(
//        q.Create(q.Collection('todos'), {
//            data: {
//                text: 'third',
//                done: false,
//                owner: 'user-test'
//            }
//        })
//    )
//    console.log(results.ref.id)

    const results = await client.query(
        q.Paginate(q.Match(q.Index('todos_by_user'), 'user-test'))
    )
    console.log(results)
}

run()