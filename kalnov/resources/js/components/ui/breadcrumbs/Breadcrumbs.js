import React from "react";
import {makeStyles, useTheme} from "@material-ui/core";
import {Breadcrumb} from "./Breadcrumb";
import { withBreadcrumbs } from "../../../breadcrumbs/withBreadcrumbs";
import {routes} from "../../../breadcrumbs/routes";

const useStyles = makeStyles(theme => ({
    breadcrumbsContainer: {

    }
}))

const BreadcrumbsPanel = (props) => {
    const styles = useStyles(useTheme())

    const { breadcrumbs } = props

    return (
        <div className={styles.breadcrumbsContainer}>
            { breadcrumbs.map((breadcrumb, index) => {
                return (
                    <Breadcrumb
                        label={breadcrumb.breadcrumb}
                        link={breadcrumb.path}
                        key={breadcrumb.path}
                        isCurrent={index === breadcrumbs.length - 1}
                    />
                )
            }) }
        </div>
    )
}

export const Breadcrumbs = withBreadcrumbs(routes)(BreadcrumbsPanel)
