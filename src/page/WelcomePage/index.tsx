import Button from "../../container/Button";
import BgImage from "../../img/bg-main.png";
import Storage from "../../img/storage.png";

import "./index.css";

const WelcomePage = () => {
  return (
    <div className="main-page">
      <div className="hero" style={{ backgroundImage: `url(${BgImage})` }}>
        <div className="hero__block">
          <h2 className="hero__title">Hello!</h2>
          <p className="hero__text">Welcome to bank app</p>
        </div>
      </div>

      <div className="storage" style={{ backgroundImage: `url(${Storage})` }} />

      <div className="buttons-container">
        <Button text="Sign up" href="/signup" type="nav" />
        <Button text="Sign in" mod="secondary" href="/signin" type="nav" />
      </div>
    </div>
  );
};

export default WelcomePage;
