export const NewError = {
    invalidField: (code: Number, message: String) => {
        return {
            name: 'InvalidField',
            statusCode: code,
            message: message
        }
    },
    unauthorized:  (code: Number, message: String) => {
        return {
            name: 'unauthorized',
            statusCode: code,
            message: message
        }
    },
}