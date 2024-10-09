const Comment = require("../models/comment");
const Posts = require("../models/post");
const User = require("../models/user");

//post function
const createPost = async (req, res) => {
  const { userId, title, content } = req.body;

  try {
    const newPost = new Posts({
      userId,
      title,
      content,
      comments: [],
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.postId).populate(
      "userId",
      "username"
    );
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Comment function
const createComment = async (req, res) => {
  const { userId, postId, content } = req.body;

  try {
    const newComment = new Comment({
      userId,
      postId,
      content,
    });

    const savedComment = await newComment.save();

    // Now, add the comment to the post's comments array
    const post = await Posts.findById(postId);
    post.comments.push(savedComment._id);
    await post.save();

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPostWithComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Posts.findById(postId)
      .populate("userId", "username email") // Populate the user who created the post
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "username email", // Populate user details for each comment
        },
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPost,
  createComment,
  getPostWithComments,
  getPost,
};
