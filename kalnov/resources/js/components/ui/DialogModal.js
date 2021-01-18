import React from 'react'
import {Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText} from "@material-ui/core";
import {DeanButton} from "./DeanButton";

export const DialogModal = ({ id, open, title, text, children, onClose, buttonText, ...dialogProps }) => {
    return (
        <Dialog aria-labelledby={id} open={open} onClose={onClose} {...dialogProps}>
            <DialogTitle id={id}>{ title }</DialogTitle>
            <DialogContent>
                <DialogContentText>{ text }</DialogContentText>
                { children }
            </DialogContent>
            <DialogActions>
                <DeanButton primary onClick={onClose}>{buttonText}</DeanButton>
            </DialogActions>
        </Dialog>
    )
}
