import React from 'react'
import {makeStyles, useTheme} from "@material-ui/core";

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
    cardText: {
        color: theme.palette.text.main
    },
    actions: {
        display: 'flex'
    },
}))

export const StudentCard = ({ actions, text }) => {

    const theme = useTheme()
    const styles = useStyles()

    return (
        <div className={styles.card}>
            <span className={styles.cardText}>{text}</span>
            <div className={styles.actions}>
                {actions}
            </div>
        </div>
    )
}
