import React from 'react'
import {makeStyles, Tooltip, useTheme} from "@material-ui/core";

const useTooltipStyles = makeStyles(theme => ({
    arrow: {
        color: theme.palette.primary.dark
    },
    tooltip: {
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
        fontSize: '0.7rem',
        padding: '6px 10px'
    }
}))

export const DeanTooltip = (props) => {
    const styles = useTooltipStyles(useTheme())

    const tooltipClasses = {
        tooltip: styles.tooltip,
        arrow: styles.arrow
    }

    return (
        <Tooltip arrow classes={tooltipClasses} {...props}>
            {props.children}
        </Tooltip>
    )
}
