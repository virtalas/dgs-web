import React, { useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Chip from '@material-ui/core/Chip'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import ListSubheader from '@material-ui/core/ListSubheader'
import { OutlinedInput } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: 5,
    minWidth: 120,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}))

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: '80%',
      width: 250,
    },
  },
}

interface Props {
  selectedTags: Tag[]
  setSelectedTags: (tags: Tag[]) => void,
  allTags: Tag[],
}

const TagSelect: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { selectedTags, setSelectedTags, allTags } = props

  const handleSelectedTagsChange = (event: React.ChangeEvent<{ value: unknown }>, value: any) => {
    const selectedTagId = value.props.value as string
    const selectedTag = allTags.find(tag => tag.id === selectedTagId) as Tag

    if (!selectedTagId) {
      // selectedTagId was 'undefined'. This happens if a label in the popup list was clicked.
      return
    }

    let updatedTags
    if (arrayContains(selectedTags, selectedTag)) {
      // Remove if clicked again
      updatedTags = selectedTags.filter(tag => tag.id !== selectedTagId)
    } else {
      // Add
      updatedTags = [...selectedTags, selectedTag]
    }
    setSelectedTags(updatedTags)
  }

  const conditionTagList = allTags.filter(tag => tag.weatherCondition || tag.condition).map(tag => (
    <MenuItem key={tag.id} value={tag.id}>
      <Checkbox checked={arrayContains(selectedTags, tag)} color="primary" />
      <ListItemText primary={tag.name} />
    </MenuItem>
  ))

  const userTagList = allTags.filter(tag => !tag.weatherCondition && !tag.condition).map(tag => (
    <MenuItem key={tag.id} value={tag.id}>
      <Checkbox checked={arrayContains(selectedTags, tag)} color="primary" />
      <ListItemText primary={tag.name} />
    </MenuItem>
  ))

  // Used for outlined Select's input label.
  const inputLabel = React.useRef<HTMLLabelElement>(null)
  const [labelWidth, setLabelWidth] = React.useState(0)
  useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth)
  }, [])

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel ref={inputLabel} htmlFor="players-select">Tags</InputLabel>
      <Select
        multiple
        value={selectedTags}
        onChange={handleSelectedTagsChange}
        input={<OutlinedInput labelWidth={labelWidth} name="players" id="players-select" />}
        renderValue={selected => (
          <div className={classes.chips}>
            {(selected as Tag[]).map(tag => (
              <Chip key={tag.id} label={tag.name} className={classes.chip} />
            ))}
          </div>
        )}
        MenuProps={MenuProps}
      >
        {conditionTagList}
        {userTagList.length !== 0 ? (
          <ListSubheader>Tags added by users</ListSubheader>
        ) : null}
        {userTagList}
      </Select>
    </FormControl>
  )
}

function arrayContains(array: Tag[], tag: Tag): boolean {
  return array.some(t => t.id === tag.id)
}

export default TagSelect
