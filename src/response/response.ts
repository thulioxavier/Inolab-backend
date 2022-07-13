export const Data = {
    responseData: (code: Number, data: Object | Array<Object>) => {
        return {
            statusCode: code,
            status: true,
            message: 'Success',
            data: data,
        }
    }
}