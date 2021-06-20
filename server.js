const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');

var app = express();
app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    // host: "us-cdbr-iron-east-02.cleardb.net",
    // user: "b7e2437887xxxa",
    // password: "0200xxx6",
    // database: "heroku_7643ec736354xxx",
    host: "localhost",
    user: "liv",
    password: "Remydog18!",
    database: "project",
    multipleStatements: true
    });

mysqlConnection.connect((err)=> {
        if(!err)
        console.log('Connection Established Successfully');
        else
        console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
        });

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/by-season', function (req, res) {
    var country = req.query.country;
    var year = req.query.year; 
    var season = req.query.season

    mysqlConnection.query(
        `select 
        o.rank, 
        s.title song_name, 
        c.name country, 
        o.year year, 
        o.season season
        from on_chart_on o
        join song s using (song_id)
        join country c using (country_id)
        where c.name = "${country}" and o.year = ${year} and o.season = "${season}"
        order by o.rank;`, (err, rows, fields) => {
            if (!err)
            res.json(rows);
            else
            console.log(err);
        })
} );

app.get('/all-time', function (req, res) {
    var country = req.query.country;

    mysqlConnection.query(
        `select 
        o.rank, 
        s.title song_name, 
        c.name country, 
        o.year year, 
        o.season season
        from on_chart_on o
        join song s using (song_id)
        join country c using (country_id)
        where c.name = "${country}"
        order by o.streams desc;`, (err, rows, fields) => {
            if (!err)
            return res.json(rows);
            else
            console.log(err);
        })
} );

app.get('/compare-song-by-season' , (req, res) => {
    let country1 = req.query.country1;
    let country2 = req.query.country2;
    let year = req.query.year; 
    let season = req.query.season

    mysqlConnection.query(
        `select distinct o.rank, s.title, s.url, a.name "artist", g.title "genre", o.streams
        from on_chart_on o
        join song s on (o.song_id = s.song_id)
        join country c on (o.country_id = c.country_id)
        join artist a on (a.artist_id = s.artist_id)
        join genre g on (g.genre_id = a.artist_id)
        where c.name = "${country1}" and o.year = ${year} and o.season = "${season}" and s.song_id in (
            select s.song_id
            from on_chart_on o
            join song s on (o.song_id = s.song_id)
            join country c on (o.country_id = c.country_id)
            join artist a on (a.artist_id = s.artist_id)
            join genre g on (g.genre_id = a.artist_id)
            where c.name = "${country2}" and o.year = ${year} and o.season = "${season}")
        order by o.rank, o.streams
        limit 10;`, (err, rows, fields) => {
    if (!err) {
        console.log(country1, country2, year, season, rows);
        return res.json(rows);
    }
    else {
        console.log(err);
    }
    })
} );

app.get('/compare-song-all-time' , (req, res) => {
    var country1 = req.query.country1;
    var country2 = req.query.country2;

    mysqlConnection.query(
        `select distinct s.title, s.url, a.name "artist", g.title "genre", o.rank, o.streams
        from on_chart_on o
        join song s on (o.song_id = s.song_id)
        join country c on (o.country_id = c.country_id)
        join artist a on (a.artist_id = s.artist_id)
        join genre g on (g.genre_id = a.artist_id)
        where c.name = "${country1}" and s.song_id in (
            select s.song_id
            from on_chart_on o
            join song s on (o.song_id = s.song_id)
            join country c on (o.country_id = c.country_id)
            join artist a on (a.artist_id = s.artist_id)
            join genre g on (g.genre_id = a.artist_id)
            where c.name = "${country2}")
        order by o.rank, o.streams
        limit 10;`, (err, rows, fields) => {
    if (!err)
    res.json(rows);
    else
    console.log(err);
    })
} );

