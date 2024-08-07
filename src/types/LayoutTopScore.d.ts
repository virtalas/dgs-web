interface LayoutTopScore {
    gameId: string,
    gameEndDate: Date,
    playerId: string,
    playerFirstName: string,
    playerLastName: string,
    toPar: number,
    totalScore: number,
}

interface LayoutTopScores {
    meAndFriendsTop: LayoutTopScore[],
    myTop: LayoutTopScore[],
}
