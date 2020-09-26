import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { IconButton, withStyles } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'
import TextField from '@material-ui/core/TextField'

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

const GameDateTextField = withStyles({
  root: {
    '& label': {
      color: 'white',
    },
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
      color: 'white',
    },
    marginTop: 5,
    marginBottom: 10,
  },
})(TextField)

interface Props {
  game: Game,
}

// TODO: if startDate != null, render "1.1.1111 9.30 - 10.45"
// TODO: When isEditing == true, hide new game button
// TODO: update game & backend after editing done.

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

  const gameDate = (
    <Typography variant="subtitle1" className={classes.title}>{game.endDate}</Typography>
  )

  // TODO: Validation for date, calendar value picker?
  const gameDateEditing = (
    <div>
      <GameDateTextField
        id="gamedate-start-edit"
        label="Start"
        variant="outlined"
        size="small"
        defaultValue={game.startDate}
      />
      <GameDateTextField
        id="gamedate-end-edit"
        label="End"
        variant="outlined"
        size="small"
        defaultValue={game.endDate}
      />
    </div>
  )

  return (
    <BlueCard>
      <Typography variant="h6" className={classes.title}>{game.course.name}</Typography>
      {isEditing ? gameDateEditing : gameDate}
      {allowedToEdit ? editButton : null}
      <ScoreCard game={game} isEditing={isEditing} />
      <GameInfo game={game} />
    </BlueCard>
  )
}

export default GameCard
