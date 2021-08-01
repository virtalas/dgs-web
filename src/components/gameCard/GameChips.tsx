import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'

import { highScoreBlue, illegalRed } from '../../constants/Colors'
import AddTagButton from './AddTagButton'
import { Redirect } from 'react-router-dom'

export const chipHeight = 22

const useStyles = makeStyles((theme) => ({
  chip: {
    height: chipHeight,
    marginRight: 8,
  },
  chipRow: {
    lineHeight: '31px', // Affects spacing between chips when wrapped to two rows.
  },
  highScoreChip: {
    height: chipHeight,
    width: 90,
    fontSize: '97%',
    cursor: 'pointer',
    backgroundColor: highScoreBlue,
    color: 'white',
    position: 'relative',
    left: -5,
  },
  illegalChip: {
    height: chipHeight,
    width: 100,
    fontSize: '97%',
    cursor: 'pointer',
    backgroundColor: illegalRed,
    color: 'white',
    position: 'relative',
    left: -5,
  },
  illegalDisabledChip: {
    height: chipHeight,
    width: 100,
    fontSize: '97%',
    cursor: 'pointer',
    position: 'relative',
    left: -5,
  },
}), { name: 'MuiHook' })

interface Props {
  game: Game,
  setGame: (game: Game) => void,
  isEditing: boolean,
  availableWeatherConditions: Tag[],
  availableConditions: Tag[],
  chosenUserTagHistory: Tag[],
  setChosenUserTagHistory: (tags: Tag[]) => void,
}

