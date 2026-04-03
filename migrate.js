// Simple migration script for Railway
const { execSync } = require('child_process');

console.log('🔄 Running database migration...');

try {
  // Change to server directory and run migration
  process.chdir('server');
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
  console.log('✅ Database migration completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
