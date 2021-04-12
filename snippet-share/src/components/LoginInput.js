import React from "react";
import "./style/loginInput.css";

const LoginInput = (props) => {
  return (
    <div className="input_box">
      <input
        type={props.inputType}
        required
        // placeholder={props.placeholder}
        onChange={props.onChangeEvent}
        value={props.value}
        className="login_input"
      />
      <span className="label_name">{props.labelName}</span>
    </div>
  );
};

export default LoginInput;