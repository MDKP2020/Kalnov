import React, {useEffect, useState} from 'react'
import axios from '../../axios'
import {useLocation, useParams} from "react-router";
import { KeyboardDatePicker } from '@material-ui/pickers'
import {Student} from "./student/Student";
import {useTheme, makeStyles} from "@material-ui/core";
import {DeanButton} from "../ui/DeanButton";
import {SearchBar} from "../ui/SearchBar";

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
    }
}))

export const Group = () => {
    const styles = useStyles(useTheme())

    const { year, studyYear, studyYearType, number } = useParams()
    const [students, setStudents] = useState([])
    const [studentsAreLoaded, setStudentsAreLoaded] = useState(false)
    const [lastExamDate, setLastExamDate] = useState('')

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

    return (
        <div className={styles.container}>
            <h2>Список группы</h2>

            { studentsContent }

            <div className={styles.lastExamDateInputContainer}>

            </div>

            <DeanButton disabled={studentsAreLoaded && students.length === 0} primary className={styles.transferButton}>Перевести студентов на следующий курс</DeanButton>
        </div>
    )

}
