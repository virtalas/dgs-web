interface Photo {
  id: string,
  key: string,
  url: string | undefined,
  thumbnailKey: string,
  thumbnailUrl: string | undefined,
  createdDate: Date,
  gameId: string | undefined,
  gameEndDate: Date | undefined,
}
