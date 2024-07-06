const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    auto: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
  },
  profileName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  urlImage:{
    type: String,
    default: ""
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    default: null
  },
  countryId: {
    type: Number,
    default: null
  },
  countryName: {
    type: String,
    default: null
  },
  countryCode: {
    type: String,
    default: null
  },
  provinceId: {
    type: Number,
    default: null
  },
  provinceName: {
    type: String,
    default: null
  },
  provinceCode: {
    type: String,
    default: null
  },
  districtId: {
    type: Number,
    default: null
  },
  districtName: {
    type: String,
    default: null
  },
  districtDistrictCode: {
    type: String,
    default: null
  },
  wardId: {
    type: Number,
    default: null
  },
  wardName: {
    type: String,
    default: null
  },
  wardCode: {
    type: String,
    default: null
  },
  lastName: {
    type: String,
    default: null
  },
  firstName: {
    type: String,
    default: null
  },
  versionNo: {
    type: Number,
    default: null
  },
  status: {
    type: Number,
    default: 3
  },
  lastOrderNumber: {
    type: String,
    default: null
  },
  zipCode: {
    type: String,
    default: null
  },
  city: {
    type: String,
    default: null
  },
  totalSpent: {
    type: Number,
    default: 0.0
  },
  isAcceptMarketing: {
    type: Boolean,
    default: false
  },
  lastOrderId: {
    type: Number,
    default: null
  },
  orderCount: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    default: null
  },
  nationalPhone: {
    type: String,
    default: null
  },
  phoneCountryCode: {
    type: String,
    default: null
  },
  customerAddressPhone: {
    type: String,
    default: null
  },
  birthday: {
    type: Date,
    default: null
  },
  gender: {
    type: Number,
    // 0: Male, 1: Female, 2: Other
    default: 0
  },
  state: {
    type: String,
    default: 'Enabled'
  },
  debt: {
    type: Number,
    default: 0.0
  },
  following: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      profileName: {
        type: String,
        required: true
      },
      username: {
        type: String,
        required: true
      }
    }
  ],
  followers: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      profileName: {
        type: String,
        required: true
      },
      username: {
        type: String,
        required: true
      },
      isFollow: {
        type: Boolean,
        required: true
      }
    }
  ],
  productTags: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        auto: true,
        unique: true
      },
      productName: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      urlImage: {
        type: String,
        required: true
      },
      posts: [
        {
          postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            auto: true,
            unique: true
          },
          title: {
            type: String,
            required: true
          },
          content: {
            type: String,
            required: true
          },
          likeNumber: {
            type: Number,
            required: true
          },
          mediaUrl: {
            type: String,
            required: true
          },
          type: {
            type: String,
            required: true
          }
        }
      ]
    }
  ],
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  isOtpVerified: {
    type: Boolean,
    default: false,
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;