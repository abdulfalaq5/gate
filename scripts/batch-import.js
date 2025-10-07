const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')

/**
 * Script to batch import multiple CSV files
 * Usage: node scripts/batch-import.js <chunks-dir> <api-url> <token>
 */

const batchImport = async (chunksDir, apiUrl, token) => {
  try {
    console.log(`🔄 Starting batch import`)
    console.log(`📁 Chunks directory: ${chunksDir}`)
    console.log(`🌐 API URL: ${apiUrl}`)

    // Get all CSV files in chunks directory
    const files = fs.readdirSync(chunksDir)
      .filter(file => file.endsWith('.csv'))
      .sort()
    
    if (files.length === 0) {
      throw new Error('No CSV files found in chunks directory')
    }
    
    console.log(`📦 Found ${files.length} CSV files to import`)
    
    const results = []
    let totalSuccess = 0
    let totalFailed = 0
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const filename = files[i]
      const filepath = path.join(chunksDir, filename)
      
      console.log(`\n📤 Processing ${i + 1}/${files.length}: ${filename}`)
      
      try {
        // Create form data
        const formData = new FormData()
        formData.append('file', fs.createReadStream(filepath))
        
        // Make API request
        const response = await axios.post(apiUrl, formData, {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          timeout: 300000 // 5 minutes timeout
        })
        
        const result = response.data
        
        if (result.success) {
          console.log(`✅ ${filename}: SUCCESS`)
          console.log(`   - Created: ${result.data?.summary?.created || 0}`)
          console.log(`   - Skipped: ${result.data?.summary?.skipped || 0}`)
          console.log(`   - Errors: ${result.data?.summary?.errors || 0}`)
          
          totalSuccess++
          results.push({
            filename,
            status: 'success',
            summary: result.data?.summary || {}
          })
        } else {
          console.log(`❌ ${filename}: FAILED - ${result.message}`)
          totalFailed++
          results.push({
            filename,
            status: 'failed',
            error: result.message
          })
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.log(`❌ ${filename}: ERROR - ${error.message}`)
        totalFailed++
        results.push({
          filename,
          status: 'error',
          error: error.message
        })
        
        // Continue with next file even if one fails
        continue
      }
    }
    
    // Summary
    console.log(`\n🎉 Batch import completed!`)
    console.log(`📊 Summary:`)
    console.log(`  - Total files: ${files.length}`)
    console.log(`  - Successful: ${totalSuccess}`)
    console.log(`  - Failed: ${totalFailed}`)
    
    // Calculate totals
    const totalCreated = results
      .filter(r => r.status === 'success')
      .reduce((sum, r) => sum + (r.summary?.created || 0), 0)
    
    const totalSkipped = results
      .filter(r => r.status === 'success')
      .reduce((sum, r) => sum + (r.summary?.skipped || 0), 0)
    
    const totalErrors = results
      .filter(r => r.status === 'success')
      .reduce((sum, r) => sum + (r.summary?.errors || 0), 0)
    
    console.log(`  - Total created: ${totalCreated}`)
    console.log(`  - Total skipped: ${totalSkipped}`)
    console.log(`  - Total errors: ${totalErrors}`)
    
    // Save detailed results
    const resultFile = path.join(chunksDir, 'import-results.json')
    fs.writeFileSync(resultFile, JSON.stringify(results, null, 2))
    console.log(`📄 Detailed results saved to: ${resultFile}`)
    
    return {
      totalFiles: files.length,
      successful: totalSuccess,
      failed: totalFailed,
      totalCreated,
      totalSkipped,
      totalErrors,
      results
    }
    
  } catch (error) {
    console.error('❌ Batch import failed:', error)
    throw error
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.length < 3) {
    console.log('Usage: node scripts/batch-import.js <chunks-dir> <api-url> <token>')
    console.log('Example: node scripts/batch-import.js ./chunks http://localhost:9518/api/employees/import "your-jwt-token"')
    process.exit(1)
  }
  
  const chunksDir = args[0]
  const apiUrl = args[1]
  const token = args[2]
  
  batchImport(chunksDir, apiUrl, token)
    .then(result => {
      console.log('✅ Batch import completed successfully!')
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ Batch import failed:', error)
      process.exit(1)
    })
}

module.exports = { batchImport }
