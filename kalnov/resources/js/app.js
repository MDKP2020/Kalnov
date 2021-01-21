import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import { GroupPicker } from "./components/group/GroupPicker";
import {Header} from "./components/ui/Header";
import {makeStyles, MuiThemeProvider} from '@material-ui/core';
import {theme} from "./theme";
import '../css/app.css';
import {Navigation} from "./components/Navigation";
import {NewMajor} from "./components/major/NewMajor";

const useStyles = makeStyles({
    root: {
        fontFamily: 'Roboto'
    },
})

export const App = () => {
    const styles = useStyles()

    return (
        <MuiThemeProvider theme={theme}>
            <div className={styles.root}>
                <Router>
                    <Header/>
                    <Switch>
                        <Route path="/" exact>
                            <Navigation />
                        </Route>
                        <Route path="/groups">
                            <GroupPicker/>
                        </Route>
                        <Route path="/majors">
                            <NewMajor />
                        </Route>
                    </Switch>
                </Router>
            </div>
        </MuiThemeProvider>
    )
}

ReactDOM.render(<App/>, document.getElementById('root'))
