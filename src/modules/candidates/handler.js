const { candidatesColumns, candidatesValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const candidatesRepository = require('./postgre_repository')
const { generateMinioUpload } = require('../../utils/minio-upload')
const { sanitizeCandidateData } = require('./validation')

class CandidatesHandler {
  /**
   * Get all candidates with pagination and filtering (POST method)
   */
  async getCandidates(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }
      
      // Create a modified request object for parseStandardQuery
      const modifiedReq = {
        ...req,
        query: requestParams
      }

      // Parse query parameters menggunakan sistem filter standar
      const queryParams = parseStandardQuery(modifiedReq, {
        allowedSortColumns: [
          'candidate_name',
          'candidate_email',
          'candidate_phone',
          'candidate_number',
          'candidate_city',
          'candidate_state',
          'candidate_country',
          'created_at',
          'updated_at'
        ],
        defaultSort: ['created_at', 'desc'],
        searchableColumns: [
          'candidate_name',
          'candidate_email',
          'candidate_phone',
          'candidate_number',
          'candidate_city',
          'candidate_state',
          'candidate_country'
        ],
        allowedFilters: [
          'candidate_name',
          'candidate_email',
          'candidate_phone',
          'candidate_number',
          'company_id',
          'department_id',
          'title_id',
          'candidate_city',
          'candidate_state',
          'candidate_country',
          'is_delete'
        ],
        dateColumn: 'created_at'
      })
      
      const result = await candidatesRepository.getCandidates(queryParams)
      
      return successResponse(res, result, 'Candidates retrieved successfully')
    } catch (error) {
      console.error('Error getting candidates:', error)
      return errorResponse(res, 'Failed to retrieve candidates', 500)
    }
  }

  /**
   * Get candidate by ID with all relations
   */
  async getCandidateById(req, res) {
    try {
      const { id } = req.params
      
      const candidate = await candidatesRepository.getCandidateById(id)
      if (!candidate) {
        return errorResponse(res, 'Candidate not found', 404)
      }
      
      return successResponse(res, candidate, 'Candidate retrieved successfully')
    } catch (error) {
      console.error('Error getting candidate:', error)
      return errorResponse(res, 'Failed to retrieve candidate', 500)
    }
  }

  /**
   * Create new candidate with multipart/form-data support
   */
  async createCandidate(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST/multipart)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST/multipart parameters
      }

      // Validate request
      const validation = validateRequest(requestParams, candidatesValidationRules.create, candidatesColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      // Sanitize data
      let candidateData = sanitizeCandidateData(requestParams)
      
      // Handle candidate_foto upload to MinIO
      if (req.files && req.files.length > 0) {
        const fotoFile = req.files.find(file => file.fieldname === 'candidate_foto')
        if (fotoFile) {
          try {
            const fileIndex = req.files.findIndex(file => file.fieldname === 'candidate_foto')
            
            const uploadResult = await generateMinioUpload(
              req, 
              fileIndex,
              'candidates/photos',
              'candidate_photo',
              '',
              {
                isWatermark: false,
                isPrivate: false,
                isContentType: true,
                fileNames: '',
                compressImage: true,
                maxFileSize: 10 * 1024 * 1024 // 10MB max for candidate photos
              }
            )
            
            if (uploadResult.status) {
              candidateData.candidate_foto = uploadResult.pathForDatabase
              console.log(`Candidate photo uploaded successfully: ${uploadResult.fileNames}`)
            } else {
              console.warn(`Failed to upload candidate photo: ${uploadResult.error}`)
              // Continue without photo if upload fails
            }
          } catch (error) {
            console.error('Error uploading candidate photo:', error)
            // Continue without photo if upload fails
          }
        }
        
        // Handle candidate_resume upload to MinIO
        const resumeFile = req.files.find(file => file.fieldname === 'candidate_resume')
        if (resumeFile) {
          try {
            const fileIndex = req.files.findIndex(file => file.fieldname === 'candidate_resume')
            
            const uploadResult = await generateMinioUpload(
              req, 
              fileIndex,
              'candidates/resumes',
              'candidate_resume',
              '',
              {
                isWatermark: false,
                isPrivate: false,
                isContentType: true,
                fileNames: '',
                compressImage: false, // Don't compress PDFs
                maxFileSize: 50 * 1024 * 1024 // 50MB max for resumes
              }
            )
            
            if (uploadResult.status) {
              candidateData.candidate_resume = uploadResult.pathForDatabase
              console.log(`Candidate resume uploaded successfully: ${uploadResult.fileNames}`)
            } else {
              console.warn(`Failed to upload candidate resume: ${uploadResult.error}`)
              // Continue without resume if upload fails
            }
          } catch (error) {
            console.error('Error uploading candidate resume:', error)
            // Continue without resume if upload fails
          }
        }
      }
      
      // Set created_by from token
      candidateData.created_by = req.user?.user_id || req.user?.employee_id
      
      const candidate = await candidatesRepository.createCandidate(candidateData)
      
      return successResponse(res, candidate, 'Candidate created successfully', 201)
    } catch (error) {
      console.error('Error creating candidate:', error)
      
      // Provide more specific error message
      if (error.code === '23503') { // Foreign key constraint violation
        return errorResponse(res, 'Invalid company_id, department_id, or title_id. One or more referenced records do not exist.', 400)
      }
      if (error.code === '23505') { // Unique constraint violation
        return errorResponse(res, 'Candidate with this email or number already exists.', 400)
      }
      
      return errorResponse(res, 'Failed to create candidate', 500)
    }
  }

  /**
   * Update candidate with multipart/form-data support
   * Don't overwrite candidate_foto or candidate_resume if not changed
   */
  async updateCandidate(req, res) {
    try {
      const { id } = req.params
      
      // Check if candidate exists
      const existingCandidate = await candidatesRepository.getCandidateById(id)
      if (!existingCandidate) {
        return errorResponse(res, 'Candidate not found', 404)
      }
      
      // Validate request
      const validation = validateRequest(req.body, candidatesValidationRules.update, candidatesColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      // Sanitize data
      let updateData = sanitizeCandidateData(req.body)
      
      // Handle candidate_foto upload to MinIO (only if new file is uploaded)
      if (req.files && req.files.length > 0) {
        const fotoFile = req.files.find(file => file.fieldname === 'candidate_foto')
        if (fotoFile) {
          try {
            const fileIndex = req.files.findIndex(file => file.fieldname === 'candidate_foto')
            
            const uploadResult = await generateMinioUpload(
              req, 
              fileIndex,
              'candidates/photos',
              'candidate_photo',
              '',
              {
                isWatermark: false,
                isPrivate: false,
                isContentType: true,
                fileNames: '',
                compressImage: true,
                maxFileSize: 10 * 1024 * 1024 // 10MB max for candidate photos
              }
            )
            
            if (uploadResult.status) {
              updateData.candidate_foto = uploadResult.pathForDatabase
              console.log(`Candidate photo updated successfully: ${uploadResult.fileNames}`)
            } else {
              console.warn(`Failed to update candidate photo: ${uploadResult.error}`)
              // Don't update photo if upload fails, preserve existing
            }
          } catch (error) {
            console.error('Error uploading candidate photo:', error)
            // Don't update photo if upload fails, preserve existing
          }
        } else {
          // If no photo file is uploaded, preserve the existing photo in the database
          // Don't include candidate_foto in updateData
          console.log('No photo file uploaded, preserving existing photo')
        }
        
        // Handle candidate_resume upload to MinIO (only if new file is uploaded)
        const resumeFile = req.files.find(file => file.fieldname === 'candidate_resume')
        if (resumeFile) {
          try {
            const fileIndex = req.files.findIndex(file => file.fieldname === 'candidate_resume')
            
            const uploadResult = await generateMinioUpload(
              req, 
              fileIndex,
              'candidates/resumes',
              'candidate_resume',
              '',
              {
                isWatermark: false,
                isPrivate: false,
                isContentType: true,
                fileNames: '',
                compressImage: false, // Don't compress PDFs
                maxFileSize: 50 * 1024 * 1024 // 50MB max for resumes
              }
            )
            
            if (uploadResult.status) {
              updateData.candidate_resume = uploadResult.pathForDatabase
              console.log(`Candidate resume updated successfully: ${uploadResult.fileNames}`)
            } else {
              console.warn(`Failed to update candidate resume: ${uploadResult.error}`)
              // Don't update resume if upload fails, preserve existing
            }
          } catch (error) {
            console.error('Error uploading candidate resume:', error)
            // Don't update resume if upload fails, preserve existing
          }
        } else {
          // If no resume file is uploaded, preserve the existing resume in the database
          // Don't include candidate_resume in updateData
          console.log('No resume file uploaded, preserving existing resume')
        }
      } else {
        // If no files are uploaded, preserve existing files
        console.log('No files uploaded, preserving existing files')
      }
      
      // Set updated_by from token
      updateData.updated_by = req.user?.user_id || req.user?.employee_id
      
      const candidate = await candidatesRepository.updateCandidate(id, updateData)
      
      return successResponse(res, candidate, 'Candidate updated successfully')
    } catch (error) {
      console.error('Error updating candidate:', error)
      
      // Provide more specific error message
      if (error.code === '23503') { // Foreign key constraint violation
        return errorResponse(res, 'Invalid company_id, department_id, or title_id. One or more referenced records do not exist.', 400)
      }
      if (error.code === '23505') { // Unique constraint violation
        return errorResponse(res, 'Candidate with this email or number already exists.', 400)
      }
      
      return errorResponse(res, 'Failed to update candidate', 500)
    }
  }

  /**
   * Soft delete candidate
   */
  async deleteCandidate(req, res) {
    try {
      const { id } = req.params
      
      // Check if candidate exists
      const existingCandidate = await candidatesRepository.getCandidateById(id)
      if (!existingCandidate) {
        return errorResponse(res, 'Candidate not found', 404)
      }
      
      const deleteData = {
        is_delete: true,
        deleted_at: new Date(),
        deleted_by: req.user?.user_id || req.user?.employee_id
      }
      
      const result = await candidatesRepository.updateCandidate(id, deleteData)
      
      return successResponse(res, null, 'Candidate deleted successfully')
    } catch (error) {
      console.error('Error deleting candidate:', error)
      return errorResponse(res, 'Failed to delete candidate', 500)
    }
  }
}

module.exports = new CandidatesHandler()

