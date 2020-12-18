import React from 'react'
import { Button } from '@material-ui/core'

export const DeanButton = ({ primary, secondary, error, children }) => {
    return (<Button
        variant='contained'
        disableElevation
    >{ children }</Button>)
}
