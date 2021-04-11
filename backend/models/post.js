const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

//Post Schema--------------------
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    snippet: {
      type: String,
      required: true,
    },
    snippetLang: {
      type: String,
      required: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    likes: [{ type: ObjectId, ref: "User", default: [] }],
    comments: [{
        comment: {
            type: String,
        },
        postedBy: {
            type: ObjectId,
            ref: "User",
        },
      }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);