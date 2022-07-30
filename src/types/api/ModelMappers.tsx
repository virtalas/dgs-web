import { calculateToPar, calculateTotalScore } from '../../utils/ScoreUtil'
import { CourseSort } from '../enums/CourseSort'

const playerScoresToPlayer = (playerScores: ApiPlayerScores): Player => {
  return {
    id: playerScores.player_id,
    firstName: playerScores.player_name,
    lastName: playerScores.player_last_name,
    friendStatus: playerScores.friend_status,
    guest: playerScores.guest,
    newGuest: undefined,
    admin: undefined,
  }
}

const playerScoresToGameHighScore = (playerScores: ApiPlayerScores): GameHighScore => {
  return {
    player: playerScoresToPlayer(playerScores),
    isCurrentBest: playerScores.is_current_best,
  }
}

export const apiGameResponseToGame = (gameResponse: ApiGameResponse): Game => {
  const layoutTotalPar = gameResponse.layout.holes.map((hole: Hole) => hole.par).reduce((a: number, b: number) => a + b)
  const comments = gameResponse.game.comments.map(apiComment => apiCommentToComment(apiComment))
  const photos = gameResponse.game.photos.map(apiPhoto => apiPhotoToPhoto(apiPhoto))
  const scores = gameResponse.scores.map((playerScores: ApiPlayerScores) => {
    const total = calculateTotalScore(playerScores.throws, playerScores.obs)
    return {
      player: playerScoresToPlayer(playerScores),
      strokes: playerScores.throws,
      obs: playerScores.obs,
      total: total,
      toPar: calculateToPar(playerScores.throws, total, gameResponse.layout.holes),
    }
  })

  return {
    id: gameResponse.game.id,
    creatorId: gameResponse.game.creator_id,
    courseName: gameResponse.course.name,
    courseId: gameResponse.course.id,
    layout: { ...gameResponse.layout, total: layoutTotalPar, mapURL: gameResponse.layout.mapURL},
    startDate: gameResponse.game.start_date ? new Date(gameResponse.game.start_date) : undefined,
    endDate: new Date(gameResponse.game.end_date),
    temperature: gameResponse.game.temperature,
    weatherIconId: gameResponse.game.weather_icon_id,
    comments: sortByCreatedDate(comments),
    scores: sortByToPar(scores),
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
      .map(s => playerScoresToGameHighScore(s)),
    illegalScorers: gameResponse.scores
      .filter(s => !s.legal)
      .map(s => playerScoresToPlayer(s)),
    allowedToEdit: gameResponse.game.allowed_to_edit,
    finished: gameResponse.game.finished,
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

export const apiPhotoToPhoto = (apiPhoto: ApiPhoto): Photo => {
  return {
    id: apiPhoto.id,
    key: apiPhoto.key,
    url: apiPhoto.url,
    thumbnailKey: apiPhoto.thumbnail_key,
    thumbnailUrl: apiPhoto.thumbnail_url,
    createdDate: new Date(apiPhoto.created_date),
    gameId: apiPhoto.game_id,
    gameEndDate: apiPhoto.game_end_date ? new Date(apiPhoto.game_end_date) : undefined,
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
    weather_icon_id: game.weatherIconId,
    tags: game.tags.concat(game.conditions).concat(game.weatherConditions).map(tag => tagToApiTag(tag)),
    finished: game.finished,
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
        layoutId: hs.layout_id,
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
  }
}

export const apiDetailedCourseToDetailedCourse = (apiDetailedCourse: ApiDetailedCourse): DetailedCourse => {
  const layouts = apiDetailedCourse.layouts.map(apiDetailedLayout => apiDetailedLayoutToDetailedLayout(apiDetailedLayout))
  const photos = apiDetailedCourse.photos.map(photo => apiPhotoToPhoto(photo))

  return {
    id: apiDetailedCourse.id,
    name: apiDetailedCourse.name,
    city: apiDetailedCourse.city,
    lat: apiDetailedCourse.lat,
    lon: apiDetailedCourse.lon,
    layouts: sortByNumberOfGames(layouts),
    allowedToEdit: apiDetailedCourse.allowed_to_edit,
    numberOfGames: apiDetailedCourse.number_of_games,
    photo: apiDetailedCourse.photo ? apiPhotoToPhoto(apiDetailedCourse.photo) : undefined,
    photos: sortByGameEndDate(photos, false),
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
    numberOfGamesUniversal: apiDetailedLayout.number_of_games_universal,
  }
}

export const apiHoleScoreDistributionToHoleScoreDistribution = (apiHoleScoreDistribution: ApiHoleScoreDistribution): HoleScoreDistribution => {
  return {
    holeNum: apiHoleScoreDistribution.hole_num,
    holeAvgScore: apiHoleScoreDistribution.hole_avg_score,
    holeAvgToPar: apiHoleScoreDistribution.hole_avg_to_par,
    holeDifficultyPlacement: apiHoleScoreDistribution.difficulty_placement,
    holeInOneCount: apiHoleScoreDistribution.hole_in_one_count,
    eagleCount: apiHoleScoreDistribution.eagle_count,
    birdieCount: apiHoleScoreDistribution.birdie_count,
    parCount: apiHoleScoreDistribution.par_count,
    bogeyCount: apiHoleScoreDistribution.bogey_count,
    overBogeyCount: apiHoleScoreDistribution.over_bogey_count,
  }
}

export function sortCourses(courses: Course[], sortBy: CourseSort): Course[] {
  return courses.sort((a, b) => {
    switch (sortBy) {
      case CourseSort.byName:
        return a.name > b.name ? 1 : -1
      case CourseSort.byCity:
        if (a.city === b.city) return a.name > b.name ? 1 : -1
        return a.city > b.city ? 1 : -1
      case CourseSort.byNumberOfGames:
        const same = (a as ListCourse).numberOfGames === (b as ListCourse).numberOfGames
        if (same) return a.name > b.name ? 1 : -1
        return (b as ListCourse).numberOfGames - (a as ListCourse).numberOfGames
      default:
        return -1
    }
  })
}

export function sortTags(tags: Tag[]): Tag[] {
  return tags.sort((a, b) => {
    return a.name > b.name ? 1 : -1
  })
}

export function sortByCreatedDate(array: { createdDate: Date }[], asc: boolean = true): any {
  return array.sort((a, b) => {
    let same = a.createdDate.getTime() === b.createdDate.getTime()
    if (same) return 0
    if (a.createdDate > b.createdDate) return asc ? 1 : -1
    return asc ? -1 : 1
  })
}

export function sortByGameEndDate(array: { gameEndDate: Date | undefined }[], asc: boolean = true): any {
  return array.sort((a, b) => {
    if (a.gameEndDate === undefined || b.gameEndDate === undefined) return 0
    let same = a.gameEndDate.getTime() === b.gameEndDate.getTime()
    if (same) return 0
    if (a.gameEndDate > b.gameEndDate) return asc ? 1 : -1
    return asc ? -1 : 1
  })
}

export function sortByToPar(scores: PlayerScores[]): PlayerScores[] {
  return scores.sort((a, b) => {
    let same = a.toPar === b.toPar
    if (same) return b.total - a.total // Same toPar but lower total means they skipped holes, meaning illegal round.
    if (a.toPar > b.toPar) return 1
    return -1
  })
}

export function sortByName(array: BasicLayout[]): BasicLayout[] {
  return array.sort((a, b) => {
    let same = a.name === b.name
    if (same) return 0
    if (a.name > b.name) return 1
    return -1
  })
}

function sortByNumberOfGames(array: DetailedLayout[]): DetailedLayout[] {
  return array.sort((a, b) => {
    let same = a.numberOfGamesUniversal === b.numberOfGamesUniversal
    if (same) return (a.name > b.name) ? 1 : -1
    if (a.numberOfGamesUniversal < b.numberOfGamesUniversal) return 1
    return -1
  })
}