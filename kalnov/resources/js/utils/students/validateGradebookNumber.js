const NUMBER_PATTERN = /^\d{8}$/i

export const validateGradebookNumber = (number) => {
    return number.match(NUMBER_PATTERN) !== null
}
