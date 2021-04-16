//Models----------------
const User = require("../models/user.js");
const Post = require("../models/post.js");
//Packages----------------
const formidable = require("formidable");
const fs = require("fs");

//Get user by it's Id PARAM--------------------
exports.getUserById = (req, res, next, id) => {
  User.findById(id)
    .populate("followers", "_id name username profile_photo")
    .populate("following", "_id name username profile_photo")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "No User Found in DB",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      user.profile_photo.data = undefined;

      user.followers.map((followedUser, index) => {
        followedUser.profile_photo.data = undefined;
      })
      user.following.map((followingUser, index) => {
        followingUser.profile_photo.data = undefined;
      })

      req.profile = user;
      next();
    });
};

//Get Another User--------------------
exports.getOtherUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No User Found in DB",
      });
    }
    req.OtherProfile = user._id;
    next();
  });
};

//Follow a User--------------------
exports.followUser = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.profile._id },
    },
    { new: true })
    .populate("followers", "_id name username profile_photo")
    .populate("following", "_id name username profile_photo")
    .select("-password -encry_password -salt -createdAt -updatedAt")
    .then((resultFollowedUser) => {
      User.findByIdAndUpdate(
        req.profile._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      ).populate("followers", "_id name username profile_photo")
       .populate("following", "_id name username profile_photo")
       .select("-password -encry_password -salt -createdAt -updatedAt")
       .then((result) => {
          res.json(resultFollowedUser);
        })
        .catch((err) => {
          return res.status(422).json({
            error: "Failed to Add Following",
          });
        });
      })
    .catch(err => {
      return res.status(422).json({
        error: "Failed to Follow the User",
      });
    })
};

//Unfollow a User--------------------
exports.unFollowUser = (req, res) => {
  User.findByIdAndUpdate(
    req.body.unFollowId,
    {
      $pull: { followers: req.profile._id },
    },
    { new: true }
  ).populate("followers", "_id name username profile_photo")
   .populate("following", "_id name username profile_photo")
   .select("-password -encry_password -salt -createdAt -updatedAt")
   .then((resultFollowingUser) => {
    User.findByIdAndUpdate(
      req.profile._id,
      {
        $pull: { following: req.body.unFollowId },
      },
      { new: true }
    )
      .populate("followers", "_id name username profile_photo")
      .populate("following", "_id name username profile_photo")
      .select("-password -encry_password -salt -createdAt -updatedAt")
      .then((result) => {
        res.json(resultFollowingUser);
      })
      .catch((err) => {
        return res.status(422).json({
          error: "Failed to Remove Following",
        });
      });
  })
  .catch((err) => {
    return res.status(422).json({
      error: "Failed to UnFollow the User",
    });
  })
};

//Add a profile photo--------------------
exports.addProfilePhoto = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem in Image",
      });
    }

    const { _id } = req.profile;
    User.findOne({ _id }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "Cannot find user",
        });
      }
      if (file.profile_photo) {
        if (file.profile_photo.size > 3000000) {
          return res.status(400).json({
            error: "File size is tooooo BIG",
          });
        }
        user.profile_photo.data = fs.readFileSync(file.profile_photo.path);
        user.profile_photo.contentType = file.profile_photo.type;
      }
      user.save((err, user) => {
        if (err) {
          return res.status(400).json({
            error: "Not able to save Profile Photo in DB",
          });
        }
        user.salt = undefined;
        user.encry_password = undefined;
        user.createdAt = undefined;
        user.updatedAt = undefined;
        user.profile_photo.data = undefined;
        res.json(user);
      });
    });
  });
};

//Get Profile Photo--------------------
exports.getProfilePhoto = (req, res, next) => {
  User.findOne({ _id: req.OtherProfile._id })
    .then((user) => {
      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      if (user.profile_photo) {
        res.set("Content-Type", user.profile_photo.contentType);
        return res.send(user.profile_photo.data);
      }
      next();
    })
    .catch((err) => console.log(err));
};

//Get user profile--------------------
exports.getOtherUser = (req, res) => {
  User.findOne({ _id: req.OtherProfile._id })
    .populate("followers", "_id name username profile_photo")
    .populate("following", "_id name username profile_photo")
    .then((user) => {
      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      user.profile_photo.data = undefined;
      user.followers.map((followedUser, index) => {
        followedUser.profile_photo.data = undefined;
      })
      user.following.map((followingUser, index) => {
        followingUser.profile_photo.data = undefined;
      })
      
      Post.find({ postedBy: req.OtherProfile._id })
        .populate("postedBy", "_id name username profile_photo")
        .populate("comments.postedBy", "_id name username profile_photo")
        .sort("-createdAt")
        .exec((err, posts) => {
          if (err) {
            return res.status(400).json({
              error: "Posts not found from DB",
            });
          }
          posts.map((post) => {
            post.postedBy.profile_photo.data = undefined;
            post.comments.map((com) => {
              com.postedBy.profile_photo.data = undefined;
            })
          });
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
};

//Search for a User by it's username--------------------
exports.searchUser = (req, res) => {
  let searchUserPattern = new RegExp("^" + req.body.searchUserPattern);
  User.find({ username: { $regex: searchUserPattern } })
    .then((user) => {
      user.map((user) => {
        user.salt = undefined;
        user.encry_password = undefined;
        user.createdAt = undefined;
        user.updatedAt = undefined;
        user.profile_photo.data = undefined;
      });
      if (req.body.searchUserPattern === ""){
        return res.json([])
      }
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
    });
};
