export type PublicUser = Pick<
  User,
  | 'id'
  | 'name'
  | 'last_name'
  | 'email'
  | 'emailVerified'
  | 'phone'
  | 'lastLogin'
  | 'createdAt'
  | 'updatedAt'
  | 'provider'
>
