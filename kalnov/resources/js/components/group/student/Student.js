import React, {useState} from 'react'
import {useTheme, makeStyles, FormControl, TextField} from "@material-ui/core";
import {ArrowForward, Cancel, Edit} from "@material-ui/icons";
import {DeanTooltip} from "../../ui/DeanTooltip";
import {StudentCard} from "./StudentCard";
import axios from "../../../axios";

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
        color: theme.palette.text.main
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

export const Student = ({ name, id, gradebookNumber }) => {
    const theme = useTheme()
    const styles = useStyles(theme)

    const [openExpelStudentModal, setOpenExpelStudentModal] = useState(false)
    const [expelReason, setExpelReason] = useState('')

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
        axios.post()
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
            <Cancel htmlColor={theme.palette.error.main} classes={actionIconClasses} />
        </DeanTooltip>,
        <DeanTooltip title="Редактировать информацию" key='edit'>
            <Edit htmlColor={EDIT_BUTTON_COLOR} classes={actionIconClasses}/>
        </DeanTooltip>,
        <DeanTooltip title="Перевести в другую группу" key='transfer'>
            <ArrowForward htmlColor={theme.palette.primary.main} classes={actionIconClasses}/>
        </DeanTooltip>
    ]

    return (
        <StudentCard
            text={`${name}, №${gradebookNumber}`}
            actions={actions}
        />
    )
}
