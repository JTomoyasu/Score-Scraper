$(document).ready(function(){
    $.get("/scrape",function(data){
        console.log("step 1 complete");
    }).then(function(err){
        if(err){
            console.log(err);
        }
        $.getJSON("/articles", function(resp){
            for(var i=0; i<resp.length; i++){
                $(".article-container").append("<p data-id='" + resp[i]._id + "'>" + resp[i].title + "<br />" + resp[i].link + "<br />"+resp[i].summary+"</p>");
            }
        });
    });
});
// $(".comment-area").append("<h2>" + data.title + "</h2>");
// // An input to enter a new title
// $(".comment-area").append("<input id='titleinput' name='title' >");
// // A textarea to add a new comment body
// $(".comment-area").append("<textarea id='bodyinput' name='body'></textarea>");
// // A button to submit a new comment, with the id of the article saved to it
// $(".comment-area").append("<button data-id='" + data._id + "' id='savecomment'>Save Note</button>");

// // If there's a comment in the article
// if (data.comment) {
//     // Place the title of the comment in the title input
//     $("#titleinput").val(data.comment.title);
//     // Place the body of the comment in the body textarea
//     $("#bodyinput").val(data.comment.body);
// }