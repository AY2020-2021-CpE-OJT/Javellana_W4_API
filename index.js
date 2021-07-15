const Express = require("express");
const cors = require("cors");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL = 'mongodb+srv://m001-student:m001-mongodb-basics@sandbox.nkho1.mongodb.net/heroes?retryWrites=true&w=majority';
const DATABASE_NAME = "heroes";


var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', function(req, res) {
    res.send('iron man');
});
console.log('Listening to port 5000...');
app.listen(5000, () => {
    MongoClient.connect(CONNECTION_URL, { useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        heroDatabase = client.db(DATABASE_NAME);
        marvelCollection = heroDatabase.collection("marvel");
        console.log("Connected to `" + DATABASE_NAME + "`!");
        phonebookDatabase = client.db('Phonebook');
        person = phonebookDatabase.collection('Person');

        app.post('/bayani', (req, res) => {
            if (req.body.name == 'batman') return res.status(400).send('That is not a marvel hero');
            if (!req.body.name) return res.status(400).send('Name cannot be empty');

            marvelCollection.insertOne(req.body, (error, result) => {
                if(error) return res.status(500).send(error);
                res.send('Succesfully inserted a document');
            });
        });

        app.get("/bayani", (req, res) => {
            marvelCollection.find({}).toArray((error, result) => {
                if(error) return res.status(500).send(error)
                res.send(result);
            });
        });

        app.get('/person', (req, res) => {
            person.find({}).toArray((error, result) => {
                if(error) return res.status(500).send(error);
                res.send(result);
            });
        });

        app.get('/person/documents', (req, res) => {
            person.countDocuments({}, (error, result) => {
                res.json(result);
            });
        });
    });
});