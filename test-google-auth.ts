// Simple test for Google Auth service
console.log('Testing Google Auth service...');

// Test Firebase import
try {
  const { auth } = await import('./lib/firebase');
  console.log('✅ Firebase auth imported successfully');
  console.log('Auth object:', auth ? 'Available' : 'Not available');
} catch (error: any) {
  console.error('❌ Firebase import failed:', error.message);
}

// Test Google Auth service
try {
  const { GoogleAuthWebService } = await import('./lib/googleAuthWeb');
  console.log('✅ Google Auth service imported successfully');
  console.log('Service methods:', Object.getOwnPropertyNames(GoogleAuthWebService));
} catch (error: any) {
  console.error('❌ Google Auth service import failed:', error.message);
}

console.log('Test completed!');

// Make this file a module
export {};
