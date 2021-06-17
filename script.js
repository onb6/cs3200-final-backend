const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');

var app = express();
app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'liv',
    password: '',
    database: 'proj',
    multipleStatements: true
    });

mysqlConnection.connect((err)=> {
        if(!err)
        console.log('Connection Established Successfully');
        else
        console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
        });

//Establish the server connection
//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/stat', function (req, res) {
    var country = req.query.country;
    var year = req.query.year; 
    var season = req.query.season

    mysqlConnection.query(
        `select 
            o.rank, 
            s.title song_name, 
            c.name country, 
            o.chart_year year, 
            o.chart_time_period season
        from on_chart_in o
        join song s using (song_id)
        join country c using (country_id)
        where c.name = ${country} and o.chart_year = ${year} and o.chart_time_period = ${season}
        order by o.rank;`, (err, rows, fields) => {
            if (!err)
            res.send(rows);
            else
            console.log(err);
        })
} );

app.get('/artist' , (req, res) => {
    mysqlConnection.query('SELECT * FROM artist', (err, rows, fields) => {
    if (!err)
    res.send(rows);
    else
    console.log(err);
    })
    } );

app.get('/country' , (req, res) => {
    mysqlConnection.query('SELECT * FROM country', (err, rows, fields) => {
    if (!err)
    res.send(rows);
    else
    console.log(err);
    })
    } );

app.get('/genre' , (req, res) => {
    mysqlConnection.query('SELECT * FROM genre', (err, rows, fields) => {
    if (!err)
    res.send(rows);
    else
    console.log(err);
    })
    } );

app.get('/song' , (req, res) => {
    mysqlConnection.query('SELECT * FROM song', (err, rows, fields) => {
    if (!err)
    res.send(rows);
    else
    console.log(err);
    })
    } );