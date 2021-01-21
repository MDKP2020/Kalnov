import React from 'react';
import { makeStyles, Link } from "@material-ui/core";
import {useHistory} from "react-router";

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        '& > h3:not(:first-of-type)': {
            marginTop: '16px',
        },
        '& > h3': {
            cursor: 'pointer',
        },
        padding: '42px 60px',
    },
})

export const Navigation = () => {
    const styles = useStyles()
    const history = useHistory()

    // Navigation links
    const groupLink = '/groups'
    const majorsLink = '/majors'

    // Links handlers
    const openGroupsPage = () => {
        history.push(groupLink)
    }

    const openMajorsPage = () => {
        history.push(majorsLink)
    }

    return (
        <div className={styles.container}>
            <Link component="h3" onClick={openGroupsPage}>Работа со студентами</Link>
            <Link component="h3" onClick={openMajorsPage}>Создание специальности</Link>
        </div>
    )
}
