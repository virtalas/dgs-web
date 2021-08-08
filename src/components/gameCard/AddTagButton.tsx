import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Chip from '@material-ui/core/Chip'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader'

import { chipHeight } from './GameInfo'
import gamesService from '../../services/gamesService'
import baseService from '../../services/baseService'
import { arrayContainsTag } from './GameChips'
import DisableableButton from '../DisableableButton'

const useStyles = makeStyles((theme) => ({
  chip: {
    height: chipHeight,
    marginRight: 5,
  },
  addTagButtonChip: {
    height: chipHeight,
    marginRight: 5,
    color: 'blue',
  },
  dialogContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}))

interface Props {
  chosenTags: Tag[],
  onTagChosen: (tag: Tag) => void,
  availableConditions: Tag[],
  availableWeatherConditions: Tag[],
  chosenUserTagHistory: Tag[],
}

const AddTagButton: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { chosenTags, onTagChosen, availableConditions, availableWeatherConditions, chosenUserTagHistory } = props

  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [availableUserTags, setAvailableUserTags] = useState<Tag[]>([])
  const [inputError, setInputError] = useState(false)

  const allTagNames = availableConditions
    .concat(availableWeatherConditions)
    .concat(availableUserTags)
    .concat(chosenUserTagHistory)
    .map(tag => tag.name)

  const tagsToShow = availableUserTags.filter(tag => !arrayContainsTag(chosenTags, tag))

  useEffect(() => {
    const cancelTokenSource = baseService.cancelTokenSource()
    gamesService.getUserTags(cancelTokenSource).then(tags => setAvailableUserTags(tags))

    return () => cancelTokenSource?.cancel()
  }, [])

  const handleOpen = () => {
    setNewTagName('')
    setDialogOpen(true)
  }

  const handleTagNameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const inputtedName = event.target.value as string
    setNewTagName(inputtedName)
    setInputError(allTagNames.includes(inputtedName))
  }

  const handleAddTag = () => {
    setDialogOpen(false)
    const newTag: Tag = {
      id: 'temp-id-' + newTagName,
      name: newTagName,
      condition: false,
      weatherCondition: false,
    }
    onTagChosen(newTag)
  }

  const handleTagChosen = (tag: Tag) => {
    setDialogOpen(false)
    onTagChosen(tag)
  }

  const tagNameInputField = (
    <form className={classes.dialogContainer}>
      <TextField
        id="standard-basic"
        label="New tag"
        value={newTagName}
        error={inputError}
        helperText={inputError ? 'This tag already exists.' : null}
        onChange={handleTagNameChange}
      />
    </form>
  )

  const tagList = tagsToShow.length > 0 ? (
    <List
      component="nav"
      subheader={
        <ListSubheader disableSticky component="div" id="nested-list-subheader">
          Existing tags
        </ListSubheader>
      }
    >
      {tagsToShow.map(tag => (
        <ListItem key={tag.id}>
          <Chip
            className={classes.chip}
            label={tag.name}
            variant="outlined"
            onClick={() => handleTagChosen(tag)}
          />
        </ListItem>
      ))}
    </List>
  ) : null

  const dialogContent = (
    <DialogContent>
      {tagNameInputField}
      <br />
      {tagList}
    </DialogContent>
  )

  const dialogActions = (
    <DialogActions>
      <Button onClick={() => setDialogOpen(false)} color="primary">
        Cancel
      </Button>

      <DisableableButton
        variant="text"
        onClick={handleAddTag}
        disabled={newTagName.length === 0 || inputError}
      >
        Add
      </DisableableButton>
    </DialogActions>
  )

  return (
    <div>
      <Chip
        className={classes.addTagButtonChip}
        label="...add tag"
        variant="outlined"
        onClick={handleOpen}
      />

      <Dialog disableEscapeKeyDown open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add tag</DialogTitle>
        {dialogContent}
        {dialogActions}
      </Dialog>
    </div>
  )
}

export default AddTagButton
