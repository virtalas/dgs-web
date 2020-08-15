import React from 'react'
import { makeStyles } from '@material-ui/styles'

import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Chip from '@material-ui/core/Chip'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import ListSubheader from '@material-ui/core/ListSubheader'

const useStyles = makeStyles((theme) => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}))

const itemHeight = 48
const itemPaddingTop = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: itemHeight * 4.5 + itemPaddingTop,
      width: 250,
    },
  },
}

interface Props {
  formControlStyle: string,
  players: Player[],
  setPlayers: any,
  allPlayers: Player[],
  setGameCreatable: any,
}

const PlayerSelect: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { formControlStyle, players, setPlayers, allPlayers, setGameCreatable } = props

  const guests = allPlayers.filter(player => player.guest)

  const handlePlayersChange = (event: React.ChangeEvent<{ value: unknown }>, value: any) => {
    const selectedPlayerId = value.props.value as string
    const selectedPlayer = allPlayers.find(player => player.id === selectedPlayerId) as Player

    let updatedPlayers
    if (players.includes(selectedPlayer)) { // Remove if clicked again
      updatedPlayers = players.filter(player => player.id !== selectedPlayerId)
    } else { // Add
      updatedPlayers = [...players, selectedPlayer]
    }
    setPlayers(updatedPlayers)
    setGameCreatable(updatedPlayers.length >= 1)
  }

  const playerList = allPlayers.filter(player => !player.guest).map((player) => (
    <MenuItem key={player.id} value={player.id}>
      <Checkbox checked={players.indexOf(player) > -1} color="primary" />
      <ListItemText primary={player.firstName} />
    </MenuItem>
  ))

  const guestList = guests.map((guest) => (
    <MenuItem key={guest.id} value={guest.id}>
      <Checkbox checked={players.indexOf(guest) > -1} color="primary" />
      <ListItemText primary={guest.firstName} />
    </MenuItem>
  ))

  // TODO: Bigger list height so no need for scrolling.
  return (
    <FormControl className={formControlStyle} error={players.length === 0}>
      <InputLabel id="demo-mutiple-chip-label">Players</InputLabel>
      <Select
        multiple
        value={players}
        onChange={handlePlayersChange}
        input={<Input id="select-multiple-chip" />}
        renderValue={selected => (
          <div className={classes.chips}>
            {(selected as Player[]).map((player) => (
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
      <FormHelperText>{players.length === 0 ? 'Choose at least one player' : ''}</FormHelperText>
    </FormControl>
  )
}

export default PlayerSelect
