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

export const Student = ({ name, id, gradebookNumber, groupId, expelReason: studentExpelReason }) => {
    const theme = useTheme()
    const styles = useStyles({ isExpel: studentExpelReason !== null })

    const [openExpelStudentModal, setOpenExpelStudentModal] = useState(false)
    const [expelReason, setExpelReason] = useState('')
    const [showSuccessStudentExpelSnackbar, setShowSuccessStudentExpelSnackbar] = useState(false)

    const EDIT_BUTTON_COLOR = '#e6b710'

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
        })
    }

    const handleExpelButtonClick = () => {
        setOpenExpelStudentModal(true)
    }

    const handleEditButtonClick = () => {

    }

    const handleTransferButtonClick = () => {

    }

    const actionIconClasses = { root: styles.actionIcon }

    const actions = [
        <DeanTooltip title="Отчислить студента" key='expel'>
            <Cancel htmlColor={theme.palette.error.main} classes={actionIconClasses} onClick={handleExpelButtonClick} />
        </DeanTooltip>,
        <DeanTooltip title="Редактировать информацию" key='edit'>
            <Edit htmlColor={EDIT_BUTTON_COLOR} classes={actionIconClasses}/>
        </DeanTooltip>,
        <DeanTooltip title="Перевести в другую группу" key='transfer'>
            <ArrowForward htmlColor={theme.palette.primary.main} classes={actionIconClasses}/>
        </DeanTooltip>
    ]

    let cardText = `${name}, №${gradebookNumber}`
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
                title={`Отчислить студента ${name}`}
                text="Укажите причину отчисления студента"
                confirmButtonText="Отчислить"
                closeButtonText="Отмена"
                id="expel-student-modal"
                onClose={() => setOpenExpelStudentModal(false)}
                onConfirm={handleStudentExpel}
            >
                { ExpelReasonInput }
            </DialogModal>
            <Snackbar
                open={showSuccessStudentExpelSnackbar}
                autoHideDuration={3500}
                onClose={() => setShowSuccessStudentExpelSnackbar(false)}
            >
                <SnackbarContent
                    message={`Студент ${name} был успешно отчислен по причине: ${expelReason}`}
                />
            </Snackbar>
        </>
    )
}
