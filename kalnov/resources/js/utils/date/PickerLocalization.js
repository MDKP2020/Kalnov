import React from 'react'
import { format } from 'date-fns'
import ruLocale from 'date-fns/locale/ru'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'

class RuLocalizedUtils extends DateFnsUtils {
    getCalendarHeaderText(date) {
        return format(date, 'LLLL', { locale: ruLocale })
    }

    getDatePickerHeaderText(date) {
        return format(date, 'dd MMMM', { locale: ruLocale })
    }
}

export const PickerLocalization = ({ children }) => (
    <MuiPickersUtilsProvider utils={RuLocalizedUtils} locale={ruLocale}>
        {children}
    </MuiPickersUtilsProvider>
)
