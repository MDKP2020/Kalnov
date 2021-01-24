import React from 'react'
import { ErrorSnackbarContent } from "./ErrorSnackbarContent";
import { WarningSnackbarContent } from "./WarningSnackbarContent";
import { Snackbar, SnackbarContent } from "@material-ui/core";

export const DeanSnackbar = props => {
    const { error, warning, message, action, ...otherProps } = props

    let ContentOfSnackbarContent = <SnackbarContent message={message} action={action} /> /* По умолчанию - обычный SnackbarContent */
    if (error)
        ContentOfSnackbarContent = <ErrorSnackbarContent message={message} action={action} />
    else if (warning)
        ContentOfSnackbarContent = <WarningSnackbarContent message={message} action={action} />

    return (
        <Snackbar {...otherProps}>
            {ContentOfSnackbarContent}
        </Snackbar>
    )
}
