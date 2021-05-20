interface ApiTagUpdate {
  id: string | undefined,
  name: string,
}

interface ApiGameUpdate {
  id: string,
  creator_id: string,
  start_date: datetime | undefined,
  end_date: datetime,
  comment_content: string,
  temperature: double | undefined,
  tags: ApiTagUpdate[],
}
