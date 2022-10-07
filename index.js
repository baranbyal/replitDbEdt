let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let http = require("http").Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile("/index.html", { root: "." });
});

app.get("/create", function(req, res) {
  res.sendFile("/create.html", { root: "." });
});

app.post('/create', function(req, res, next) {
  client.connect(err => {
    const dancers = client.db("drmdb").collection("dancers");

    let dancer = { name: req.body.name, surname: req.body.surname, telephone: req.body.telephone, branch: req.body.branch, attandance: req.body.attandance };

    dancers.insertOne(dancer, function(err, res) {
      if (err) throw err;
      console.log("1 dancer added");
    });

  })
  res.send("Dancer Created");
})

app.set("port", process.env.PORT || 5000);
http.listen(app.get("port"), function() {
  console.log("listening on port", app.get("port"));
});


const MongoClient = require("mongodb").MongoClient;
const mongo_username = process.env.MONGO_USERNAME;
const mongo_password = process.env.MONGO_PASSWORD;

const uri = `mongodb+srv://${mongo_username}:${mongo_password}@mongodeneme.1n0pcdf.mongodb.net/drmdb?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true });


