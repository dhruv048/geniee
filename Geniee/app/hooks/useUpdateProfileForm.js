import { useState } from 'react';
import moment from 'moment';

const useUpdateProfileForm = () => {
    const initialState = {
        firstName: { value: '', error: false },
        //middleName: { value: '', error: false },
        lastName: { value: '', error: false },
        email: { value: '', error: false },
        contactNo: { value: '', error: false },
    };

    const [values, setValues] = useState(initialState);

    const handleInputChange = (field, value, error = false) => {
        setValues((s) => ({
            ...s,
            [field]: { value, error },
        }));
    };

    const validateUpdateProfileForm = () => {
        let hasError = false;
        const ignorableFields = ['middleName'];
        // eslint-disable-next-line array-callback-return
        Object.keys(values).map((key) => {
            if (ignorableFields.includes(key)) {
                // do Nothing
            }
            else { }
            if (values[key].value === '') {
                handleInputChange(key, values[key].value, true);
                hasError = true;
            } else {
                handleInputChange(key, values[key].value, false);
            }
        });
        return hasError;
    };

    const resetUpdateProfileForm = () => {
        setValues(initialState);
    };

    return { values, handleInputChange, validateUpdateProfileForm, resetUpdateProfileForm };
};

export default useUpdateProfileForm;
