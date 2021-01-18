import React, { useState, useEffect } from 'react'
import { Warning } from '@material-ui/icons'
import { InputLabel, makeStyles, MenuItem, Select, TextField, FormControl } from "@material-ui/core";
import { DeanButton } from "../ui/DeanButton";
import { StudyTypesNames } from "../../types/studyTypes";
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
        color: theme.warning.main,
        width: '40px',
        height: '40px',
    },
    warningText: {
        fontSize: '1rem',
        color: theme.palette.text.gray,
    },
    warningBlock: {
        display: 'flex',
        alignItems: 'center'
    },
    createButton: {
        marginRight: '3rem',
    },
    formControl: {
        '&:not(:first-of-type)': {
            marginTop: '40px',
        },
        '&:first-of-type': {
            marginTop: '30px',
        },
        width: '40%',
    }
}))

export const NewGroup = () => {
    useEffect(() => {
        axios.get('/majors')
            .then(response => {
                setMajors(response.data)
            })
            .catch(error => console.log(error))
    })

    const [groupNumber, setGroupNumber] = useState('')
    const [major, setMajor] = useState('ПрИн')
    const [studyType, setStudyType] = useState('')
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

    return (
        <div className={styles.container}>
            <h2>Новая группа</h2>
            <FormControl className={styles.formControl}>
                <TextField
                    autoFocus
                    value={groupNumber}
                    type="text"
                    onChange={groupNumberHandler()}
                />
            </FormControl>
            <FormControl className={styles.formControl}>
                <InputLabel htmlFor="selectMajor">Направление обучения</InputLabel>
                <Select
                    inputProps={{ id: 'selectMajor' }}
                    value={major}
                    onChange={majorHandler}
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
                >
                    {StudyTypesNames.map(studyType => (
                        <MenuItem key={studyType.value} value={studyType.value}>
                            {studyType.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div className={styles.groupCreationBlock}>
                <DeanButton onClick={groupCreationHandler}>Создать группу</DeanButton>
                <div className={styles.warningBlock}>
                    <Warning classes={{ root: styles.warningIcon }} />
                    <p className={styles.warningText}>Группа будет создана на первом курсе в текущем учебном году</p>
                </div>
            </div>
        </div>
    )
}
