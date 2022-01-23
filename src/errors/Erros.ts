export const Error = {
    SelectError: async (code: string) => {
        let msg_error = '';

        switch (code) {
            case 'P1013':
                msg_error = "The provided database string is invalid. {details}"
                break;
            case 'P2002':
                msg_error = "Unique constraint failed on the {constraint}"
                break;
            default:
                msg_error = "Entre em contato com o Administrador do sistema!"
                break;
        }
    
        return msg_error;
    }
}