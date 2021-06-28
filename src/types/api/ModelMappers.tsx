import { calculateToPar, calculateTotalScore } from '../../utils/ScoreUtil'

const playerScoresToPlayer = (playerScores: ApiPlayerScores): Player => {
  return {
    id: playerScores.player_id,
    firstName: playerScores.player_name,
    lastName: playerScores.player_last_name ?? '',
    friendStatus: playerScores.friend_status,
    guest: undefined,
    newGuest: undefined,
    admin: undefined,
  }
}

export const apiGameResponseToGame = (gameResponse: ApiGameResponse): Game => {
  const layoutTotalPar = gameResponse.layout.holes.map((hole: Hole) => hole.par).reduce((a: number, b: number) => a + b)
  const comments = gameResponse.game.comments.map(apiComment => apiCommentToComment(apiComment))
  const photos = gameResponse.game.photos.map(apiPhoto => apiPhotoToPhoto(apiPhoto))
  return {
    id: gameResponse.game.id,
    creatorId: gameResponse.game.creator_id,
    courseName: gameResponse.course.name,
    courseId: gameResponse.course.id,
    layout: { ...gameResponse.layout, total: layoutTotalPar, mapURL: gameResponse.layout.mapURL},
    startDate: gameResponse.game.start_date ? new Date(gameResponse.game.start_date) : undefined,
    endDate: new Date(gameResponse.game.end_date),
    temperature: gameResponse.game.temperature,
    comments: sortByCreatedDate(comments),
    scores: gameResponse.scores.map((playerScores: ApiPlayerScores) => {
      const total = calculateTotalScore(playerScores.throws, playerScores.obs)
      return {
        player: playerScoresToPlayer(playerScores),
        strokes: playerScores.throws,
        obs: playerScores.obs,
        total: total,
        toPar: calculateToPar(playerScores.throws, total, gameResponse.layout.holes),
      }
    }),
    tags: sortTags(gameResponse.game.tags
      .filter(tag => (!tag.condition && !tag.weather_condition))
      .map(tag => apiTagToTag(tag))),
    weatherConditions: sortTags(gameResponse.game.tags
      .filter(tag => tag.weather_condition)
      .map(tag => apiTagToTag(tag))),
    conditions: sortTags(gameResponse.game.tags
      .filter(tag => tag.condition)
      .map(tag => apiTagToTag(tag))),
    photos: sortByCreatedDate(photos),
    highScorers: gameResponse.scores
      .filter(s => s.high_score)
      .map(s => playerScoresToPlayer(s)),
    illegalScorers: gameResponse.scores
      .filter(s => !s.legal)
      .map(s => playerScoresToPlayer(s)),
  }
}

export const apiTagToTag = (apiTag: ApiTag): Tag => {
  return {
    id: apiTag.id ?? '',
    name: apiTag.name,
    condition: apiTag.condition,
    weatherCondition: apiTag.weather_condition,
  }
}

const tagToApiTag = (tag: Tag): ApiTag => {
  return {
    id: tag.id.includes('temp-id') ? undefined : tag.id,
    name: tag.name,
    condition: tag.condition,
    weather_condition: tag.weatherCondition,
  }
}

const apiCommentToComment = (apiComment: ApiComment): GameComment => {
  return {
    id: apiComment.id,
    userId: apiComment.user_id,
    content: apiComment.content,
    createdDate: new Date(apiComment.created_date),
  }
}

export const apiPhotoToPhoto =(apiPhoto: ApiPhoto): Photo => {
  return {
    id: apiPhoto.id,
    key: apiPhoto.key,
    url: apiPhoto.url,
    thumbnailKey: apiPhoto.thumbnail_key,
    thumbnailUrl: apiPhoto.thumbnail_url,
    createdDate: new Date(apiPhoto.created_date),
  }
}

