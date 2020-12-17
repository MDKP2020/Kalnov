import React from 'react'
import {useTheme} from "@material-ui/core";

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

export const StudentCard = ({ name,  }) => {
    const styles = useStyles(useTheme())

    return (
        <div className={styles.card}>
            <span className={styles.name}>{name}</span>
            <div className={styles.actions}>
                { /* TODO: иконки действий */ }
            </div>
        </div>
    )
}