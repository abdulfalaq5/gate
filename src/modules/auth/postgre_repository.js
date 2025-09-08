const { pgCore } = require('../../config/database');
const {
  mappingSuccess,
  mappingError,
  setPayloadToken,
  isValidPassword,
  ROLE,
  generatePassword,
} = require('../../utils');
const { generateCustomerNo } = require('../../utils/customer')
const { lang } = require('../../lang');
const {
  TABLE,
  TABLE_CUSTOMER,
  TABLE_CLIENT,
  COLUMN,
  COLUMN_CUSTOMER,
  COLUMN_ME,
  COLUMN_CUSTOMER_ME,
  COLUMN_CLIENT,
  COLUMN_CLIENT_ME,
  TABLE_JOIN,
} = require('./column');
/**
 * @param {object} where
 * @param {string} password
 * @param {array} column
 * @return {object}
 */
const getByParam = async (where, password, column = COLUMN) => {
  try {
    where[`${TABLE}.deleted_at`] = null;
    const [result] = await pgCore(TABLE)
      .innerJoin(TABLE_JOIN, `${TABLE_JOIN}.role_id`, `${TABLE}.role_id`)
      .select(column)
      .where(where);
    if (result) {
      const validationPassword = isValidPassword(
        password,
        result.password,
        result.salt
      );
      if (result?.status === '1' && validationPassword === true) {
        const response = mappingSuccess(
          lang.__('get.success'),
          setPayloadToken(result)
        );
        return response?.data;
      }
      if (result?.status === '1' && validationPassword === false) {
        return mappingSuccess(lang.__('password.invalid'), [], 201, false);
      }
      return mappingSuccess(lang.__('account.not.active'), [], 201, false);
    }
    return mappingSuccess(
      lang.__('username.not.found', { val: where?.username }),
      [],
      201,
      false
    );
  } catch (error) {
    error.path = __filename;
    return mappingError(error);
  }
};

const getByParamInspection = async (where, password, column = COLUMN) => {
  try {
    where[`${TABLE}.deleted_at`] = null;
    const [result] = await pgCore(TABLE)
      .innerJoin(TABLE_JOIN, `${TABLE_JOIN}.role_id`, `${TABLE}.role_id`)
      .select(column)
      .where(where)
      .where((builder) => {
        builder
          .where(where)
          .whereIn(`${TABLE_JOIN}.role_name`, ROLE.ONLY_INSPECTION);
      });

    if (result) {
      const validationPassword = isValidPassword(
        password,
        result.password,
        result.salt
      );
      if (result?.status === '1' && validationPassword === true) {
        const response = mappingSuccess(
          lang.__('get.success'),
          setPayloadToken(result, 'admin', true)
        );

        response.data.data.access_token.location_id = result.location_id;
        response.data.data.refresh_token.location_id = result.location_id;

        return response?.data;
      }
      if (result?.status === '1' && validationPassword === false) {
        return mappingSuccess(lang.__('password.invalid'), [], 201, false);
      }
      return mappingSuccess(lang.__('account.not.active'), [], 201, false);
    }
    return mappingSuccess(
      lang.__('username.not.found', { val: where?.username }),
      [],
      201,
      false
    );
  } catch (error) {
    error.path = __filename;
    return mappingError(error);
  }
};

const customerSignin = async (email, password, column = COLUMN_CUSTOMER) => {
  try {
    const [result] = await pgCore(TABLE_CUSTOMER)
      .select(column)
      .where((builder) => {
        builder.whereILike('email', `${email}%`).andWhere('deleted_at', null);
      });
    if (result) {
      const validationPassword = isValidPassword(
        password,
        result.password,
        result.salt
      );
      if (result?.status === '1' && validationPassword === true) {
        result.role_name = ROLE.CUSTOMER_BUYER;
        const response = mappingSuccess(
          lang.__('get.success'),
          setPayloadToken(result, 'front')
        );
        return response?.data;
      }
      if (result?.status === '1' && validationPassword === false) {
        return mappingSuccess(lang.__('password.invalid'), [], 201, false);
      }
      return mappingSuccess(lang.__('account.not.active'), [], 201, false);
    }
    return mappingSuccess(
      lang.__('username.not.found', { val: email }),
      [],
      201,
      false
    );
  } catch (error) {
    error.path = __filename;
    return mappingError(error);
  }
};

