/**
 * Test script for Gemini API integration
 * Run with: npx ts-node test-gemini.ts
 * 
 * Make sure you have:
 * 1. Created .env file with EXPO_PUBLIC_GEMINI_API_KEY
 * 2. Installed @google/genai package
 */

// Load environment variables
import 'dotenv/config';
import { generateGeminiContent, generateGeminiContentWithRetry, GeminiModel } from './src/ai/models/gemini';
import { simplifyContent } from './src/ai/adapt/simplifyText';

const TEST_TEXT = `React Native is a popular open-source framework for building mobile applications using JavaScript and React. It allows developers to create cross-platform apps that run on both iOS and Android devices using a single codebase. React Native utilizes native components, ensuring that applications have a native look and feel while benefiting from the efficiency of JavaScript development.`;

async function testGeminiAPI() {
  console.log('\n🧪 TESTING GEMINI API INTEGRATION\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Basic content generation
    console.log('\n✅ Test 1: Basic Content Generation');
    console.log('-'.repeat(60));
    const response1 = await generateGeminiContent(
      'Explain what React Native is in one short sentence.',
      { model: GeminiModel.FLASH_2_5 }
    );
    console.log('Response:', response1);

    // Test 2: Content generation with retry
    console.log('\n✅ Test 2: Content Generation with Retry');
    console.log('-'.repeat(60));
    const response2 = await generateGeminiContentWithRetry({
      prompt: 'List 3 benefits of using React Native in bullet points.',
      config: { model: GeminiModel.FLASH_2_5 },
      maxRetries: 3,
    });
    console.log('Response:', response2);

    // Test 3: Text simplification
    console.log('\n✅ Test 3: Text Simplification');
    console.log('-'.repeat(60));
    console.log('Original text:', TEST_TEXT);
    const simplified = await simplifyContent(TEST_TEXT);
    console.log('\nSimplified text:', simplified.simplifiedText);
    console.log('\nStats:');
    console.log(`  - Original length: ${simplified.originalLength} chars`);
    console.log(`  - Simplified length: ${simplified.simplifiedLength} chars`);
    console.log(`  - Reduction: ${Math.round((1 - simplified.simplifiedLength / simplified.originalLength) * 100)}%`);

    // Test 4: Different models
    console.log('\n✅ Test 4: Testing Different Models');
    console.log('-'.repeat(60));
    
    console.log('\nModel: FLASH_2_5');
    const flashResponse = await generateGeminiContent(
      'What is AI in 5 words?',
      { model: GeminiModel.FLASH_2_5 }
    );
    console.log('Response:', flashResponse);

    console.log('\nModel: PRO_2_5');
    const proResponse = await generateGeminiContent(
      'What is AI in 5 words?',
      { model: GeminiModel.PRO_2_5 }
    );
    console.log('Response:', proResponse);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 ALL TESTS PASSED!');
    console.log('='.repeat(60));

  } catch (error: any) {
    console.error('\n❌ TEST FAILED:');
    console.error('Error:', error.message);
    if (error.originalError) {
      console.error('Original error:', error.originalError);
    }
    process.exit(1);
  }
}

// Run tests
testGeminiAPI();
