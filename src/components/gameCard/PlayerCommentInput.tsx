import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'

import ActionButton from './ActionButton'

const useStyles = makeStyles(() => ({
  newPlayerCommentEdit: {
    width: '100%',
    paddingRight: 80,
  },
  buttonsContainer: {
    backgroundColor: 'red',
    background: 'red',
  },
}))

interface Props {
  game: Game,
  userId: string | undefined,
  sendGame: (game?: Game) => void,
}

const PlayerCommentInput: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { game, userId, sendGame } = props

  const [commentContent, setCommentContent] = useState<string>('')

  let loading = false

  const handleNewPlayerCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentContent(event.target.value)
  }

  const handleSendComment = () => {
    loading = true
    let commentAlreadyExists = false

    const updatedComments = game.comments.map(comment => {
      if (comment.userId === userId) {
        commentAlreadyExists = true
        comment.content = commentContent
      }
      return comment
    })

    if (!commentAlreadyExists) {
      updatedComments.push({
        id: '',
        userId: userId ?? '',
        content: commentContent,
        createdDate: new Date(),
      })
    }

    game.comments = updatedComments
    sendGame(game)
  }

  const cancelButton = loading ? null : (
    <ActionButton
      variant="cancel"
      position="bottom"
      secondary={true}
      onClick={() => setCommentContent('')}
    />
  )

  const newPlayerCommentButtons = commentContent.length > 0 ? (
    <div>
      {cancelButton}

      <ActionButton
        variant="ok"
        position="bottom"
        loading={loading}
        fillBackground={true}
        onClick={handleSendComment}
      />
    </div>
  ) : null

  return (
    <div>
      <InputBase
        value={commentContent}
        className={classes.newPlayerCommentEdit}
        multiline={true}
        rowsMax={100}  
        placeholder="Add your comment"
        inputProps={{ 'aria-label': 'naked' }}
        onChange={handleNewPlayerCommentChange}
      />

      {newPlayerCommentButtons}
    </div>
  )

}

export default PlayerCommentInput
