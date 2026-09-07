import connectDB from './config/db.js';
import mongoose from 'mongoose';
import User from './models/User.js';
import News from './models/News.js';

const runTests = async () => {
  console.log('--- STARTING INTEGRATION VALIDATION ---');
  try {
    await connectDB();
    
    // Clear previous test records
    await User.deleteMany({ email: /test.*@bharatnews.in/ });
    await News.deleteMany({ title: /Test Article.*/ });

    console.log('1. Testing Registration...');
    const reporter = await User.create({
      name: 'Test Journalist',
      email: 'testreporter@bharatnews.in',
      password: 'password123',
      role: 'Journalist'
    });
    console.log(`✓ Reporter account created: ${reporter.name} (Role: ${reporter.role})`);

    const editor = await User.create({
      name: 'Test Editor',
      email: 'testeditor@bharatnews.in',
      password: 'password123',
      role: 'Editor'
    });
    console.log(`✓ Editor account created: ${editor.name} (Role: ${editor.role})`);

    console.log('2. Testing Journalist News Pipeline...');
    const draft = await News.create({
      title: 'Test Article: AI Breakthrough',
      content: 'Local researchers build highly efficient models.',
      category: 'Technology',
      slug: 'test-article-ai-breakthrough',
      reporter: reporter._id,
      status: 'Pending'
    });
    console.log(`✓ News draft submitted to queue: ${draft.title} (Status: ${draft.status})`);

    console.log('3. Testing Editor Review & Approval...');
    const underReview = await News.findById(draft._id);
    if (!underReview) throw new Error('News draft not found');
    
    underReview.status = 'Published';
    underReview.editorsPick = true;
    await underReview.save();
    console.log(`✓ Editor approved draft! New Status: ${underReview.status}, Editors Pick: ${underReview.editorsPick}`);

    console.log('4. Verifying homepage visibility...');
    const homepageFeed = await News.find({ status: 'Published' });
    const found = homepageFeed.find(n => n.slug === 'test-article-ai-breakthrough');
    if (!found) throw new Error('Published article not showing in feed');
    console.log('✓ Article verified active on Homepage feed!');

    console.log('--- ALL INTEGRATION TESTS PASSED SUCCESSFULLY! ---');
  } catch (err) {
    console.error('✕ INTEGRATION TESTING FAILED:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('DB disconnected.');
  }
};

runTests();
