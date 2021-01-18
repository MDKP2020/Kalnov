import React from 'react';

import {makeStyles, Typography, useTheme} from "@material-ui/core";
import { useHistory } from "react-router";
import {ChevronRight} from "@material-ui/icons";
import {NavLink} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    breadcrumb: {
        color: theme.palette.text.light,
        fontSize: '13px',
        fontWeight: 700,
    },
    breadcrumbDivider: {
        color: theme.palette.text.light
    },
    breadcrumbContainer: {
        display: 'flex',
        alignItems: 'center'
    }
}))

export const Breadcrumb = ({ label, link, isCurrent }) => {
    const styles = useStyles(useTheme())

    const BreadcrumbText = <Typography color='textSecondary' className={styles.breadcrumb}>{ label }</Typography>

    const ClickableBreadcrumb = (
        <>
            <NavLink to={link}>{ BreadcrumbText }</NavLink>
            <ChevronRight className={styles.breadcrumbDivider}/>
        </>
    )

    return isCurrent ? BreadcrumbText : ClickableBreadcrumb

}
