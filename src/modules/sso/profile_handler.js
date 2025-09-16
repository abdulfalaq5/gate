const bcrypt = require('bcrypt');
const UsersRepository = require('../users/postgre_repository');
const EmployeesRepository = require('../employees/postgre_repository');
const { CustomException } = require('../../utils/exception');
const { Logger } = require('../../utils/logger');
const { pgCore } = require('../../config/database');

/**
 * SSO Profile Handler - Menangani operasi profil user
 */
class SSOProfileHandler {
  constructor() {
    this.usersRepository = new UsersRepository(pgCore);
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

      // Ambil data user dengan detail lengkap
      const userProfile = await this.usersRepository.getUserWithDetails(userId);
      
      if (!userProfile) {
        throw new CustomException('Profil user tidak ditemukan', 404);
      }

      // Format response tanpa password
      const profileData = {
        user_id: userProfile.user_id,
        user_name: userProfile.user_name,
        user_email: userProfile.user_email,
        employee_id: userProfile.employee_id,
        employee_name: userProfile.employee_name,
        role_id: userProfile.role_id,
        role_name: userProfile.role_name,
        created_at: userProfile.created_at,
        updated_at: userProfile.updated_at
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
   * PUT /auth/sso/profil - Update profil user, employee, dan password dalam satu endpoint
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user?.user_id;
      const { 
        // User data
        user_name, 
        user_email,
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

      Logger.info('Updating user profile', { 
        user_id: userId, 
        updates: { 
          user_name, 
          user_email, 
          employee_name, 
          employee_email, 
          title_id,
          password_update: !!current_password
        } 
      });

      // Validasi minimal satu field harus diisi
      const hasUserUpdate = user_name || user_email;
      const hasEmployeeUpdate = employee_name || employee_email || title_id;
      const hasPasswordUpdate = current_password || new_password || confirm_password;

      if (!hasUserUpdate && !hasEmployeeUpdate && !hasPasswordUpdate) {
        throw new CustomException('Minimal satu field harus diisi untuk update profil', 400);
      }

      // Ambil data user dan employee yang ada
      const userProfile = await this.usersRepository.getUserWithDetails(userId);
      if (!userProfile) {
        throw new CustomException('Profil user tidak ditemukan', 404);
      }

      const employeeId = userProfile.employee_id;

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
        const isCurrentPasswordValid = await this.usersRepository.verifyPassword(current_password, userProfile.user_password);
        if (!isCurrentPasswordValid) {
          throw new CustomException('Password lama tidak benar', 400);
        }
      }

      // Validasi email duplikasi untuk user
      if (user_email) {
        const existingUser = await this.usersRepository.findByEmail(user_email);
        if (existingUser && existingUser.user_id !== userId) {
          throw new CustomException('Email sudah digunakan oleh user lain', 400);
        }
      }

      // Validasi username duplikasi untuk user
      if (user_name) {
        const existingUser = await this.usersRepository.findByUsername(user_name);
        if (existingUser && existingUser.user_id !== userId) {
          throw new CustomException('Username sudah digunakan oleh user lain', 400);
        }
      }

      // Validasi email duplikasi untuk employee
      if (employee_email) {
        const existingEmployee = await this.employeesRepository.findByEmail(employee_email);
        if (existingEmployee && existingEmployee.employee_id !== employeeId) {
          throw new CustomException('Email employee sudah digunakan oleh employee lain', 400);
        }
      }

      // Mulai transaction untuk update data
      const trx = await pgCore.transaction();

      try {
        // Update user data
        if (hasUserUpdate) {
          const userUpdateData = {};
          if (user_name) userUpdateData.user_name = user_name;
          if (user_email) userUpdateData.user_email = user_email;
          if (hasPasswordUpdate) {
            const saltRounds = 10;
            userUpdateData.user_password = await bcrypt.hash(new_password, saltRounds);
          }

          await trx('users')
            .where('user_id', userId)
            .update({
              ...userUpdateData,
              updated_at: new Date(),
              updated_by: userId
            });
        }

        // Update employee data
        if (hasEmployeeUpdate) {
          const employeeUpdateData = {};
          if (employee_name) employeeUpdateData.employee_name = employee_name;
          if (employee_email) employeeUpdateData.employee_email = employee_email;
          if (title_id) employeeUpdateData.title_id = title_id;

          await trx('employees')
            .where('employee_id', employeeId)
            .update({
              ...employeeUpdateData,
              updated_at: new Date(),
              updated_by: userId
            });
        }

        // Commit transaction
        await trx.commit();

        // Ambil data yang sudah diupdate
        const updatedProfile = await this.usersRepository.getUserWithDetails(userId);

        // Format response tanpa password
        const profileData = {
          user_id: updatedProfile.user_id,
          user_name: updatedProfile.user_name,
          user_email: updatedProfile.user_email,
          employee_id: updatedProfile.employee_id,
          employee_name: updatedProfile.employee_name,
          employee_email: updatedProfile.employee_email,
          title_id: updatedProfile.title_id,
          role_id: updatedProfile.role_id,
          role_name: updatedProfile.role_name,
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
