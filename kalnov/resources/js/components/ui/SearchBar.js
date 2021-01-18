import React, {useEffect, useState} from 'react'
import {useTheme, Input, InputLabel, makeStyles, FormControl, InputAdornment} from "@material-ui/core";
import {Search} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    searchField: {
        width: '100%',
        marginBottom: '1rem'
    }
}))

export const SearchBar = ({ queryParamName, queryFunction }) => {
    const theme = useTheme()
    const styles = useStyles(theme)

    const [query, setQuery] = useState("")

    useEffect(() => {
        queryFunction(query)
    }, [query])

    const handleQueryChange = (event) => {
        setQuery(event.target.value)
    }

    const SEARCH_NAME = `search-${queryParamName}`

    return (
        <div>
            <FormControl variant="standard" size="small" className={styles.searchField}>
                <InputLabel htmlFor={SEARCH_NAME}>Поиск</InputLabel>
                <Input
                    id={SEARCH_NAME}
                    onChange={handleQueryChange}
                    value={ query }
                    endAdornment={
                        <InputAdornment position="end">
                            <Search htmlColor={theme.palette.primary.main}/>
                        </InputAdornment>
                    }
                />
            </FormControl>
        </div>
    )
}
