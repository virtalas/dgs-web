import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import { Route, NavLink, HashRouter, Router } from 'react-router-dom'

import Drawer from './Drawer'
import Games from './games/Games'
import Players from './players/Players'

describe.only('<Drawer />', () => {

  it('renders content', () => {
    const drawer = shallow(
      <HashRouter>
        <Drawer />
      </HashRouter>
    )
console.log(drawer.dive().dive().find(Route).at(0).html())
    expect(drawer.dive().dive().find(Route).at(0).props().component).to.equal(Games)
    expect(drawer.dive().find(Route).at(0).props().path).to.equal('/')

    expect(drawer.dive().find(Route).at(1).props().component).to.equal(Games)
    expect(drawer.dive().find(Route).at(1).props().path).to.equal('/games')

    expect(drawer.dive().find(Route).at(2).props().component).to.equal(Players)
    expect(drawer.dive().find(Route).at(2).props().path).to.equal('/players')
  })

  it('renders correct component when navigating', () => {
    // TODO: press navLink
  })
})
