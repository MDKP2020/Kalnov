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
    disabled: {
        backgroundColor: theme.palette.background.light
    }
}))

export const StudentCard = ({ actions, text, disabled }) => {

    const theme = useTheme()
    const styles = useStyles()

    const cardStyles = [styles.card]
    if(disabled)
        cardStyles.push(styles.disabled)

    return (
        <div className={cardStyles.join(' ')}>
            <span className={styles.cardText}>{text}</span>
            <div className={styles.actions}>
                {actions}
            </div>
        </div>
    )
}
