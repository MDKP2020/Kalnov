import React from 'react';

import { makeStyles, useTheme } from "@material-ui/core";
import { useHistory } from "react-router";
import {ChevronRight} from "@material-ui/icons";
import {NavLink} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    breadcrumb: {
        color: theme.palette.text.light,
        fontSize: '12px'
    },
    clickable: {
        cursor: 'pointer',
        fontWeight: 700,
    },
    breadcrumbDivider: {
        color: theme.palette.text.light
    }
}))

export const Breadcrumb = ({ label, link, isCurrent }) => {
    const styles = useStyles(useTheme())

    const BreadcrumbText = <span className={styles.breadcrumb}>{ label }</span>

    const ClickableBreadcrumb = (
        <div>
            <NavLink to={link}>{ BreadcrumbText }</NavLink>
            <ChevronRight className={styles.breadcrumbDivider}/>
        </div>
    )

    return isCurrent ? BreadcrumbText : ClickableBreadcrumb

}
