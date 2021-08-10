import { useState } from "react"

const UseForgetPasswordForm = () => {
    const initialState = {
        email: { value: '', error: false },
        token: { value: '', error: false },
        password: { value: '', error: false },
        confirmPassword: { value: '', error: false },
        setPassword: { value: false, error: false },
        loading: { value: false, error: false },
        showPassword: { value: false, error: false },
        showConfirmPassword: { value: false, error: false },
    }

    const [values, setValues] = useState(initialState);

    const handleInputChange = (field, value, error = false) => {
        setValues((s) => ({
            ...s,
            [field]: { value, error },
        }));
    };

    const validateForgetPasswordForm = () => {
        let hasError = false;
        //const ignorableFields = [];
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

    const resetForgetPasswordForm = () => {
        setValues(initialState);
    };

    return { values, handleInputChange, validateForgetPasswordForm, resetForgetPasswordForm };
}

export default UseForgetPasswordForm;