export const STUDENT_NAME_VALIDATION_MESSAGES = {
    valid: '',
    empty: 'ФИО студента не может быть пустым',
    invalidName: 'Укажите фамилию, имя и отчество студента'
}

const NAME_PATTERN = /^[а-яА-Я]+ [а-яА-Я]+ [а-яА-Я]+$/i
const EMPTY_STRING_PATTERN = /^\s*$/

export const validateStudentName = (name) => {
    if(name.match(EMPTY_STRING_PATTERN))
        return STUDENT_NAME_VALIDATION_MESSAGES.empty;
    else if(!name.match(NAME_PATTERN))
        return STUDENT_NAME_VALIDATION_MESSAGES.invalidName;
    else
        return STUDENT_NAME_VALIDATION_MESSAGES.valid;
}
