import { useState } from 'react';

const useAddressDetailForm = () => {
    const initialState = {
        district: { value: '', error: false },
        city: { value: '', error: false },
        //pickLocation: { value: '', error: false },
        nearestLandmark: { value: '', error: false },
        contact: { value: '', error: false },
        OTPCode: { value: '', error: false }
    };

    const [values, setValues] = useState(initialState);

    const handleInputChange = (field, value, error = false) => {
        setValues((s) => ({
            ...s,
            [field]: { value, error },
        }));
    };

    const validateAddressDetailForm = () => {
        let hasError = false;
        const ignorableFields = ['middleName','confirmPassword'];
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

    const resetAddressDetailForm = () => {
        setValues(initialState);
    };

    return { values, handleInputChange, validateAddressDetailForm, resetAddressDetailForm };
};

export default useAddressDetailForm;
