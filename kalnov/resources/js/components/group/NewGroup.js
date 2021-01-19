import React, { useState, useEffect } from 'react'
import { Warning } from '@material-ui/icons'
import {
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    FormControl,
    CircularProgress,
} from "@material-ui/core";
import { DeanButton } from "../ui/DeanButton";
import axios from "../../axios";
import {useHistory, useParams} from "react-router";

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    groupCreationBlock: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '80px',
    },
    warningIcon: {
        color: theme.palette.warning.main,
        width: '40px',
        height: '40px',
    },
    warningText: {
        fontSize: '1rem',
        color: theme.palette.text.gray,
        marginLeft: '1rem',
    },
    warningBlock: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '3rem',
    },
    formControl: {
        '&:not(:first-of-type)': {
            marginTop: '40px',
        },
        '&:first-of-type': {
            marginTop: '30px',
        },
        width: '37%',
    },
    selectComponent: {
        '&:focus': {
            backgroundColor: 'inherit',
        },
    },
    majorNameLoadingProgress: {
        color: theme.palette.primary.main,
    }
}))

export const NewGroup = () => {
    const fetchMajors = async () => {
        axios.get('/majors')
            .then(response => {
                setMajors(response.data)
                setMajorsLoaded(true)
            })
            .catch(error => console.log(error))
    }
    useEffect(() => {
        fetchMajors()
    }, [])

    const [groupNumber, setGroupNumber] = useState('')
    const [major, setMajor] = useState('ПрИн')
    const [majors, setMajors] = useState([])
    const [majorsAreLoaded, setMajorsLoaded] = useState(false)

    const styles = useStyles()

    const params = useParams()
    const history = useHistory()
    const studyType = params.studyYearType

    console.log(studyType)

    const groupNumberHandler = (event) => {
        setGroupNumber(event.target.value)
    }

    const majorHandler = (event) => {
        setMajor(event.target.value)
    }

    const groupCreationHandler = async () => {
        axios.post('/groups', {
            number: groupNumber,
            studyYearType: studyType,
            majorId: majors.find(maj => maj.acronym === major).id,
        }).then(() => {
            history.goBack()
        })
    }

    const renderMajorSelectValue = (value) => {
        if (majorsAreLoaded !== false) {
            const major = majors.find(major => major.acronym === value)
            if(major)
                return major.name
            else
                return 'Нет специальностей'
        } else {
            return <CircularProgress size="1.2em" classes={{ root: styles.majorNameLoadingProgress }} />
        }
    }

    return (
        <div className={styles.container}>
            <h2>Новая группа</h2>
            <FormControl className={styles.formControl}>
                <TextField
                    autoFocus
                    value={groupNumber}
                    type="text"
                    onChange={groupNumberHandler}
                />
            </FormControl>
            <FormControl className={styles.formControl}>
                <InputLabel htmlFor="selectMajor">Направление обучения</InputLabel>
                <Select
                    inputProps={{ id: 'selectMajor' }}
                    value={major}
                    onChange={majorHandler}
                    classes={{ select: styles.selectComponent }}
                    renderValue={renderMajorSelectValue}
                >
                    {majors.map(major => (
                        <MenuItem key={major.acronym} value={major.acronym}>
                            {major.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div className={styles.groupCreationBlock}>
                <DeanButton primary onClick={groupCreationHandler}>Создать группу</DeanButton>
                <div className={styles.warningBlock}>
                    <Warning classes={{ root: styles.warningIcon }} />
                    <p className={styles.warningText}>Группа будет создана на первом курсе в текущем учебном году</p>
                </div>
            </div>
        </div>
    )
}