const refreshTokenCustomer = async (where, column = COLUMN_CUSTOMER) => {
  try {
    where[`${TABLE_CUSTOMER}.deleted_at`] = null;
    const [result] = await pgCore(TABLE_CUSTOMER).select(column).where(where);
    if (result) {
      result.role_name = ROLE.CUSTOMER_BUYER;
      const response = mappingSuccess(
        lang.__('get.success'),
        setPayloadToken(result, 'front')
      );
      return response?.data;
    }
    return mappingSuccess(lang.__('not.found'));
  } catch (error) {
    error.path = __filename;
    return mappingError(error);
  }
};

const meCustomer = async (where, column = COLUMN_CUSTOMER_ME) => {
  try {
    where[`${TABLE_CUSTOMER}.deleted_at`] = null;
    const [result] = await pgCore(TABLE_CUSTOMER).select(column).where(where);
    if (result) {
      return mappingSuccess(lang.__('get.success'), result);
    }
    return mappingSuccess(lang.__('not.found'), [], 201, false);
  } catch (error) {
    error.path = __filename;
    return mappingError(error);
  }
};

const conductorSignin = async (where, password, column = COLUMN) => {
  try {
    where[`${TABLE}.deleted_at`] = null;
    const [result] = await pgCore(TABLE)
      .leftJoin(TABLE_JOIN, `${TABLE_JOIN}.role_id`, `${TABLE}.role_id`)
      .select(column)
      .where(where);
    if (result) {
      const validationPassword = isValidPassword(
        password,
        result.password,
        result.salt
      );
      if (
        result?.status === '1'
        && validationPassword === true
        && ROLE.ONLY_CONDUCTOR.includes(result?.role_name)
      ) {
        const response = mappingSuccess(
          lang.__('get.success'),
          setPayloadToken(result)
        );
        return response?.data;
      }
      if (result?.status === '1' && validationPassword === false) {
        return mappingSuccess(lang.__('password.invalid'), [], 201, false);
      }
      return mappingSuccess(lang.__('account.not.access'), [], 201, false);
    }
    return mappingSuccess(
      lang.__('username.not.found', { val: where?.username }),
      [],
      201,
      false
    );
  } catch (error) {
    error.path = __filename;
    return mappingError(error);
  }
};

const refreshToken = async (where, column = COLUMN) => {
  try {
    where[`${TABLE}.deleted_at`] = null;
    const [result] = await pgCore(TABLE)
      .innerJoin(TABLE_JOIN, `${TABLE_JOIN}.role_id`, `${TABLE}.role_id`)
      .select(column)
      .where(where);
    if (result) {
      const response = mappingSuccess(
        lang.__('get.success'),
        setPayloadToken(result)
      );
      return response?.data;
    }
    return mappingSuccess(
      lang.__('not.found.value', { value: result?.username })
    );
  } catch (error) {
    error.path = __filename;
    return mappingError(error);
  }
};

const getPermissions = async (result) => {
  try {
    const permissions = await pgCore.raw(`select concat(mam.permission_name, '.',mp.name)
    from mst_menu_has_permissions mmhp
    inner join mst_permissions mp on mmhp.permission_id = mp.id
    inner join mst_admin_menu mam on mmhp.menu_id = mam.menu_id
    inner join mst_role_has_permissions mrhp on mmhp.permission_id = mrhp.permission_id
    and mmhp.menu_id = mrhp.menu_id and mrhp.role_id = '${result?.role_id}'`);
    return permissions?.rows;
  } catch (error) {
    return error;
  }
};

