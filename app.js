//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const { forEach } = require("lodash");
var _ = require("lodash");
const mongoose = require('mongoose');


const homeStartingContent = "This blog is your personal space where you can document your daily thoughts, experiences, and reflections. By subscribing to this blog, you have taken the first step towards creating a daily journaling practice. Through this blog, we will explore a range of topics, including mindfulness, productivity, relationships, and more.My hope is that this blog will inspire and motivate you to take some time out of your day to reflect on your experiences and emotions. Journaling is an incredibly powerful tool for self - discovery and personal growth.It allows you to develop a deeper understanding of yourself and the world around you.By regularly documenting your thoughts and experiences, you can gain insights into your patterns of behavior and thought, identify areas of your life that need attention, and develop a greater sense of clarity and purpose. Thank you for subscribing to this blog and embarking on this journey of self - discovery with me. I look forward to sharing daily insights and musings with you!";
const aboutContent = "Welcome to the blog, your personal sanctuary for journaling and self-expression. We understand the importance of capturing moments, reflections, and the journey of personal growth. Here, we provide a space for you to share your thoughts, experiences, and stories in the form of a digital journal. Our mission is to inspire and empower individuals to embrace the art of journaling as a means of self-discovery and mindfulness. Whether you're a seasoned journaler or just starting your journaling journey, this is your supportive platform to pour out your thoughts, dreams, and daily musings.";
const contactContent = "Have questions, feedback, or just want to connect? We'd love to hear from you! Reach out to our team using the following contact options: For general inquiries, partnership opportunities, or any other matters, drop us an email at contact@yourjournalblog.com. If you need technical assistance, encounter issues with the website, or have specific questions, please fill out our Contact Form for dedicated support.";

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
