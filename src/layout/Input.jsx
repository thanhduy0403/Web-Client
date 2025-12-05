import React from "react";

function Input({
  name = "",
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  ...props // để forward các props khác nếu cần
}) {
  return (
    <>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className}
        {...props}
      ></input>
    </>
  );
}

export default Input;
