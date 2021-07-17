import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
// import Button from '@material-ui/core/Button'

import HighScores from './HighScores'
import InviteGuestButton from './InviteGuestButton'
import PlayerStats from './PlayerStats'

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(2),
  },
  playerStats: {
    marginTop: theme.spacing(2),
  }
}))

interface Props {
  player: Player,
  guest?: boolean,
}

// TODO: Average scores modal (pretty identical to High Scores, show only toPar and no total, vertically scrolling, years as columns).

const PlayerCard: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { player, guest } = props

  return player ? (
    <Card data-cy="playerCard" className={classes.card}>

      <CardContent>
        <Typography variant="h5" component="h2">
          {player.firstName}
        </Typography>

        <div className={classes.playerStats}>
          <PlayerStats playerId={player.id} />
        </div>

        {(guest !== undefined && guest) ? <InviteGuestButton player={player} /> : null}
      </CardContent>

      <CardActions>
        <HighScores key={'highscore' + player.id} playerId={player.id} playerName={player.firstName} />

        {/* TODO: */}
        {/* <Button size="small" disabled>Average scores</Button> */}
      </CardActions>

    </Card>
  ) : null
}

export default PlayerCard
