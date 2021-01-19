import React from 'react'
import { Warning } from '@material-ui/icons'
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    warningIcon: {
        color: theme.palette.warning.main,
        width: '40px',
        height: '40px',
    },
    warningText: {
        fontSize: '1rem',
        color: theme.palette.text.gray,
        marginLeft: '1rem',
    },
    warningBlock: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '3rem',
    },
}))

export const DeanWarning = ({ text }) => {
    const styles = useStyles()

    return (
        <div className={styles.warningBlock}>
            <Warning classes={{ root: styles.warningIcon }} />
            <p className={styles.warningText}>{text}</p>
        </div>
    )
}
