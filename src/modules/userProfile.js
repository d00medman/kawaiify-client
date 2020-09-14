import React, { useEffect, useState }  from "react";
import { useAuth0 } from "@auth0/auth0-react";
import CSS from '../css.js'

// Most of the code here is lifted from auth0's tutorials, hence the functional components, as opposed to the class components used in the rest of the app

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const loginButtonStyle = CSS.filledButtonStyle('#6be8c7') 

  return <button style={loginButtonStyle} onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
    const { logout } = useAuth0();

    const logoutButtonStyle = CSS.filledButtonStyle('#eb726a')

    return (
      <button style={logoutButtonStyle} onClick={() => logout({ returnTo: window.location.origin })}>
        Log Out
      </button>
    );
  };


const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);

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
  
  const headerStyle = CSS.headerStyle()
  const navbarLeftStyle = CSS.navbarStyle('left') 
  const navbarRightStyle = CSS.navbarStyle('right')
  const mainHeadlineStyle = CSS.mainHeadlineStyle()

  return (
      <div style={headerStyle}>
        <div style={navbarLeftStyle}>
            <h1 style={mainHeadlineStyle}>Kawaiify</h1>
            <p>(◕‿◕✿)</p>
          </div>
          {isAuthenticated ? (
            <div>
              <div style={navbarRightStyle}>
                  <img src={user.picture} alt={user.name} />
              </div>
              <div style={navbarRightStyle}>
                  <p>{user.email}</p>
                  <LogoutButton />
              </div>
            </div>
          ) : (
              <div style={navbarRightStyle}>
                <LoginButton/>
              </div>
          )}
      </div>
  );
};

export default Profile;