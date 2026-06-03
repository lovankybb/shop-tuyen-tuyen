import sys

with open("web-app/src/pages/Authentication/Authentication.jsx", "r") as f:
    content = f.read()

content = content.replace(
'''import { useState } from "react";
import "./Authentication.css"; // Import file CSS vào đây bro nhé
import SuccessPopup from "../../components/Popup/SuccessPopup";
import ErrorPopup from "../../components/Popup/ErrorPopup";''',
'''import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Authentication.css";
import SuccessPopup from "../../components/Popup/SuccessPopup";
import ErrorPopup from "../../components/Popup/ErrorPopup";
import { login, register } from "../../service/AuthenticationService";
import { getMyProfile } from "../../service/UserService";
import { AuthContext } from "../../context/AuthContext";'''
)

content = content.replace(
'''  const [focused, setFocused] = useState("");

  const isRegister = mode === "register";''',
'''  const [focused, setFocused] = useState("");
  const navigate = useNavigate();
  const { login: setContextUser } = useContext(AuthContext) || { login: () => {} };

  const isRegister = mode === "register";'''
)

content = content.replace(
'''  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorPopupOpen(true);
  };''',
'''  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        if (form.password !== form.confirmPassword) {
           setErrorPopupOpen(true);
           return;
        }
        await register(form.username, form.email, form.password);
        setSuccessPopupOpen(true);
        setTimeout(() => switchMode("login"), 1500);
      } else {
        await login(form.username, form.password);
        try {
           const profile = await getMyProfile();
           const userRole = profile.roles && profile.roles.length > 0 ? profile.roles[0].name : "USER";
           localStorage.setItem("role", userRole);
           setContextUser(profile);
        } catch(err) {
           console.error("Could not fetch profile", err);
        }
        setSuccessPopupOpen(true);
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      console.error(err);
      setErrorPopupOpen(true);
    }
  };'''
)

with open("web-app/src/pages/Authentication/Authentication.jsx", "w") as f:
    f.write(content)
