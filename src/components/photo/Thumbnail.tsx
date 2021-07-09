import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import ButtonBase from '@material-ui/core/ButtonBase'
import Paper from '@material-ui/core/Paper'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera'
import DeleteIcon from '@material-ui/icons/Delete'
import LoadingView from '../LoadingView'

const thumbnailScale = 0.70

interface Props {
  isEditing: boolean,
  thumbnailMaxHeight: number,
  thumbnailMaxWidth?: number,
  photo?: Photo,
  isLoading?: boolean,
  handlePhotoSelection?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handlePhotoClick?: () => void,
}

const Thumbnail: React.FC<Props> = (props) => {
  const { isEditing, thumbnailMaxHeight, thumbnailMaxWidth, photo, isLoading, handlePhotoSelection, handlePhotoClick } = props

  const useStyles = makeStyles((theme) => ({
    addPhotoPaper: {
      backgroundColor: 'lightgrey',
      color: 'grey',
      width: (thumbnailMaxWidth ? thumbnailMaxWidth : thumbnailMaxHeight) * thumbnailScale,
      height: thumbnailMaxHeight * thumbnailScale,
      position: 'relative',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
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
  }))
  
  const classes = useStyles()

  let icon = photo ? (
    <DeleteIcon className={classes.buttonIcon} />
  ) : (
    <PhotoCameraIcon className={classes.buttonIcon} />
  )

  if (isLoading) {
    icon = (
      <LoadingView />
    )
  }
  
  const paper = (
    <Paper className={classes.addPhotoPaper} elevation={0}>
      {photo?.thumbnailUrl ? (
        <img className={classes.image} src={photo?.thumbnailUrl} alt="" />
      ) : null}

      {isEditing ? icon : null}
    </Paper>
  )

  const input = isEditing && !photo ? (
    <input
      type="file"
      name="img"
      accept="image/*"
      hidden
      onChange={handlePhotoSelection}
    />
  ) : null

  return (
    <ButtonBase
      focusRipple
      component="label"
      onClick={handlePhotoClick}
      disabled={isLoading}
    >
      {paper}
      {input}
    </ButtonBase>
  )
}

export default Thumbnail
