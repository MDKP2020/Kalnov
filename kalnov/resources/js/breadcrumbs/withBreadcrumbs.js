import React from 'react';
import { matchPath, withRouter } from 'react-router';

const renderBreadcrumb = (breadcrumb, match) => {
    if(typeof breadcrumb === 'function')
        return breadcrumb(match)
    else
        return breadcrumb;
}

const getBreadcrumbsForCurrentPath = ({ routes, currentPath }) => {
    const pathSections = currentPath
        .replace(/\/$/, '') // удаление последнего слэша
        .replace(/^\//, '') // удаление лидирующего слэша
        .split('/'); // части пути

    const matches = [];
    console.log(pathSections)

    pathSections.reduce((url, section) => {
        const path = url + '/' + section;
        console.log(path)

        routes.some(route => {
            const match = matchPath(path, { path: route.path, exact: true })
            if(match !== null) {

                matches.push({
                    breadcrumb: renderBreadcrumb(route.breadcrumb, match),
                    path: match.url,
                    match
                })

                return true;
            }
            else return false;
        })

        return path;
    }, '')

    return matches; // [ { breadcrumb, path, match }, ... ]
}

// routes - массив объектов, обозначающих страницу на сайте, тип: { path, breadcrumb }, path - URL страницы, breadcrumb - название страницы
export const withBreadcrumbs = routes => Component => {
    const ComponentWithBreadcrumbs = (props) => {
        return <Component
            {...props}
            breadcrumbs={
                getBreadcrumbsForCurrentPath({ routes, currentPath: props.location.pathname})
            }
        />
    }

    return withRouter(ComponentWithBreadcrumbs)
}
