import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import ButtonBase from '@material-ui/core/ButtonBase'
import Paper from '@material-ui/core/Paper'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'flex-start',
  },
  addPhotoButton: {
    marginLeft: 8,
    marginBottom: 8,
  },
  addPhotoPaper: {
    backgroundColor: 'lightgrey',
    color: 'grey',
    width: 50,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    opacity: 0.85,
    color: 'white',
  },
}))

interface Props {
  game: Game,
  setGame: (game: Game) => void,
  isEditing: boolean,
}

const GamePhotos: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { game, setGame, isEditing } = props

  const handlePhotoSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO
    game.photoURLs = ['newurl.org/pic.png' + new Date().getMilliseconds(), ...game.photoURLs]
    setGame(game)
  }

  const handlePhotoClick = (photoURL: string) => {
    if (isEditing) {
      if (window.confirm('Delete this photo?')) {
        game.photoURLs = game.photoURLs.filter(url => url !== photoURL)
        setGame(game)
      }
    } else {
      // TODO display view, with left/right to browse
    }
  }

  const photos = game.photoURLs.map((photoURL, index) => (
    <ButtonBase
      key={photoURL + index}
      className={classes.addPhotoButton}
      focusRipple
      onClick={() => handlePhotoClick(photoURL)}
    >
      <Paper className={classes.addPhotoPaper} elevation={0}>
        <DeleteIcon className={classes.buttonIcon} />
      </Paper>
    </ButtonBase>
  ))

  const addPhotoButton = isEditing ? (
    <ButtonBase
      className={classes.addPhotoButton}
      focusRipple
      component="label"
    >
      <Paper className={classes.addPhotoPaper} elevation={0}>
        <PhotoCameraIcon className={classes.buttonIcon} />
      </Paper>

      <input
        type="file"
        name="img"
        accept="image/*"
        hidden
        onChange={handlePhotoSelection}
      />
    </ButtonBase>
  ) : null

  return game.photoURLs.length > 0 || isEditing ? (
    <div className={classes.root}>
      {photos}
      {addPhotoButton}
    </div>
  ) : null
}

export default GamePhotos
