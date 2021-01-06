import React from 'react'
import {useTheme, makeStyles} from "@material-ui/core";
import ExpelIcon from '../../../../img/icons/close-icon.svg'
import EditIcon from '../../../../img/icons/edit-icon.svg'
import TransferIcon from '../../../../img/icons/transfer-icon.svg'
import {ArrowForward, Cancel, Edit} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
        border: `1px solid ${theme.palette.background.main}`,
        borderRadius: 10,
        width: '100%',
        padding: '14px 16px',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    name: {
        color: theme.palette.text.light
    },
    actions: {
        display: 'flex'
    },
    actionIcon: {
        cursor: 'pointer',
        '&:not(:first-of-type)': {
            marginLeft: '0.4rem'
        }
    }
}))

export const StudentCard = ({ name, id }) => {
    const theme = useTheme()
    const styles = useStyles(theme)

    const EDIT_BUTTON_COLOR = '#e6b710'

    const handleExpelButtonClick = () => {

    }

    const handleEditButtonClick = () => {

    }

    const handleTransferButtonClick = () => {

    }

    const actionIconClasses = { root: styles.actionIcon }

    return (
        <div className={styles.card}>
            <span className={styles.name}>{name}</span>
            <div className={styles.actions}>
                <Cancel htmlColor={theme.palette.error.main} classes={actionIconClasses} />
                <Edit htmlColor={EDIT_BUTTON_COLOR} classes={actionIconClasses}/>
                <ArrowForward htmlColor={theme.palette.primary.main} classes={actionIconClasses}/>
            </div>
        </div>
    )
}
