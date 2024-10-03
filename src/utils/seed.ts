import connection from "../config/connection.js";
import { User, Thought } from "../models/index.js";
import { userData, thoughtData } from "./data.js";


connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('Connected!');

    let thoghtCheck = await connection.db?.listCollections({name: 'thoughts'}).toArray();
    if(thoghtCheck?.length){
        await connection.dropCollection('thoughts');
    }

    let userCheck = await connection.db?.listCollections({name: 'users'}).toArray();
    if(userCheck?.length){
        await connection.dropCollection('users');
    }

    await User.insertMany(userData);
    await Thought.insertMany(thoughtData)

    console.table(userData);
    console.table(thoughtData);
    console.info('Seeding Complete!')
    process.exit(0);
});