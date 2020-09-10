import React from 'react';
// import ImageUploader from 'react-images-upload';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';


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
        // this.isAtStart = this.isAtStart.bind(this)
        // this.isAtEnd = this.isAtEnd.bind(this)
        this.getNextUserImageData = this.getNextUserImageData.bind(this)
        // this.getInitialData = this.getInitialData.bind(this)
    }

    componentDidMount() {
        //Make API call here
        this.getMyImageData()
    }

    // getInitialData() {
    //     this.getMyImageData()
    // }

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
        try {
            const response = await axios.get(
                `http://127.0.0.1:5000/get-image/${id}`,
                { responseType: 'blob' }
            )
            // console.log('response in getImageData')
            // const maxImageID = response.headers['max_image_id'] ? parseInt(response.headers['max_image_id']) : this.state.maxImageID
            // console.log(response.headers)
            this.setState({
                id: parseInt(response.headers['image_id']),
                picture: response.data,
                name: response.headers['image_name'],
                currentImageIndex: newImageIndex
                // this.state.display.concat() response.data 
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
        // console.log('start of getMyImageData')
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
            // const maxImageID = response.headers['max_image_id'] ? parseInt(response.headers['max_image_id']) : this.state.maxImageID
            console.log(response)

            this.setState({
                id: parseInt(response.headers['image_id']),
                picture: response.data,
                name: response.headers['image_name'],
                imageIDList: response.headers['user_image_id_list'].split(','),
                currentImageIndex: 0
                // this.state.display.concat() response.data 
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
        const { isAuthenticated } = this.props.auth0;
        if (!isAuthenticated) {
            console.log('not authenticated on render')
            return <h3>Please log in to view the images you've altered</h3>
        }

        // if (!this.state.initialized) {
        //     this.getInitialData()
        // }

        // const isAtStart = this.isAtStart()
        // const isAtEnd  = this.isAtEnd()
        
        return (
            <div>
                <h2>Images which have had effects applied to them</h2>
                <img src={ URL.createObjectURL(this.state.picture)} class="preview" />
                {!(this.state.currentImageIndex === 0) &&
                    <button className="btn btn-success"
                        onClick={async () => {await this.getPreviousUserImage();}}
                    >
                        Previous
                    </button>}
                {!(this.state.currentImageIndex === this.state.imageIDList.length) && 
                    <button className="btn btn-success"
                      onClick={async () => {await this.getNextUserImage();}}
                    >
                      Next
                    </button>}
            </div>
        )
    }
}

export default withAuth0(MyImageDisplayComponent)