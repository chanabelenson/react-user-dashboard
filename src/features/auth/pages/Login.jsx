
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import { useFetchApi } from "../../useFetchApi.js";
import '../../../styles/login.css';

function LogIn() {
    const { getData } = useFetchApi();
    const { login } = useUser();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setError } = useForm();

    const onSubmit = async (data) => {
        const user = await checkIfUserExist(data.username, data.password);
        if (user) {
            const userData={
                username:user[0].username,
                name:user[0].name,
                id:user[0].id
            }
            await login(userData, getData);
            navigate(`/users/${userData.id}/home`);
        }
    };

    async function checkIfUserExist(userName, password) {
        const result = await getData(`users?username=${userName}`);
        if (result === null) {
            setError("root", { message: "Server error. Please try again later." });
            return null;
        }
        if (result.length === 0) {
            setError("root", { message: "User or password is not correct" });
            return null;
        }
        if (result[0].website !== password) {
            setError("root", { message: "User or password is not correct" });
            return null;
        }
        return result;
    }

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-form">
                    <h1>Welcome</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            {...register("username", { required: "Username is required" })}
                            type="text"
                            placeholder="Username"
                            className="input-field"
                            autoFocus
                        />
                        {errors.username && <p className="error-message">{errors.username.message}</p>}
                        
                        <input
                            {...register("password", { required: "Password is required" })}
                            type="password"
                            placeholder="Password"
                            className="input-field"
                        />
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                        
                        <button type="submit" className="btn btn-primary">Login</button>
                        <button type="button" onClick={() => navigate("/register")} className="btn btn-secondary">Register</button>
                        
                        {errors.root && <p className="error-message">{errors.root.message}</p>}
                    </form>
                </div>
            </div>
            <div className="login-right"></div>
        </div>
    );
}

export default LogIn;