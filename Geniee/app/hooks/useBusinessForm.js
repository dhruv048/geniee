import { useState } from 'react';

const UseBusinessForm = () => {
    const initialState = {
        title: { value: '', error: false },
        selectedCategory: { value: '', error: false },
        location: { value: null, error: false },
        contact: { value: '', error: false },
        avatarSource: { value: null, error: false },
        Image: { value: null, error: false },
        webLink: { value: '', error: false },
        pickLocation: { value: false, error: false },
        loading: { value: false, error: false },
        businessType: { value: 2, error: false },
        contactPerson: { value: '', error: false },
        panvat: { value: '', error: false },
        email: { value: '', error: false },
        panVatImage :{value:'',error:false},
    };

    const [values, setValues] = useState(initialState);

    const handleInputChange = (field, value, error = false) => {
        setValues((s) => ({
            ...s,
            [field]: { value, error },
        }));
    };
    const validateBusinessForm = () => {
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

    const resetBusinessForm = () => {
        setValues(initialState);
    };

    return { values, handleInputChange, validateBusinessForm, resetBusinessForm };
}

export default UseBusinessForm;