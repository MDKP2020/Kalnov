import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import {useHistory} from "react-router";
import {makeStyles, useTheme, TextField} from "@material-ui/core";
import {useDefaultStyles} from "../../hooks/useDefaultStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import {DeanButton} from "../ui/DeanButton";
import {DialogModal} from "../ui/DialogModal";

const useStyles = makeStyles({
    container: {
        padding: '20px 0px'
    },
    yearContainer: {
        paddingLeft: "15px",
        marginBottom: '3rem'
    },
    year: {
        display: 'block',
        padding: '0.5rem 0',
        cursor: 'pointer'
    },
    loaderContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '4rem'
    }
})

export const YearPicker = (props) => {

    const [years, setYears] = useState([])
    const [yearsAreLoaded, setYearsLoaded] = useState(false)
    const [createYearModalIsOpen, setCreateYearModalOpen] = useState(false)
    const [yearStart, setYearStart] = useState('')

    const styles = useStyles()
    const defaultStyles = useDefaultStyles(useTheme())

    const fetchYears = () => {
        axios.get('/years').then(yearsList => {
            setYears(yearsList.data)
            setYearsLoaded(true)
        })
    }

    useEffect(fetchYears, [])

    const history = useHistory()

    const handleYearClick = (year) => {
        history.push(`/groups/${year}`)
    }

    const handleYearCreate = () => {
        axios.post('/years', {
            start: yearStart
        }).then(() => {
            fetchYears()
        })
        setCreateYearModalOpen(false)
    }

    const handleAddYearButtonClick = () => {
        setCreateYearModalOpen(true)
    }

    const handleYearStartChange = (event) => {
        setYearStart(event.target.value)
    }

    const YearStartInput = (
        <TextField
            value={yearStart}
            onChange={handleYearStartChange}
            label='Начало уч. года'
            placeholder='ГГГГ-ММ-дд'
        />
    )

    const YearsList = years.map(year => {
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
        })

    let pickerContent;
    if(!yearsAreLoaded)
        pickerContent = <div className={styles.loaderContainer}><CircularProgress/></div>
    else
        pickerContent = years.length > 0 ? YearsList: <span className={defaultStyles.errorMessage}>Годов обучения ещё нет</span>

    return (
        <div className={styles.container}>
            <span className={defaultStyles.chooseLabel}>Выберите год обучения: </span>
            <div className={styles.yearContainer}>
                { pickerContent }
            </div>

            <DeanButton primary onClick={handleAddYearButtonClick}>Добавить год обучения</DeanButton>
            <DialogModal
                open={createYearModalIsOpen}
                title='Добавить новый год обучения'
                text='Введите дату начала года обучения в формате ГГГГ-ММ-дд'
                buttonText='Создать'
                id='create-year-modal'
                onClose={handleYearCreate}
            >{ YearStartInput }</DialogModal>
        </div>
    )
}
