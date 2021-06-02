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
  return {
    id: gameResponse.game.id,
    creatorId: gameResponse.game.creator_id,
    courseName: gameResponse.course.name,
    layout: { ...gameResponse.layout, total: layoutTotalPar},
    startDate: gameResponse.game.start_date ? new Date(gameResponse.game.start_date) : undefined,
    endDate: new Date(gameResponse.game.end_date),
    temperature: gameResponse.game.temperature,
    comments: gameResponse.game.comments.map(apiComment => apiCommentToComment(apiComment)),
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

export const apiCourseToCourse = (apiCourse: ApiCourse): Course => {
  return {
    id: apiCourse.id,
    name: apiCourse.name,
    city: apiCourse.city,
    layouts: apiCourse.layouts,
    allowedToEdit: undefined,
    numberOfGames: apiCourse.number_of_games,
  }
}

export const apiDetailedCourseToCourse = (apiDetailedCourse: ApiDetailedCourse): Course => {
  return {
    id: apiDetailedCourse.id,
    name: apiDetailedCourse.name,
    city: apiDetailedCourse.city,
    layouts: apiDetailedCourse.layouts.map(apiDetailedLayout => apiDetailedLayoutToLayout(apiDetailedLayout)),
    allowedToEdit: apiDetailedCourse.allowed_to_edit,
    numberOfGames: apiDetailedCourse.number_of_games,
  }
}

export const apiDetailedLayoutToLayout = (apiDetailedLayout: ApiDetailedLayout): Layout => {
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

export function sortTags(tags: Tag[]): Tag[] {
  return tags.sort((a, b) => {
    return a.name > b.name ? 1 : -1
  })
}
