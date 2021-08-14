import {useState} from 'react';

const UseContactForm = () =>{
    const initialState = {
        name: { value: '', error: false },
        email: { value: '', error: false },
        contact: { value: '', error: false },
        message: { value: '', error: false },
        error: { value: null, error: false },
        loading: { value: false, error: false },
    };

    const [values, setValues] = useState(initialState);

    const handleInputChange = (field, value, error = false) => {
        setValues((s) => ({
            ...s,
            [field]: { value, error },
        }));
    };
    const validateContactForm = () => {
        let hasError = false;
        const ignorableFields = ['nothing'];
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

    const resetContactForm = () => {
        setValues(initialState);
    };

    return { values, handleInputChange, validateContactForm, resetContactForm };
}

export default UseContactForm;