import React, { useState, useEffect, forwardRef } from 'react';
import { useField } from 'formik';

import { InputWithHelper } from '../molecules/InputWithHelper';

export const AutoCompleteField = forwardRef(
  ({ className, type = 'text', fetchData, ...props }, ref) => {
    const [field, meta, helpers] = useField(props); // Use Formik's useField hook
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
      if (field.value) {
        fetchSuggestions(field.value);
      } else {
        setSuggestions([]);
        setShowSuggestions(false); // Close dropdown when the input is cleared
      }
    }, [field.value]);

    const fetchSuggestions = async (query) => {
      try {
        const response = await fetch(
          'https://oris.orientacnisporty.cz/API/?format=json&method=getCSOSClubList',
        );
        const data = await response.json();

        // Access the 'Data' field, which holds all the club information
        const clubs = data.Data;

        // Use Object.values() to get an array of clubs and filter them based on the query
        const filteredSuggestions = Object.values(clubs).filter(
          (item) =>
            item.Name.toLowerCase().includes(query.toLowerCase()) ||
            item.Abbr.toLowerCase().includes(query.toLowerCase()),
        );

        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const handleSuggestionClick = (suggestion) => {
      helpers.setValue(suggestion); // Use Formik's setValue to update form field
      setShowSuggestions(false);
    };

    const error = meta.touched && meta.error ? meta.error : undefined;

    return (
      <div className="relative">
        <InputWithHelper error={error} {...field} {...props} />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-3 py-2 text-sm hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion.Name)}
              >
                {suggestion.Name}
              </li>
            ))}
          </ul>
        )}
        {meta.touched && meta.error ? (
          <div className="text-red-500 text-sm">{meta.error}</div>
        ) : null}
      </div>
    );
  },
);

export default AutoCompleteField;
