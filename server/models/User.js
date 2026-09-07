import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows null/empty for phone-only logins
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ['Guest', 'Reader', 'Journalist', 'Editor', 'Advertiser', 'Admin', 'Super Admin'],
      default: 'Reader',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    otp: {
      code: String,
      expiresAt: Date,
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'News',
      },
    ],
    readingHistory: [
      {
        news: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'News',
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    subscription: {
      isPremium: {
        type: Boolean,
        default: false,
      },
      plan: {
        type: String,
        enum: ['Free', 'Monthly', 'Yearly'],
        default: 'Free',
      },
      expiresAt: {
        type: Date,
      },
    },
    status: {
      type: String,
      enum: ['Active', 'Suspended'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
