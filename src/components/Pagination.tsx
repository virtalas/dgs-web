import React from 'react'
import { makeStyles } from '@material-ui/styles'
import PaginationDot from './PaginationDot'

// Modified from:
// https://github.com/oliviertassinari/react-swipeable-views/blob/master/docs/src/modules/components/Pagination.js

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    bottom: 65, // TODO: fix hard coding
    // right: 8,
    display: 'flex',
    flexDirection: 'row',
  },
}))

interface Props {
  dots: number,
  index: number,
  onChangeIndex: Function,
}

const Pagination: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { dots, index, onChangeIndex } = props

  const handleClick = (event: any, index: number) => {
    onChangeIndex(index)
  }

  const children = []

  for (let i = 0; i < dots; i += 1) {
    children.push(
      <PaginationDot key={i} index={i} active={i === index} onClick={handleClick} />
    )
  }

  return <div className={classes.root}>{children}</div>
}

export default Pagination
