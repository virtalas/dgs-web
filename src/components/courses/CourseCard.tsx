import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { Card, CardContent } from '@material-ui/core'

import { sneakyGrey } from '../../constants/Colors'
import coursesService from '../../services/coursesService'

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  image: {
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 100,
    overflow: 'hidden',
    // Center mapPlaceholderText vertically:
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  mapPlaceholderText: {
    color: sneakyGrey,
  },
}))

interface Props {
  course: Course,
}

// TODO: Current weather conditions?
// TODO: Use ghosting after opening Accordion and fetching data
// TODO: Picture: Use course.picture (IRL pic uploaded to server), or if it's empty, use the mapURL from the active layout.

const CourseCard: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { course } = props

  useEffect(() => {
  }, [])

  const coverPictureURL = course.layouts.filter(layout => layout.active)[0].mapURL

  return (
    <Card className={classes.card}>
      <div className={classes.imageContainer}>
        {/* TODO: Clicking image opens popup of course map */}
        <img
          className={classes.image}
          src={coverPictureURL}
        />
      </div>

      <CardContent>
        <Typography variant="h5">
          {course.name}, {course.city}
        </Typography>

        <Typography component="p">
          Games played: XXX
        </Typography>

        <Typography component="p">
          Latest game: X.XX.XXXX
        </Typography>

        <Typography component="p">
          Average score: +X.X
        </Typography>

        <Typography component="p">
          On this course:
          <Button size="small">All games</Button>
          <Button size="small">My games</Button>
        </Typography>

        <br />

        <Accordion disabled>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Holes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
              sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion disabled>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Layouts</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
              sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion disabled>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>High scores</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              [All scores] [My scores]
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion disabled>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Scores per hole</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
              sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion disabled>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Development of high scores</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
              sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  )
}

export default CourseCard
