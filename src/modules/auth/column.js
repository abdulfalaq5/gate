const TABLE = 'mst_users';
const TABLE_CUSTOMER = 'mst_customer';
const TABLE_CLIENT = 'mst_client';
const TABLE_JOIN = 'mst_role';
const COLUMN = [
  `${TABLE}.users_id`,
  `${TABLE}.full_name`,
  `${TABLE}.status`,
  `${TABLE}.password`,
  `${TABLE}.salt`,
  `${TABLE}.location_id`,
  `${TABLE_JOIN}.role_name`,
];
const COLUMN_ME = [
  `${TABLE}.users_id`,
  `${TABLE}.full_name`,
  `${TABLE}.jabatan`,
  `${TABLE_JOIN}.role_name`,
  `${TABLE}.role_id`,
];
const COLUMN_CUSTOMER = [
  `${TABLE_CUSTOMER}.customer_id as users_id`,
  `${TABLE_CUSTOMER}.first_name`,
  `${TABLE_CUSTOMER}.last_name`,
  `${TABLE_CUSTOMER}.status`,
  `${TABLE_CUSTOMER}.password`,
  `${TABLE_CUSTOMER}.salt`,
];
const COLUMN_CUSTOMER_ME = [
  `${TABLE_CUSTOMER}.customer_id`,
  `${TABLE_CUSTOMER}.first_name`,
  `${TABLE_CUSTOMER}.last_name`,
  `${TABLE_CUSTOMER}.company_name`,
];
const COLUMN_CLIENT = [
  `${TABLE_CLIENT}.client_id as users_id`,
  `${TABLE_CLIENT}.first_name`,
  `${TABLE_CLIENT}.last_name`,
  `${TABLE_CLIENT}.status`,
  `${TABLE_CLIENT}.password`,
  `${TABLE_CLIENT}.salt`,
];
const COLUMN_CLIENT_ME = [
  `${TABLE_CLIENT}.client_id`,
  `${TABLE_CLIENT}.first_name`,
  `${TABLE_CLIENT}.last_name`,
];

module.exports = {
  TABLE,
  TABLE_CUSTOMER,
  TABLE_CLIENT,
  TABLE_JOIN,
  COLUMN,
  COLUMN_CUSTOMER,
  COLUMN_ME,
  COLUMN_CUSTOMER_ME,
  COLUMN_CLIENT,
  COLUMN_CLIENT_ME,
};
