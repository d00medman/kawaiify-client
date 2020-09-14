import React from 'react';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import CSS from '../css.js'
import { Grid, Cell } from "styled-css-grid";
import ImageDisplayComponent from './imageDisplay.js'

class ImageListComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            imageList: [],
            displayList: true,
            displayImageID: 0,
            myImages: false
            // hold: new Blob()
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

            const imageList = response.data.map((element) => (
                this.imageDataWithBlob(element)
            ));

            this.setState({
                imageList: imageList
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
            'fileBlob': blob
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
            
            const imageList = response.data.map((element) => (
                this.imageDataWithBlob(element)
            ));
            
            console.log('image list')
            console.log(imageList)

            this.setState({
                imageList: imageList,
                // hold: blob
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

        const gridStyle = CSS.gridStyle()
        const gridItemStyle = CSS.gridItemStyle()
        const imageStyle = CSS.imageListDisplayStyle()

        return (
            <Grid columns={4} gap="10px">
                <Cell width={3}>
                {imageList.map((image) =>
                    
                        <a onClick={() => this.loadSingleImage(image.id)}>
                            <div>{image.displayName}</div>
                            <div>
                            <img style={imageStyle} src={ URL.createObjectURL(image.fileBlob)} />
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