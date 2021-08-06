import { useState } from 'react';
import moment from 'moment';

const useRegisterForm = () => {
    const initialState = {
        loading: { value: false, error: false },
        termsChecked: { value: false, error: false },
        firstName: { value: '', error: false },
        middleName: { value: '', error: false },
        lastName: { value: '', error: false },
        email: { value: '', error: false },
        contact: { value: '', error: false },
        password: { value: '', error: false },
        location: { value: null, error: false },
        confirmPassword: { value: false, error: false },
        confirmPasswordVisible: { value: false, error: false },
        userType: { value: null, error: false },
        pickLocation: { value: false, error: false },
        privacyModal: { value: false, error: false },
        termsModal: { value: false, error: false },
        showPassword: { value: false, error: false },
        showConfirmPassword: { value: false, error: false },
    };
    const [values, setValues] = useState(initialState);

    const handleInputChange = (field, value, error = false) => {
        setValues((s) => ({
            ...s,
            [field]: { value, error },
        }));
    };

    const validateRegisterForm = () => {
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

    const resetRegisterForm = () => {
        setValues(initialState);
    };

    return { values, handleInputChange, validateRegisterForm, resetRegisterForm };
};

export default useRegisterForm;
