const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
// UsersRepository removed - now using employees table directly
const EmployeesRepository = require('../employees/postgre_repository');
const { CustomException } = require('../../utils/exception');
const { Logger } = require('../../utils/logger');
const { pgCore } = require('../../config/database');
const { generateMinioUpload } = require('../../utils/minio-upload');

/**
 * SSO Profile Handler - Menangani operasi profil user
 */
class SSOProfileHandler {
  constructor() {
    // UsersRepository removed - now using employees table directly
    this.employeesRepository = new EmployeesRepository(pgCore);
    
    // Configure multer for file upload
    this.upload = multer({
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        // Allow only image files
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Hanya file gambar yang diperbolehkan'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit for profile photos
        files: 1 // Only one file allowed
      }
    });
  }

  /**
   * Get multer middleware for file upload
   */
  getUploadMiddleware() {
    return this.upload.single('employee_foto');
  }

  /**
   * GET /auth/sso/profil - Mendapatkan data profil user yang sedang login
   */
  async getProfile(req, res) {
    try {
      const userId = req.user?.user_id;
      
      if (!userId) {
        throw new CustomException('User tidak terautentikasi', 401);
      }

      Logger.info('Getting user profile', { user_id: userId });

      // Ambil data employee dengan detail lengkap termasuk company melalui department
      const employeeProfile = await pgCore('employees')
        .select([
          'employees.employee_id',
          'employees.employee_name',
          'employees.employee_email',
          'employees.employee_exmail_account',
          'employees.employee_mobile',
          'employees.employee_office_number',
          'employees.employee_address',
          'employees.employee_channel',
          'employees.employee_foto',
          'employees.password',
          'titles.title_name',
          'departments.department_name',
          'companies.company_name'
        ])
        .leftJoin('titles', 'employees.title_id', 'titles.title_id')
        .leftJoin('departments', 'employees.department_id', 'departments.department_id')
        .leftJoin('companies', 'departments.company_id', 'companies.company_id')
        .where('employees.employee_id', userId)
        .where('employees.is_delete', false)
        .first();
      
      if (!employeeProfile) {
        throw new CustomException('Profil employee tidak ditemukan', 404);
      }

      // Format response tanpa password, user_id, user_name, user_email
      const profileData = {
        employee_id: employeeProfile.employee_id,
        employee_name: employeeProfile.employee_name,
        employee_email: employeeProfile.employee_email,
        employee_exmail_account: employeeProfile.employee_exmail_account,
        employee_mobile: employeeProfile.employee_mobile,
        employee_office_number: employeeProfile.employee_office_number,
        employee_address: employeeProfile.employee_address,
        employee_channel: employeeProfile.employee_channel,
        employee_foto: employeeProfile.employee_foto,
        title_name: employeeProfile.title_name,
        department_name: employeeProfile.department_name,
        company_name: employeeProfile.company_name,
        created_at: employeeProfile.created_at,
        updated_at: employeeProfile.updated_at
      };

      return res.status(200).json({
        success: true,
        message: 'Profil berhasil diambil',
        data: profileData,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      Logger.error('Error getting user profile:', error);
      
      if (error instanceof CustomException) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errors: null,
          timestamp: new Date().toISOString()
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
        errors: null,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * PUT /auth/sso/profil - Update profil employee dan password dengan upload foto
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user?.user_id;
      const { 
        // Employee data
        employee_name,
        employee_email,
        // Password data
        current_password,
        new_password,
        confirm_password
      } = req.body;
      
      if (!userId) {
        throw new CustomException('User tidak terautentikasi', 401);
      }

      Logger.info('Updating employee profile', { 
        user_id: userId, 
        updates: { 
          employee_name, 
          employee_email, 
          photo_update: !!req.file,
          password_update: !!current_password
        } 
      });

      // Validasi minimal satu field harus diisi
      const hasEmployeeUpdate = employee_name || employee_email || req.file;
      const hasPasswordUpdate = current_password || new_password || confirm_password;

      if (!hasEmployeeUpdate && !hasPasswordUpdate) {
        throw new CustomException('Minimal satu field harus diisi untuk update profil', 400);
      }

      // Ambil data employee yang ada (userId sekarang adalah employee_id)
      const employeeProfile = await pgCore('employees')
        .select([
          'employees.employee_id',
          'employees.employee_name',
          'employees.employee_email',
          'employees.password',
          'employees.employee_foto'
        ])
        .where('employees.employee_id', userId)
        .where('employees.is_delete', false)
        .first();
      
      if (!employeeProfile) {
        throw new CustomException('Profil employee tidak ditemukan', 404);
      }

      const employeeId = employeeProfile.employee_id;

      // Validasi password jika ada update password
      if (hasPasswordUpdate) {
        if (!current_password || !new_password || !confirm_password) {
          throw new CustomException('Semua field password harus diisi untuk update password', 400);
        }

        if (new_password !== confirm_password) {
          throw new CustomException('Password baru dan konfirmasi password tidak sama', 400);
        }

        if (new_password.length < 6) {
          throw new CustomException('Password baru minimal 6 karakter', 400);
        }

        // Verifikasi password lama
        const bcrypt = require('bcrypt');
        const isCurrentPasswordValid = await bcrypt.compare(current_password, employeeProfile.password);
        if (!isCurrentPasswordValid) {
          throw new CustomException('Password lama tidak benar', 400);
        }
      }

      // Handle file upload untuk employee_foto
      let employeeFotoPath = employeeProfile.employee_foto; // Keep existing photo if no new upload
      if (req.file) {
        try {
          // Convert req.file to req.files format for generateMinioUpload compatibility
          req.files = [req.file];
          
          // Upload file ke MinIO
          const uploadResult = await generateMinioUpload(
            req, 
            0, // file index
            'employee-photos', // folder path
            `employee-${userId}`, // naming prefix
            '', // default value
            {
              isWatermark: false,
              isPrivate: false,
              isContentType: true,
              fileNames: '',
              compressImage: true,
              maxFileSize: 5 * 1024 * 1024 // 5MB
            }
          );

          if (uploadResult.status) {
            employeeFotoPath = uploadResult.pathForDatabase;
            Logger.info('Employee photo uploaded successfully', { 
              user_id: userId, 
              photo_path: employeeFotoPath 
            });
          } else {
            Logger.error('Failed to upload employee photo', { 
              user_id: userId, 
              error: uploadResult.error 
            });
            throw new CustomException(`Gagal mengupload foto: ${uploadResult.error}`, 400);
          }
        } catch (error) {
          Logger.error('Error uploading employee photo:', error);
          throw new CustomException('Gagal mengupload foto profil', 400);
        }
      }

      // Validasi email duplikasi untuk employee
      if (employee_email) {
        const existingEmployee = await pgCore('employees')
          .select('employee_id', 'employee_email')
          .where('employee_email', employee_email)
          .where('employee_id', '!=', employeeId)
          .where('is_delete', false)
          .first();
        
        if (existingEmployee) {
          throw new CustomException('Email employee sudah digunakan oleh employee lain', 400);
        }
      }

      // Mulai transaction untuk update data
      const trx = await pgCore.transaction();

      try {
        // Update employee data dan password
        const employeeUpdateData = {};
        
        // Update employee fields
        if (employee_name) employeeUpdateData.employee_name = employee_name;
        if (employee_email) employeeUpdateData.employee_email = employee_email;
        if (employeeFotoPath) employeeUpdateData.employee_foto = employeeFotoPath;
        
        // Update password jika ada
        if (hasPasswordUpdate) {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(new_password, saltRounds);
          employeeUpdateData.password = hashedPassword;
        }

        // Update timestamp dan updated_by
        employeeUpdateData.updated_at = new Date();
        employeeUpdateData.updated_by = userId;

        // Lakukan update jika ada data yang diubah
        if (Object.keys(employeeUpdateData).length > 2) { // lebih dari updated_at dan updated_by
          await trx('employees')
            .where('employee_id', employeeId)
            .update(employeeUpdateData);
        }

        // Commit transaction
        await trx.commit();

        // Ambil data employee yang sudah diupdate
        const updatedProfile = await pgCore('employees')
          .select([
            'employees.employee_id',
            'employees.employee_name',
            'employees.employee_email',
            'employees.employee_foto',
            'titles.title_name',
            'departments.department_name',
            'companies.company_name',
            'employees.created_at',
            'employees.updated_at'
          ])
          .leftJoin('titles', 'employees.title_id', 'titles.title_id')
          .leftJoin('departments', 'employees.department_id', 'departments.department_id')
          .leftJoin('companies', 'departments.company_id', 'companies.company_id')
          .where('employees.employee_id', employeeId)
          .where('employees.is_delete', false)
          .first();

        // Format response tanpa password, user_id, user_name, user_email
        const profileData = {
          employee_id: updatedProfile.employee_id,
          employee_name: updatedProfile.employee_name,
          employee_email: updatedProfile.employee_email,
          employee_foto: updatedProfile.employee_foto,
          title_name: updatedProfile.title_name,
          department_name: updatedProfile.department_name,
          company_name: updatedProfile.company_name,
          created_at: updatedProfile.created_at,
          updated_at: updatedProfile.updated_at
        };

        let message = 'Profil berhasil diupdate';
        if (req.file) {
          message += ' dan foto berhasil diupload';
        }
        if (hasPasswordUpdate) {
          message += ' dan password berhasil diubah';
        }

        return res.status(200).json({
          success: true,
          message: message,
          data: profileData,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        await trx.rollback();
        throw error;
      }

    } catch (error) {
      Logger.error('Error updating user profile:', error);
      
      // Handle multer errors
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Ukuran file foto terlalu besar. Maksimal ukuran file adalah 5 MB.',
          errors: null,
          timestamp: new Date().toISOString()
        });
      }
      
      if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Hanya satu file foto yang diperbolehkan.',
          errors: null,
          timestamp: new Date().toISOString()
        });
      }
      
      if (error instanceof CustomException) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errors: null,
          timestamp: new Date().toISOString()
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
        errors: null,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = SSOProfileHandler;
