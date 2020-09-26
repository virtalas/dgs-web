import { Typography } from '@material-ui/core'
import React from 'react'

import SwipeableViews from 'react-swipeable-views'

interface Props {
  holeNum: number,
  setHoleNum: (holeNum: number) => void,
  swipeableViewStyle: any,
}

const HoleInfoView: React.FC<Props> = (props) => {
  const { holeNum, setHoleNum, swipeableViewStyle } = props

  return (
    <SwipeableViews
      className={swipeableViewStyle}
      resistance
      index={holeNum - 1}
      onChangeIndex={(index: number) => setHoleNum(index + 1)}
    >
      <div>
        <br /><br /><br />
        <Typography variant="h6" gutterBottom>
          Hole {holeNum} statistics
        </Typography>
        <Typography variant="body1" gutterBottom>
          pars/birdies/bogies/etc graph
        </Typography>
        <Typography variant="h6" gutterBottom>
          Course statistics
        </Typography>
        <Typography variant="body1" gutterBottom>
          ?
        </Typography>
        <Typography variant="h6" gutterBottom>
          High scores in [CourseName]
        </Typography>
        <Typography variant="body1" gutterBottom>
          Teppo: -3<br />
          Seppo: -1
        </Typography>
      </div>
    </SwipeableViews>
  )
}

export default HoleInfoView
