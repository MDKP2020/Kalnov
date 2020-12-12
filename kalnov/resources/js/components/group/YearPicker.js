import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import {useHistory} from "react-router";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    container: {
        padding: '20px 0px'
    },
    yearContainer: {
        paddingLeft: "15px"
    },
    year: {
        display: 'block',
        padding: '0.5rem 0',
        cursor: 'pointer'
    },
    chooseYearLabel: {
        fontSize: '1.5rem',
        marginBottom: '1rem',
        display: 'block'
    }
})

export const YearPicker = (props) => {

    const [ years, setYears ] = useState([])
    const styles = useStyles()

    useEffect(() => {
        axios.get('/years').then(yearsList => {
            setYears(yearsList.data)
        })
    }, [])

    const history = useHistory()

    const handleYearClick = (year) => {
        history.push(`/groups/${year}`)
    }

    return (
        <div className={styles.container}>
            <span className={styles.chooseYearLabel}>Выберите год обучения: </span>
            <div className={styles.yearContainer}>
                { years.map(year => {
                    const date = new Date(year.start)
                    const currentYear = date.getFullYear()
                    const nextYear = date.getFullYear() + 1

                    return <span
                        key={currentYear}
                        onClick={() => handleYearClick(currentYear)}
                        className={styles.year}
                    >
                    { `${currentYear} - ${nextYear}` }
                </span>
                })}
            </div>
        </div>
    )
}
