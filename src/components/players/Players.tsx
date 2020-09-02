import React from 'react'

import { useAuth } from '../../context/AuthContext'

const Players: React.FC<{}> = () => {
  const { user } = useAuth()

  return (
    <div id="playersPage">
      <h2>Players</h2>
      <p>Player {user ? user.firstName : null}</p>
      <p>Cras facilisis urna ornare ex volutpat, et
      convallis erat elementum. Ut aliquam, ipsum vitae
      gravida suscipit, metus dui bibendum est, eget rhoncus nibh
      metus nec massa. Maecenas hendrerit laoreet augue
      nec molestie. Cum sociis natoque penatibus et magnis
      dis parturient montes, nascetur ridiculus mus.</p>

      <p>Duis a turpis sed lacus dapibus elementum sed eu lectus.</p>
    </div>
  )
}

export default Players
