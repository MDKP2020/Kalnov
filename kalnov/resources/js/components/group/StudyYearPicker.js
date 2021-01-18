import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import {useHistory, useParams} from "react-router";
import {makeStyles, useTheme} from '@material-ui/core'
import {useDefaultStyles} from "../../hooks/useDefaultStyles"
import { StudyTypes } from '../../types/studyTypes'

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
    },
    studyYearContainer: {
        paddingLeft: '15px'
    }
})

export const StudyYearPicker = (props) => {
    const history = useHistory()
    const styles = useStyles()
    const defaultStyles = useDefaultStyles(useTheme())

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
            <span className={defaultStyles.chooseLabel}>Выберите курс обучения:</span>

            <div className={styles.studyYearContainer}>
                <div className={styles.studyTypeContainer}>
                    <span className={styles.studyType}>Бакалавриат</span>
                    {years.filter(year => year.type === StudyTypes.bachelor).map(yearMapper)}
                </div>
                <div className={styles.studyTypeContainer}>
                    <span className={styles.studyType}>Магистратура</span>
                    {years.filter(year => year.type === StudyTypes.master).map(yearMapper)}
                </div>
            </div>
        </div>
    )
}
