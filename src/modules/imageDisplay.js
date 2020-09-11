import React from 'react';
// import ImageUploader from 'react-images-upload';
import axios from 'axios';
import CSS from '../css.js'

class ImageDisplayComponent extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            id: null,
            maxImageID: null,
            name: '',
            picture: new Blob(),
        }

        this.getImageData = this.getImageData.bind(this)
    }

    componentDidMount() {
        this.getImageData(-1)
    }

    async getImageData(id) {
        try {
            const response = await axios.get(
                `http://127.0.0.1:5000/get-image/${id}`,
                { responseType: 'blob' }
            )
            console.log('response in getImageData')
            const maxImageID = response.headers['max_image_id'] ? parseInt(response.headers['max_image_id']) : this.state.maxImageID
            console.log(response.headers)
            this.setState({
                id: parseInt(response.headers['image_id']),
                picture: response.data,
                name: response.headers['image_name'],
                maxImageID: maxImageID
                // this.state.display.concat() response.data 
            },  () => {
                console.log('state in set state in list images')
                console.log(this.state);
            });
        } catch(error) {
            console.log('error in getImageData')
            console.log(error)
        }
    }

    render() {
        const listDisplayStyle = CSS.listDisplayStyle('10px')
        const listSelectorStyle = CSS.listSelectorStyle()
        const imageDisplayStyle = CSS.imageDisplayStyle()
        const mainHeadlineStyle = CSS.mainHeadlineStyle()
        
        const showPrevious = this.state.id > 1
        const showNext = this.state.id < this.state.maxImageID

        return (
            <div>
                <div style={listDisplayStyle}>
                    <h3 style={mainHeadlineStyle}>All images kawaiified by users</h3>
                </div>

                <img style={imageDisplayStyle} src={ URL.createObjectURL(this.state.picture)} class="preview" />
                
                <div style={listDisplayStyle}>
                    {showPrevious &&
                        <button style={listSelectorStyle} onClick={async () => {await this.getImageData(this.state.id - 1);}}>
                            Previous
                        </button>}
                    {showNext && 
                        <button style={listSelectorStyle} onClick={async () => {await this.getImageData(this.state.id + 1);}}>
                          Next
                        </button>}
                </div>
            </div>
        )
    }
}

export default ImageDisplayComponent