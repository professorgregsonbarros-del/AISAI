// Simple migration script for Railway
const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Running database migration...');
console.log('Current directory:', process.cwd());

try {
  // Change to server directory
  const serverDir = path.join(process.cwd(), 'server');
  console.log('Changing to:', serverDir);
  process.chdir(serverDir);

  console.log('Running: npx prisma db push --accept-data-loss');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });

  console.log('✅ Database migration completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.error('Error details:', error);
  process.exit(1);
}
