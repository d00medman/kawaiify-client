import React from 'react';
import ImagePreviewUploadComponent from './modules/imagePreviewUpload.js'
import ImageDisplayComponent from './modules/imageDisplay.js'
import MyImageDisplayComponent from './modules/myImageDisplay.js'
import Profile from './modules/userProfile.js'
import { withAuth0 } from '@auth0/auth0-react';
import CSS from './css.js'
 
class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      currentMainDisplay: 1,
      currentDisplayList: 1
    }

    this.currentDisplayList = this.currentDisplayList.bind(this)
    this.setDisplay = this.setDisplay.bind(this)
    // this.setCurrentDisplayListToAll = this.setCurrentDisplayListToAll.bind(this)
    this.listDisplaySwitch = this.listDisplaySwitch.bind(this)
  }

  setDisplay(mainValue, listValue) {
      this.setState({
        currentDisplayList: listValue,
        currentMainDisplay: mainValue
    },  () => {
        console.log('state setDisplay')
        console.log(this.state);
    });
  }

  listDisplaySwitch() {
    const { isAuthenticated } = this.props.auth0;
    if (!isAuthenticated) {
      return
    }
    
    const listSelectorStyle = CSS.listSelectorStyle()

    return (
      <div>
        <button style={listSelectorStyle} onClick={() => this.setDisplay(this.state.currentMainDisplay, 1)}>
          All Altered Images
        </button>
        <button style={listSelectorStyle} onClick={() => this.setDisplay(this.state.currentMainDisplay, 2)}>
          My Altered Images
        </button>
      </div>
    )
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
        <button style={leftSelectorStyle} onClick={() => this.setDisplay(2, this.state.currentDisplayList)}>
          Kawaiify Image
        </button>
        <button style={rightSelectorStyle} onClick={() => this.setDisplay(1, this.state.currentDisplayList)}>
          View Kawaiified Images
        </button>
      </div>
    )
  }

  currentMainDisplay() {
    const { isAuthenticated } = this.props.auth0;

    const listDisplayStyle = CSS.listDisplayStyle('0px')

    if (!isAuthenticated) {
      return(
        <div style={listDisplayStyle}>
          {this.currentDisplayList()}
        </div>
      )
    }

    if (this.state.currentMainDisplay === 1) {
      return (
        <div>
          <div style={listDisplayStyle}>
            {this.mainDisplaySwitch()}
          </div>
          <div style={listDisplayStyle}>
            {this.listDisplaySwitch()}
          </div>
          <div style={listDisplayStyle}>
            {this.currentDisplayList()}
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
            <ImagePreviewUploadComponent />
          </div>
        </div>
      )
    }
  }

  currentDisplayList() {
    if (this.state.currentDisplayList === 2) {
      return <MyImageDisplayComponent />
    } else {
      return <ImageDisplayComponent />
    }
  }
  
  render() {
      const appStyle = CSS.appStyle()
      const headerStyle = CSS.headerStyle()
      const footerStyle = CSS.footerStyle()
      const paragraphStyle = CSS.paragraphStyle()

      return (
        <div>
          <header style={headerStyle}>
            <Profile />
          </header>
          <div style={appStyle}>
            {this.currentMainDisplay()}
          </div>
          <footer style={footerStyle}>
            <div style={footerStyle}>
              <p style={paragraphStyle}>UWU sowwy I need to figure out what to put hewe</p>
              <p style={paragraphStyle}>Might just be because of my machine, but the footer is ungodly large</p>
            </div>
          </footer>
        </div>
      );
  }
}

export default withAuth0(App);
