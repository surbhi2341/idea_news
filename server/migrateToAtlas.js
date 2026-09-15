/**
 * Local MongoDB → Atlas MongoDB Data Migration Script
 * 
 * Ye script local MongoDB ka saara data padhkar
 * Atlas (remote) MongoDB mein copy kar dega.
 * 
 * Run: node migrateToAtlas.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const LOCAL_URI = 'mongodb://127.0.0.1:27017/bharat_news';
const ATLAS_URI = process.env.MONGODB_URI;

// Collections jo migrate karni hain
const COLLECTIONS = [
  'users',
  'news',
  'comments',
  'advertisements',
  'breakingnews',
  'categories',
  'epapers',
  'medias',
  'polls',
  'systems',
  'webstories',
  'settings',
  'activitylogs',
];

async function migrateCollection(localDb, atlasDb, collectionName) {
  try {
    const localCollection = localDb.collection(collectionName);
    const atlasCollection = atlasDb.collection(collectionName);

    const docs = await localCollection.find({}).toArray();

    if (docs.length === 0) {
      console.log(`   ⏭️  ${collectionName}: 0 documents (skip)`);
      return 0;
    }

    // Atlas mein purana data delete karo (fresh import)
    await atlasCollection.deleteMany({});

    // Batch insert
    const result = await atlasCollection.insertMany(docs, { ordered: false });
    console.log(`   ✅ ${collectionName}: ${result.insertedCount} documents migrated`);
    return result.insertedCount;
  } catch (err) {
    if (err.code === 11000) {
      console.log(`   ⚠️  ${collectionName}: Kuch duplicate records the, baaki insert ho gaye`);
      return 0;
    }
    console.log(`   ❌ ${collectionName}: Error - ${err.message}`);
    return 0;
  }
}

async function migrate() {
  let localConn, atlasConn;

  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Local MongoDB → Atlas Migration');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Local MongoDB connect karo
    console.log('📦 Local MongoDB se connect ho raha hai...');
    localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✅ Local MongoDB Connected!\n');

    // Atlas connect karo
    console.log('☁️  Atlas MongoDB se connect ho raha hai...');
    atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('✅ Atlas MongoDB Connected!\n');

    const localDb = localConn.db;
    const atlasDb = atlasConn.db;

    // Pehle check karo local mein kaunsi collections hain
    const localCollections = await localDb.listCollections().toArray();
    const localCollectionNames = localCollections.map(c => c.name);
    console.log(`📋 Local DB mein ${localCollectionNames.length} collections mili:\n   ${localCollectionNames.join(', ')}\n`);

    console.log('🚀 Migration shuru ho rahi hai...\n');

    let total = 0;

    // Sab collections migrate karo jo local mein hain
    for (const collName of localCollectionNames) {
      total += await migrateCollection(localDb, atlasDb, collName);
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`🎉 Migration complete! Total ${total} documents migrate hue.`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    if (error.message.includes('ECONNREFUSED') || error.message.includes('127.0.0.1')) {
      console.error('\n💡 Local MongoDB chal nahi raha! Please start karo:');
      console.error('   mongod --dbpath "C:\\data\\db"');
      console.error('   Ya MongoDB service start karo Windows Services se.');
    }
  } finally {
    if (localConn) await localConn.close();
    if (atlasConn) await atlasConn.close();
    console.log('✅ Connections close ho gaye.');
    process.exit(0);
  }
}

migrate();
