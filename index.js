const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//use middleware
app.use(cors());
app.use(express.json());

// user : mydbuser
// pass : ZIi3z3usqJGPb51h



const uri = "mongodb+srv://mydbuser:ZIi3z3usqJGPb51h@cluster0.kd4xv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const userCollection = client.db("foodExpress").collection("users");

        // GET user : 
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        // get user for update
        app.get('/user/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        // POSt user : add a new user
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log('adding new user', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result)
        });

        // update user for put
        app.put('/user/:id', async(req, res) => {
            const id = req.params.id;
            const updatedUSer = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc ={
                $set: {
                    name: updatedUSer.name,
                    email: updatedUSer.email
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // DELETE user 
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        // const user = {name: 'portugal' , email: 'portu@gmail.com'};
        
        // console.log(`User inserted with id: ${result.insertedId}`)
    }
    finally{
        // await client.close();
    } 

}

run().catch(console.dir);

// client.connect(err => {
//   const collection = client.db("foodExpress").collection("users");
//   console.log('db connected');
//   // perform actions on the collection object
//   client.close();
// });


app.get('/', (req, res) =>{
    res.send('Running my node crud server');
});

app.listen(port, () => {
    console.log('CRUD SERVER IS RUNNING');
});