import { useState } from 'react';

const UseBusinessForm = () => {
    const initialState = {
        merchantName: { value: '', error: false },
        businessType: { value: '', error: false },
        selectedCategory: { value: '', error: false },
        district : {value:'',error:false},
        city : {value:'',error:false},
        nearestLandmark : {value:'',error:false},
        location: { value: '', error: false },
        panNumber: { value: '', error: false },
        contact: { value: '', error: false },
        email: { value: '', error: false },
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