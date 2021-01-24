import { SnackbarContent, withStyles } from "@material-ui/core";

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.warning.main
    },
})

export const WarningSnackbarContent = withStyles(styles)(SnackbarContent)
