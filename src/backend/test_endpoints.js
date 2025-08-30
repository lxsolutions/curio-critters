


const axios = require('axios');
const baseURL = 'http://localhost:56472/api';

async function testHealth() {
  try {
    const response = await axios.get(`${baseURL}/health`);
    console.log('✅ Health endpoint:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health endpoint failed:', error.message);
    return false;
  }
}

async function testUsers() {
  try {
    const response = await axios.get(`${baseURL}/users`);
    console.log('✅ Users endpoint:', response.data.length, 'users found');
    return true;
  } catch (error) {
    console.error('❌ Users endpoint failed:', error.message);
    return false;
  }
}

async function testQuests() {
  try {
    const response = await axios.get(`${baseURL}/quests`);
    console.log('✅ Quests endpoint:', response.data.length, 'quests found');
    return true;
  } catch (error) {
    console.error('❌ Quests endpoint failed:', error.message);
    return false;
  }
}

async function testCreateUser() {
  try {
    const response = await axios.post(`${baseURL}/users`, {
      username: 'test_user_123',
      grade: 4
    });
    console.log('✅ Create user endpoint:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Create user endpoint failed:', error.message);
    return false;
  }
}

async function testCreateQuest() {
  try {
    const response = await axios.post(`${baseURL}/quests`, {
      title: 'Science Quest',
      description: 'Answer science questions to grow your critter',
      location: 'Lab',
      subject: 'science',
      difficulty: 'medium',
      xpReward: 150,
      loot: ['sticker_science', 'coin'],
      activeFor: null
    });
    console.log('✅ Create quest endpoint:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Create quest endpoint failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  const tests = [
    testHealth,
    testUsers,
    testQuests,
    testCreateUser,
    testCreateQuest
  ];

  let successCount = 0;

  for (const test of tests) {
    if (await test()) {
      successCount++;
    }
  }

  console.log(`\n📊 Test Results: ${successCount}/${tests.length} passed`);
}

runAllTests().catch(console.error);


