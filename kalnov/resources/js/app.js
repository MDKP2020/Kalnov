import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import { GroupList } from "./components/group/GroupList";
import {Header} from "./components/ui/Header";
import {makeStyles, MuiThemeProvider} from '@material-ui/core';
import {theme} from "./theme";

const useStyles = makeStyles({
    root: {
        fontFamily: 'Roboto'
    }
})

export const App = (props) => {
    const styles = useStyles()

    return (
        <MuiThemeProvider theme={theme}>
            <div className={styles.root}>
                <Router>
                    <Header/>
                    <Switch>
                        <Route exact path="/groups">
                            <GroupList/>
                        </Route>
                    </Switch>
                </Router>
            </div>
        </MuiThemeProvider>
    )
}

ReactDOM.render(<App/>, document.getElementById('root'))
