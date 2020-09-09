import React from 'react';
import ImagePreviewUploadComponent from './modules/imagePreviewUpload.js'
import ImageDisplayComponent from './modules/imageDisplay.js'
 
class App extends React.Component {
  
    render() {
        return (
          <div>
            <ImagePreviewUploadComponent />
            <ImageDisplayComponent />
          </div>
        );
    }
}

export default App;
