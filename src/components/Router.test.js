import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import { Route, NavLink, HashRouter } from 'react-router-dom'
import Fab from '@material-ui/core/Fab'
import { unwrap } from "@material-ui/core/test-utils"
import { createShallow, createMount } from '@material-ui/core/test-utils'
import { MemoryRouter } from 'react-router'

import Drawer from './Drawer'
import Router from './Router'
import { ResponsiveDrawer } from './Drawer'
import Games from './games/Games'
import Players from './players/Players'
import ScoreInputPage from './games/ScoreInputPage'

describe.only('<Router />', () => {

  let mount;

  // before(() => {
  //   mount = createMount();
  // });

  // after(() => {
  //   mount.cleanUp();
  // });

  it('renders content', () => {
    const router = createShallow()(<Router />)
    expect(router.find(Route).at(1).props().component).to.equal(Drawer)
  })

  // it('renders new game page', () => {
  //   mount = createMount()
  //   const component = mount(
  //     <MemoryRouter initialEntries={['/games/new']} >
  //       <Router />
  //     </MemoryRouter>
  //   )
  //   console.log(component.find(Route).debug())
  //   expect(component.find(ScoreInputPage)).to.have.lengthOf(1)
  //   mount.cleanUp()
  // })
})