app.get('/compare-artist-by-season' , (req, res) => {
    var country1 = req.query.country1;
    var country2 = req.query.country2;
    var year = req.query.year; 
    var season = req.query.season

    mysqlConnection.query(
        `select distinct a.name "artist"
        from on_chart_on o
        join song s on (o.song_id = s.song_id)
        join country c on (o.country_id = c.country_id)
        join artist a on (a.artist_id = s.artist_id)
        where c.name = "${country1}" and o.year = ${year} and o.season = "${season}" and a.artist_id in (
            select a.artist_id
            from on_chart_on o
            join song s on (o.song_id = s.song_id)
            join country c on (o.country_id = c.country_id)
            join artist a on (a.artist_id = s.artist_id)
            where c.name = "${country2}" and o.year = ${year} and o.season = "${season}"
            group by artist_id
            order by sum(o.streams) desc)
        group by artist
        order by sum(o.streams) desc
        limit 3;`, (err, rows, fields) => {
    if (!err)
    res.json(rows);
    else
    console.log(err);
    })
} );

app.get('/compare-artist-all-time' , (req, res) => {
    var country1 = req.query.country1;
    var country2 = req.query.country2;

    mysqlConnection.query(
        `select distinct a.name "artist"
        from on_chart_on o
        join song s on (o.song_id = s.song_id)
        join country c on (o.country_id = c.country_id)
        join artist a on (a.artist_id = s.artist_id)
        where c.name = "${country1}" and a.artist_id in (
            select a.artist_id
            from on_chart_on o
            join song s on (o.song_id = s.song_id)
            join country c on (o.country_id = c.country_id)
            join artist a on (a.artist_id = s.artist_id)
            where c.name = "${country2}"
            group by artist_id
            order by sum(o.streams) desc)
        group by artist
        order by sum(o.streams) desc
        limit 3;`, (err, rows, fields) => {
    if (!err)
    res.json(rows);
    else
    console.log(err);
    })
} );

app.get('/compare-genre-by-season' , (req, res) => {
    var country1 = `${req.query.country1}`;
    var country2 = `${req.query.country2}`;
    var year = `${req.query.year}`; 
    var season = `${req.query.season}`;

    mysqlConnection.query(
        `select distinct g.title "genre"
        from on_chart_on o
        join song s on (o.song_id = s.song_id)
        join country c on (o.country_id = c.country_id)
        join artist a on (a.artist_id = s.artist_id)
        join genre g on (g.genre_id = a.artist_id)
        where c.name = "${country1}" and o.year = ${year} and o.season = "${season}" and g.genre_id in (
        select g.genre_id
        from on_chart_on o
        join song s on (o.song_id = s.song_id)
        join country c on (o.country_id = c.country_id)
        join artist a on (a.artist_id = s.artist_id)
        join genre g on (g.genre_id = a.artist_id)
        where c.name = "${country2}" and o.year = ${year} and o.season = "${season}"
        group by genre_id
        order by sum(o.streams) desc)
        group by genre
        order by sum(o.streams) desc
        limit 3;`, (err, rows, fields) => {
    if (!err)
    res.json(rows);
    else
    console.log(err);
    })
} );

app.get('/compare-genre-all-time' , (req, res) => {
    var country1 = req.query.country1;
    var country2 = req.query.country2;

    mysqlConnection.query(
        `select distinct g.title "genre"
        from on_chart_on o
        join song s on (o.song_id = s.song_id)
        join country c on (o.country_id = c.country_id)
        join artist a on (a.artist_id = s.artist_id)
        join genre g on (g.genre_id = a.artist_id)
        where c.name = "${country1}" and g.genre_id in (
            select g.genre_id
            from on_chart_on o
            join song s on (o.song_id = s.song_id)
            join country c on (o.country_id = c.country_id)
            join artist a on (a.artist_id = s.artist_id)
            join genre g on (g.genre_id = a.artist_id)
            where c.name = "${country2}"
            group by genre_id
            order by sum(o.streams) desc)
        group by genre
        order by sum(o.streams) desc
        limit 3;`, (err, rows, fields) => {
    if (!err)
    res.json(rows);
    else
    console.log(err);
    })
} );