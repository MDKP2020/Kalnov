import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import axios from '../../axios'
import {makeStyles} from "@material-ui/core";
import {Route, Switch} from "react-router";
import {YearPicker} from "./YearPicker";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: ""
    }
}))

export const GroupList = (props) => {

    return (
        <div>
            <h1>Работа со студентами</h1>
            <Switch>
                <Route path='/groups'>
                    <YearPicker/>
                </Route>
            </Switch>
        </div>
    )
}
