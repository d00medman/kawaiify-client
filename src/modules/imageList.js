import React from 'react';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import CSS from '../css.js'

import ImageDisplayComponent from './imageDisplay.js'

class ImageListComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            imageList: [],
            displayList: true,
            displayImageID: 0,
            myImages: false
        }

        this.getAllImageData = this.getAllImageData.bind(this)
        this.displaySingleImage = this.displaySingleImage.bind(this)
        this.loadSingleImage = this.loadSingleImage.bind(this)
        this.getUsersImageData = this.getUsersImageData.bind(this)
        this.getListdata = this.getListdata.bind(this)
        this.setDisplayList = this.setDisplayList.bind(this)
    }

    componentDidMount() {
        this.getAllImageData()
    }

    setDisplayList(myImages) {
        this.setState({
            myImages: myImages,
            displayList: true,
            displayImageID: 0
        },  () => {
          console.log('state setDisplayList')
          console.log(this.state);
        });
        // Hydrate the list with the appropriate method from the server
        myImages ? this.getUsersImageData(): this.getAllImageData()
    }

    listDisplaySwitch() {
        const { isAuthenticated } = this.props.auth0;
        if (!isAuthenticated) {
          return
        }
    
        return (
          <div>
            <button style={CSS.listSelectorStyle()} onClick={() => this.setDisplayList(false)}>
              All Altered Images
            </button>
            <button style={CSS.listSelectorStyle()} onClick={() => this.setDisplayList(true)}>
              My Altered Images
            </button>
          </div>
        )
      }

    getListdata() {
        this.state.listAllImages ? this.getAllImageData(): this.getUsersImageData()
    }

    async getUsersImageData() {
        console.log('getUsersImageData')
        const { isAuthenticated, user } = this.props.auth0;
        if (!isAuthenticated) {
            console.log('user not authenticated, no data to return')
            return false
        }

        try {
            const response = await axios.get(
                `http://127.0.0.1:5000/get-my-image-data/${user.email}`,
                // { responseType: 'blob' }
            )
            console.log('response in getUsersImageData')
            console.log(response)
            this.setState({
                imageList: response.data
            },  () => {
                console.log('state in set state in getUsersImageData')
                console.log(this.state);
            });
        } catch(error) {
            console.log('error in getUsersImageData')
            console.log(error)
        }
    }

    async getAllImageData() {
        console.log('getAllImageData')
        try {
            const response = await axios.get(
                `http://127.0.0.1:5000/get-all-images`,
                // { responseType: 'blob' }
            )
            console.log('response in getAllImageData')
            console.log(response)
            this.setState({
                imageList: response.data
            },  () => {
                console.log('state in set state in getAllImageData')
                console.log(this.state);
            });
        } catch(error) {
            console.log('error in getAllImageData')
            console.log(error)
        }
    }

    loadSingleImage(imageId) {
        console.log(imageId)
        this.setState({
            displayList: false,
            displayImageID: imageId
        },  () => {
            console.log('state in set state in loadSingleImage')
            console.log(this.state);
        });
    }

    displaySingleImage() {
        const {displayList, displayImageID, myImages} = this.state
        if (displayList || displayImageID < 1) {
            console.log('cant display single image')
            return this.displayListComponent()
        }

        const listDisplayStyle = CSS.listDisplayStyle('10px')

        return (
            <div>
                <div style={listDisplayStyle}>
                    {this.listDisplaySwitch()}
                </div>
                <ImageDisplayComponent 
                    imageId={displayImageID}
                    isMyImage={myImages}
                    setDisplayList={this.setDisplayList}
                />
            </div>
        ) 
    }

    renderList() {
        const { isAuthenticated, user } = this.props.auth0;
        const { imageList, myImages } = this.state

        if (imageList.length < 1) {
            return isAuthenticated && myImages ? <h3>You have no Kawaiified images</h3> : <h3>No images have been kawaiified</h3>
        }

        return (
            <ul>
                {imageList.map((image) =>
                    <li>
                        <a onClick={() => this.loadSingleImage(image.id)}>{image.fileName}</a>
                    </li>
                )}
            </ul>
        )
    }


    displayListComponent() {
        const { isAuthenticated, user } = this.props.auth0;
        const { myImages } = this.state
        const listDisplayStyle = CSS.listDisplayStyle('10px')

        const listHeadline = myImages ? `Images kawaiified by ${user.email}` : 'All images kawaiified by users'

        return (
            <div >
                <div style={listDisplayStyle}>
                        <h3 style={CSS.mainHeadlineStyle()}>{listHeadline}</h3>
                </div>

                {isAuthenticated && <div style={listDisplayStyle}>
                    {this.listDisplaySwitch()}
                </div>}
                {this.renderList()}
            </div>
        )
    }

    render() {
        const currentDisplay = this.state.displayList ? this.displayListComponent() : this.displaySingleImage()

        return (
            <div>
                {currentDisplay}
            </div>
            
        )
    }
}

export default withAuth0(ImageListComponent)