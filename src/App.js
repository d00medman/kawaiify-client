import React from 'react';
import ImagePreviewUploadComponent from './modules/imagePreviewUpload.js'
import Profile from './modules/userProfile.js'
import { withAuth0 } from '@auth0/auth0-react';
import CSS from './css.js'
import ImageListComponent from './modules/imageList.js'
 
class App extends React.Component {
  prodAPIURL = 'https://backend-dot-steg-interview-project.ue.r.appspot.com'

  constructor(props) {
    super(props)

    this.state = {
      kawaiifyImageComponent: false,
    }

    this.setDisplay = this.setDisplay.bind(this)
  }

  setDisplay(kawaiifyImageComponent) {
    this.setState({
      kawaiifyImageComponent
    },  () => {
      console.log('state of top level app in setDisplay')
      console.log(this.state);
    });
  }

  

  mainDisplaySwitch() {
    const { isAuthenticated } = this.props.auth0;
    if (!isAuthenticated) {
      return
    }

    const leftSelectorStyle = CSS.mainDisplaySelectorStyle('left')
    const rightSelectorStyle = CSS.mainDisplaySelectorStyle('right')

    return (
      <div>
        <button style={leftSelectorStyle} onClick={() => this.setDisplay(true)}>
          Kawaiify Image
        </button>
        <button style={rightSelectorStyle} onClick={() => this.setDisplay(false)}>
          View Kawaiified Images
        </button>
      </div>
    )
  }

  currentMainDisplay() {
    const { isAuthenticated } = this.props.auth0;
    console.log(this.props.auth0)

    const listDisplayStyle = CSS.listDisplayStyle('0px')
    if (!isAuthenticated) {
      // If no authenticated user is signed in, return just the image list component
      return(
        <div style={listDisplayStyle}>
          <ImageListComponent 
            prodAPIURL={this.prodAPIURL}
          />
        </div>
      )
    }

    if (!this.state.kawaiifyImageComponent) {
      return (
        <div>
          <div style={listDisplayStyle}>
            {this.mainDisplaySwitch()}
          </div>
          
          <div style={listDisplayStyle}>
            <ImageListComponent
              prodAPIURL={this.prodAPIURL}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div style={listDisplayStyle}>
            {this.mainDisplaySwitch()}
          </div>
          <div style={listDisplayStyle}>
            <ImagePreviewUploadComponent 
              prodAPIURL={this.prodAPIURL}
            />
          </div>
        </div>
      )
    }
  }
  
  render() {
      const paragraphStyle = CSS.paragraphStyle()

      return (
        <div>
          <Profile />
          <div style={CSS.appStyle()}>
            {this.currentMainDisplay()}
          </div>
          <div style={CSS.footerStyle()}>
            <p style={paragraphStyle}>Kawaiify is a simple image manipulation application requested as part of an interview for steg.ai</p>
            <p style={paragraphStyle}>Please Kawaiify responsibly</p>
          </div>
        </div>
      );
  }
}

export default withAuth0(App);
