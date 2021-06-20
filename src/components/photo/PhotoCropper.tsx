import React, { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Point } from "react-easy-crop/types"

import Slider from "@material-ui/core/Slider"
import { makeStyles, Typography } from "@material-ui/core"
import Button from "@material-ui/core/Button"

import { getCroppedImg } from "./PhotoCropperUtil"
import { courseThumbnailMaxWidth, courseThumbnailMaxHeight } from "../courses/CoursePhotoButton"

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    height: '90vh',
  },
  cropperContainer: {
    position: 'relative',
    height: '40vh',
  },
  cropTitle: {
    marginBottom: theme.spacing(1),
  },
}))

interface Props {
  imageString: string,
  handleCropFinished: (imageString: Blob) => void,
}

const PhotoCropper: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { imageString, handleCropFinished } = props

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState('')

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFinishCropping = useCallback(async () => {
    try {
      const croppedImageString = await getCroppedImg(
        imageString,
        croppedAreaPixels,
        0
      )
      handleCropFinished(croppedImageString)
    } catch (e) {
      window.alert('Cropping failed: ' + e)
    }
  }, [croppedAreaPixels, handleCropFinished, imageString])

  return (
    <div className={classes.root}>
      <Typography className={classes.cropTitle}>Adjust the thumbnail photo for the course:</Typography>

      <div className={classes.cropperContainer}>
        <Cropper
          image={imageString}
          crop={crop}
          zoom={zoom}
          aspect={courseThumbnailMaxWidth / courseThumbnailMaxHeight}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>

      <div className="controls">
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e, zoom) => setZoom(Number(zoom))}
          classes={{ root: "slider" }}
        />

        <Button
          variant="outlined"
          onClick={handleFinishCropping}
        >
          Crop
        </Button>
      </div>
    </div>
  )
}

export default PhotoCropper
