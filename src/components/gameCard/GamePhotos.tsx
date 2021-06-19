import React, { useEffect, useRef, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import { CancelTokenSource } from 'axios'

import { makeStyles } from '@material-ui/core/styles'
import ButtonBase from '@material-ui/core/ButtonBase'
import Paper from '@material-ui/core/Paper'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera'
import DeleteIcon from '@material-ui/icons/Delete'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Modal from '@material-ui/core/Modal/Modal'

import photosService from '../../services/photosService'
import baseService from '../../services/baseService'
import PhotoViewer from './PhotoViewer'

const thumbnailMaxDimension = 70
export const photoMaxDimension = 1000

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'flex-start',
  },
  extraTopPadding: {
    marginTop: theme.spacing(2),
  },
  addPhotoButton: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  addPhotoPaper: {
    backgroundColor: 'lightgrey',
    color: 'grey',
    width: thumbnailMaxDimension,
    height: thumbnailMaxDimension,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonIcon: {
    opacity: 0.85,
    color: 'white',
    display: 'block',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: 'auto',
  },
  modal: {
    alignItems: 'center',
    maxWidth: 1000,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container: {
    outline: 'none',
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

  const [photoViewerOpen, setPhotoViewerOpen] = useState(false)
  const [clickedPhoto, setClickedPhoto] = useState<Photo>()

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => () => cancelTokenSourceRef.current?.cancel(), [])

  const resizeFile = (file: File, thumbnail: boolean) => {
    const maxWidth = thumbnail ? thumbnailMaxDimension : photoMaxDimension
    const maxHeight = thumbnail ? thumbnailMaxDimension : photoMaxDimension

    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        maxWidth,
        maxHeight,
        'JPEG',
        100,
        0,
        (uri) => resolve(uri),
        'base64'
      )
    })
  }

  const handlePhotoSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let photoData: any
    let thumbnailData: any

    try {
      // @ts-ignore: Object is possibly 'null'.
      const file = event.target.files[0]
      photoData = await resizeFile(file, false)
      thumbnailData = await resizeFile(file, true)
    } catch (err) {
      console.log('Photo compression failed:', err)
      return
    }

    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    const photo = await photosService.uploadGamePhoto(game.id, photoData, thumbnailData, cancelTokenSourceRef.current)

    game.photos = [photo, ...game.photos]
    setGame(game)
  }

  const handlePhotoClick = async (photo: Photo) => {
    if (isEditing) {
      if (window.confirm('Delete this photo?')) {
        cancelTokenSourceRef.current = baseService.cancelTokenSource()
        photosService.deletePhoto(photo, cancelTokenSourceRef.current)
          .then(() => {
            game.photos = game.photos.filter(p => p.url !== photo.url)
            setGame(game)
          })
          .catch(error => {
            window.alert('Photo deletion failed.')
            console.log('Photo deletion failed:', error)
          })
      }
    } else {
      setClickedPhoto(photo)
      setPhotoViewerOpen(true)
    }
  }

  const handlePhotoViewerClose = () => {
    setPhotoViewerOpen(false)
    setClickedPhoto(undefined)
  }

  const photos = game.photos.map((photo, index) => (
    <ButtonBase
      key={photo.url + index}
      className={classes.addPhotoButton}
      focusRipple
      onClick={() => handlePhotoClick(photo)}
    >
      <Paper className={classes.addPhotoPaper} elevation={0}>
        <img className={classes.image} src={photo.thumbnailUrl} alt="" />

        {isEditing ? (
          <DeleteIcon className={classes.buttonIcon} />
        ) : null}
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

  const thumbnails = game.photos.length > 0 || isEditing ? (
    <div className={[classes.root, isEditing ? classes.extraTopPadding : null].join(' ')}>
      {photos}
      {addPhotoButton}
    </div>
  ) : null

  return (
    <div>
      {thumbnails}

      <Modal
        className={classes.modal}
        open={photoViewerOpen}
        onClose={handlePhotoViewerClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={photoViewerOpen}>
          <div className={classes.container}>
            <PhotoViewer
              photos={game.photos}
              selected={clickedPhoto}
              handleClose={handlePhotoViewerClose}
              />
          </div>
        </Fade>
      </Modal>

    </div>
  )
}

export default GamePhotos
