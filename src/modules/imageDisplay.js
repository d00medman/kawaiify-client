import React from 'react';
import axios from 'axios';
import CSS from '../css.js'
import { withAuth0 } from '@auth0/auth0-react';
import Loader from 'react-loader-spinner'

class ImageDisplayComponent extends React.Component {

    // component lifecycle functions
    constructor(props) {
        super(props)
        this.state = {
            id: props.imageId,
            fileName: '',
            creatorEmail: '',
            cloudUrl: '',
            isLoading: false,
        }

        this.getImageData = this.getImageData.bind(this)
    }

    componentDidMount() {
        this.getImageData(this.props.imageId)
    }

    getAPIURLBase() {
        const { prodAPIURL } = this.props
        console.log(this.props.prodAPIURL)
        return prodAPIURL ? prodAPIURL : 'http://127.0.0.1:5000'
        // return 'http://127.0.0.1:5000'
    }

    // API contact functions
    async deleteMyImage(id) {
        console.log(`id in getNextUserImageData: ${id}`)
        const { isAuthenticated, getAccessTokenSilently } = this.props.auth0;
        if (!isAuthenticated) {
            console.log(`only authenticated users should be able to delete files`)
            return false
        }

        this.setState({
            isLoading: true
        }, () => {
            console.log('set state to loading in deleteMyImage')
        })
  

        const token = await getAccessTokenSilently()
        console.log('get access token in delete my image')
        console.log(token)
        try {
            const response = await axios.get(
                `${this.getAPIURLBase()}/delete-my-image-data/${id}`,
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                    } 
                }
            )
            console.log('response in deleteMyImage')
            console.log(response)
            if (response.status === 200) {
                this.setState({
                    isLoading: false
                }, () => {
                    console.log('set state to loading in deleteMyImage')
                })
                // Redirects us back to the appropriate list view 
                this.props.setDisplayList(true)
            } else {
                console.log('unsuccessful status code from server')
            }
        } catch(error) {
            console.log('error in deleteMyImage')
            console.log(error)
        }
    }

    async reportImage(id) {
        try {
            const response = await axios.get(
                `${this.getAPIURLBase()}/report-image/${id}`
            )
            console.log('response in reportImage')
            console.log(response)

            if (response.status === 200) {
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
                `${this.getAPIURLBase()}/get-image/${id}`,
                // { responseType: 'blob' }
            )
            console.log('response in getImageData')
            console.log(response)
            this.setState({
                cloudUrl: response.data.cloudUrl,
                fileName: response.data.fileName,
                creatorEmail: response.data.creatorEmail
            },  () => {
                console.log('state in set state in list images')
                console.log(this.state);
            });
        } catch(error) {
            console.log('error in getImageData')
            console.log(error)
        }
    }

    // JSX construction methods
    controlPanel() {
        const { isAuthenticated } = this.props.auth0;
        const listDisplayStyle = CSS.listDisplayStyle('10px')
        const deleteImageStyle = CSS.filledButtonStyle('#eb726a')

        const { id } = this.state

        if (isAuthenticated && this.props.isMyImage) {
            return (
                <div style={listDisplayStyle}>
                    <button style={deleteImageStyle} onClick={async () => {this.deleteMyImage(id)}}>
                            Delete
                    </button>
                </div>
            )
        }

        return (
            <div style={CSS.listDisplayStyle('10px')}>
                <button style={deleteImageStyle} onClick={async () => {this.reportImage(id)}}>
                    Report
                </button>
            </div>
        )
    }

    // URL.createObjectURL(this.state.picture)

    render() {
        const { fileName, creatorEmail, cloudUrl, isLoading } = this.state

        const listDisplayStyle = CSS.listDisplayStyle('10px')
        const listHeadline = this.props.isMyImage ? fileName : `${fileName} - created by ${creatorEmail}`

        return (
            <div>
                <div style={listDisplayStyle}>
                    <h3 style={CSS.mainHeadlineStyle()}>{listHeadline}</h3>
                </div>

                <div style={listDisplayStyle}>
                    {!isLoading ? 
                        <img style={CSS.imageDisplayStyle()} src={cloudUrl} />
                        : <Loader type="Bars" color="#eb726a" height={80} width={80} float="right" />}
                </div>

                <div style={listDisplayStyle}>
                    {this.controlPanel()}
                </div>
                
            </div>
        )
    }
}

export default withAuth0(ImageDisplayComponent)