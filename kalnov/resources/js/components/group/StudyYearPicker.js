import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import {useHistory, useParams} from "react-router";
import {FormControl, InputLabel, makeStyles, MenuItem, Select, useTheme} from '@material-ui/core'
import {useDefaultStyles} from "../../hooks/useDefaultStyles"
import {StudyTypes, StudyTypesNames} from '../../types/studyTypes'
import CircularProgress from "@material-ui/core/CircularProgress";
import {DeanButton} from "../ui/DeanButton";
import {DialogModal} from "../ui/DialogModal";

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
        paddingLeft: '15px',
        marginBottom: '3rem'
    },
    loaderContainer: {
        marginTop: '4rem'
    },
    selectComponent: {
        '&:focus': {
            backgroundColor: 'inherit',
        },
    },
    formControl: {
        '&:not(:first-of-type)': {
            marginTop: '2rem'
        },
        display: 'flex',
        maxWidth: '40vw'
    }
})

const BACHELOR_STUDY_YEARS = [1, 2, 3, 4]
const MASTER_STUDY_YEARS = [1, 2]

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
    const [yearsAreLoaded, setYearsLoaded] = useState(false)

    const [isCreateStudyYearModalOpen, setCreateStudyYearModalOpen] = useState(false)
    const [studyYear, setStudyYear] = useState('ААА')
    const [studyYearType, setStudyYearType] = useState('ААА')
    const [availableYears, setAvailableYears] = useState([])

    const handleAddStudyYear = () => {
        setCreateStudyYearModalOpen(true)
    }

    const handleCreateStudyYear = () => {
        axios.post('/study_years', {
            year: studyYear,
            type: studyYearType
        }).then(response => {
            setCreateStudyYearModalOpen(false)
            fetchStudyYears()
        })
    }

    useEffect(() => {
        if(studyYearType === StudyTypes.bachelor)
            setAvailableYears(BACHELOR_STUDY_YEARS)
        else if (studyYearType === StudyTypes.master)
            setAvailableYears(MASTER_STUDY_YEARS)
    }, [studyYearType])

    const handleStudyYearTypeChange = (event) => {
        setStudyYearType(event.target.value)
    }

    const handleStudyYearChange = (event) => {
        setStudyYear(event.target.value)
    }

    const CreateStudyYearInputs = (
        <div>
            <FormControl className={styles.formControl}>
                <InputLabel htmlFor="studyTypeSelect">Тип обучения</InputLabel>
                <Select
                    inputProps={{ id: 'studyTypeSelect'}}
                    value={studyYearType}
                    onChange={handleStudyYearTypeChange}
                    classes={{ select: styles.selectComponent }}
                >
                    {StudyTypesNames.map(studyType => (
                        <MenuItem key={studyType.value} value={studyType.value}>
                            {studyType.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl className={styles.formControl}>
                <InputLabel htmlFor="selectStudyYear">Курс обучения</InputLabel>
                <Select
                    inputProps={{ id: 'selectStudyYear'}}
                    value={studyYear}
                    onChange={handleStudyYearChange}
                    classes={{ select: styles.selectComponent }}
                >
                    {availableYears.map(year => (
                        <MenuItem key={year} value={year}>
                            {year}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )

    const { year } = useParams()

    const fetchStudyYears = () => {
        axios.get(`/study_years`, {
            params: { year }
        }).then(studyYears => {
            setYears(studyYears.data)
            setYearsLoaded(true)
        })
    }

    useEffect(fetchStudyYears, [year])

    const StudyYearsLists = (
        <>
            <div className={styles.studyTypeContainer}>
                <span className={styles.studyType}>Бакалавриат</span>
                {years.filter(year => year.type === StudyTypes.bachelor).map(yearMapper)}
            </div>
            <div className={styles.studyTypeContainer}>
                <span className={styles.studyType}>Магистратура</span>
                {years.filter(year => year.type === StudyTypes.master).map(yearMapper)}
            </div>
        </>
    )

    let pickerContent;
    if(!yearsAreLoaded)
        pickerContent = <div className={`${defaultStyles.centeredContentContainer} ${styles.loaderContainer}`}><CircularProgress/></div>
    else
        pickerContent = years.length > 0 ? StudyYearsLists : <span className={defaultStyles.errorMessage}>Курсов обучения ещё нет</span>

    return (
        <div>
            <span className={defaultStyles.chooseLabel}>Выберите курс обучения:</span>

            <div className={styles.studyYearContainer}>
                { pickerContent }
            </div>

            <DeanButton primary onClick={handleAddStudyYear}>Добавить курс обучения</DeanButton>
            <DialogModal
                maxWidth='md'
                fullWidth
                id='create-study-year-modal'
                title='Добавить новый курс обучения'
                confirmButtonText='Создать'
                closeButtonText='Отмена'
                open={isCreateStudyYearModalOpen}
                onConfirm={handleCreateStudyYear}
                onClose={() => setCreateStudyYearModalOpen(false)}
                children={CreateStudyYearInputs}
            />
        </div>
    )
}
