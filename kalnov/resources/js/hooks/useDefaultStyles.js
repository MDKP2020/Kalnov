import {makeStyles} from "@material-ui/core";

export const useDefaultStyles = makeStyles(theme => ({
    chooseLabel: {
        fontSize: '1.4rem',
        marginBottom: '1rem',
        display: 'block'
    },
    errorMessage: {
        color: theme.palette.error.main,
        fontSize: '1.2rem',
        display: 'block'
    },
    centeredContentContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
}))
