import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import {useHistory, useParams} from "react-router";
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
    studyTypeContainer: {
        display: 'flex',
        marginBottom: '0.5rem'
    },
    studyType: {
        display: 'inline-block',
        minWidth: '120px',
        fontWeight: 700
    },
    studyYear: {
        '&:not(:first-of-type)': {
            marginLeft: '0.4rem'
        },
        cursor: 'pointer'
    }
})

const BACHELOR_TYPE = 'bachelor'
const MASTER_TYPE = 'master'

export const StudyYearPicker = (props) => {
    const history = useHistory()
    const styles = useStyles()

    const handleStudyYearClick = (year) => {
        history.push(`${history.location.pathname}/${year.type}/${year.year}`)
    }

    const yearMapper = (year) => {
        return (
            <span
                className={styles.studyYear} key={`${year.type}/${year.year}`}
                onClick={() => handleStudyYearClick(year)}
            >
                {`${year.year} курс`}
            </span>
        )
    }

    const [years, setYears] = useState([])

    const { year } = useParams()

    useEffect(() => {
        axios.get(`/study_years`, {
            params: { year }
        }).then(studyYears => {
            setYears(studyYears.data)
        })
    }, [year])

    return (
        <div>
            <div className={styles.studyTypeContainer}>
                <span className={styles.studyType}>Бакалавриат</span>
                {years.filter(year => year.type === BACHELOR_TYPE).map(yearMapper)}
            </div>
            <div className={styles.studyTypeContainer}>
                <span className={styles.studyType}>Магистратура</span>
                {years.filter(year => year.type === MASTER_TYPE).map(yearMapper)}
            </div>
        </div>
    )
}
