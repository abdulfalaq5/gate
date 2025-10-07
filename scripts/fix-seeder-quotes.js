const fs = require('fs');
const path = require('path');

/**
 * Script untuk memperbaiki quotes di seeder yang menyebabkan syntax error
 */

function fixSeederQuotes() {
  const seederPath = path.join(__dirname, '..', 'src', 'repository', 'postgres', 'seeders', '0013_full_employee_data_seeder.js');
  
  try {
    console.log('🔧 Fixing quotes in seeder file...');
    
    let content = fs.readFileSync(seederPath, 'utf8');
    
    // Fix the specific issue with apostrophes in address fields
    content = content.replace(/Bontote'ne/g, 'Bontote\\'ne');
    content = content.replace(/([^\\])'([^',\s])/g, '$1\\\$2'); // Escape single quotes that aren't already escaped
    
    // Write back the fixed content
    fs.writeFileSync(seederPath, content);
    
    console.log('✅ Seeder file quotes fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing seeder quotes:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  fixSeederQuotes();
}

module.exports = { fixSeederQuotes };
