import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { dirtyBlue } from '../../constants/Colors'

// Modified from:
// https://github.com/oliviertassinari/react-swipeable-views/blob/master/docs/src/modules/components/PaginationDot.js

const useStyles = makeStyles(() => ({
  root: {
    height: 18,
    width: 18,
    cursor: 'pointer',
    border: 0,
    background: 'none',
    padding: 0,
  },
  dot: {
    backgroundColor: '#e4e6e7',
    height: 12,
    width: 12,
    borderRadius: 6,
    margin: 3,
  },
  active: {
    backgroundColor: dirtyBlue,
  },
}))

interface Props {
  active: boolean,
  index: number,
  onClick: Function,
}

const PaginationDot: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { active, index, onClick } = props

  const handleClick = (event: any) => {
    onClick(event, index)
  }

  let styleDot

  if (active) {
    styleDot = [classes.dot, classes.active].join(' ')
  } else {
    styleDot = classes.dot
  }

  return (
    <button type="button" className={classes.root} onClick={handleClick}>
      <div className={styleDot} />
    </button>
  )
}

export default PaginationDot
