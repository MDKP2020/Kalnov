import React, {useEffect, useState} from 'react'
import axios from '../../axios'
import {useLocation, useParams} from "react-router";
import { KeyboardDatePicker } from '@material-ui/pickers'
import {StudentCard} from "./student/StudentCard";
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
    }
}))

export const Group = () => {
    const styles = useStyles(useTheme())

    const { year, studyYear, studyYearType, number } = useParams()
    const [students, setStudents] = useState([])
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
        ).then(students => { setStudents(students.data); console.log(students) })
    }

    const handleLastExamDateChange = (date) => {
        setLastExamDate(date)
    }

    useEffect(getStudents, [year, studyYear, studyYearType])

    return (
        <div className={styles.container}>
            <h2>Список группы</h2>

            <SearchBar queryFunction={getStudents} queryParamName='name'/>

            <div className={styles.studentList}>
                {students.map(student => {
                    const fullName = `${student['last_name']} ${student.name} ${student['middle_name']}`
                    return <StudentCard key={student.id} name={fullName} id={student.id} />
                })}
            </div>

            <div className={styles.lastExamDateInputContainer}>

            </div>

            <DeanButton primary className={styles.transferButton}>Перевести студентов на следующий курс</DeanButton>
        </div>
    )

}
