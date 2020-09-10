import React from 'react';
import ImagePreviewUploadComponent from './modules/imagePreviewUpload.js'
import ImageDisplayComponent from './modules/imageDisplay.js'
import Profile from './modules/userProfile.js'
 
class App extends React.Component {
  
    render() {
        return (
          <div>
            <Profile />
            <ImagePreviewUploadComponent />
            <ImageDisplayComponent />
          </div>
        );
    }
}

export default App;
