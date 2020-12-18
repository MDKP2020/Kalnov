import React from 'react'
import {useTheme} from "@material-ui/core";
import ExpelIcon from '../../../../img/icons/close-icon.svg'
import EditIcon from '../../../../img/icons/edit-icon.svg'
import TransferIcon from '../../../../img/icons/transfer-icon.svg'

const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
        border: `1px solid ${theme.palette.background.main}`,
        borderRadius: 10,
        width: '100%',
        padding: '16px 20px',
        justifyContent: 'space-between'
    },
    name: {
        color: theme.palette.text.light
    },
    actions: {
        display: 'flex'
    }
}))

export const StudentCard = ({ name, id }) => {
    const styles = useStyles(useTheme())

    const handleExpelButtonClick = () => {

    }

    const handleEditButtonClick = () => {

    }

    const handleTransferButtonClick = () => {

    }

    return (
        <div className={styles.card}>
            <span className={styles.name}>{name}</span>
            <div className={styles.actions}>
                <img onClick={handleExpelButtonClick} src={ExpelIcon} alt="Отчислить"/>
                <img onClick={handleEditButtonClick} src={EditIcon} alt="Редактировать"/>
                <img onClick={handleTransferButtonClick} src={TransferIcon} alt="Перевести"/>
            </div>
        </div>
    )
}
