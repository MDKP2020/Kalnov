import React from 'react';

import { makeStyles, useTheme } from "@material-ui/core";
import { useHistory } from "react-router";
import {ChevronRight} from "@material-ui/icons";

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

    const history = useHistory()

    const handleBreadcrumbClick = () => {
        history.push(link)
    }

    const BreadcrumbText = <span className={styles.breadcrumb}>{ label }</span>

    const ClickableBreadcrumb = (
        <div>
            <span className={styles.clickable} onClick={handleBreadcrumbClick}>{ BreadcrumbText }</span>
            <ChevronRight className={styles.breadcrumbDivider}/>
        </div>
    )

    return isCurrent ? <BreadcrumbText/> : <ClickableBreadcrumb/>

}
