import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import { GroupList } from "./components/group/GroupList";
import {Header} from "./components/ui/Header";
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        fontFamily: 'Roboto'
    }
})

export const App = (props) => {
    const styles = useStyles()

    return (
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
    )
}

ReactDOM.render(<App/>, document.getElementById('root'))
