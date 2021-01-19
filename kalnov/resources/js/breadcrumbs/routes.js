export const routes = [
    {
        path: '/groups/:year',
        breadcrumb: (match) => {
            return `${match.params.year} - ${Number.parseInt(match.params.year) + 1}`
        }
    },
    {
        path: '/groups',
        breadcrumb: 'Группы'
    },
    {
        path: '/groups/:year/:studyType/:studyYear',
        breadcrumb: match => {
            let studyType;
            if(match.params.studyType === 'bachelor')
                studyType = 'Бакалавриат'
            else if(match.params.studyType === 'master')
                studyType = 'Магистратура'

            return `${studyType}, ${match.params.studyYear} курс`
        }
    },
    {
        path: '/groups/:year/:studyType/:studyYear/newGroup',
        breadcrumb: match => 'Новая группа',
    },
    {
        path: '/groups/:year/:studyType/:studyYear/:number',
        breadcrumb: match => `${match.params.studyYear}${match.params.number}`
    },
]
