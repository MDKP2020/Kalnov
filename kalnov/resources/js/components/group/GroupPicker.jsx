import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import axios from '../../axios'
import {makeStyles} from "@material-ui/core";
import {Route, Switch, useLocation} from "react-router";
import {YearPicker} from "./YearPicker";
import {StudyYearPicker} from "./StudyYearPicker";
import {Group} from "./Group";
import {GroupList} from "./GroupList";
import {Breadcrumbs} from "../ui/breadcrumbs/Breadcrumbs";
import { NewGroup } from "./NewGroup";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: "20px 60px 0"
    }
}))

export const GroupPicker = (props) => {

    const styles = useStyles()
    const location = useLocation()
    console.log(location)

    return (
        <div className={styles.container}>
            <Breadcrumbs/>

            <h1>Работа со студентами</h1>
            <Switch>
                <Route path='/groups' exact>
                    <YearPicker/>
                </Route>

                <Route path="/groups/:year/:studyYearType/:studyYear/newGroup">
                    <NewGroup />
                </Route>

                <Route path='/groups/:year/:studyYearType/:studyYear/:number'>
                    <Group/>
                </Route>

                <Route path='/groups/:year/:studyYearType/:studyYear'>
                    <GroupList/>
                </Route>

                <Route path='/groups/:year'>
                    <StudyYearPicker/>
                </Route>
            </Switch>
        </div>
    )
}
