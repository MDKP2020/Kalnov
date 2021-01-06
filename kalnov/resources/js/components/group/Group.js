import React, {useEffect, useState} from 'react'
import axios from '../../axios'
import {useLocation, useParams} from "react-router";
import { KeyboardDatePicker } from '@material-ui/pickers'
import {StudentCard} from "./student/StudentCard";
import {useTheme, makeStyles} from "@material-ui/core";
import {DeanButton} from "../ui/DeanButton";

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column'
    },
    studentList: {
        overflowY: 'auto',
        maxHeight: '300px'
    },
    lastExamDateInputContainer: {
        display: 'flex',
    }
}))

export const Group = () => {
    const styles = useStyles(useTheme())

    const { year, studyYear, studyYearType, number } = useParams()
    const [students, setStudents] = useState([])
    const [lastExamDate, setLastExamDate] = useState('')

    const id = useLocation().state.groupId

    const handleLastExamDateChange = (date) => {
        setLastExamDate(date)
    }

    useEffect(() => {
        axios.get(`/groups/${id}/students`).then(students => { setStudents(students.data); console.log(students) })
    }, [year, studyYear, studyYearType])

    return (
        <div className={styles.container}>
            <h2>Список группы</h2>

            { /* TODO: search bar */ }

            <div className={styles.studentList}>
                {students.map(student => {
                    const fullName = `${student['last_name']} ${student.name} ${student['middle_name']}`
                    return <StudentCard key={student.id} name={fullName} id={student.id} />
                })}
            </div>

            <div className={styles.lastExamDateInputContainer}>

            </div>

            <DeanButton primary>Перевести студентов на следующий курс</DeanButton>
        </div>
    )

}
