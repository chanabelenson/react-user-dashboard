import React from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useFetchApi } from "../../useFetchApi.js";
import '../../../styles/register.css';


function Register() {
    const { getData } = useFetchApi();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();

    function goToLogIn() {
        navigate("/login");
    }

    async function onSubmit(data) {
        const { userName, password, confirmPassword } = data;

        clearErrors("root");

        const result = await getData(`users?username=${userName}`);
        if (result === null) {
            setError("root", { message: "Server error. Please try again later." });
            return;
        }

        if (result.length > 0) {
            setError("root", { message: "User is already exist, try to log in" });
            return;
        }

        if (password !== confirmPassword) {
            setError("root", { message: "Passwords are not the same" });
            return;
        }

        navigate("/register/more_details", { state: { userName, password } });
    }

    return (
        <div className="register-container">
            <div className="register-left">
                <div className="register-form">
                    <h1>Register</h1>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            {...register("userName", { required: "Username is required" })}
                            type="text"
                            placeholder="Username"
                            className="input-field"
                            autoFocus
                        />
                        {errors.userName && <p className="error-message">{errors.userName.message}</p>}

                        <input
                            {...register("password", { 
                                required: "Password is required",
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
                                    message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number"
                                }
                            })}
                            type="password"
                            placeholder="Password"
                            className="input-field"
                        />
                        {errors.password && <p className="error-message">{errors.password.message}</p>}

                        <input
                            {...register("confirmPassword", { required: "Confirm Password is required" })}
                            type="password"
                            placeholder="Confirm Password"
                            className="input-field"
                        />
                        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}

                        <button type="submit" className="btn btn-primary">Register</button>
                        <button type="button" onClick={goToLogIn} className="btn btn-secondary">Login</button>

                        {errors.root && <p className="error-message">{errors.root.message}</p>}
                    </form>
                </div>
            </div>
            <div className="register-right"></div>
        </div>
    );
}

export default Register;
