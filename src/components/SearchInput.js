import React from 'react';
import InputBase from "@material-ui/core/InputBase";

const SearchInput = ({ value, triggerSearch }) => (
    <InputBase
        className="input"
        placeholder="Search"
        onChange={triggerSearch}
        value={value}
    />
);

export default SearchInput;