const { body } = require('express-validator');

/**
 * Validasi untuk endpoint update profil employee dan password
 */
const updateProfileValidation = [
  // Employee data validation
  body('employee_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nama employee harus antara 2-100 karakter'),
  
  body('employee_email')
    .optional()
    .isEmail()
    .withMessage('Format email employee tidak valid')
    .isLength({ max: 100 })
    .withMessage('Email employee maksimal 100 karakter'),
  
  body('title_id')
    .optional()
    .isUUID()
    .withMessage('Title ID harus berupa UUID yang valid'),

  // Password validation (conditional)
  body('current_password')
    .optional()
    .notEmpty()
    .withMessage('Password lama harus diisi jika ingin mengubah password'),
  
  body('new_password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password baru minimal 6 karakter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password baru harus mengandung minimal 1 huruf kecil, 1 huruf besar, dan 1 angka'),
  
  body('confirm_password')
    .optional()
    .notEmpty()
    .withMessage('Konfirmasi password harus diisi jika ingin mengubah password')
    .custom((value, { req }) => {
      if (req.body.new_password && value !== req.body.new_password) {
        throw new Error('Konfirmasi password tidak sama dengan password baru');
      }
      return true;
    }),

  // Custom validation untuk memastikan minimal satu field diisi
  body().custom((value, { req }) => {
    const { 
      employee_name, 
      employee_email, 
      title_id, 
      current_password, 
      new_password, 
      confirm_password 
    } = req.body;

    const hasEmployeeUpdate = employee_name || employee_email || title_id;
    const hasPasswordUpdate = current_password || new_password || confirm_password;

    if (!hasEmployeeUpdate && !hasPasswordUpdate) {
      throw new Error('Minimal satu field harus diisi untuk update profil');
    }

    // Jika ada password update, semua field password harus diisi
    if (hasPasswordUpdate) {
      if (!current_password || !new_password || !confirm_password) {
        throw new Error('Semua field password harus diisi untuk update password');
      }
    }

    return true;
  })
];

module.exports = {
  updateProfileValidation,
};
