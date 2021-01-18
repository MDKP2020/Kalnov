import React, {useEffect, useState} from 'react'
import axios from '../../axios'
import {useLocation, useParams} from "react-router";
import { KeyboardDatePicker } from '@material-ui/pickers'
import {Student} from "./student/Student";
import {useTheme, makeStyles, Snackbar, SnackbarContent} from "@material-ui/core";
import {DeanButton} from "../ui/DeanButton";
import {SearchBar} from "../ui/SearchBar";
import {StudyTypes} from "../../types/studyTypes";

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column'
    },
    studentList: {
        overflowY: 'auto',
        maxHeight: '300px',
        marginTop: '1.5rem'
    },
    lastExamDateInputContainer: {
        display: 'flex',
    },
    transferButton: {
        marginTop: '3rem'
    },
    noStudentsMessage: {
        color: theme.palette.error.main,
        fontSize: '1.2rem',
        display: 'block'
    },
    actionsWithGroup: {
        display: 'flex',
        flexDirection: 'column',
        '& > button:not(:first-of-type)': {
            marginTop: '2.5rem',
        },
    },
}))

export const Group = () => {
    const styles = useStyles(useTheme())

    const { year, studyYear, studyYearType, number } = useParams()
    const [students, setStudents] = useState([])
    const [studentsAreLoaded, setStudentsAreLoaded] = useState(false)
    const [lastExamDate, setLastExamDate] = useState('')
    const [successExpelSnackbarOpen, setSuccessExpelSnackbarOpen] = useState(false)
    const [failureExpelSnackbarOpen, setFailureExpelSnackbarOpen] = useState(false)

    const id = useLocation().state.groupId

    const getStudents = (query) => {
        axios.get(
            `/groups/${id}/students`,
            {
                params: {
                    name: query ? query : ''
                }
            }
        ).then(students => { setStudents(students.data); setStudentsAreLoaded(true) })
    }

    const handleLastExamDateChange = (date) => {
        setLastExamDate(date)
    }

    useEffect(getStudents, [year, studyYear, studyYearType])

    const StudentList = (
        <>
            <SearchBar queryFunction={getStudents} queryParamName='name'/>

            <div className={styles.studentList}>
                {students.map(student => {
                    const fullName = `${student['last_name']} ${student.name} ${student['middle_name']}`
                    return <Student key={student.id} name={fullName} id={student.id} />
                })}
            </div>
        </>
    )

    const NoStudentsMessage = <span className={styles.noStudentsMessage}>В группе ещё нет студентов</span>

    let studentsContent;
    if(!studentsAreLoaded)
        studentsContent = null
    else {
        studentsContent = students.length > 0  ? StudentList : NoStudentsMessage
    }

    const expelStudentsHandler = async () => {
        try {
            const response = await axios.patch(`/groups/${id}/expel/studyEnd`)
            if (response.status === 200) {
                setSuccessExpelSnackbarOpen(true)
                await getStudents()
            }
        } catch (e) {
            setFailureExpelSnackbarOpen(true)
        }
    }

    return (
        <div className={styles.container}>
            <h2>Список группы</h2>

            { studentsContent }

            <div className={styles.lastExamDateInputContainer}>

            </div>
            <div className={styles.actionsWithGroup}>
                <DeanButton disabled={studentsAreLoaded && students.length === 0} primary className={styles.transferButton}>Перевести студентов на следующий курс</DeanButton>
                <DeanButton
                    error
                    disabled={(studyYearType === StudyTypes.bachelor && studyYear !== 4) || (studyYearType === StudyTypes.master && studyYear !== 2)}
                    onClick={expelStudentsHandler}
                >
                    Отчислить студентов в связи с окончанием обучения
                </DeanButton>
            </div>
            <Snackbar
                open={successExpelSnackbarOpen}
                autoHideDuration={2500}
                onClose={() => setSuccessExpelSnackbarOpen(false)}
            >
                <SnackbarContent message={'Студенты успешно отчислены'} />
            </Snackbar>
            <Snackbar
                open={failureExpelSnackbarOpen}
                autoHideDuration={2500}
                onClose={() => setFailureExpelSnackbarOpen(false)}
            >
                <SnackbarContent message={'При отчислении студентов возникла ошибка'} />
            </Snackbar>
        </div>
    )

}
