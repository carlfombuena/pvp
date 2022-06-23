const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const https = require("https");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
  // res.send("hello there");
  res.sendFile(__dirname + "/index.html");
});
app.get("/signup",function(req,res){
  res.sendFile(__dirname + "/signup.html");
})
app.post("/signup",function(req,res){
  const first = req.body.fname;
  const last = req.body.lname;
  const email = req.body.em;
  console.log(first,last,email);
  const data =  {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: first,
          LNAME: last
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us2.api.mailchimp.com/3.0/lists/937a60495c";

  const options = {
    method: "POST",
    auth: "carlfombuena:c93f445a61fc2ffb36a8756c01f2654d-us2"
  };
  const request = https.request(url, options, function(response){
    if( response.statusCode === 200){
      res.sendFile(__dirname+ "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    };
    response.on("data", function(data){
      // console.log(JSON.parse(data));
    })
  });


  request.write(jsonData);
  request.end();
  // api key
  // c93f445a61fc2ffb36a8756c01f2654d-us2
  // list id
  // 937a60495c
});

app.post("/fail", function(req,res){
  res.redirect("/signup")
});
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
