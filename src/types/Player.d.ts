interface Player {
  id: string,
  firstName: string,
  lastName: string | undefined,
  friendStatus: 'confirmed' | 'pending' | 'not_friends' | undefined,
  guest: boolean | undefined,
  newGuest: boolean | undefined,
  admin: boolean | undefined,
}
