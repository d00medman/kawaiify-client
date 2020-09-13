import React from 'react';
import axios from 'axios';
import CSS from '../css.js'
import { withAuth0 } from '@auth0/auth0-react';

class ImageDisplayComponent extends React.Component {

    constructor(props) {
        super(props)

        // console.log('props in ImageDisplayComponent constructor:')
        // console.log(props)

        this.state = {
            id: props.imageId,
            name: '',
            creator: '',
            picture: new Blob(),
        }

        this.getImageData = this.getImageData.bind(this)
    }

    componentDidMount() {
        this.getImageData(this.props.imageId)
    }

    async deleteMyImage(id) {
        console.log(`id in getNextUserImageData: ${id}`)
        const { isAuthenticated } = this.props.auth0;
        if (!isAuthenticated) {
            console.log(`only authenticated users should be able to delete files`)
            return false
        }

        try {
            const response = await axios.get(
                `http://127.0.0.1:5000/delete-my-image-data/${id}`,
                { 
                    // responseType: 'blob', 
                    // headers: { Pragma: 'no-cache'} 
                }
            )
            console.log('response in deleteMyImage')
            console.log(response)
            if (response.stats === 200) {
                // Redirects us back to the appropriate list view 
                this.props.setDisplayList(true)
            } else {
                console.log('unsuccessful status code from server')
            }

            // Call the parent method to return to the list view
        } catch(error) {
            console.log('error in deleteMyImage')
            console.log(error)
        }
    }

    async reportImage(id) {
        console.log(`id in reportImage: ${id}`)
        // const { isAuthenticated } = this.props.auth0;
        // if (!isAuthenticated) {
        //     console.log(`only authenticated users should be able to delete files`)
        //     return false
        // }

        try {
            const response = await axios.get(
                `http://127.0.0.1:5000/report-image/${id}`,
                { 
                    // responseType: 'blob', 
                    // headers: { Pragma: 'no-cache'} 
                }
            )
            console.log('response in reportImage')
            console.log(response)

            if (response.stats === 200) {
                // Redirects us back to the appropriate list view 
                this.props.setDisplayList(false)
            } else {
                console.log('unsuccessful status code from server')
            }

        } catch(error) {
            console.log('error in deleteMyImage')
            console.log(error)
        }
    }

    async getImageData(id) {
        console.log(`id in getImageData: ${id}`)
        try {
            const response = await axios.get(
                `http://127.0.0.1:5000/get-image/${id}`,
                { responseType: 'blob' }
            )
            console.log('response in getImageData')
            console.log(response)
            this.setState({
                picture: response.data,
                name: response.headers['image_name'],
                creator: response.headers['image_creator']
            },  () => {
                console.log('state in set state in list images')
                console.log(this.state);
            });
        } catch(error) {
            console.log('error in getImageData')
            console.log(error)
        }
    }

    controlPanel() {
        const { isAuthenticated, user } = this.props.auth0;
        const listDisplayStyle = CSS.listDisplayStyle('10px')
        const deleteImageStyle = CSS.filledButtonStyle('#eb726a')

        if (isAuthenticated && this.props.isMyImage) {
            return (
                <div style={listDisplayStyle}>
                    <button style={deleteImageStyle} onClick={async () => {this.deleteMyImage(this.state.id)}}>
                            Delete
                    </button>
                </div>
            )
        }

        return (
            <div style={CSS.listDisplayStyle('10px')}>
                    <button style={deleteImageStyle} onClick={async () => {this.reportImage(this.state.id)}}>
                            Report
                    </button>
            </div>
        )
    }

    render() {
        console.log('props in ImageDisplayComponent render:')
        console.log(this.props)

        const listHeadline = this.props.isMyImage ? this.state.name : `${this.state.name} - created by ${this.state.creator}`

        return (
            <div>
                <div style={CSS.listDisplayStyle('10px')}>
                    <h3 style={CSS.mainHeadlineStyle()}>{listHeadline}</h3>
                </div>

                <img style={CSS.imageDisplayStyle()} src={ URL.createObjectURL(this.state.picture)} class="preview" />

                {this.controlPanel()}
            </div>
        )
    }
}

export default withAuth0(ImageDisplayComponent)