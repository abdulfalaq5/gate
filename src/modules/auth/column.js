const TABLE = 'employees';
const TABLE_JOIN = 'titles';
const TABLE_JOIN_DEPT = 'departments';
const COLUMN = [
  `${TABLE}.employee_id as users_id`,
  `${TABLE}.employee_name as full_name`,
  `${TABLE}.is_delete as status`,
  `${TABLE}.password`,
  `${TABLE}.employee_exmail_account as user_email`,
  `${TABLE_JOIN}.title_name`,
  `${TABLE_JOIN_DEPT}.department_name`,
];
const COLUMN_ME = [
  `${TABLE}.employee_id as users_id`,
  `${TABLE}.employee_name as full_name`,
  `${TABLE}.employee_exmail_account as user_email`,
  `${TABLE_JOIN}.title_name`,
  `${TABLE_JOIN_DEPT}.department_name`,
];

module.exports = {
  TABLE,
  TABLE_JOIN,
  TABLE_JOIN_DEPT,
  COLUMN,
  COLUMN_ME,
};
