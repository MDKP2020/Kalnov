import { SnackbarContent, withStyles } from "@material-ui/core";

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.error.dark,
    },
})

export const ErrorSnackbarContent = withStyles(styles)(SnackbarContent)
