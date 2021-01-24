import React, { useState, useEffect } from 'react'
import {
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    FormControl,
    CircularProgress, Snackbar, SnackbarContent,
} from "@material-ui/core";
import { DeanButton } from "../ui/DeanButton";
import axios from "../../axios";
import {useHistory, useParams} from "react-router";
import {DeanWarning} from "../ui/DeanWarning";
import {WarningSnackbarContent} from "../ui/WarningSnackbarContent";

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
    formControl: {
        '&:not(:first-of-type)': {
            marginTop: '40px',
        },
        '&:first-of-type': {
            marginTop: '30px',
        },
        width: '37%',
    },
    majorNameLoadingProgress: {
        color: theme.palette.primary.main,
    },
    pageHeader: {
        marginBottom: 0,
    },
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
    const [groupNumberErrorSnackbarOpen, setGroupNumberErrorSnackbarOpen] = useState(false)

    const styles = useStyles()

    const params = useParams()
    const history = useHistory()
    const studyType = params.studyYearType

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
            yearRange: Number.parseInt(params.year),
            studyYear: Number.parseInt(params.studyYear),
        }).then(() => {
            history.goBack()
        }).catch(error => {
            if(error.response.data.errors.number)
                setGroupNumberErrorSnackbarOpen(true)
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
            <h2 className={styles.pageHeader}>Новая группа</h2>
            <FormControl className={styles.formControl}>
                <TextField
                    label='Номер группы'
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
                <DeanWarning inline text="Группа будет создана на первом курсе в текущем учебном году" />
            </div>

            <Snackbar autoHideDuration={4500} open={groupNumberErrorSnackbarOpen} onClose={() => setGroupNumberErrorSnackbarOpen(false)}>
                <WarningSnackbarContent message='Номер группы должен быть числом' />
            </Snackbar>
        </div>
    )
}
