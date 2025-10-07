const fs = require('fs')
const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

/**
 * Script to split large CSV file into smaller chunks
 * Usage: node scripts/split-csv.js <input-file> <output-dir> <chunk-size>
 */

const splitCSV = async (inputFile, outputDir, chunkSize = 50) => {
  try {
    console.log(`🔄 Splitting CSV file: ${inputFile}`)
    console.log(`📁 Output directory: ${outputDir}`)
    console.log(`📊 Chunk size: ${chunkSize} records`)

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Read CSV header
    const headers = []
    let isFirstRow = true
    
    return new Promise((resolve, reject) => {
      const results = []
      
      fs.createReadStream(inputFile, { encoding: 'utf8' })
        .pipe(csv())
        .on('headers', (headerList) => {
          headers.push(...headerList)
        })
        .on('data', (data) => {
          results.push(data)
        })
        .on('end', async () => {
          try {
            console.log(`📝 Total records: ${results.length}`)
            
            // Split into chunks
            const chunks = []
            for (let i = 0; i < results.length; i += chunkSize) {
              chunks.push(results.slice(i, i + chunkSize))
            }
            
            console.log(`📦 Created ${chunks.length} chunks`)
            
            // Write each chunk to separate file
            for (let i = 0; i < chunks.length; i++) {
              const chunk = chunks[i]
              const filename = `employees_chunk_${String(i + 1).padStart(3, '0')}.csv`
              const filepath = `${outputDir}/${filename}`
              
              // Create CSV writer
              const csvWriter = createCsvWriter({
                path: filepath,
                header: Object.keys(chunk[0]).map(key => ({ id: key, title: key }))
              })
              
              await csvWriter.writeRecords(chunk)
              console.log(`✅ Created: ${filename} (${chunk.length} records)`)
            }
            
            console.log(`🎉 CSV split completed successfully!`)
            console.log(`📊 Summary:`)
            console.log(`  - Input file: ${inputFile}`)
            console.log(`  - Total records: ${results.length}`)
            console.log(`  - Chunks created: ${chunks.length}`)
            console.log(`  - Records per chunk: ${chunkSize}`)
            console.log(`  - Output directory: ${outputDir}`)
            
            resolve({
              totalRecords: results.length,
              chunksCreated: chunks.length,
              chunkSize: chunkSize
            })
            
          } catch (error) {
            reject(error)
          }
        })
        .on('error', reject)
    })
    
  } catch (error) {
    console.error('❌ Error splitting CSV:', error)
    throw error
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.length < 2) {
    console.log('Usage: node scripts/split-csv.js <input-file> <output-dir> [chunk-size]')
    console.log('Example: node scripts/split-csv.js data.csv ./chunks 50')
    process.exit(1)
  }
  
  const inputFile = args[0]
  const outputDir = args[1]
  const chunkSize = parseInt(args[2]) || 50
  
  splitCSV(inputFile, outputDir, chunkSize)
    .then(result => {
      console.log('✅ Split completed successfully!')
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ Split failed:', error)
      process.exit(1)
    })
}

module.exports = { splitCSV }
