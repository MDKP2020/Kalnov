import React, {useEffect, useState} from 'react'
import axios from '../../axios'
import {useHistory, useLocation, useParams} from "react-router";
import { KeyboardDatePicker } from '@material-ui/pickers'
import {Student} from "./student/Student";
import {useTheme, makeStyles, Snackbar, SnackbarContent, CircularProgress} from "@material-ui/core";
import {DeanButton} from "../ui/DeanButton";
import {SearchBar} from "../ui/SearchBar";
import {StudyTypes} from "../../types/studyTypes";
import {ArrowUpward} from "@material-ui/icons";
import { format } from 'date-fns'
import {PickerLocalization} from "../../utils/date/PickerLocalization";
import {useDefaultStyles} from "../../hooks/useDefaultStyles";

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
        marginTop: '1.5rem',
        display: 'flex',
        alignItems: 'center'
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
    enrollStudentsLabelContainer: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        marginTop: '1.5rem'
    },
    enrollStudentsIcon: {
        fontSize: '2.4rem',
        marginRight: '0.7rem'
    },
    enrollStudentsLabel: {
        fontSize: '1.1rem'
    },
    setLastExamDateButton: {
        marginLeft: '2rem',
    },
    toNewGroupButton: {
        width: '100%',
    },
}))

export const Group = () => {
    const theme = useTheme()
    const styles = useStyles()
    const defaultStyles = useDefaultStyles()

    const history = useHistory()

    const { year, studyYear, studyYearType, number } = useParams()
    const [students, setStudents] = useState([])
    const [studentsAreLoaded, setStudentsAreLoaded] = useState(false)
    const [lastExamDate, setLastExamDate] = useState(`01.01.${Number.parseInt(year) + 1}`)
    const [successExpelSnackbarOpen, setSuccessExpelSnackbarOpen] = useState(false)
    const [failureExpelSnackbarOpen, setFailureExpelSnackbarOpen] = useState(false)
    const [successSetLastExamDateSnackbarOpen, setSuccessSetLastExamDateSnackbarOpen] = useState(false)
    const [failureSetLastExamDateSnackbarOpen, setFailureSetLastExamDateSnackbarOpen] = useState(false)
    const [failureNextYearMoveSnackbarOpen, setFailureNextYearMoveSnackbarOpen] = useState(false)
    const [failureNextYearMoveError, setFailureNextYearMoveError] = useState('')
    const [newGroupId, setNewGroupId] = useState(null)
    const [studentNameQuery, setStudentNameQuery] = useState('')

    const id = new URLSearchParams(useLocation().search).get('groupId')

    const getStudents = (query) => {
        setStudentNameQuery(query)

        axios.get(
            `/groups/${id}/students`,
            {
                params: {
                    name: query ? query : ''
                }
            }
        ).then(students => {
            setStudents(students.data)
            setStudentsAreLoaded(true)
        })
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
                    return <Student
                        key={student.id}
                        id={student.id}
                        gradebookNumber={student['gradebook_number']}
                        groupId={id}
                        expelReason={student['expel_reason']}
                        onUpdate={getStudents}
                        name={student.name}
                        lastName={student['last_name']}
                        middleName={student['middle_name']}
                    />
                })}
            </div>
        </>
    )

    const handleStudentsEnroll = () => {
        history.push(`${history.location.pathname}/enroll?groupId=${id}`)
    }

    const NoStudentsMessage = <span className={styles.noStudentsMessage}>В группе ещё нет студентов</span>
    const NoStudentsContent = <div>
        {NoStudentsMessage}
        <div className={styles.enrollStudentsLabelContainer} onClick={handleStudentsEnroll}>
            <ArrowUpward className={styles.enrollStudentsIcon} htmlColor={theme.palette.primary.main}/>
            <span className={styles.enrollStudentsLabel}>Зачислить студентов</span>
        </div>
    </div>

    let studentsContent;
    if(!studentsAreLoaded)
        studentsContent = <CircularProgress size='2em'/>
    else {
        studentsContent = students.length === 0 && studentNameQuery === '' ? NoStudentsContent : StudentList
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

    const handleMoveToNextYear = () => {
        axios.post(`/groups/${id}/nextYear`).then(response => {
            setNewGroupId(response.data)
        }).catch(error => {
            if (error.response.status === 400 && error.response.data.errors?.['last_exam_date']) {
                setFailureNextYearMoveError('Не установлена дата последнего экзамена')
            }
            if (error.response.status === 400 && error.response.data.error.includes('only after the end of last exam')) {
                setFailureNextYearMoveError('Невозможно перевести студентов, пока не наступит дата последнего экзамена')
            }
            setFailureNextYearMoveSnackbarOpen(true)
        })
    }

    const openNewGroupPage = () => {
        history.push(`/groups/${Number.parseInt(year) + 1}/${studyYearType}/${Number.parseInt(studyYear) + 1}/${number}?groupId=${newGroupId}`)
    }

    const ToNewGroupButton = (
        <DeanButton primary className={styles.toNewGroupButton} onClick={openNewGroupPage}>Перейти к новой группе</DeanButton>
    )

    const handleSetLastExamDate = () => {
        axios.post(`/groups/${id}/lastExamDate`, {
            lastExamDate: format(lastExamDate, 'yyyy-MM-dd')
        }).then(response => setSuccessSetLastExamDateSnackbarOpen(true))
          .catch(error => {
            if (error.response.data.errors?.['last_exam_year']?.[0].includes('should be equal to last year of year range')) {
                setFailureSetLastExamDateSnackbarOpen(true)
            }
        })
    }

    return (
        <div className={styles.container}>
            <h2>Список группы</h2>

            { studentsContent }

            <div className={styles.lastExamDateInputContainer}>
                <PickerLocalization>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd.MM.yyyy"
                        margin="normal"
                        id="last-exam-date"
                        label="Дата последнего экзамена во втором семестре"
                        value={lastExamDate}
                        onChange={handleLastExamDateChange}
                    />
                </PickerLocalization>
                <DeanButton primary onClick={handleSetLastExamDate} className={styles.setLastExamDateButton}>Установить</DeanButton>
            </div>
            <div className={styles.actionsWithGroup}>
                <DeanButton onClick={handleMoveToNextYear} disabled={studentsAreLoaded && students.length === 0} primary className={styles.transferButton}>Перевести студентов на следующий курс</DeanButton>
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
                <SnackbarContent message="Студенты успешно отчислены" />
            </Snackbar>

            <Snackbar
                open={failureExpelSnackbarOpen}
                autoHideDuration={2500}
                onClose={() => setFailureExpelSnackbarOpen(false)}
            >
                <SnackbarContent message="При отчислении студентов возникла ошибка" />
            </Snackbar>

            <Snackbar open={newGroupId !== null} autoHideDuration={10000} onClose={() => setNewGroupId(null)}>
                <SnackbarContent message="Группа успешно переведена на следующий курс" action={ToNewGroupButton} />
            </Snackbar>

            <Snackbar open={successSetLastExamDateSnackbarOpen} autoHideDuration={3500} onClose={() => setSuccessSetLastExamDateSnackbarOpen(false)}>
                <SnackbarContent message="Дата последнего экзамена успешно установлена" />
            </Snackbar>

            <Snackbar open={failureNextYearMoveSnackbarOpen} autoHideDuration={4500} onClose={() => setFailureNextYearMoveSnackbarOpen(false)}>
                <SnackbarContent message={failureNextYearMoveError} />
            </Snackbar>

            <Snackbar open={failureSetLastExamDateSnackbarOpen} autoHideDuration={4500} onClose={() => setFailureSetLastExamDateSnackbarOpen(false)}>
                <SnackbarContent
                    message="Год даты последнего экзамена должен совпадать с последним годом текущего учебного года"
                    classes={{ root: defaultStyles.errorSnackbar}}
                />
            </Snackbar>
        </div>
    )

}