const GameChips: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { game, setGame, isEditing, availableWeatherConditions, availableConditions, chosenUserTagHistory, setChosenUserTagHistory } = props

  const [playerRedirect, setPlayerRedirect] = useState(false)
  const [gameSearchRedirectPath, setGameSearchRedirectPath] = useState<string>()

  const editableUserTagsToShow = [...game.tags, ...chosenUserTagHistory.filter(tag => !arrayContainsTag(game.tags, tag))]

  useEffect(() => {
    const userTagsNotInHistory = game.tags.filter(tag => !arrayContainsTag(chosenUserTagHistory, tag))
    if (userTagsNotInHistory.length > 0) {
      setChosenUserTagHistory([...userTagsNotInHistory, ...chosenUserTagHistory])
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (playerRedirect) {
    return <Redirect push to={'/players'} />
  } else if (gameSearchRedirectPath) {
    return <Redirect push to={'/games/search?' + gameSearchRedirectPath} />
  }

  const handlePlayerChipClick = (event: React.MouseEvent) => {
    const playerId = event.currentTarget.getAttribute('data-playerid')
    const player = game.scores.find(scores => scores.player.id === playerId)?.player

    if (isEditing) {
      if (game.illegalScorers.find(player => player.id === playerId)) {
        game.illegalScorers = game.illegalScorers.filter(player => player.id !== playerId)
      } else {
        if (player) {
          game.illegalScorers = game.illegalScorers.concat(player)
        }
      }
      setGame(game)
    } else {
      setPlayerRedirect(true)
    }
  }

  const handleTagChipClick = (tag: Tag) => {
    setGameSearchRedirectPath('tag=' + tag.id)
  }

  const handleTagToggle = (tag: Tag, arrayName: 'conditions' | 'weatherConditions' | 'tags') => {
    if (arrayContainsTag(game[arrayName], tag)) {
      game[arrayName] = game[arrayName].filter(t => t.id !== tag.id)
    } else if (tag) {
      game[arrayName] = game[arrayName].concat(tag)
    }
    setGame(game)
  }

  const tagIsSelected = (tag: Tag): boolean => {
    if (game.weatherConditions.find(t => t.id === tag.id)) {
      return true
    }
    if (game.conditions.find(t => t.id === tag.id)) {
      return true
    }
    if (game.tags.find(t => t.id === tag.id)) {
      return true
    }
    return false
  }

  const handleUserTagChosen = (tag: Tag) => {
    game.tags = game.tags.concat(tag)
    setChosenUserTagHistory([tag, ...chosenUserTagHistory])
    setGame(game)
  }

  const createColorChip = (styleClass: string, label: string, player: Player, color: 'primary' | 'secondary' | 'default', index: number) => {
    const isIllegal = game.illegalScorers.find(p => p.id === player.id)
    const variant = isEditing && isIllegal ? 'default' : 'outlined'
    const classs = isEditing && isIllegal ? classes.illegalChip : styleClass
    const chipColor = isEditing && isIllegal ? 'secondary' : color
    return (
      <Chip
        classes={{ icon: classs } as any}
        icon={<Chip color={chipColor} variant={variant} label={label} />}
        label={player.firstName}
        variant="outlined"
        color={chipColor}
        data-playerid={player.id}
        onClick={handlePlayerChipClick}
        className={classes.chip}
        key={index}
      />
    )
  }

  const tagChips = !isEditing ? (
    <div className={classes.chipRow}>
      {game.temperature ? <Chip className={classes.chip} label={game.temperature + " °C"} /> : null}
      
      {game.weatherConditions.map((condition: Tag, index: number) => (
        <Chip className={classes.chip} label={condition.name} onClick={() => handleTagChipClick(condition)} key={index} />
      ))}
      
      {game.conditions.map((condition: Tag, index: number) => (
        <Chip className={classes.chip} label={condition.name} onClick={() => handleTagChipClick(condition)} key={index} />
      ))}
      
      {game.tags.map((tag: Tag, index: number) => (
        <Chip className={classes.chip} label={tag.name} onClick={() => handleTagChipClick(tag)} key={index} />
      ))}

      {isEditing ? null : game.highScorers.map((player: Player, index: number) => {
        return createColorChip(classes.highScoreChip, 'High score', player, 'primary', index)
      })}

      {game.illegalScorers.map((player: Player, index: number) => {
        return createColorChip(classes.illegalChip, 'Illegal game', player, 'secondary', index)
      })}
    </div>
  ) : null

  const createTagChip = (tag: Tag, onClick: () => void, index: number) => {
    return (
      <Chip
        className={classes.chip}
        label={tag.name}
        variant={tagIsSelected(tag) ? 'default' : 'outlined'}
        onClick={onClick}
        key={index}
      />
    )
  }
  
  const editableTags = isEditing ? (
    <div className={classes.chipRow}>
      {availableWeatherConditions.map((condition: Tag, index: number) => {
        const onClick = () => handleTagToggle(condition, 'weatherConditions')
        return createTagChip(condition, onClick, index)
      })}

      {availableConditions.map((condition: Tag, index: number) => {
        const onClick = () => handleTagToggle(condition, 'conditions')
        return createTagChip(condition, onClick, index)
      })}

      {editableUserTagsToShow.map((tag: Tag, index: number) => {
        const onClick = () => handleTagToggle(tag, 'tags')
        return createTagChip(tag, onClick, index)
      })}

      <AddTagButton
        chosenTags={editableUserTagsToShow}
        onTagChosen={handleUserTagChosen}
        availableConditions={availableConditions}
        availableWeatherConditions={availableWeatherConditions}
        chosenUserTagHistory={chosenUserTagHistory}
      />
    </div>
  ) : null

  const illegalScorerEdit = isEditing ? (
    <div className={classes.chipRow}>
      {game.scores.map((scores: PlayerScores, index: number) => {
        return createColorChip(classes.illegalDisabledChip, 'Illegal game', scores.player, 'default', index)
      })}
    </div>
  ) : null

  return (
    <div>
      {tagChips}
      {editableTags}
      {illegalScorerEdit}
    </div>
  )
}

export function arrayContainsTag(array: Tag[], tag: Tag | undefined): boolean {
  if (tag !== undefined && array.find(t => t.id === tag.id || t.name === tag.name)) {
    return true
  }
  return false
}

export default GameChips
