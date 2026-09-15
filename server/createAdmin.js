/**
 * Admin User Create Script
 * Run: node createAdmin.js
 * Ye script database mein ek Super Admin user create karega
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, required: false },
    role: {
      type: String,
      enum: ['Guest', 'Reader', 'Journalist', 'Editor', 'Advertiser', 'Admin', 'Super Admin'],
      default: 'Reader',
    },
    status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
    subscription: {
      isPremium: { type: Boolean, default: false },
      plan: { type: String, enum: ['Free', 'Monthly', 'Yearly'], default: 'Free' },
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', UserSchema);

const ADMIN_EMAIL = 'admin@ideaciti.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME = 'Super Admin';
const ADMIN_ROLE = 'Super Admin';

async function createAdmin() {
  try {
    console.log('MongoDB se connect ho raha hai...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected!');

    // Check karo kya admin already exist karta hai
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log(`\n⚠️  Admin user already exist karta hai:`);
      console.log(`   Email: ${existing.email}`);
      console.log(`   Role:  ${existing.role}`);
      console.log(`   Status: ${existing.status}`);

      // Password reset karo existing user ka
      existing.password = ADMIN_PASSWORD;
      await existing.save();
      console.log(`\n✅ Password reset ho gaya: ${ADMIN_PASSWORD}`);
    } else {
      const admin = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: ADMIN_ROLE,
        status: 'Active',
      });

      console.log(`\n✅ Admin user successfully create ho gaya!`);
      console.log(`   Name:  ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role:  ${admin.role}`);
    }

    console.log(`\n🎉 Ab in credentials se login karo:`);
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);

    await mongoose.disconnect();
    console.log('\n✅ Done! MongoDB disconnect ho gaya.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
