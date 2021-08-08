import React, { useEffect, useRef, useState } from 'react'
import { CancelTokenSource } from 'axios'

import IconButton from '@material-ui/core/IconButton'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import Badge from '@material-ui/core/Badge'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'

import baseService from '../services/baseService'
import playersService from '../services/playersService'
import { friendRequestExplanation } from '../constants/Strings'
import { sneakyGrey } from '../constants/Colors'

const useStyles = makeStyles((theme) => ({
  content: {
    margin: theme.spacing(1),
  },
  friendRequestExplanationText: {
    color: sneakyGrey,
  },
}))

const NotificationsButton: React.FC = () => {
  const classes = useStyles()

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const open = Boolean(anchorEl)
  const count = friendRequests ? friendRequests.length : 0

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    playersService.getFriendRequests(cancelTokenSourceRef.current).then(friendRequests => setFriendRequests(friendRequests))

    return () => cancelTokenSourceRef.current?.cancel()
  }, [])

  const handleAccept = (friendId: string) => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    playersService.acceptFriendRequest(friendId, cancelTokenSourceRef.current).then(() => 
      setFriendRequests(prev => prev?.filter(fr => fr.friend_id !== friendId)))
  }

  const handleDecline = (friendId: string) => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    playersService.declineFriendRequest(friendId, cancelTokenSourceRef.current).then(() => 
      setFriendRequests(prev => prev?.filter(fr => fr.friend_id !== friendId)))
  }

  const defaultContent = (
    <div className={classes.content}>
      <Typography>No notifications.</Typography>
    </div>
  )

  const friendRequestList = (
    <div className={classes.content}>
      <Typography>New friend request!</Typography>
      <Typography className={classes.friendRequestExplanationText}>{friendRequestExplanation}</Typography>

      <List>
        {friendRequests?.map((friendRequest) => {
          return (
            <ListItem key={friendRequest.friend_id} role={undefined} dense>
              <ListItemText primary={friendRequest.friend_name + ' ' + friendRequest.friend_last_name} />
              <ListItemSecondaryAction>
                <Button color="secondary" onClick={() => handleDecline(friendRequest.friend_id)}>Decline</Button>
                <Button color="primary" onClick={() => handleAccept(friendRequest.friend_id)}>Accept</Button>
              </ListItemSecondaryAction>
            </ListItem>
          );  
        })}
      </List>
    </div>
  )

  return (
    <div>
      <Badge color="secondary" overlap="circular" badgeContent={count}>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="Open notifications"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)}
        >
          <NotificationsIcon />
        </IconButton>
      </Badge>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {count > 0 ? friendRequestList : defaultContent}
      </Popover>
    </div>
  )
}

export default NotificationsButton
