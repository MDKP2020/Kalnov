import React, {useEffect, useState} from 'react'
import {makeStyles, useTheme} from "@material-ui/core"
import axios from "../../axios";
import {useHistory, useParams} from "react-router";
import {useDefaultStyles} from "../../hooks/useDefaultStyles";

const useStyles = makeStyles(theme => ({
    groupContainer: {
        paddingLeft: '15px'
    },
    majorContainer: {
        display: 'flex'
    },
    group: {
        cursor: 'pointer'
    }
}))

export const GroupList = () => {
    const theme = useTheme()

    const styles = useStyles(theme)
    const defaultStyles = useDefaultStyles(theme)
    const history = useHistory()

    const [groups, setGroups] = useState({})
    const { year, studyYear, studyYearType } = useParams()

    const handleGroupClick = (groupNumber, id) => {
        history.push(`${history.location.pathname}/${groupNumber}`, {
            groupId: id
        })
        console.log(history)
    }


    useEffect(() => {
        axios.get('/groups', {
            params: {
                year, studyYear, studyYearType
            }
        }).then(groups => {
            console.log(groups)
            setGroups(groups.data)
        })
    }, [year, studyYear, studyYearType])

    const majors = Object.keys(groups)

    return (
        <div>
            <span className={defaultStyles.chooseLabel}>Выберите группу</span>
            <div className={styles.groupContainer}>
                {
                    majors.map(major => {
                        return (
                            <div className={styles.majorContainer} key={major}>
                                {groups[major].map(group => {
                                    const groupNumber = `${group['study_year']}${group.number}`
                                    const groupName = `${group.name}-${groupNumber}`
                                    return (
                                        <span
                                            key={groupName}
                                            className={styles.group}
                                            onClick={() => handleGroupClick(group.number, group.id)}
                                        >
                                        {groupName}
                                    </span>
                                    )
                                })}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
