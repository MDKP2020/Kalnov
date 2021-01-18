import React, { useState, useEffect } from 'react'
import { Warning } from '@material-ui/icons'
import { InputLabel, makeStyles, MenuItem, Select, TextField, FormControl } from "@material-ui/core";
import { DeanButton } from "../ui/DeanButton";
import { StudyTypesNames } from "../../types/studyTypes";
import { CircularProgress } from "@material-ui/core";
import axios from "../../axios";

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
            })
            .catch(error => console.log(error))
    }
    useEffect(() => {
        fetchMajors()
    }, [])

    const [groupNumber, setGroupNumber] = useState('')
    const [major, setMajor] = useState('ПрИн')
    const [studyType, setStudyType] = useState('bachelor')
    const [majors, setMajors] = useState([])

    const styles = useStyles()

    const groupNumberHandler = (event) => {
        setGroupNumber(event.target.value)
    }

    const majorHandler = (event) => {
        setMajor(event.target.value)
    }

    const studyTypeHandler = (event) => {
        setStudyType(event.target.value)
    }

    const groupCreationHandler = async () => {
        const newGroupData = {}
        axios.post('/groups', {
            number: groupNumber,
            studyYearType: studyType,
            majorId: major,
        }).then(response => console.log(response))
    }

    const renderMajorSelectValue = (value) => {
        if (majors.length !== 0) {
            const major = majors.find(major => major.acronym === value)
            return major.name
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
            <FormControl className={styles.formControl}>
                <InputLabel htmlFor="studyTypeSelect">Тип обучения</InputLabel>
                <Select
                    inputProps={{ id: 'studyTypeSelect' }}
                    value={studyType}
                    onChange={studyTypeHandler}
                    classes={{ select: styles.selectComponent }}
                >
                    {StudyTypesNames.map(studyType => (
                        <MenuItem key={studyType.value} value={studyType.value}>
                            {studyType.name}
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
