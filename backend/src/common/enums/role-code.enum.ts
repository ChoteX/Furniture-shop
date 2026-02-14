export enum RoleCode {
  ADMIN = 'admin',
  AUTHORIZED_DEALER = 'authorized_dealer',
  ARCHITECT = 'architect',
  PRESS = 'press',
}

export const NON_ADMIN_ROLES = [
  RoleCode.AUTHORIZED_DEALER,
  RoleCode.ARCHITECT,
  RoleCode.PRESS,
];
