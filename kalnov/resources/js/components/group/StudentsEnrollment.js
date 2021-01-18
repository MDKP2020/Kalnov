import React, {useEffect, useState} from 'react'
import {useLocation} from "react-router";
import {makeStyles, useTheme} from "@material-ui/core";
import axios from "../../axios";
import TextField from "@material-ui/core/TextField";
import {validateStudentName} from "../../utils/students/validateStudentName";
import {DeanButton} from "../ui/DeanButton";
import {StudentCard} from "./student/StudentCard";
import {Cancel, Warning} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({

}))

export const StudentsEnrollment = (props) => {

    const theme = useTheme()

    const groupId = useLocation().state.id

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
                    label='ФИО студента'
                    value={newStudent}
                    placeholder='Петров Иван Фёдорович'
                    onChange={handleStudentNameChange}
                    helperText={studentNameErrorMessage}
                    error={studentNameErrorMessage !== ''}
                />
                <DeanButton primary onClick={handleStudentAdd}>Добавить</DeanButton>
            </div>
            <div>
                {newStudents.map(
                    student => (
                        <StudentCard
                            key={student}
                            text={student.fullName}
                            actions={[<Cancel htmlColor={theme.palette.error.main} onClick={() => handleStudentRemove(student.fullName)}/>]}
                        />
                    )
                )}
                {students.map(student => <StudentCard key={student.id} text={student.name} actions={[]}/>)}
            </div>

            <div>
                <DeanButton onClick={handleStudentsEnroll()}>Зачислить студентов</DeanButton>
                <div>
                    <Warning htmlColor={theme.palette.warning.main}/>
                    <span>Студенты будут зачислены в выбранную группу</span>
                </div>
            </div>
        </div>
    )
}
