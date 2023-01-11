const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json());
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p8qnexq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const allCategories = client.db('realState').collection('categories')
        const allDetail = client.db('realState').collection('detail')
        const allComments = client.db('realState').collection('comment')
        const allUsers = client.db('realState').collection('users')
        const allBookings = client.db('realState').collection('bookings')


        app.get('/allCategories', async (req, res) => {
            const query = {};
            const result = await allCategories.find(query).toArray();
            res.send(result);
        })


        app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const first = await allCategories.findOne(query)
            const name = first.name
            const query2 = { type: name }
            const result = await allDetail.find(query2).toArray()
            res.send(result)
        })

        app.get('/detail/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await allDetail.findOne(query)
            res.send(result);
        })


        app.get('/comments/:co', async (req, res) => {
            const name = req.params.co;
            const query = { type: name }
            const result = await allComments.find(query).toArray()
            res.send(result);
        })

        app.post('/comment', async (req, res) => {
            const data = req.body;
            const result = await allComments.insertOne(data)
            res.send(result);
        })

        app.delete('/commentDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await allComments.deleteOne(query)
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const query = req.body;
            const inserted = await allUsers.findOne({ email: query.email })
            if (inserted) {
                return res.send({ message: 'Previously Added' })
            }
            const result = await allUsers.insertOne(query);
            res.send(result);
        })

        app.post('/bookings', async (req, res) => {
            const query = req.body;
            const result = await allBookings.insertOne(query);
            res.send(result);
        })

        app.get('/myBooking', async (req, res) => {
            const email = req.query.email;
            const query = { user_email: email };
            const result = await allBookings.find(query).toArray();
            res.send(result);
        })

        app.delete('/bookingDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await allBookings.deleteOne(query)
            res.send(result);
        })


        app.get('/allAggent', async (req, res) => {
            const query = {};
            const result = await allDetail.find(query).toArray();
            res.send(result)
        })

        app.get('/allUsers', async (req, res) => {
            const query = {};
            const result = await allUsers.find(query).toArray();
            res.send(result)
        })

        app.delete('/userDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await allUsers.deleteOne(query);
            res.send(result);
        })

        app.put('/makeAdmin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await allUsers.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        app.get('/allBookings', async (req, res) => {
            const query = {  };
            const result = await allBookings.find(query).toArray();
            res.send(result);
        })

        app.get('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await allUsers.findOne(query);
            res.send({ isAdmin: user?.role == 'admin' });
        })


    }


    finally {

    }
}

run().catch(console.log)


app.get('/', (req, res) => {
    res.send('Real State Server Running')
})

app.listen(port, () => {
    console.log(`Real State start on port ${port}`)
})