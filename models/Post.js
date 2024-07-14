const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    auto: true,
    unique: true
  },
  title: {
    type: String,
    default: 'null'
  },
  content: {
    type: String,
    default: 'null'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  blogId: {
    type: Schema.Types.ObjectId,
    default: "64f08094085e719848561776"
  },
  blogTitle: {
    type: String,
    default: 'null'
  },
  blogHandleUrl: {
    type: String,
    default: 'null'
  },
  blogCommentRule: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  pageTitle: {
    type: String,
    default: 'null'
  },
  metaDescription: {
    type: String,
    default: 'null'
  },
  productTags: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        required: true
      },
      productName: {
        type: String,
        default: 'null'
      },
      price: {
        type: Number,
        default: 0
      },
      urlImage: {
        type: String,
        default: 'null'
      }
    }
  ],
  newBlog: {
    type: Schema.Types.ObjectId,
    ref: 'Blog'
  },
  commentList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  likeList: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      username: {
        type: String,
        required: true
      },
      profileName:{
        type:String,
        required:true
      },
      isFollowed: {
        type: Boolean,
        default: false
      }
    }
  ],
  saveNumber: {
    type: Number,
    default: 0
  },
  viewNumber: {
    type: Number,
    default: 0
  },
  shareNumber: {
    type: Number,
    default: 0
  },
  image: [
    {
      alt: {
        type: String,
        default: 'null'
      },
      urlImage: {
        type: String,
        default: 'null'
      },
      aspect: {
        type: String,
        default: 'vertical'
      }
    }
  ],
  urlVideo: {
    type: String,
    default: 'null'
  },
  urlHandle: {
    type: String,
    default: 'null'
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  canonicalUrl: {
    type: String,
    default: 'null'
  },
  metaRobotsFollow: {
    type: String,
    default: 'null'
  },
  metaRobotsIndex: {
    type: String,
    default: 'null'
  }
});

module.exports = mongoose.model('Post', PostSchema);