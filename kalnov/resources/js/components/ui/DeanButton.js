import React from 'react'
import {Button, makeStyles, useTheme} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    root: {
        padding: '12px 34px', // change default padding for the button
        fontWeight: 700, // default font-weight
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

export const DeanButton = (props) => {

    const styles = useStyles(useTheme())
    const classes = { root: styles.root }

    const { primary, secondary, error, children, className, ...restProps } = props

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
        {...restProps}
    >{ children }</Button>)
}
