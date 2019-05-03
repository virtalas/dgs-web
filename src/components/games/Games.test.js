import React from 'react'
import { expect } from 'chai'

import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'
import { createShallow } from '@material-ui/core/test-utils'

import Games from './Games'
import GameCard from './GameCard'

describe.only('<Games />', () => {
  it('renders content', () => {
    // TODO once mocking API calls possible:
    // expect(gamesPage.find(GameCard)).to.have.lengthOf(2)
  })
})
