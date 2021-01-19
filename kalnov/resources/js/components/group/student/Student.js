import React, {useState} from 'react'
import {useTheme, makeStyles, FormControl, TextField, SnackbarContent, Snackbar} from "@material-ui/core";
import {ArrowForward, Cancel, Edit} from "@material-ui/icons";
import {DeanTooltip} from "../../ui/DeanTooltip";
import {StudentCard} from "./StudentCard";
import axios from "../../../axios";
import {DialogModal} from "../../ui/DialogModal";

const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
        border: `1px solid ${theme.palette.background.main}`,
        borderRadius: 10,
        width: '100%',
        padding: '14px 16px',
        justifyContent: 'space-between',
        alignItems: 'center',
        '&:not(:first-of-type)': {
            marginTop: '0.8rem'
        }
    },
    name: {
        color: theme.palette.text.main,
    },
    studentName: {
        color: props => props.isExpel ? theme.palette.error.main : 'black',
    },
    actions: {
        display: 'flex'
    },
    actionIcon: {
        cursor: 'pointer',
        '&:not(:first-of-type)': {
            marginLeft: '0.4rem'
        }
    },
}))

export const Student = ({ fullName, id, gradebookNumber, groupId, expelReason: studentExpelReason, lastName, middleName, name, onUpdate }) => {
    const theme = useTheme()
    const styles = useStyles({ isExpel: studentExpelReason !== null })

    const [openExpelStudentModal, setOpenExpelStudentModal] = useState(false)
    const [expelReason, setExpelReason] = useState('')
    const [showSuccessStudentExpelSnackbar, setShowSuccessStudentExpelSnackbar] = useState(false)

    const [openEditStudentModal, setOpenEditStudentModal] = useState(false)
    const [newStudentName, setNewStudentName] = useState(name)
    const [newStudentMiddleName, setNewStudentMiddleName] = useState(middleName)
    const [newStudentLastName, setNewStudentLastName] = useState(lastName)

    const EDIT_BUTTON_COLOR = '#e6b710'

    const handleNewNameChange = (event) => {
        setNewStudentName(event.target.value)
    }

    const handleNewMiddleNameChange = (event) => {
        setNewStudentMiddleName(event.target.value)
    }

    const handleNewLastNameChange = (event) => {
        setNewStudentLastName(event.target.value)
    }

    const createInputForName = (nameType, value, handler) => {
        let inputLabel
        switch (nameType) {
            case 'last':
                inputLabel = 'Фамилия студента'
                break;

            case 'middle':
                inputLabel = 'Отчество студента'
                break;

            case 'first':
                inputLabel = 'Имя студента'
                break;

            default:
                break;
        }

        return (
            <TextField
                value={value}
                onChange={handler}
                label={inputLabel}
            />
        )
    }

    const handleExpelReasonChange = (event) => {
        setExpelReason(event.target.value)
    }

    const ExpelReasonInput = (
        <FormControl style={{ display: 'flex' }}>
            <TextField
                label="Причина отчисления"
                value={expelReason}
                onChange={handleExpelReasonChange}
            />
        </FormControl>
    )

    const handleStudentExpel = (studentId) => {
        axios.patch(`/groups/${groupId}/expel`, {
            reason: expelReason,
            studentId: id
        }).then(response => {
            setOpenExpelStudentModal(false)
            setShowSuccessStudentExpelSnackbar(true)
            onUpdate()
        })
    }

    const handleStudentEdit = (studentId) => {
        const newStudentData = {}
        if (newStudentName !== name) newStudentData.name = newStudentName
        if (newStudentLastName !== lastName) newStudentData.lastName = newStudentLastName
        if (newStudentMiddleName !== middleName) newStudentData.middleName = newStudentMiddleName
        axios.patch(`/students/${id}/edit`, {
            ...newStudentData
        }).then(response => {
            setOpenEditStudentModal(false)
            onUpdate()
        })
    }

    const handleExpelButtonClick = () => {
        setOpenExpelStudentModal(true)
    }

    const handleEditButtonClick = () => {
        setOpenEditStudentModal(true)
    }

    const handleTransferButtonClick = () => {

    }

    const actionIconClasses = { root: styles.actionIcon }

    const actions = [
        <DeanTooltip title="Отчислить студента" key='expel'>
            <Cancel htmlColor={theme.palette.error.main} classes={actionIconClasses} onClick={handleExpelButtonClick} />
        </DeanTooltip>,
        <DeanTooltip title="Редактировать информацию" key='edit'>
            <Edit htmlColor={EDIT_BUTTON_COLOR} classes={actionIconClasses} onClick={handleEditButtonClick}/>
        </DeanTooltip>,
        <DeanTooltip title="Перевести в другую группу" key='transfer'>
            <ArrowForward htmlColor={theme.palette.primary.main} classes={actionIconClasses}/>
        </DeanTooltip>
    ]

    let cardText = `${fullName}, №${gradebookNumber}`
    if (studentExpelReason) cardText += ` Отчислен по причине: "${studentExpelReason}"`

    return (
        <>
            <StudentCard
                text={cardText}
                actions={actions}
                textClass={styles.studentName}
            />

            <DialogModal
                open={openExpelStudentModal}
                title={`Отчислить студента ${fullName}`}
                text="Укажите причину отчисления студента:"
                confirmButtonText="Отчислить"
                closeButtonText="Отмена"
                id="expel-student-modal"
                onClose={() => setOpenExpelStudentModal(false)}
                onConfirm={handleStudentExpel}
            >
                { ExpelReasonInput }
            </DialogModal>
            <DialogModal
                open={openEditStudentModal}
                title={`Изменить данные студента ${fullName}`}
                text="Введите новые данные студента:"
                confirmButtonText="Сохранить"
                closeButtonText="Отмена"
                id="edit-student-modal"
                onClose={() => setOpenEditStudentModal(false)}
                onConfirm={handleStudentEdit}
            >
                {createInputForName('first', newStudentName, handleNewNameChange)}
                {createInputForName('last', newStudentLastName, handleNewLastNameChange)}
                {createInputForName('middle', newStudentMiddleName, handleNewMiddleNameChange)}
            </DialogModal>
            <Snackbar
                open={showSuccessStudentExpelSnackbar}
                autoHideDuration={3500}
                onClose={() => setShowSuccessStudentExpelSnackbar(false)}
            >
                <SnackbarContent
                    message={`Студент ${fullName} был успешно отчислен по причине: ${expelReason}`}
                />
            </Snackbar>
        </>
    )
}
