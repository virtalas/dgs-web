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
      <div>Coming soon</div>
    </SwipeableViews>
  )
}

export default HoleInfoView
