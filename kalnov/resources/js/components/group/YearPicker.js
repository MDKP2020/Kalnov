import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import {useHistory} from "react-router";

export const YearPicker = (props) => {

    const [ years, setYears ] = useState([])

    useEffect(() => {
        axios.get('/years').then(yearsList => {
            setYears(yearsList.data)
        })
    }, [])

    const history = useHistory()

    const handleYearClick = () => {
        history.push(`/groups/${year.start}`)
    }

    return (
        <div>
            <span>Выберите год обучения: </span>
            { years.map(year => {
                const date = new Date(year.start)
                const currentYear = date.getFullYear()
                const nextYear = date.getFullYear() + 1

                return <span onClick={handleYearClick}>{ `${currentYear} - ${nextYear}` }</span>
            })}
        </div>
    )
}
