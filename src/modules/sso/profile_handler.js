const bcrypt = require('bcrypt');
// UsersRepository removed - now using employees table directly
const EmployeesRepository = require('../employees/postgre_repository');
const { CustomException } = require('../../utils/exception');
const { Logger } = require('../../utils/logger');
const { pgCore } = require('../../config/database');

/**
 * SSO Profile Handler - Menangani operasi profil user
 */
class SSOProfileHandler {
  constructor() {
    // UsersRepository removed - now using employees table directly
    this.employeesRepository = new EmployeesRepository(pgCore);
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
   * PUT /auth/sso/profil - Update profil employee dan password
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user?.user_id;
      const { 
        // Employee data
        employee_name,
        employee_email,
        title_id,
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
          title_id,
          password_update: !!current_password
        } 
      });

      // Validasi minimal satu field harus diisi
      const hasEmployeeUpdate = employee_name || employee_email || title_id;
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
          'employees.title_id'
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
        if (title_id) employeeUpdateData.title_id = title_id;
        
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
            'employees.title_id',
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
          title_name: updatedProfile.title_name,
          department_name: updatedProfile.department_name,
          company_name: updatedProfile.company_name,
          created_at: updatedProfile.created_at,
          updated_at: updatedProfile.updated_at
        };

        let message = 'Profil berhasil diupdate';
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
