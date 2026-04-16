import React, { useEffect, useState } from 'react';
import { useUser } from '../../auth/context/UserContext.jsx';
import { useFetchApi } from '../../useFetchApi.js';

function Info() {
    const { currentUser } = useUser();
    const { getData } = useFetchApi();

    const [userDetails, setUserDetails] = useState(currentUser);

    useEffect(() => {
        async function fetchFullUser() {
            if (
                currentUser &&
                (!currentUser.address || !currentUser.address?.zipcode)
            ) {
                const fullUser = await getData(`users/${currentUser.id}`);
                setUserDetails(fullUser);
            }
        }

        fetchFullUser();
    }, [currentUser]);

    if (!userDetails) return null;

    return (
        <div>
            <h2>User Profile</h2>

            <section>
                <h4>General Info</h4>
                <p><strong>Full Name:</strong> {userDetails.name}</p>
                <p><strong>Username:</strong> {userDetails.username}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
            </section>

            <section>
                <h4>Address</h4>
                <p>
                    {userDetails.address?.city}, {userDetails.address?.street}
                </p>
                <p>Zipcode: {userDetails.address?.zipcode}</p>
            </section>

            <section>
                <h4>Company</h4>
                <p><strong>{userDetails.company?.name}</strong></p>
                <p><em>"{userDetails.company?.catchPhrase}"</em></p>
            </section>
        </div>
    );
}

export default Info;

