import React from 'react'
import {Button, makeStyles, useTheme} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    root: {
        padding: '4px 16px', // change default padding for the button
        fontWeight: 500, // default font-weight
        maxWidth: '50%',
        textTransform: 'none'
    },
    primary: {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark
        }
    },
    secondary: {
        backgroundColor: theme.palette.background.main,
        color: 'black',
        '&:hover': {
            backgroundColor: theme.palette.background.dark
        }
    }
}))

export const DeanButton = ({ primary, secondary, error, children, className }) => {

    const styles = useStyles(useTheme())
    const classes = { root: styles.root }

    const buttonClasses = []
    if(primary)
        buttonClasses.push(styles.primary)
    else if(secondary)
        buttonClasses.push(styles.secondary)

    buttonClasses.push(className)

    return (<Button
        variant='contained'
        disableElevation
        classes={classes}
        className={buttonClasses.join(' ')}
    >{ children }</Button>)
}