export const gameToApiGameUpdate = (game: Game, userId: string): ApiGameUpdate => {
  return {
    id: game.id,
    creator_id: game.creatorId,
    start_date: game.startDate,
    end_date: game.endDate,
    comment_content: game.comments.find(comment => comment.userId === userId)?.content ?? '',
    temperature: game.temperature,
    tags: game.tags.concat(game.conditions).concat(game.weatherConditions).map(tag => tagToApiTag(tag)),
  }
}

export const apiPlayerToPlayer = (apiPlayer: ApiPlayer): Player => {
  return {
    id: apiPlayer.id,
    firstName: apiPlayer.first_name,
    lastName: apiPlayer.last_name,
    friendStatus: undefined,
    admin: apiPlayer.admin ?? undefined,
    guest: apiPlayer.email === null,
    newGuest: undefined,
  }
}

export const apiCourseHighScoresToCourseHighScores = (highScores: ApiCourseHighScores): CourseHighScores => {
  return {
    courseName: highScores.course_name,
    layoutHighScores: highScores.layout_high_scores.map(hs => {
      return {
        gameId: hs.game_id,
        gameEndDate: new Date(hs.game_end_date),
        layoutName: hs.layout_name,
        toPar: hs.to_par,
      }
    })
  }
}

export const apiListCourseToListCourse = (apiListCourse: ApiListCourse): ListCourse => {
  return {
    id: apiListCourse.id,
    name: apiListCourse.name,
    city: apiListCourse.city,
    lat: apiListCourse.lat,
    lon: apiListCourse.lon,
    numberOfGames: apiListCourse.number_of_games,
    photo: apiListCourse.photo ? apiPhotoToPhoto(apiListCourse.photo) : undefined,
  }
}

export const apiBasicCourseToBasicCourse = (apiBasicCourse: ApiBasicCourse): BasicCourse => {
  return {
    id: apiBasicCourse.id,
    name: apiBasicCourse.name,
    city: apiBasicCourse.city,
    lat: apiBasicCourse.lat,
    lon: apiBasicCourse.lon,
    layouts: apiBasicCourse.layouts,
    numberOfGames: apiBasicCourse.number_of_games,
  }
}

export const apiDetailedCourseToDetailedCourse = (apiDetailedCourse: ApiDetailedCourse): DetailedCourse => {
  return {
    id: apiDetailedCourse.id,
    name: apiDetailedCourse.name,
    city: apiDetailedCourse.city,
    lat: apiDetailedCourse.lat,
    lon: apiDetailedCourse.lon,
    layouts: apiDetailedCourse.layouts.map(apiDetailedLayout => apiDetailedLayoutToDetailedLayout(apiDetailedLayout)),
    allowedToEdit: apiDetailedCourse.allowed_to_edit,
    numberOfGames: apiDetailedCourse.number_of_games,
    photo: apiDetailedCourse.photo ? apiPhotoToPhoto(apiDetailedCourse.photo) : undefined,
  }
}

export const apiDetailedLayoutToDetailedLayout = (apiDetailedLayout: ApiDetailedLayout): DetailedLayout => {
  return {
    id: apiDetailedLayout.id,
    active: apiDetailedLayout.active,
    name: apiDetailedLayout.name,
    description: apiDetailedLayout.description,
    holes: apiDetailedLayout.holes,
    total: apiDetailedLayout.total,
    mapURL: apiDetailedLayout.mapURL,
    allowedToEdit: apiDetailedLayout.allowed_to_edit,  
  }
}

export function sortCourses(courses: Course[], sortByPopularity: boolean): Course[] {
  return courses.sort((a, b) => {
    if (sortByPopularity) {
      return b.numberOfGames - a.numberOfGames
    }
    return a.name > b.name ? 1 : -1
  })
}

export function sortTags(tags: Tag[]): Tag[] {
  return tags.sort((a, b) => {
    return a.name > b.name ? 1 : -1
  })
}

export function sortByCreatedDate(array: { createdDate: Date }[]): any {
  return array.sort((a, b) => {
    let same = a.createdDate.getTime() === b.createdDate.getTime()
    if (same) return 0
    if (a.createdDate > b.createdDate) return 1
    return -1
  })
}