const me = async (where, column = COLUMN_ME) => {
  try {
    where[`${TABLE}.deleted_at`] = null;
    const [result] = await pgCore(TABLE)
      .innerJoin(TABLE_JOIN, `${TABLE_JOIN}.role_id`, `${TABLE}.role_id`)
      .select(column)
      .where(where);
    if (result) {
      const permissions = await getPermissions(result);
      result.permissions = permissions.map((obj) => obj.concat.toLowerCase().split(' ').join(''));
      return mappingSuccess(lang.__('get.success'), result);
    }
    return mappingSuccess(lang.__('not.found'), [], 201, false);
  } catch (error) {
    error.path = __filename;
    return mappingError(error);
  }
};

const clientSignin = async (email, password, column = COLUMN_CLIENT) => {
  try {
    const [result] = await pgCore(TABLE_CLIENT)
      .select(column)
      .where((builder) => {
        builder.whereILike('email', `${email}%`).andWhere('deleted_at', null);
      });
    if (result) {
      const validationPassword = isValidPassword(
        password,
        result.password,
        result.salt
      );
      if (result?.status === '1' && validationPassword === true) {
        result.role_name = ROLE.CLIENT_SELLER;
        const response = mappingSuccess(
          lang.__('get.success'),
          setPayloadToken(result, 'front')
        );
        return response?.data;
      }
      if (result?.status === '1' && validationPassword === false) {
        return mappingSuccess(lang.__('password.invalid'), [], 201, false);
      }
      return mappingSuccess(lang.__('account.not.active'), [], 201, false);
    }
    return mappingSuccess(
      lang.__('username.not.found', { val: email }),
      [],
      201,
      false
    );
  } catch (error) {
    console.log(error)
    error.path = __filename;
    return mappingError(error);
  }
};

const refreshTokenClient = async (where, column = COLUMN_CLIENT) => {
  try {
    where[`${TABLE_CLIENT}.deleted_at`] = null;
    const [result] = await pgCore(TABLE_CLIENT).select(column).where(where);
    if (result) {
      result.role_name = ROLE.CLIENT_SELLER;
      const response = mappingSuccess(
        lang.__('get.success'),
        setPayloadToken(result, ROLE.CLIENT_SELLER)
      );
      return response?.data;
    }
    return mappingSuccess(lang.__('not.found'));
  } catch (error) {
    error.path = __filename;
    return mappingError(error);
  }
};

const meClient = async (where, column = COLUMN_CLIENT_ME) => {
  try {
    where[`${TABLE_CLIENT}.deleted_at`] = null;
    const [result] = await pgCore(TABLE_CLIENT).select(column).where(where);
    if (result) {
      return mappingSuccess(lang.__('get.success'), result);
    }
    return mappingSuccess(lang.__('not.found'), [], 201, false);
  } catch (error) {
    error.path = __filename;
    return mappingError(error);
  }
};

const registerCustomer = async (payload) => {
  try {
    // Generate customer number
    const customerNo = await generateCustomerNo()

    // Prepare customer data with proper password handling
    const passwordPayload = { password: payload.password }
    const { password, salt } = generatePassword(passwordPayload)

    // Prepare customer data
    const customerData = {
      ...payload,
      password,
      salt,
      customer_no: customerNo,
      registration_date: new Date(),
      status: '1', // Active by default
      created_at: new Date()
    }

    // Insert into database
    const [result] = await pgCore(TABLE_CUSTOMER)
      .insert(customerData)
      .returning('*')

    return mappingSuccess(lang.__('create.success'), result)
  } catch (error) {
    error.path = __filename
    return mappingError(error)
  }
}

module.exports = {
  getByParam,
  getByParamInspection,
  refreshToken,
  refreshTokenCustomer,
  customerSignin,
  conductorSignin,
  me,
  meCustomer,
  clientSignin,
  meClient,
  refreshTokenClient,
  registerCustomer
};
