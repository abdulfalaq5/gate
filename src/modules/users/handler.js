const UsersRepository = require('./postgre_repository');
const { CustomException } = require('../../utils/exception');
const { logger } = require('../../utils/logger');
const jwt = require('jsonwebtoken');
const ssoConfig = require('../../config/sso');

class UsersHandler {
  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async createUser(req, res) {
    try {
      const { employee_id, role_id, user_name, user_email, user_password } = req.body;
      const createdBy = req.user?.user_id;

      // Check if username already exists
      const existingUserByUsername = await this.usersRepository.findByUsername(user_name);
      if (existingUserByUsername) {
        throw new CustomException('Username already exists', 400);
      }

      // Check if email already exists
      const existingUserByEmail = await this.usersRepository.findByEmail(user_email);
      if (existingUserByEmail) {
        throw new CustomException('Email already exists', 400);
      }

      const userData = {
        employee_id,
        role_id,
        user_name,
        user_email,
        user_password,
        created_by: createdBy,
      };

      const user = await this.usersRepository.createUser(userData);

      // Remove password from response
      delete user.user_password;

      logger.info('User created successfully', { user_id: user.user_id });

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async getUser(req, res) {
    try {
      const { id } = req.params;

      const user = await this.usersRepository.getUserWithDetails(id);

      if (!user) {
        throw new CustomException('User not found', 404);
      }

      // Remove password from response
      delete user.user_password;

      return res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (error) {
      logger.error('Error getting user:', error);
      throw error;
    }
  }

  async listUsers(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;

      let whereCondition = { is_delete: false };

      if (search) {
        whereCondition.$or = [
          { user_name: { $ilike: `%${search}%` } },
          { user_email: { $ilike: `%${search}%` } }
        ];
      }

      const users = await this.usersRepository.findMany(whereCondition, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        orderBy: 'created_at',
        orderDirection: 'desc'
      });

      // Remove passwords from response
      users.forEach(user => delete user.user_password);

      const total = await this.usersRepository.count(whereCondition);

      return res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: {
          users,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      logger.error('Error listing users:', error);
      throw error;
    }
  }

  async getUserPermissions(req, res) {
    try {
      const { id } = req.params;

      const user = await this.usersRepository.findById(id);

      if (!user) {
        throw new CustomException('User not found', 404);
      }

      const permissions = await this.usersRepository.getUserPermissions(id);

      return res.status(200).json({
        success: true,
        message: 'User permissions retrieved successfully',
        data: permissions,
      });
    } catch (error) {
      logger.error('Error getting user permissions:', error);
      throw error;
    }
  }

  async login(req, res) {
    try {
      const { user_name, user_password } = req.body;

      // Find user by username or email
      let user = await this.usersRepository.findByUsername(user_name);
      if (!user) {
        user = await this.usersRepository.findByEmail(user_name);
      }

      if (!user) {
        throw new CustomException('Invalid credentials', 401);
      }

      // Verify password
      const isValidPassword = await this.usersRepository.verifyPassword(user_password, user.user_password);
      if (!isValidPassword) {
        throw new CustomException('Invalid credentials', 401);
      }

      // Get user details with permissions
      const userDetails = await this.usersRepository.getUserWithDetails(user.user_id);
      const permissions = await this.usersRepository.getUserPermissions(user.user_id);

      // Generate JWT token
      const tokenPayload = {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        role_id: user.role_id,
        employee_id: user.employee_id,
      };

      const token = jwt.sign(tokenPayload, ssoConfig.sso.jwt.secret, {
        expiresIn: ssoConfig.sso.jwt.expiresIn,
        issuer: ssoConfig.sso.jwt.issuer,
        audience: ssoConfig.sso.jwt.audience,
      });

      logger.info('User logged in successfully', { user_id: user.user_id });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            ...userDetails,
            user_password: undefined, // Remove password from response
          },
          permissions,
          token,
        },
      });
    } catch (error) {
      logger.error('Error during login:', error);
      throw error;
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { employee_id, role_id, user_name, user_email, user_password } = req.body;
      const updatedBy = req.user?.user_id;

      const user = await this.usersRepository.findById(id);

      if (!user) {
        throw new CustomException('User not found', 404);
      }

      // Check if username already exists (excluding current user)
      if (user_name && user_name !== user.user_name) {
        const existingUser = await this.usersRepository.findByUsername(user_name);
        if (existingUser) {
          throw new CustomException('Username already exists', 400);
        }
      }

      // Check if email already exists (excluding current user)
      if (user_email && user_email !== user.user_email) {
        const existingUser = await this.usersRepository.findByEmail(user_email);
        if (existingUser) {
          throw new CustomException('Email already exists', 400);
        }
      }

      const updateData = {
        updated_at: new Date(),
        updated_by: updatedBy,
      };

      if (employee_id) updateData.employee_id = employee_id;
      if (role_id) updateData.role_id = role_id;
      if (user_name) updateData.user_name = user_name;
      if (user_email) updateData.user_email = user_email;
      if (user_password) updateData.user_password = user_password;

      const updatedUser = await this.usersRepository.updateUser(id, updateData);

      // Remove password from response
      delete updatedUser.user_password;

      logger.info('User updated successfully', { user_id: id });

      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deletedBy = req.user?.user_id;

      const user = await this.usersRepository.findById(id);

      if (!user) {
        throw new CustomException('User not found', 404);
      }

      await this.usersRepository.deleteUser(id, deletedBy);

      logger.info('User deleted successfully', { user_id: id });

      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  async restoreUser(req, res) {
    try {
      const { id } = req.params;
      const updatedBy = req.user?.user_id;

      const user = await this.usersRepository.findOne({
        user_id: id,
        is_delete: true
      });

      if (!user) {
        throw new CustomException('User not found or not deleted', 404);
      }

      await this.usersRepository.restoreUser(id, updatedBy);

      logger.info('User restored successfully', { user_id: id });

      return res.status(200).json({
        success: true,
        message: 'User restored successfully',
      });
    } catch (error) {
      logger.error('Error restoring user:', error);
      throw error;
    }
  }

  async changePassword(req, res) {
    try {
      const { current_password, new_password } = req.body;
      const userId = req.user?.user_id;

      const user = await this.usersRepository.findById(userId);

      if (!user) {
        throw new CustomException('User not found', 404);
      }

      // Verify current password
      const isValidPassword = await this.usersRepository.verifyPassword(current_password, user.user_password);
      if (!isValidPassword) {
        throw new CustomException('Current password is incorrect', 400);
      }

      // Update password
      await this.usersRepository.updateUser(userId, {
        user_password: new_password,
        updated_at: new Date(),
        updated_by: userId,
      });

      logger.info('Password changed successfully', { user_id: userId });

      return res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      logger.error('Error changing password:', error);
      throw error;
    }
  }
}

module.exports = UsersHandler;
