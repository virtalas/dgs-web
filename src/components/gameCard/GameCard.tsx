import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'

import ScoreCard from './ScoreCard'
import GameInfo from './GameInfo'
import BlueCard from './BlueCard'

const useStyles = makeStyles((theme) => ({
  title: {
    color: 'white',
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 8,
  },
}))

interface Props {
  game: Game,
}

// TODO: if startDate != null, render "1.1.1111 9.30 - 10.45"
// TODO: if game.creator == user, show "..."-button in the right upper corner

const GameCard: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { game } = props

  const [isEditing, setIsEditing] = useState(false)

  // TODO(?): if game.creator == user || user.isAdmin
  const allowedToEdit = true

  const editButton = (
    <IconButton aria-label="edit" className={classes.editButton} onClick={() => setIsEditing(!isEditing)}>
      {isEditing ? (<DoneIcon />) : (<EditIcon />)}
    </IconButton>
  )

  return (
    <BlueCard>
      <Typography variant="h6" className={classes.title}>{game.course.name}</Typography>
      <Typography variant="subtitle1" className={classes.title}>{game.endDate}</Typography>
      {allowedToEdit ? editButton : null}
      <ScoreCard game={game} />
      <GameInfo game={game} />
    </BlueCard>
  )
}

export default GameCard
