import React, {useEffect, useState} from 'react'
import {useLocation} from "react-router";
import {makeStyles, useTheme} from "@material-ui/core";
import axios from "../../axios";
import TextField from "@material-ui/core/TextField";
import {validateStudentName} from "../../utils/students/validateStudentName";
import {DeanButton} from "../ui/DeanButton";
import {StudentCard} from "./student/StudentCard";
import {Cancel, Warning} from "@material-ui/icons";
import {DeanWarning} from "../ui/DeanWarning";

const useStyles = makeStyles(theme => ({
    studentNameField: {
        minWidth: '40%'
    },
    addStudentButton: {
        marginLeft: '1.5rem'
    },
    removeStudentIcon: {
        cursor: 'pointer'
    },
    studentsList: {
        marginTop: '2rem',
        marginBottom: '2.5rem'
    }
}))

export const StudentsEnrollment = (props) => {

    const theme = useTheme()
    const styles = useStyles()

    const groupId = new URLSearchParams(useLocation().search).get('groupId')

    useEffect(() => {
        axios.get(`/groups/${groupId}/students`).then(response => setStudents(response.data))
    }, [])

    const [students, setStudents] = useState([])
    const [newStudent, setNewStudent] = useState('')
    const [newStudents, setNewStudents] = useState([])
    const [studentNameErrorMessage, setStudentNameErrorMessage] = useState('')

    const handleStudentNameChange = (event) => {
        const name = event.target.value

        setStudentNameErrorMessage(validateStudentName(name))
        setNewStudent(name)
    }

    const handleStudentAdd = () => {
        setNewStudents(currentStudents => {
            const updatedNewStudents = [...currentStudents]
            const studentName = newStudent.split(' ')
            updatedNewStudents.push({
                firstName: studentName[1],
                lastName: studentName[0],
                middleName: studentName[2],
                fullName: newStudent
            })

            return updatedNewStudents
        })

        setStudentNameErrorMessage('')
        setNewStudent('')
    }

    const handleStudentRemove = (name) => {
        setNewStudents(currentStudents => {
            const updatedStudents = [...currentStudents]
            const deletedStudentIndex = updatedStudents.findIndex(student => student.fullName === name)
            updatedStudents.splice(deletedStudentIndex, 1)

            return updatedStudents
        })
    }

    const handleStudentsEnroll = () => {
        axios.post(`/groups/${groupId}/enrollment`, {
            students: newStudents.map(student => ({
                name: student.firstName,
                lastName: student.lastName,
                middleName: student.middleName
            }))
        }).then(response => {
            if(response.status === 200) {
                // TODO: показать тост об успешном зачислении студентов
            }
        })
    }

    return (
        <div>
            <div>
                <TextField
                    classes={{ root:  styles.studentNameField}}
                    label='ФИО студента'
                    value={newStudent}
                    placeholder='Петров Иван Фёдорович'
                    onChange={handleStudentNameChange}
                    helperText={studentNameErrorMessage}
                    error={studentNameErrorMessage !== ''}
                />
                <DeanButton primary onClick={handleStudentAdd} className={styles.addStudentButton} >Добавить</DeanButton>
            </div>
            <div className={styles.studentsList}>
                {newStudents.map(
                    student => (
                        <StudentCard
                            key={student.fullName}
                            text={student.fullName}
                            actions={[
                                <Cancel
                                    key='remove-student'
                                    htmlColor={theme.palette.error.main}
                                    onClick={() => handleStudentRemove(student.fullName)}
                                    className={styles.removeStudentIcon}
                                />
                            ]}
                        />
                    )
                )}
                {students.map(student => <StudentCard key={student.id} text={student.name} actions={[]}/>)}
            </div>

            <div>
                <DeanButton primary onClick={handleStudentsEnroll}>Зачислить студентов</DeanButton>
                <DeanWarning text="Студенты будут зачислены в выбранную группу" />
            </div>
        </div>
    )
}
