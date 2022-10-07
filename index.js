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

app.get("/get", function(req, res) {
    res.sendFile("/get.html", { root: "." });

});

app.get("/get-client", function (req, res) {
    client.connect(err => {
        client.db("drmdb").collection("dancers").findOne({ name: req.query.name }, function (err, result) {
            if (err) throw err;
            res.render("update", { oldname: result.name, oldsurname: result.surname, oldtelephone: result.telephone, oldbranch: result.branch, oldattandance: result.attandance });
        });
    });
});

// Post API to update dancer
app.post("/update", function (req, res) {
    client.connect(err => {
        if (err) throw err;
        let query = {name:req.body.oldname, surname:req.body.oldsurname, telephone:req.body.oldtelephone, branch:req.body.oldbranch, attandance:req.body.oldattandance};
        let newvalues = { $set: {name:req.body.name, surname:req.body.surname, telephone:req.body.telephone, branch:req.body.branch, attandance:req.body.attandance} };

        client.db("drmdb").collection("dancers").updateOne(query, newvalues, function (err, res) {

            if (err) throw err;
            console.log("1 document updated");
            res.render("update", { message: "Dancer Updated" , oldname: req.body.name, oldsurname: req.body.surname, oldtelephone: req.body.telephone, oldbranch: req.body.branch, oldattandance: req.body.attandance});
        });
    });
});

// Post API to delete dancer
app.post("/delete", function (req, res) {
    client.connect(err => {
        if (err) throw err;
        let query = {name:req.body.name, surname:req.body.surname, telephone:req.body.telephone, branch:req.body.branch, attandance:req.body.attandance};

        client.db("drmdb").collection("dancers").deleteOne(query, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            res.send("Dancer ${req.body.name} deleted");
        });
    });
});



app.engine("pug",require("pug").__express);
app.set("views",".");
app.set("view engine","pug");

const MongoClient = require("mongodb").MongoClient;
const mongo_username = process.env.MONGO_USERNAME;
const mongo_password = process.env.MONGO_PASSWORD;

const uri = `mongodb+srv://${mongo_username}:${mongo_password}@mongodeneme.1n0pcdf.mongodb.net/drmdb?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true });


