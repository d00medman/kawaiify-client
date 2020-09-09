import React from 'react';
// import ImageUploader from 'react-images-upload';
import axios from 'axios';

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
        //Make API call here
        this.getImageData(-1)
    }

    async getImageData(id) {
        try {
            const response = await axios.get(
                `http://127.0.0.1:5000/get-image/${id}`,
                { responseType: 'blob' }
            )
            console.log('response in getImageData')
            // console.log()
            // let objrep = JSON.parse(response.headers['bumped_data'])
            // console.log(typeof(response.headers['image_id']))
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
        return (
            <div>
                <h2>Images which have had effects applied to them</h2>
                <img src={ URL.createObjectURL(this.state.picture)} class="preview" />
                {this.state.id > 1 &&
                    <button className="btn btn-success"
                        onClick={async () => {await this.getImageData(this.state.id - 1);} }
                    >
                        Previous
                    </button>}
                {this.state.id < this.state.maxImageID && 
                    <button className="btn btn-success"
                      onClick={async () => {await this.getImageData(this.state.id + 1);} }
                    >
                      Next
                    </button>}
            </div>
        )
    }
}

export default ImageDisplayComponent