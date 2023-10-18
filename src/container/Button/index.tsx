import { Link } from "react-router-dom";
import "./index.css";

const Button: React.FC<{
  text: string;
  mod?: string;
  href?: string;
  disabled?: boolean;
  type: "nav" | "submit";
  action?: () => void;
}> = ({ text, mod, href, type, action, disabled }) => {
  switch (type) {
    case "nav":
      return href ? (
        <Link
          to={href}
          className={`button ${mod ? `button--${mod}` : ""} ${
            disabled ? "disabled" : ""
          }`}
          style={{ pointerEvents: disabled ? "none" : "auto" }}
        >
          {text}
        </Link>
      ) : (
        <div>Error</div>
      );

    case "submit":
      return (
        <div
          onClick={action}
          className={`button ${mod ? `button--${mod}` : ""} ${
            disabled ? "disabled" : ""
          }`}
          style={{ pointerEvents: disabled ? "none" : "auto" }}
        >
          {text}
        </div>
      );
  }
};

export default Button;
