import { useState } from "react";
import "./index.css";
import { ErrorObject } from "../../types/ErrorObject";

const Input: React.FC<{
  name: string;
  type: string;
  isPassword?: boolean;
  value: string;
  setValue: (newValue: string) => void;
  error: ErrorObject;
}> = ({ name, isPassword, value, setValue, error, type }) => {
  const [hide, setHide] = useState<boolean>(true);

  let placeholder;
  let handleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  switch (type.toLowerCase()) {
    case "email":
      placeholder = "example@gmail.com";
      break;
    case "code":
      placeholder = "123456";
      break;
    case "number":
      placeholder = "$0";
      break;
    case "password":
      placeholder = "Password";
      handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const elem = e.target as HTMLElement;
        const classList = elem.classList;
        if (error.result) {
          classList.toggle("form__password--show");
          classList.toggle("form__password--hide");
        } else if (!error.result) {
          classList.toggle("form__password--show-red");
          classList.toggle("form__password--hide-red");
        }

        setHide(!hide);
      };
      break;
  }
  return (
    <div className={`form__block ${!error.result ? "form__block--error" : ""}`}>
      <label htmlFor={name.toLowerCase()} className="form__label">
        {name}
      </label>
      <div className="form__input-wrapper">
        <input
          onChange={(e) => {
            setValue(e.target.value);
          }}
          value={value}
          name={name.toLowerCase()}
          type={isPassword && hide ? "password" : "text"}
          className="form__input"
          placeholder={placeholder}
        />
        {isPassword && (
          <div
            className={`form__password ${
              error.result ? "form__password--show" : "form__password--show-red"
            } `}
            onClick={(e) => handleClick(e)}
          />
        )}
      </div>
      {!error.result && <div className="form__error">{error.message}</div>}
    </div>
  );
};

export default Input;
