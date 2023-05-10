//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const { forEach } = require("lodash");
var _ = require("lodash");
const mongoose = require('mongoose');


const homeStartingContent = "This blog is your personal space where you can document your daily thoughts, experiences, and reflections. By subscribing to this blog, you have taken the first step towards creating a daily journaling practice. Through this blog, we will explore a range of topics, including mindfulness, productivity, relationships, and more.My hope is that this blog will inspire and motivate you to take some time out of your day to reflect on your experiences and emotions. Journaling is an incredibly powerful tool for self - discovery and personal growth.It allows you to develop a deeper understanding of yourself and the world around you.By regularly documenting your thoughts and experiences, you can gain insights into your patterns of behavior and thought, identify areas of your life that need attention, and develop a greater sense of clarity and purpose. Thank you for subscribing to this blog and embarking on this journey of self - discovery with me. I look forward to sharing daily insights and musings with you!";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogDB");

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {

  Post.find().then(posts => {
    res.render("home", {
      homeContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});
app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", async (req, res) => {
 
  const post = new Post({
    title: req.body.titleBox,
    content: req.body.postBox
  });

  try {
    await post.save();
    res.redirect("/");
  } catch (err) {
    // Handle error
  }

});

app.get("/posts/:postId", async (req, res) => {
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findOne({ _id: requestedPostId });
    res.render("post", {
      title: post.title,
      content: post.content
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
