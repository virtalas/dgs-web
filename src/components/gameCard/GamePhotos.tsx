import React, { useEffect, useRef, useState } from 'react'
import { CancelTokenSource } from 'axios'

import { makeStyles } from '@material-ui/core/styles'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Modal from '@material-ui/core/Modal/Modal'

import photosService from '../../services/photosService'
import baseService from '../../services/baseService'
import PhotoViewer from './PhotoViewer'
import { resizeFile } from '../../utils/PhotoUtils'
import Thumbnail from '../photo/Thumbnail'

export const thumbnailMaxDimension = 90
const photoMaxDimension = 1200

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
  game?: Game,
  photos: Photo[],
  setPhotos: (photos: Photo[]) => void,
  isEditing: boolean,
}

const GamePhotos: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { game, photos, setPhotos, isEditing } = props

  const [photoViewerOpen, setPhotoViewerOpen] = useState(false)
  const [clickedPhoto, setClickedPhoto] = useState<Photo>()
  const [photoUrlsFetched, setPhotoUrlsFetched] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  const fetchPhotoUrls = () => {
    if (photos.length === 0) return
    cancelTokenSourceRef.current = baseService.cancelTokenSource()

    photosService.getPhotoUrls(photos.map(photo => photo.key), cancelTokenSourceRef.current)
      .then(urls => {
        if (!urls) return

        const modifiedPhotos = [...photos]
        for (let i = 0; i < modifiedPhotos.length; i++) {
          modifiedPhotos[i].url = urls[i]
        }

        setPhotos(modifiedPhotos)
        setPhotoUrlsFetched(true)
      })
  }

  useEffect(() => {
    const fetchThumbnailUrls = async () => {
      if (photos.length === 0) return
      if (photos[0].thumbnailUrl) return

      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      const urls = await photosService.getPhotoUrls(photos.map(photo => photo.thumbnailKey), cancelTokenSourceRef.current)
      
      if (!urls) return

      const modifiedPhotos = [...photos]
      for (let i = 0; i < modifiedPhotos.length; i++) {
        modifiedPhotos[i].thumbnailUrl = urls[i]
      }

      setPhotos(modifiedPhotos)
    }

    fetchThumbnailUrls()
    return () => cancelTokenSourceRef.current?.cancel()
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  const handlePhotoSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!game) return
    let photoData: any
    let thumbnailData: any

    try {
      // @ts-ignore: Object is possibly 'null'.
      const file = event.target.files[0]
      photoData = await resizeFile(file, photoMaxDimension, photoMaxDimension, false)
      thumbnailData = await resizeFile(file, thumbnailMaxDimension, thumbnailMaxDimension, true)
    } catch (err) {
      window.alert('Photo compression or cropping failed:' + err)
      return
    }

    setIsUploading(true)
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    const photo = await photosService.uploadGamePhoto(game.id, photoData, thumbnailData, cancelTokenSourceRef.current)
    setIsUploading(false)

    setPhotos([...photos, photo])
  }

  const handlePhotoClick = async (photo: Photo) => {
    if (isEditing) {
      if (window.confirm('Delete this photo?')) {
        cancelTokenSourceRef.current = baseService.cancelTokenSource()
        photosService.deletePhoto(photo, cancelTokenSourceRef.current)
          .then(() => {
            if (!game) return
            const modifiedPhotos = game.photos.filter(p => p.id !== photo.id)
            setPhotos(modifiedPhotos)
          })
          .catch(error => {
            window.alert('Photo deletion failed: ' + error)
          })
      }
    } else {
      if (!photoUrlsFetched) {
        fetchPhotoUrls()
      }
      setClickedPhoto(photo)
      setPhotoViewerOpen(true)
    }
  }

  const handlePhotoViewerClose = () => {
    setPhotoViewerOpen(false)
    setClickedPhoto(undefined)
  }

  const photoThumbnails = photos.map((photo, index) => (
    <div className={classes.addPhotoButton} key={index}>
      <Thumbnail
        isEditing={isEditing}
        thumbnailMaxHeight={thumbnailMaxDimension}
        photo={photo}
        handlePhotoClick={() => handlePhotoClick(photo)}
      />
    </div>
  ))

  const addPhotoButton = isEditing ? (
    <div className={classes.addPhotoButton}>
      <Thumbnail
        isEditing={isEditing}
        isLoading={isUploading}
        thumbnailMaxHeight={thumbnailMaxDimension}
        handlePhotoSelection={handlePhotoSelection}
      />
    </div>
  ) : null

  const thumbnails = photos.length > 0 || isEditing ? (
    <div className={[classes.root, isEditing ? classes.extraTopPadding : null].join(' ')}>
      {photoThumbnails}
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
              photos={photos}
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
