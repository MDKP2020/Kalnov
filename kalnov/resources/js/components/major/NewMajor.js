import React, { useState } from 'react';
import { makeStyles, TextField, FormControl } from "@material-ui/core";
import axios from '../../axios';
import { SnackbarContent, Snackbar } from "@material-ui/core";
import {DeanButton} from "../ui/DeanButton";
import {Breadcrumbs} from "../ui/breadcrumbs/Breadcrumbs";
import {ErrorSnackbarContent} from "../ui/ErrorSnackbarContent";

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    pageContainer: {
        padding: '20px 60px',
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
    createButton: {
        marginTop: '80px',
        maxWidth: '25%',
    },
    pageHeader: {
        marginBottom: 0,
    },
}))

export const NewMajor = () => {
    const styles = useStyles()
    const [majorName, setMajorName] = useState('')
    const [majorAcronym, setMajorAcronym] = useState('')
    const [successMajorCreationSnackbarOpen, setSuccessMajorCreationSnackbarOpen] = useState(false)
    const [failureMajorCreationSnackbarOpen, setFailureMajorCreationSnackbarOpen] = useState(false)

    const handleMajorNameChange = (event) => {
        setMajorName(event.target.value)
    }

    const handleMajorAcronymChange = (event) => {
        setMajorAcronym(event.target.value)
    }

    const handleNewMajorCreation = () => {
        axios.post('/majors', {
            name: majorName,
            acronym: majorAcronym,
        }).then(() => {
            setSuccessMajorCreationSnackbarOpen(true)
        }).catch(() => {
            setFailureMajorCreationSnackbarOpen(true)
        })
    }

    return (
        <div className={styles.pageContainer}>
            <Breadcrumbs/>
            <div className={styles.container}>

                <h2 className={styles.pageHeader}>Новая специальность</h2>
                <FormControl className={styles.formControl}>
                    <TextField
                        autoFocus
                        placeholder="Программная инженерия"
                        label="Название специальности"
                        value={majorName}
                        onChange={handleMajorNameChange}
                        type="text"
                    />
                </FormControl>
                <FormControl className={styles.formControl}>
                    <TextField
                        placeholder="ПрИн"
                        label="Сокращение"
                        value={majorAcronym}
                        onChange={handleMajorAcronymChange}
                        type="text"
                    />
                </FormControl>
                <DeanButton primary className={styles.createButton} onClick={handleNewMajorCreation}>
                    Создать специальность
                </DeanButton>
                <Snackbar
                    open={successMajorCreationSnackbarOpen}
                    autoHideDuration={3500}
                    onClose={() => {
                        setSuccessMajorCreationSnackbarOpen(false)
                        setMajorName('')
                        setMajorAcronym('')
                    }}
                >
                    <SnackbarContent message={`Специальность "${majorName}" успешно создана`} />
                </Snackbar>
                <Snackbar open={failureMajorCreationSnackbarOpen} autoHideDuration={3500} onClose={() => setFailureMajorCreationSnackbarOpen(false)}>
                    <ErrorSnackbarContent message={`Не удалось создать специальность "${majorName}"`} />
                </Snackbar>
            </div>
        </div>
    )
}
