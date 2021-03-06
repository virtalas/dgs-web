import React, { useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import Chip from '@material-ui/core/Chip'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import ListSubheader from '@material-ui/core/ListSubheader'
import { OutlinedInput } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: 5,
    minWidth: 120,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}))

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: '80%',
      width: 250,
    },
  },
}

interface Props {
  players: Player[],
  setPlayers: (players: Player[]) => void,
  allPlayers: Player[],
  setGameCreatable: (creatable: boolean) => void,
}

const PlayerSelect: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { players, setPlayers, allPlayers, setGameCreatable } = props

  const guests = allPlayers.filter(player => player.guest)

  const handlePlayersChange = (event: React.ChangeEvent<{ value: unknown }>, value: any) => {
    const selectedPlayerId = value.props.value as string
    const selectedPlayer = allPlayers.find(player => player.id === selectedPlayerId) as Player

    if (!selectedPlayerId) {
      // selectedPlayerId was 'undefined'. This happens if 'Guests' label in the popup list was clicked.
      return
    }

    let updatedPlayers
    if (arrayContains(players, selectedPlayer)) {
      // Remove if clicked again
      updatedPlayers = players.filter(player => player.id !== selectedPlayerId)
    } else {
      // Add
      updatedPlayers = [...players, selectedPlayer]
    }
    setPlayers(updatedPlayers)
    setGameCreatable(updatedPlayers.length >= 1)
  }

  const playerList = allPlayers.filter((player: Player) => !player.guest).map((player: Player) => (
    <MenuItem key={player.id} value={player.id}>
      <Checkbox checked={arrayContains(players, player)} color="primary" />
      <ListItemText primary={player.firstName} />
    </MenuItem>
  ))

  const guestList = guests.map((guest: Player) => (
    <MenuItem key={guest.id} value={guest.id}>
      <Checkbox checked={arrayContains(players, guest)} color="primary" />
      <ListItemText primary={guest.firstName} />
    </MenuItem>
  ))

  // Used for outlined Select's input label.
  const inputLabel = React.useRef<HTMLLabelElement>(null)
  const [labelWidth, setLabelWidth] = React.useState(0)
  useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth)
  }, [])

  const loading = players.length === 0 && allPlayers.length >= 0
  const error = !loading && players.length === 0

  // TODO: Bigger max list height so no need for scrolling.
  return (
    <FormControl variant="outlined" className={classes.formControl} error={error}>
      <InputLabel ref={inputLabel} htmlFor="players-select">Players</InputLabel>
      <Select
        multiple
        value={players}
        onChange={handlePlayersChange}
        input={<OutlinedInput labelWidth={labelWidth} name="players" id="players-select" />}
        renderValue={selected => (
          <div className={classes.chips}>
            {(selected as Player[]).map((player: Player) => (
              <Chip key={player.id} label={player.firstName} className={classes.chip} />
            ))}
          </div>
        )}
        MenuProps={MenuProps}
      >
        {playerList}
        {guests.length !== 0 ? (
          <ListSubheader>Guests</ListSubheader>
        ) : null}
        {guestList}
      </Select>
      <FormHelperText>{error ? 'Choose at least one player' : ''}</FormHelperText>
    </FormControl>
  )
}

function arrayContains(array: Player[], player: Player): boolean {
  return array.some(p => p.id === player.id)
}

export default PlayerSelect
