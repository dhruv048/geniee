import { useState } from 'react';
import moment from 'moment';

const useRegisterForm = () => {
    const initialState = {
        loading: { value: false, error: false },
        termsChecked: { false: null, error: false },
        name: { value: '', error: false },
        email: { value: '', error: false },
        contact: { value: '', error: false },
        password: { value: '', error: false },
        location: { value: null, error: false },
        confirmPassword: { value: false, error: false },
        confirmPasswordVisible: { false: null, error: false },
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
        console.log('this is field '+ field + ' this is value '+value);
    };

    const validateRegisterForm = () => {
        let hasError = false;
        //const ignorableFields = ['serviceDetail', 'eventDetail', 'teamIdForServices', 'equipment', 'quantity', 'cost', 'providedBy', 'addOnService', 'eventStatus', 'isDefaultRoom', 'isDefaultService', 'isDefaultEvent', 'noteToGuest', 'noteToTherapist', 'id', 'isEvent', 'room', 'defaultRoom', 'defaultEventServices', 'cleanUp', 'eventCleanUp'];
        // eslint-disable-next-line array-callback-return
        Object.keys(values).map((key) => {
            if (ignorableFields.includes(key)) {
                // do Nothing
            }
            else { }
            if (appointment[key].value.length < 0) {
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

    return { values, setValues, handleInputChange, validateRegisterForm, resetRegisterForm };
};

export default useRegisterForm;
