import 'dotenv/config';

import express from 'express';
import mysql from 'mysql2/promise';
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
//for Express to get values using the POST method
app.use(express.urlencoded({extended:true}));
//setting up database connection pool, replace values in red
const pool = mysql.createPool({
    host: "sh4ob67ph9l80v61.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: process.env.DB_USERNAME,
    password: process.env.DB_PWD,
    database: "pyn5h5u7iu857dd2",
    connectionLimit: 10,
    waitForConnections: true
});
//routes
app.get('/', async (req, res) => {
   let sql = `SELECT authorId, firstName, lastName
              FROM authors
              ORDER BY lastName`;
   const [authors] = await pool.query(sql);              
   res.render('home.ejs', {authors})
});

//API to get the author information based on an author Id
app.get('/api/author/:author_Id', async (req, res) => {
    console.log(req);
   let authorId = req.params.author_Id
   let sql = `SELECT *
              FROM authors
              WHERE authorId = ?`;
   const [authorInfo] = await pool.query(sql,[authorId]);              
   res.send(authorInfo);//displays info in JSON format
});


app.get('/searchByAuthor', async (req, res) => {
   let authorId = req.query.authorId;
   let sql = ``;
   const [rows] = await pool.query(sql);              
   res.render('quotes.ejs', {rows})
});
//Searching quotes by keyword
//NEVER have user input within the SQL statement!!
app.get("/searchByKeyword", async(req, res) => {
   try {
        //console.log(req);
        let keyword = req.query.keyword;
        let sql = `SELECT quote, firstName, lastName
                   FROM quotes
                   NATURAL JOIN authors
                   WHERE quote LIKE ? `;
        let sqlParams = [`%${keyword}%`];
        const [rows] = await pool.query(sql, sqlParams);
        res.render("quotes.ejs", {rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest


app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest
app.listen(3000, ()=>{
    console.log("Express server running")
})