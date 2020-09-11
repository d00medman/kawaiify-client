import React from 'react';
// import ImageUploader from 'react-images-upload';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import CSS from '../css.js'

class MyImageDisplayComponent extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            id: null,
            imageIDList: [],
            currentImageIndex: -1, //tracks where in the array of recovered IDs we are
            name: '',
            picture: new Blob(),
            initialized: false
        }

        this.getMyImageData = this.getMyImageData.bind(this)
        this.getPreviousUserImage = this.getPreviousUserImage.bind(this)
        this.getNextUserImage = this.getNextUserImage.bind(this)
        this.getNextUserImageData = this.getNextUserImageData.bind(this)
    }

    componentDidMount() {
        this.getMyImageData()
    }

    async getPreviousUserImage() {
        const previousIndex = this.state.currentImageIndex - 1
        if (previousIndex < 0) {
            return this.state.currentImageIndex
        }
        const previousImageID = this.state.imageIDList[previousIndex]
        await this.getNextUserImageData(previousImageID, previousIndex)
    }

    // TODO: these can be merged
    async getNextUserImage() {
        const nextIndex = this.state.currentImageIndex + 1
        if (nextIndex > this.state.imageIDList.length) {
            return this.state.currentImageIndex
        }
        const nextImageID = this.state.imageIDList[nextIndex]
        await this.getNextUserImageData(nextImageID, nextIndex)
    }

    async getNextUserImageData(id, newImageIndex) {
        console.log(`id in getNextUserImageData: ${id}`)
        try {
            const response = await axios.get(
                `http://127.0.0.1:5000/get-image/${id}`,
                { responseType: 'blob' }
            )
            this.setState({
                id: parseInt(response.headers['image_id']),
                picture: response.data,
                name: response.headers['image_name'],
                currentImageIndex: newImageIndex
            },  () => {
                console.log('state in set state in getNextUserImageData')
                console.log(this.state);
            });
        } catch(error) {
            console.log('error in getNextUserImageData')
            console.log(error)
        }
    }

    async getMyImageData() {
        console.log('start of getMyImageData')
        const { isAuthenticated, user } = this.props.auth0;
        if (!isAuthenticated) {
            console.log(`not authenticated`)
            return false
        }

        try {
            const response = await axios.get(
                `http://127.0.0.1:5000/get-my-image-data/${user.email}`,
                { responseType: 'blob' }
            )
            console.log('response in getMyImageData in myimagedisplat')
            console.log(response)

            this.setState({
                id: parseInt(response.headers['image_id']),
                picture: response.data,
                name: response.headers['image_name'],
                imageIDList: response.headers['user_image_id_list'].split(','),
                currentImageIndex: 0
            },  () => {
                console.log('state in getMyImageData')
                console.log(this.state);
            });
        } catch(error) {
            console.log('error in getMyImageData')
            console.log(error)
        }
        
    }

    render() {
        const { isAuthenticated, user } = this.props.auth0;
        if (!isAuthenticated) {
            console.log('not authenticated on render')
            return <h3>Please log in to view the images you've altered</h3>
        }

        const listDisplayStyle = CSS.listDisplayStyle('10px')
        const listSelectorStyle = CSS.listSelectorStyle()
        const imageDisplayStyle = CSS.imageDisplayStyle()
        const mainHeadlineStyle = CSS.mainHeadlineStyle()

        const showPrevious = !(this.state.currentImageIndex === 0)
        const showNext = !(this.state.currentImageIndex === this.state.imageIDList.length)
        // console.log('ready to render my image display')
        return (
            <div>
                <div style={listDisplayStyle}>
                    <h3 style={mainHeadlineStyle}>Images kawaiified by {user.email}</h3>
                </div>
                
                <img style={imageDisplayStyle} src={ URL.createObjectURL(this.state.picture)}/>
                
                <div style={listDisplayStyle}>
                    {showPrevious &&
                        <button style={listSelectorStyle} onClick={async () => {await this.getPreviousUserImage();}}>
                            Previous
                        </button>}
                    {showNext && 
                        <button style={listSelectorStyle} onClick={async () => {await this.getNextUserImage();}}>
                          Next
                        </button>}
                </div>
            </div>
        )
    }
}

export default withAuth0(MyImageDisplayComponent)