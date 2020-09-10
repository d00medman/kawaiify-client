import React from 'react';
import ImagePreviewUploadComponent from './modules/imagePreviewUpload.js'
import ImageDisplayComponent from './modules/imageDisplay.js'
import MyImageDisplayComponent from './modules/myImageDisplay.js'
import Profile from './modules/userProfile.js'
import { withAuth0 } from '@auth0/auth0-react';
 
class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
        currentDisplayList: 1
    }

    this.currentDisplayList = this.currentDisplayList.bind(this)
    this.setCurrentDisplayListToUser = this.setCurrentDisplayListToUser.bind(this)
    this.setCurrentDisplayListToAll = this.setCurrentDisplayListToAll.bind(this)
    this.listDisplaySwitch = this.listDisplaySwitch.bind(this)
  }

  setCurrentDisplayListToUser() {
    this.setState({
      currentDisplayList: 2
  },  () => {
      console.log('state in set state in list images')
      console.log(this.state);
  });
  }

  setCurrentDisplayListToAll() {
    this.setState({
      currentDisplayList: 1
  },  () => {
      console.log('state in set state in list images')
      console.log(this.state);
  });
  }

  listDisplaySwitch() {
    const { isAuthenticated } = this.props.auth0;

    return (
      <div>
        <button className="btn btn-success"
                    onClick={this.setCurrentDisplayListToAll}
                  >All Altered Images</button>
        {isAuthenticated && <button className="btn btn-success"
                    onClick={this.setCurrentDisplayListToUser}
                  >My Altered Images</button>}
      </div>
    )
  }

  currentDisplayList() {
    if (this.state.currentDisplayList === 2) {
      return <MyImageDisplayComponent />
    } else {
      return <ImageDisplayComponent />
    }
  }
  
    render() {
        return (
          <div>
            <Profile />
            <ImagePreviewUploadComponent />
            {this.listDisplaySwitch()}
            {this.currentDisplayList()}
          </div>
        );
    }
}

export default withAuth0(App);
