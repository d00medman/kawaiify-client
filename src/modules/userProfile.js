import React, { useEffect, useState }  from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

// export default LoginButton;

const LogoutButton = () => {
    const { logout } = useAuth0();
  
    return (
      <button onClick={() => logout({ returnTo: window.location.origin })}>
        Log Out
      </button>
    );
  };
  
//   export default LogoutButton;

//   import React from "react";
// import { useAuth0 } from "@auth0/auth0-react";


const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);

//   console.log('profile')
//   console.log(user)
//   console.log(isAuthenticated)
//   console.log(isLoading)

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = "dev-ogr-2kjg.us.auth0.com";
  
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        });
  
        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
  
        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        const { user_metadata } = await metadataResponse.json();
  
        setUserMetadata(user_metadata);
      } catch (e) {
        console.log(e.message);
      }
    };
  
    getUserMetadata();
  }, []);
  

//   if (isLoading) {
//     return <div>Loading ...</div>;
//   }

  

  return (
    
      <div>
        {isAuthenticated ? (
            <div>
                <LogoutButton />
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </div>
        ) : (
            <LoginButton/>
        )}

        {userMetadata ? (
          <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
        ) : (
          <p>No user metadata defined</p>
        )}

      </div>
  );
};

export default Profile;