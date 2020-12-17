import React, {useEffect} from 'react'
import axios from '../../axios'
import {useParams} from "react-router";

export const Group = (props) => {
    const { year, studyYear, studyYearType } = useParams()

    useEffect(() => {
        axios.get('', {
            params: {
                year, studyYear, studyYearType
            }
        })
    }, [year, studyYear, studyYearType])

    return (
        <div></div>
    )

}
