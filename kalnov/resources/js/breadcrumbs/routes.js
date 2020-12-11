export const routes = [
    {
        path: '/groups/:year',
        breadcrumb: (match) => {
            return `${match.params.year} - ${match.params.year + 1}`
        }
    }
]
