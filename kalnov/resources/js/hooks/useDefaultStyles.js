import {makeStyles} from "@material-ui/core";

export const useDefaultStyles = makeStyles(theme => ({
    chooseLabel: {
        fontSize: '1.4rem',
        marginBottom: '1rem',
        display: 'block'
    },
    tooltip: {
        arrow: {
            backgroundColor: theme.palette.primary.main,
            color: 'white'
        }
    }
}))
