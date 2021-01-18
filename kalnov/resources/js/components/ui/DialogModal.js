import React from 'react'
import {Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText} from "@material-ui/core";
import {DeanButton} from "./DeanButton";

export const DialogModal = ({ id, open, title, text, children, onClose, onConfirm, closeButtonText, confirmButtonText, ...dialogProps }) => {
    return (
        <Dialog aria-labelledby={id} open={open} onClose={onClose} {...dialogProps}>
            <DialogTitle id={id}>{ title }</DialogTitle>
            <DialogContent>
                <DialogContentText>{ text }</DialogContentText>
                { children }
            </DialogContent>
            <DialogActions>
                <DeanButton onClick={onClose}>{closeButtonText}</DeanButton>
                <DeanButton onClick={onConfirm}>{confirmButtonText}</DeanButton>
            </DialogActions>
        </Dialog>
    )
}
