import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import ButtonBase from '@material-ui/core/ButtonBase'
import Paper from '@material-ui/core/Paper'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera'
import DeleteIcon from '@material-ui/icons/Delete'

const thumbnailScale = 0.85

interface Props {
  isEditing: boolean,
  thumbnailMaxHeight: number,
  thumbnailMaxWidth?: number,
  url?: string,
  handlePhotoSelection?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handlePhotoClick?: () => void,
}

const Thumbnail: React.FC<Props> = (props) => {
  const { isEditing, thumbnailMaxHeight, thumbnailMaxWidth, url, handlePhotoSelection, handlePhotoClick } = props

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

  const icon = url ? (
    <DeleteIcon className={classes.buttonIcon} />
  ) : (
    <PhotoCameraIcon className={classes.buttonIcon} />
  )
  
  const paper = (
    <Paper className={classes.addPhotoPaper} elevation={0}>
      {url ? (
        <img className={classes.image} src={url} alt="" />
      ) : null}

      {isEditing ? icon : null}
    </Paper>
  )

  const input = url ? null : (
    <input
      type="file"
      name="img"
      accept="image/*"
      hidden
      onChange={handlePhotoSelection}
    />
  )

  return (
    <ButtonBase
      focusRipple
      component="label"
      onClick={handlePhotoClick}
    >
      {paper}
      {input}
    </ButtonBase>
  )
}

export default Thumbnail
