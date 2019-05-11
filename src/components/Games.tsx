import React, { useState, useEffect } from 'react'

import GameCard from './gameCard/GameCard'
import gamesService from '../services/gamesService'

const Games: React.FC<{}> = () => {
  const [games, setGames] = useState<Game[]>([])
  
  // useEffect(func, []) works like componentDidMount.
  useEffect(() => {
    gamesService.getAllGamesByMonth(0).then((fetchedGames) => {
      setGames(fetchedGames)
    })
  }, [])
  
  // TODO: 'No games' text.
  return (
    <div id="gamesPage">
      {games.map(game => (
        <GameCard game={game} key={game.id}/>
      ))}
    </div>
  )
}

export default Games
