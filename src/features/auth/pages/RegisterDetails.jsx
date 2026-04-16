import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useUser } from "../context/UserContext.jsx";
import { useFetchApi } from "../../useFetchApi.js";
import '../../../styles/register-details.css';

function RegisterDetails() {
    const { postData,getData } = useFetchApi();
    const { login } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    const { userName, password } = location.state || {};
    const { register, handleSubmit, formState: { errors }, setError } = useForm();

    const onSubmit = async (data) => {
        const newUser = await addUser(data);
        const userData={
            userName:userName,
            id:newUser.id,
            name:newUser.name
        }
        if (newUser) {
            login(userData,getData);
            navigate(`/users/${newUser.id}/home`);
        }
    };

    async function addUser(data) {
        const userData = {
            username: userName,
            website: password,
            ...data
        };

        const result = await postData("users", userData);
        if (result) {
            return result;
        } else {
            setError("root", { message: "Error creating user" });
            return null;
        }
    }

    return (
        <div className="register-details-container">
            <div className="register-details-form">
                <h2>Hello {userName}, please complete your registration</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-section">
                        <h3>Personal Details</h3>
                        <div className="form-grid">
                            <input {...register('name', { required: "Full Name is required" })} placeholder="Full Name" />
                            {errors.name && <p className="error-message">{errors.name.message}</p>}

                            <input {...register('email', { required: "Email is required" })} placeholder="Email" type="email" />
                            {errors.email && <p className="error-message">{errors.email.message}</p>}

                            <input {...register('phone', { required: "Phone is required" })} placeholder="Phone" />
                            {errors.phone && <p className="error-message">{errors.phone.message}</p>}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Address</h3>
                        <div className="form-grid">
                            <input {...register('address.street', { required: "Street is required" })} placeholder="Street" />
                            {errors.address?.street && <p className="error-message">{errors.address.street.message}</p>}

                            <input {...register('address.suite')} placeholder="Apartment/Suite" />

                            <input {...register('address.city', { required: "City is required" })} placeholder="City" />
                            {errors.address?.city && <p className="error-message">{errors.address.city.message}</p>}

                            <input {...register('address.zipcode')} placeholder="Zipcode" />
                            <input {...register('address.geo.lat')} placeholder="Latitude" />
                            <input {...register('address.geo.lng')} placeholder="Longitude" />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Company Details</h3>
                        <div className="form-grid">
                            <input {...register('company.name', { required: "Company Name is required" })} placeholder="Company Name" className="full-width" />
                            {errors.company?.name && <p className="error-message">{errors.company.name.message}</p>}

                            <input {...register('company.catchPhrase')} placeholder="Slogan" />
                            <input {...register('company.bs')} placeholder="Business Field" />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">Complete Registration</button>
                    {errors.root && <p className="error-message">{errors.root.message}</p>}
                </form>
            </div>
        </div>
    );
}

export default RegisterDetails;
