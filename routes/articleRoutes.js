var db = require("../models");
var request = require("request");
var cheerio = require("cheerio");
// Routes
// =============================================================

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.render("index");
    });
    app.get("/scrape", function (req, res) {
        request("https://www.thescoreesports.com/home", function (error, response, html) {
            var $ = cheerio.load(html);
            $(".NewsCard__container--1KkQS").each(function (i, element) {
                var newArticle = {};
                newArticle.title = $(element).find("a").find("div.NewsCard__bodyContainer--1h9Eb").children("div.NewsCard__title--37vMp").text();
                newArticle.link = "https://www.thescoreesports.com" + $(element).find("a").attr("href");
                newArticle.summary = $(element).find("a").find("div.NewsCard__bodyContainer--1h9Eb").children("div.NewsCard__content--1VLID").text();
                db.Article.create(newArticle)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                        location.reload();
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });
        });
        res.json("success");
    });
    app.get("/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    // Route for grabbing a specific Article by id, populate it with it's Comments
    app.get("/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the Comments associated with it
            .populate("Comment")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    app.delete("/comments/:id", function (req, res) {
        db.Comment.findByIdAndRemove({ _id: req.params.id })
            .then(function (dbComment) {
                console.log(dbComment);
                res.json(dbComment);
                //location.reload();
            })
            .catch(function (err) {
                res.json(err);
            })
    });
    app.get("/comments/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Comment.findOne({ _id: req.params.id })
            .then(function (dbComment) {
                // If we were able to successfully find an ComdbComment with the given id, send it back to the client
                res.json(dbComment);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    app.post("/articles/:id", function (req, res) {
        // Create a new comment and pass the req.body to the entry
        db.Comment.create(req.body)
            .then(function (dbComment) {
                // If a Comment was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Comment
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: dbComment } });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
};