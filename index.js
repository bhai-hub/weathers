const express= require("express");
const app = express();
const ejs = require("ejs");
var path = require('path');
var bodyParser = require('body-parser');
const http = require('http');
const { get } = require("express/lib/response");

app.use(bodyParser.urlencoded({extended:true}))
// app.use('views', static(path.join(__dirname, 'views')))
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");

var city;
app.get("/", (req,res)=>{
    res.render("weather",{city: "enter the location", degC: "---", degF: "--", con: "--", icon:"https://cdn4.iconfinder.com/data/icons/cloud-networking/24/Error-Cloud-512.png", windM:"4", windK:"1", feelC:"32", feelF:"98", hum:"20"});
})

app.post("/", (req,res)=>{
    let data;
    city=req.body.weather;
    http.get('http://api.weatherapi.com/v1/current.json?key=3d8c3846d674495ba38141908210511&q=' + city + '&aqi=no', (response)=>{
        let weather = '';

        response.on('data', (chunk)=>{
            weather += chunk;
        });
        response.on('end',()=>{
            data = JSON.parse(weather);
            // console.log(data);
            let deC =data.current.temp_c;
            let def = data.current.temp_f;
            let con = data.current.condition.text;
            let icon = data.current.condition.icon;
            let wind_kph =data.current.wind_kph;
            let wind_mph =data.current.wind_mph;
            let feelF = data.current.feelslike_f;
            let feelC = data.current.feelslike_c;
            let hum = data.current.humidity;
            res.render("weather",{city: data.location.name, degC: deC, degF: def, con: con, icon:icon, windM:wind_mph, windK:wind_kph, feelC:feelC, feelF:feelF, hum:hum})
        });
    }).on("error", (error)=>{
        console.log("Error" + error.message);
});
    // res.render("weather",{city: city , degC:data.current.temp_c })
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server started on port 3000");
})