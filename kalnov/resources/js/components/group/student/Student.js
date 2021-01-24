import React, {useState} from 'react'
import {
    useTheme,
    makeStyles,
    FormControl,
    TextField,
    SnackbarContent,
    Snackbar,
    Select,
    MenuItem, InputLabel
} from "@material-ui/core";
import {ArrowForward, Cancel, Edit} from "@material-ui/icons";
import {DeanTooltip} from "../../ui/DeanTooltip";
import {StudentCard} from "./StudentCard";
import axios from "../../../axios";
import {DialogModal} from "../../ui/DialogModal";
import {ErrorSnackbarContent} from "../../ui/ErrorSnackbarContent";

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
    nameInputs: {
        display: 'flex',
        flexDirection: 'column',
        '& > div:not(:first-of-type)': {
            marginTop: '1.5rem',
        },
    },
    disabled: {
        pointerEvents: 'none',
        color: 'gray',
    },
    selectGroups: {
        display: 'flex',
        width: '80%',
    },
    formControl: {
        display: 'flex',
        width: '100%',
    },
}))

export const Student = ({ id, gradebookNumber, groupId, expelReason: studentExpelReason, lastName, middleName, name, onUpdate }) => {
    const theme = useTheme()
    const styles = useStyles({ isExpel: studentExpelReason !== null })

    const [openExpelStudentModal, setOpenExpelStudentModal] = useState(false)
    const [expelReason, setExpelReason] = useState('')
    const [showSuccessStudentExpelSnackbar, setShowSuccessStudentExpelSnackbar] = useState(false)

    const [openEditStudentModal, setOpenEditStudentModal] = useState(false)
    const [newStudentName, setNewStudentName] = useState(name)
    const [newStudentMiddleName, setNewStudentMiddleName] = useState(middleName)
    const [newStudentLastName, setNewStudentLastName] = useState(lastName)

    const [openTransferStudentModal, setOpenTransferStudentModal] = useState(false)
    const [newGroup, setNewGroup] = useState('')
    const [newGroupFullName, setNewGroupFullName] = useState('')
    const [newGroupId, setNewGroupId] = useState('')
    const [successTransferSnackbarOpen, setSuccessTransferSnackbarOpen] = useState(false)
    const [failureTransferSnackbarOpen, setFailureTransferSnackbarOpen] = useState(false)
    const [failureTransferGroupsLoadSnackbarOpen, setFailureTransferGroupsLoadSnackbarOpen] = useState(false)
    const [groupsForTransferTo, setGroupsForTransferTo] = useState([])
    const [areGroupsForTransferToLoaded, setAreGroupsForTransferToLoaded] = useState(false)

    const EDIT_BUTTON_COLOR = '#e6b710'

    const fullName = `${lastName} ${name} ${middleName}`

    const handleNewNameChange = (event) => {
        setNewStudentName(event.target.value)
    }

    const handleNewMiddleNameChange = (event) => {
        setNewStudentMiddleName(event.target.value)
    }

    const handleNewLastNameChange = (event) => {
        setNewStudentLastName(event.target.value)
    }

    const handleGroupChange = (event) => {
        const groupIdAndName = event.target.value
        const idAndNameBorderIndex = groupIdAndName.indexOf('/')
        const groupId = groupIdAndName.slice(0, idAndNameBorderIndex)
        const groupFullName = groupIdAndName.slice(idAndNameBorderIndex + 1)
        setNewGroup(event.target.value)
        setNewGroupId(groupId)
        setNewGroupFullName(groupFullName)
    }

    const fetchGroupsForTransferTo = () => {
        axios.get(`/groups/${groupId}/transferTo`).then(response => {
            setGroupsForTransferTo(response.data)
            const firstGroup = response.data[0]
            const firstGroupFullName = `${firstGroup.id}/${firstGroup.acronym}-${firstGroup['study_year']}${firstGroup.number}`
            setNewGroup(firstGroupFullName)
            setNewGroupId(firstGroup.id)
            setNewGroupFullName(firstGroupFullName)
            setAreGroupsForTransferToLoaded(true)
        }).catch(error => {
            console.log(error)
        })
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

    const handleStudentEdit = () => {
        const newStudentData = {}
        if (newStudentName !== name) newStudentData.firstName = newStudentName
        if (newStudentLastName !== lastName) newStudentData.lastName = newStudentLastName
        if (newStudentMiddleName !== middleName) newStudentData.middleName = newStudentMiddleName
        axios.patch(`/students/${id}/edit`, {
            ...newStudentData
        }).then(response => {
            setOpenEditStudentModal(false)
            onUpdate()
        })
    }

    const handleStudentTransfer = () => {
        console.log('New group ID: ', newGroupId)
        axios.patch(`/students/${id}/transfer`, {
            previousGroupId: groupId,
            newGroupId: newGroupId,
        }).then(response => {
            setSuccessTransferSnackbarOpen(true)
            setOpenTransferStudentModal(false)
            onUpdate()
        }).catch(error => {
            setFailureTransferSnackbarOpen(true)
        })
    }

    const handleExpelButtonClick = () => {
        setOpenExpelStudentModal(true)
    }

    const handleEditButtonClick = () => {
        setOpenEditStudentModal(true)
    }

    const handleTransferButtonClick = async () => {
        try {
            await fetchGroupsForTransferTo()
            setOpenTransferStudentModal(true)
        } catch (error) {
            setFailureTransferGroupsLoadSnackbarOpen(true)
        }

    }

    const iconClasses = [styles.actionIcon]
    if(studentExpelReason !== null) {
        iconClasses.push(styles.disabled)
    }

    const actionIconClasses = { root: iconClasses.join(' ') }

    const actions = [
        <DeanTooltip title="Отчислить студента" key='expel'>
            <Cancel htmlColor={theme.palette.error.main} classes={actionIconClasses} onClick={handleExpelButtonClick} />
        </DeanTooltip>,
        <DeanTooltip title="Редактировать информацию" key='edit'>
            <Edit htmlColor={EDIT_BUTTON_COLOR} classes={actionIconClasses} onClick={handleEditButtonClick}/>
        </DeanTooltip>,
        <DeanTooltip title="Перевести в другую группу" key='transfer' onClick={handleTransferButtonClick}>
            <ArrowForward htmlColor={theme.palette.primary.main} classes={actionIconClasses}/>
        </DeanTooltip>
    ]

    let cardText = `${fullName}, №${gradebookNumber}`
    if (studentExpelReason) cardText += ` Отчислен по причине: "${studentExpelReason}"`

    const GroupsSelect = (
        <FormControl className={styles.formControl}>
            <InputLabel htmlFor="select-new-group-for-student">Новая группа для перевода</InputLabel>
            <Select
                inputProps={{ id: 'select-new-group-for-student' }}
                value={newGroup}
                onChange={handleGroupChange}
            >
                {groupsForTransferTo.map(group => {
                    const groupFullName = `${group.acronym}-${group['study_year']}${group.number}`
                    return (
                        <MenuItem key={group.id} value={`${group.id}/${groupFullName}`}>
                            {groupFullName}
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )

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
                id={`edit-student-${id}-modal`}
                onClose={() => setOpenEditStudentModal(false)}
                onConfirm={handleStudentEdit}
            >
                <div className={styles.nameInputs}>
                    {createInputForName('first', newStudentName, handleNewNameChange)}
                    {createInputForName('last', newStudentLastName, handleNewLastNameChange)}
                    {createInputForName('middle', newStudentMiddleName, handleNewMiddleNameChange)}
                </div>
            </DialogModal>
            <DialogModal
                maxWidth='md'
                fullWidth
                open={openTransferStudentModal}
                title={`Перевести студента ${fullName} в другую группу`}
                text="Выберите новую группу:"
                confirmButtonText="Перевести"
                closeButtonText="Отмена"
                id={`transfer-student-${id}-to-new-group`}
                onClose={() => setOpenTransferStudentModal(false)}
                onConfirm={handleStudentTransfer}
            >
                <div className={styles.selectGroups}>
                    {GroupsSelect}
                </div>
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

            <Snackbar open={failureTransferGroupsLoadSnackbarOpen} autoHideDuration={4500} onClose={() => setFailureTransferGroupsLoadSnackbarOpen(false)}>
                <ErrorSnackbarContent message="При загрузке групп для перевода произошла ошибка" />
            </Snackbar>

            <Snackbar open={successTransferSnackbarOpen} autoHideDuration={3500} onClose={() => setSuccessTransferSnackbarOpen(false)}>
                <SnackbarContent message={`Студент ${fullName} был успешно переведён в группу ${newGroupFullName}`} />
            </Snackbar>

            <Snackbar open={failureTransferSnackbarOpen} autoHideDuration={4500} onClose={() => setFailureTransferSnackbarOpen(false)}>
                <ErrorSnackbarContent message="При переводе студента в другую группу произошла ошибка" />
            </Snackbar>
        </>
    )
}
