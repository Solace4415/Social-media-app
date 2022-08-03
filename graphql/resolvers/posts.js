const Post = require("../../models/Post");
const checkAuth = require("../../utils/check-auth");
const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(err);
      }
    },

    async getPost(parent, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createPost(parent, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      // context.pubsub.publish("NEW_POST", {
      //   newPost: post,
      // });

      return post;
    },
    async deletePost(parent, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);

        if (user.username === post.username) {
          await post.delete(postId);

          return "Post deleted Successfully";
        } else {
          throw new AuthenticationError("Action not Allowed");
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    async likePost(parent, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          //Post already liked, unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          //Post not liked, like it
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();

        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
  },
};
