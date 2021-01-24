import React, {useEffect, useState} from 'react'
import {useHistory, useLocation} from "react-router";
import {makeStyles, Snackbar, SnackbarContent, useTheme} from "@material-ui/core";
import axios from "../../axios";
import TextField from "@material-ui/core/TextField";
import {validateStudentName} from "../../utils/students/validateStudentName";
import {DeanButton} from "../ui/DeanButton";
import {StudentCard} from "./student/StudentCard";
import {Cancel, Warning} from "@material-ui/icons";
import {DeanWarning} from "../ui/DeanWarning";
import {validateGradebookNumber} from "../../utils/students/validateGradebookNumber";
import {useDefaultStyles} from "../../hooks/useDefaultStyles";
import {ErrorSnackbarContent} from "../ui/ErrorSnackbarContent";

const useStyles = makeStyles(theme => ({
    textField: {
        '&:not(:first-of-type)': {
            marginTop: '1rem'
        }
    },
    addStudentButton: {
        marginLeft: '2.5rem'
    },
    removeStudentIcon: {
        cursor: 'pointer'
    },
    studentsList: {
        marginTop: '2rem',
        marginBottom: '2.5rem'
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    fieldsContainer: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '40%',
        minWidth: '30%'
    },
    toGroupListButton: {
        maxWidth: '100%'
    },
}))

export const StudentsEnrollment = (props) => {

    const theme = useTheme()
    const styles = useStyles()
    const defaultStyles = useDefaultStyles()
    const history = useHistory()

    const groupId = new URLSearchParams(useLocation().search).get('groupId')

    const fetchExistingStudents = () => {
        axios.get(`/groups/${groupId}/students`).then(response => setStudents(response.data))
    }

    useEffect(fetchExistingStudents, [])

    const [students, setStudents] = useState([])
    const [newStudent, setNewStudent] = useState('')
    const [newStudents, setNewStudents] = useState([])
    const [studentNameErrorMessage, setStudentNameErrorMessage] = useState('')
    const [showSuccessEnrollmentSnackbar, setShowSuccessEnrollmentSnackbar] = useState(false)
    const [enrollErrorSnackbarOpen, setEnrollErrorSnackbarOpen] = useState(false)

    const [gradebookNumber, setGradebookNumber] = useState('')
    const [isGradebookNumberValid, setGradebookNumberValid] = useState(true)

    const handleGradebookNumberChange = (event) => {
        const number = event.target.value

        setGradebookNumber(number)
        setGradebookNumberValid(validateGradebookNumber(number))
    }

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
                fullName: newStudent,
                gradebookNumber
            })

            return updatedNewStudents
        })

        setStudentNameErrorMessage('')
        setNewStudent('')
        setGradebookNumber('')
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
                middleName: student.middleName,
                gradebookNumber: student.gradebookNumber
            }))
        }).then(response => {
            if(response.status === 200) {
                setShowSuccessEnrollmentSnackbar(true)
                setNewStudents([])
                fetchExistingStudents()
            }
        }).catch(error => {
            if(error.response.data.message.includes('SQLSTATE[23505]')) {
                setEnrollErrorSnackbarOpen(true)
            }
        })
    }

    let groupPath = history.location.pathname.replace('/enroll', '')
    groupPath = groupPath + history.location.search

    const ToGroupListButton = (
        <DeanButton className={styles.toGroupListButton} primary onClick={() => history.push(groupPath)}>К списку группы</DeanButton>
    )

    return (
        <div>
            <div className={styles.inputContainer}>
                <div className={styles.fieldsContainer}>
                    <TextField
                        classes={{ root:  styles.textField}}
                        label='ФИО студента'
                        value={newStudent}
                        placeholder='Петров Иван Фёдорович'
                        onChange={handleStudentNameChange}
                        helperText={studentNameErrorMessage}
                        error={studentNameErrorMessage !== ''}
                    />
                    <TextField
                        classes={{ root:  styles.textField}}
                        label='Номер зачётной книжки'
                        value={gradebookNumber}
                        placeholder='12345678'
                        onChange={handleGradebookNumberChange}
                        helperText={isGradebookNumberValid ? '' : 'Введите 8 цифр номера зачётной книжки'}
                        error={!isGradebookNumberValid}
                    />
                </div>
                <DeanButton
                    primary
                    disabled={!isGradebookNumberValid || studentNameErrorMessage !== '' || gradebookNumber === '' || newStudent === ''}
                    onClick={handleStudentAdd}
                    className={styles.addStudentButton}
                >
                    Добавить
                </DeanButton>
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
                {students.map(student => <StudentCard key={student.id} text={`${student['last_name']} ${student.name} ${student['middle_name']}`} actions={[]}/>)}
            </div>

            <div>
                <DeanButton disabled={newStudents.length === 0} primary onClick={handleStudentsEnroll}>Зачислить студентов</DeanButton>
                <DeanWarning text="Студенты будут зачислены в выбранную группу" />
            </div>

            <Snackbar open={showSuccessEnrollmentSnackbar} autoHideDuration={10000} onClose={() => setShowSuccessEnrollmentSnackbar(false)}>
                <SnackbarContent message='Студенты успешно зачислены' action={ToGroupListButton} />
            </Snackbar>

            <Snackbar open={enrollErrorSnackbarOpen} autoHideDuration={4500} onClose={() => setEnrollErrorSnackbarOpen(false)}>
                <ErrorSnackbarContent message='Номера зачётных книжек должны быть уникальными' />
            </Snackbar>
        </div>
    )
}
