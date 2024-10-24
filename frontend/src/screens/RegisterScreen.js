import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { register } from "../actions/userActions";
import bcrypt from "bcryptjs";

function RegisterScreen(props) { 
  const st = useSelector((state) => state)
  console.log(st)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [insecurPassword, setInsecurePassword] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, userInfo, error } = userRegister;
  const dispatch = useDispatch();

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";
  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
    return () => {
      //
    };
  }, [userInfo]);

  // const isPasswordValid = (password) => {
  //   // Password should contain both uppercase and lowercase alphabets
  //   const hasUpperCase = /[A-Z]/.test(password);
  //   const hasLowerCase = /[a-z]/.test(password);

  //   // Password should contain numbers
  //   const hasNumber = /\d/.test(password);

  //   // Number of characters should be between 8 to 15 characters
  //   const isValidLength = password.length >= 8 && password.length <= 15;

  //   return hasUpperCase && hasLowerCase && hasNumber && isValidLength;
  // };

  const passwordHandler = async (e) => {
    setInsecurePassword(e.target.value);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(insecurPassword, saltRounds);
    setPassword(hashedPassword);
  };

  const rePasswordHandler = async (e) => {
    const result = insecurPassword === e.target.value ? true : false;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(register(name, email, password));
  };
  return (
    <div className="form">
      <form onSubmit={submitHandler}>
        <ul className="form-container">
          <li>
            <h2>Create Account</h2>
          </li>
          <li>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
          </li>
          <li>
            <label htmlFor="name">Name</label>
            <input
              type="name"
              name="name"
              id="name"
              onChange={(e) => setName(e.target.value)}
            ></input>
          </li>
          <li>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </li>
          <li>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={passwordHandler}
            ></input>
          </li>
          <li>
            <label htmlFor="rePassword">Re-Enter Password</label>
            <input
              type="password"
              id="rePassword"
              name="rePassword"
              onChange={rePasswordHandler}
            ></input>
          </li>
          <li>
            <button type="submit" className="button primary">
              Register
            </button>
          </li>
          <li>
            Already have an account?
            <Link
              to={redirect === "/" ? "signin" : "signin?redirect=" + redirect}
              className="button secondary text-center"
            >
              Log into your HEBEFI account
            </Link>
          </li>
        </ul>
      </form>
    </div>
  );
}
export default RegisterScreen;
