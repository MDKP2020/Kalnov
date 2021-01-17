import {createMuiTheme} from "@material-ui/core";

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#6099B9',
            dark: '#547f96'
        },
        background: {
            main: '#C4C4C4',
            light: '#9C9C9C',
            dark: '#a1a1a1'
        },
        error: {
            main: '#D31F1F'
        },
        warning: {
            main: 'FFC52F'
        },
        text: {
            main: '#202020',
            light: '#888888'
        }
    }
})
