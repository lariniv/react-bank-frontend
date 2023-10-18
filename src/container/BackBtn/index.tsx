import { useNavigate } from "react-router-dom";

import "./index.css";

const BackBtn = () => {
  const nav = useNavigate();

  return (
    <div
      onClick={() => {
        nav(-1);
      }}
      className="back-button"
    />
  );
};

export default BackBtn;
