import React, { useEffect, useRef, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { CancelTokenSource } from 'axios'
import baseService from '../../services/baseService'
import photosService from '../../services/photosService'
import { resizeFile, toBase64 } from '../../utils/PhotoUtils'
import Thumbnail from '../photo/Thumbnail'
import PhotoCropper from '../photo/PhotoCropper'
import CancellableModal from '../CancellableModal'

export const courseThumbnailMaxHeight = 121 // 425 * 0,28571429 (aspect ratio)
export const courseThumbnailMaxWidth = 425
export const coverPhotoMaxHeight = 200
export const coverPhotoMaxWidth = 702 // 200 * 0,28571429 (aspect ratio)

const useStyles = makeStyles((theme) => ({
  photoLabel: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: 'grey',
  },
}))

interface Props {
  course?: DetailedCourse,
  photo?: Photo,
  setPhoto: (newPhoto?: Photo) => void,
}

const CoursePhotoButton: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { course, photo, setPhoto } = props

  const [photoString, setPhotoString] = useState<string>()
  const [photoFile, setPhotoFile] = useState<File>()
  const [photoCropperOpen, setPhotoCropperOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => () => cancelTokenSourceRef.current?.cancel(), [])

  const handlePhotoSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // @ts-ignore: Object is possibly 'null'.
      const file = event.target.files[0]
      const fileString = await toBase64(file)
      setPhotoFile(file)
      setPhotoString(fileString as string)
      setPhotoCropperOpen(true)

    } catch (err) {
      window.alert('Photo compression or cropping failed:' + err)
      return
    }
  }

  const handleCropFinished = async (croppedPhotoString: Blob) => {
    if (!photoFile) return
    setPhotoCropperOpen(false)

    try {
      const photoData = await resizeFile(croppedPhotoString, coverPhotoMaxHeight, coverPhotoMaxWidth, false)
      const thumbnailData = await resizeFile(croppedPhotoString, courseThumbnailMaxHeight, courseThumbnailMaxWidth, true)
  
      setIsSending(true)
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      const photo = await photosService.uploadCoursePhoto(course?.id ?? '', photoData, thumbnailData, cancelTokenSourceRef.current)
      setIsSending(false)
      setPhoto(photo)
    } catch(e) {
      window.alert('Resize failed: ' + e)
    }
  }

  const handlePhotoClick = async () => {
    if (!photo) return
    if (window.confirm('Delete this photo?')) {
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      photosService.deletePhoto(photo, cancelTokenSourceRef.current)
        .then(() => {
          setPhoto(undefined)
        })
        .catch(error => {
          window.alert('Photo deletion failed.')
          console.log('Photo deletion failed:', error)
        })
    }
  }

  const photoButton = (
    <div>
      <Typography className={classes.photoLabel} variant="caption" component="p">
        Cover photo
      </Typography>

      <Thumbnail
        isEditing={true}
        isLoading={isSending}
        photo={photo}
        thumbnailMaxHeight={courseThumbnailMaxHeight}
        thumbnailMaxWidth={courseThumbnailMaxWidth}
        handlePhotoSelection={handlePhotoSelection}
        handlePhotoClick={handlePhotoClick}
      />

      <Typography className={classes.photoLabel} variant="caption" component="p"> 
        NOTE: If the photo turns black, try selecting a smaller photo size.
      </Typography>

      <CancellableModal modalOpen={photoCropperOpen} onClose={() => setPhotoCropperOpen(false)}>
        {photoString ? (
          <PhotoCropper imageString={photoString} handleCropFinished={handleCropFinished} />
        ) : null}
      </CancellableModal>

      <br />
    </div>
  )

  return photoButton
}

export default CoursePhotoButton
