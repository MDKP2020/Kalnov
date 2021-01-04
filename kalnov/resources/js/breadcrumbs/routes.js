export const routes = [
    {
        path: '/groups/:year',
        breadcrumb: (match) => {
            return `${match.params.year} - ${Number.parseInt(match.params.year) + 1}`
        }
    }
]
