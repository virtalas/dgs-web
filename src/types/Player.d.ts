interface Player {
  id: string,
  firstName: string,
  lastName: string,
  friendStatus: 'confirmed' | 'pending' | 'not_friends' | undefined,
  guest: boolean | undefined,
  admin: boolean | undefined,
}
