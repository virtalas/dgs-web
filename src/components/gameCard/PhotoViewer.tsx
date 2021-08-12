import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
// @ts-ignore
import { MapInteractionCSS } from 'react-map-interaction'
import Slider from 'react-slick'

import { makeStyles } from '@material-ui/core/styles'

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useWindowDimensions } from '../../utils/Utils'
import Button from '@material-ui/core/Button'

const sliderTopMargin = 60

const useStyles = makeStyles((theme) => ({
  slider: {
    marginTop: sliderTopMargin,
  },
  img: {
    maxWidth: '100vw',
    maxHeight: '80vh',
  },
  mapInteractionContainer: {
    textAlign: 'center',
    height: '80vh',
  },
  gameEndDateButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    bottom: theme.spacing(8),
    background: 'rgba(189, 189, 189, .6)',
  },
}))

interface Props {
  photos: Photo[],
  selected?: Photo,
  handleClose: () => void,
}

interface MapInteractionValue {
  scale: number,
  translation: { x: number, y: number }
}

const PhotoViewer: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { photos, selected, handleClose } = props

  const { windowHeight } = useWindowDimensions()
  const [redirectGameId, setRedirectGameId] = useState<string>()
  const [imageDimensions, setImageDimensions] = useState<any>({})
  const [currentSlidePhoto, setCurrentSlidePhoto] = useState<Photo>()
  const [value, setValue] = useState<MapInteractionValue>({
    scale: 1,
    translation: { x: 0, y: 0 }
  })

  const initialSelectedIndex = photos.findIndex(photo => photo.id === selected?.id)
  const lazyLoad: 'progressive' = 'progressive'
  const touchMove = value.scale === 1

  useEffect(() => {
    setCurrentSlidePhoto(photos[initialSelectedIndex])
  }, [initialSelectedIndex, photos])

  if (redirectGameId) {
    return <Redirect push to={'/games/view/' + redirectGameId} />
  }

  const syncCurrentPhoto = (direction: 'left' | 'right') => {
    let photoIndex = photos.findIndex(photo => photo.id === currentSlidePhoto?.id ?? '')
    if (direction === 'right' && photoIndex > 0) {
      photoIndex--
    } else if (direction === 'left' && photoIndex < photos.length - 1) {
      photoIndex++
    }
    setCurrentSlidePhoto(photos[photoIndex])
  }

  const sliderSettings = {
    className: classes.slider,
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: initialSelectedIndex,
    accessibility: true,
    lazyLoad: lazyLoad,
    adaptiveHeight: true,
    touchMove: touchMove,
    onSwipe: syncCurrentPhoto,
  }

  const calculateScaledPhotoHeight = (): number => {
    if (currentSlidePhoto && imageDimensions[currentSlidePhoto.id]) {
      return imageDimensions[currentSlidePhoto.id].height * value.scale
    } else {
      console.log('calculateScaledPhotoHeight: failed to calculate scaled photo height')
      return 0
    }
  }

  const calculateScaledPhotoWidth = (): number => {
    if (currentSlidePhoto && imageDimensions[currentSlidePhoto.id]) {
      return imageDimensions[currentSlidePhoto.id].width * value.scale
    } else {
      console.log('calculateScaledPhotoWidth: failed to calculate scaled photo width')
      return 0
    }
  }

  const handleMapTouchEvent = (newValue: any) => {
    const scaledPhotoHeight = calculateScaledPhotoHeight()
    const scaledPhotoWidth = calculateScaledPhotoWidth()

    let photoWidth = 0
    if (currentSlidePhoto && imageDimensions[currentSlidePhoto.id]) {
      photoWidth = imageDimensions[currentSlidePhoto.id].width
    }

    const newX = Math.max(-(Math.abs(photoWidth - scaledPhotoWidth)), Math.min(newValue.translation.x, 0))
    const newY = Math.max(-(Math.abs(scaledPhotoHeight - windowHeight * 0.8)), Math.min(newValue.translation.y, 0))

    if (value.scale !== 1) {
      setValue({
        scale: newValue.scale,
        translation: {
          x: newX,
          y: newY,
        }
      })
    } else {
      setValue({
        scale: newValue.scale,
        translation: {
          x: 0,
          y: 0,
        },
      })
    }
  }

  const handleCloseClick = (e: any) => {
    const scaledPhotoHeight = calculateScaledPhotoHeight()
    const posY = e.clientY ? e.clientY : e.targetTouches[0].clientY
    if (posY > sliderTopMargin + scaledPhotoHeight) {
      handleClose()
    }
  }

  const dateOptions = {
    year: 'numeric',
    month: '2-digit',
    day: 'numeric',
  }

  return (
    <Slider {...sliderSettings}>
      {photos.map(photo => (
        <div
          key={photo.id}
          className={classes.mapInteractionContainer}
          onClick={handleCloseClick}
          onTouchStart={handleCloseClick}
        >
          <MapInteractionCSS
            key={photo.id}
            minScale={1}
            value={value}
            onChange={(e: any) => handleMapTouchEvent(e)}
          >
            <img
              className={classes.img}
              key={photo.id}
              src={photo.url}
              alt=""
              onLoad={(e: any) => {
                imageDimensions[photo.id] = {
                  height: e.target.offsetHeight,
                  width: e.target.offsetWidth,
                }
                setImageDimensions(imageDimensions)
              }}
            />
          </MapInteractionCSS>

          {photo.gameEndDate && (
            <Button
             className={classes.gameEndDateButton}
             variant="contained"
             onClick={() => setRedirectGameId(photo.gameId)}
            >
              {photo.gameEndDate.toLocaleString('fi-FI', dateOptions)}
            </Button>
          )}
        </div>
      ))}
    </Slider>
  )
}

export default PhotoViewer
