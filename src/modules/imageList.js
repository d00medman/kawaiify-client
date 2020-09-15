import React from 'react';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import CSS from '../css.js'
import { Grid, Cell } from "styled-css-grid";
import ImageDisplayComponent from './imageDisplay.js'

class ImageListComponent extends React.Component {

    // Component lifecycle functions
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

    getAPIURLBase() {
        const { prodAPIURL } = this.props
        console.log(this.props)
        console.log(`api url ${this.props.prodAPIURL}`)
        return prodAPIURL ? prodAPIURL : 'http://127.0.0.1:5000'
        // return 'http://127.0.0.1:5000'
    }

    // State management functions
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

    getListdata() {
        this.state.listAllImages ? this.getAllImageData(): this.getUsersImageData()
    }

    loadSingleImage(imageId) {
        this.setState({
            displayList: false,
            displayImageID: imageId
        },  () => {
            console.log('state in set state in loadSingleImage')
            console.log(this.state);
        });
    }

    // API contact functions
    async getUsersImageData() {
        console.log('getUsersImageData')
        const { isAuthenticated, user } = this.props.auth0;
        if (!isAuthenticated) {
            console.log('user not authenticated, no data to return')
            return false
        }

        try {
            const response = await axios.get(
                `${this.getAPIURLBase()}/get-my-image-data/${user.email}`,
            )

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

    imageDataWithBlob(image) {
        const binaryString = window.atob(image.fileData); // Comment this if not using base64
        const bytes = new Uint8Array(binaryString.length);
        const b64arr = bytes.map((byte, i) => binaryString.charCodeAt(i));
        const blob = new Blob([b64arr], { type: "image/png" })
        return {
            'id': image.id,
            'displayName': image.displayName,
            'fileBlob': blob,
            'creatorName': image.creatorEmail,
            'createdAt': image.createdAt
        }
    }

    async getAllImageData() {
        console.log('getAllImageData')
        try {
            const response = await axios.get(
                `${this.getAPIURLBase()}/get-all-images`,
            )
            console.log('response in getAllImageData')
            console.log(response)

            this.setState({
                imageList: response.data,
            },  () => {
                console.log('state in set state in getAllImageData')
                console.log(this.state);
            });
        } catch(error) {
            console.log('error in getAllImageData')
            console.log(error)
        }
    }

    

    // JSX construction functions
    listDisplaySwitch() {
        const { isAuthenticated } = this.props.auth0;
        if (!isAuthenticated) {
          return
        }

        const { myImages } = this.state
    
        return (
          <div>
            <button style={CSS.listSelectorStyle(myImages === false)} onClick={() => this.setDisplayList(false)}>
              All Altered Images
            </button>
            <button style={CSS.listSelectorStyle(myImages === true)} onClick={() => this.setDisplayList(true)}>
              My Altered Images
            </button>
          </div>
        )
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
                    prodAPIURL={this.props.prodAPIURL}
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

        const imageStyle = CSS.imageListDisplayStyle()
        const imageListTextStyle = CSS.imageListTextStyle()
        const listItemContainerStyle = CSS.listItemContainerStyle()

        return (
            <Grid columns={1} gap="10px">
                <Cell width={12}>
                {imageList.map((image) =>    
                    <a onClick={() => this.loadSingleImage(image.id)}>
                        <div style={listItemContainerStyle}>
                            <img style={imageStyle} src={image.cloudUrl} />
                            <h4 style={imageListTextStyle}>{image.displayName}</h4>
                            {!myImages ? 
                                <p>Created by {image.creatorEmail} on {image.createdAt}</p> :
                                <p>Created on {image.createdAt}</p>
                            }
                        </div>
                        
                    </a>
                )}
                </Cell>
            </Grid>
        )
    }


    displayListComponent() {
        const { isAuthenticated, user } = this.props.auth0;
        const { myImages } = this.state
        const listDisplayStyle = CSS.listDisplayStyle('10px')

        const listHeadline = myImages ? `Images kawaiified by ${user.email}` : 'Images kawaiified by all users'

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