const mongoose = require('mongoose');
const User = require('../models/User');
const OTP = require('../models/OTP');
require('dotenv').config();

/**
 * Database setup and initialization script
 */
class DatabaseSetup {
  constructor() {
    this.mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/luminex-trading';
  }

  async connect() {
    try {
      await mongoose.connect(this.mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      process.exit(1);
    }
  }

  async createIndexes() {
    try {
      console.log('📊 Creating database indexes...');

      // User model indexes
      await User.collection.createIndex({ email: 1 }, { unique: true });
      await User.collection.createIndex({ phone: 1 }, { unique: true });
      await User.collection.createIndex({ createdAt: -1 });
      await User.collection.createIndex({ isActive: 1 });
      await User.collection.createIndex({ role: 1 });
      await User.collection.createIndex({ lastLogin: -1 });

      // OTP model indexes
      await OTP.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
      await OTP.collection.createIndex({ userId: 1, type: 1, purpose: 1 });
      await OTP.collection.createIndex({ email: 1, type: 1, purpose: 1 });
      await OTP.collection.createIndex({ phone: 1, type: 1, purpose: 1 });
      await OTP.collection.createIndex({ createdAt: -1 });

      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating indexes:', error.message);
    }
  }

  async createAdminUser() {
    try {
      console.log('👤 Checking for admin user...');

      const adminExists = await User.findOne({ role: 'admin' });
      
      if (adminExists) {
        console.log('✅ Admin user already exists');
        return;
      }

      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@luminex.com',
        phone: '+919999999999',
        password: 'Admin@123456',
        role: 'admin',
        isEmailVerified: true,
        isPhoneVerified: true,
        isActive: true,
        profile: {
          kycStatus: 'verified'
        },
        trading: {
          accountBalance: 1000000, // $1M for admin
          riskTolerance: 'high'
        }
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully');
      console.log('📧 Email: admin@luminex.com');
      console.log('🔑 Password: Admin@123456');
      console.log('⚠️  Please change the admin password after first login!');
    } catch (error) {
      console.error('❌ Error creating admin user:', error.message);
    }
  }

  async cleanupExpiredOTPs() {
    try {
      console.log('🧹 Cleaning up expired OTPs...');
      const result = await OTP.cleanupExpired();
      console.log(`✅ Cleaned up ${result} expired OTP records`);
    } catch (error) {
      console.error('❌ Error cleaning up OTPs:', error.message);
    }
  }

  async validateEnvironment() {
    console.log('🔍 Validating environment configuration...');

    const requiredVars = [
      'MONGODB_URI',
      'JWT_SECRET',
      'JWT_REFRESH_SECRET'
    ];

    const optionalVars = [
      'EMAIL_USER',
      'EMAIL_PASS',
      'TWILIO_ACCOUNT_SID',
      'TWILIO_AUTH_TOKEN',
      'TWILIO_PHONE_NUMBER'
    ];

    let hasErrors = false;

    // Check required variables
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        console.error(`❌ Missing required environment variable: ${varName}`);
        hasErrors = true;
      } else {
        console.log(`✅ ${varName} is configured`);
      }
    });

    // Check optional variables
    optionalVars.forEach(varName => {
      if (!process.env[varName]) {
        console.warn(`⚠️  Optional environment variable not set: ${varName}`);
      } else {
        console.log(`✅ ${varName} is configured`);
      }
    });

    // Check email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  Email service will not be available without EMAIL_USER and EMAIL_PASS');
    }

    // Check SMS configuration
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.warn('⚠️  SMS service will not be available without complete Twilio configuration');
    }

    if (hasErrors) {
      console.error('❌ Please fix the missing required environment variables');
      process.exit(1);
    }

    console.log('✅ Environment validation completed');
  }

  async displayStats() {
    try {
      console.log('\n📊 Database Statistics:');
      
      const userCount = await User.countDocuments();
      const activeUserCount = await User.countDocuments({ isActive: true });
      const verifiedUserCount = await User.countDocuments({ 
        isEmailVerified: true, 
        isPhoneVerified: true 
      });
      const adminCount = await User.countDocuments({ role: 'admin' });
      const otpCount = await OTP.countDocuments();

      console.log(`👥 Total Users: ${userCount}`);
      console.log(`✅ Active Users: ${activeUserCount}`);
      console.log(`🔐 Verified Users: ${verifiedUserCount}`);
      console.log(`👑 Admin Users: ${adminCount}`);
      console.log(`📱 Active OTPs: ${otpCount}`);
    } catch (error) {
      console.error('❌ Error fetching database stats:', error.message);
    }
  }

  async run() {
    console.log('🚀 Starting Luminex Trading Backend Setup...\n');

    await this.validateEnvironment();
    await this.connect();
    await this.createIndexes();
    await this.createAdminUser();
    await this.cleanupExpiredOTPs();
    await this.displayStats();

    console.log('\n✅ Database setup completed successfully!');
    console.log('🎉 Your Luminex Trading backend is ready to use!');
    
    mongoose.disconnect();
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new DatabaseSetup();
  setup.run().catch(error => {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  });
}

module.exports = DatabaseSetup;
