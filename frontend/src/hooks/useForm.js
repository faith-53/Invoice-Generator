import { useState } from 'react';

export const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setValues({
        ...values,
        [parent]: {
          ...values[parent],
          [child]: value
        }
      });
    } else {
      setValues({
        ...values,
        [name]: value
      });
    }
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    const match = name.match(/^(\w+)\[(\d+)\]\.(\w+)$/);
    
    if (match) {
      const [, arrayName, index, property] = match;
      const newArray = [...values[arrayName]];
      newArray[index][property] = 
        e.target.type === 'number' ? parseFloat(value) : value;
      
      setValues({
        ...values,
        [arrayName]: newArray
      });
    }
  };

  return {
    values,
    setValues,
    handleChange,
    handleArrayChange
  };
};