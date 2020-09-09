import React from 'react';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
// import URL from ''

// const Example = ({ data }) => <img src={URL.createObjectURL(data)} />
 
class App extends React.Component {
 
    constructor(props) {
        super(props);
         this.state = { 
           pictures: [],
           hasPreview: false,
           preview: new Blob()
         };
         this.onDrop = this.onDrop.bind(this);
         this.uploadPreview = this.uploadPreview.bind(this)
         this.upload = this.upload.bind(this)
         this.imageUploader = React.createRef()
    }
 
    onDrop(picture) {
        // console.log('pic being uploaded')
        // console.log(picture)

        this.setState({
            pictures: picture 
        },  () => {
          console.log('state in set state')
          console.log(this.state.pictures);
        });
    }

    clearImage() {
      this.imageUploader.current.clearPictures();
    }

    async upload() {
      console.log('upload bolt')
    }

    async uploadPreview() {
      var bodyFormData = new FormData();
      bodyFormData.append('image', this.state.pictures[0]);
      try {
        const response = await axios.post(
          'http://127.0.0.1:5000/preview-image',
          bodyFormData,
          { 
            headers: { 'Content-Type': 'multipart/form-data' },
            responseType: 'blob'
          }
        )
        console.log('response in upload:')
        // console.log(response.data.blob())

        // console.log(`response data is type: ${typeof(response.data)}`)

        this.setState({
          // pictures: [],
          preview: response.data,
          hasPreview: true
        },  () => {
          console.log('state in set state')
          console.log(this.state);
        });

        // this.clearImage()
      } catch(error) {
        console.log('error in upload:')
        console.log(error)
      }
    }
 
    render() {
        return (
          <div>
            <h2>Preview your image</h2>
            <div class="row">
              <div class="column">
                <ImageUploader
                  withIcon={true}
                  withPreview={true}
                  singleImage={true}
                  buttonText='Choose image'
                  onChange={this.onDrop}
                  imgExtension={['.jpg', '.gif', '.png', '.gif']}
                  maxFileSize={5242880}
                  ref={this.imageUploader}
                />
                <div class="row">
                  <div class="column">
                    <button className="btn btn-success"
                      onClick={async () => {await this.uploadPreview();} }
                    >
                      Preview
                    </button>
                  </div>
                </div>
                <div class="column">
                  {this.state.hasPreview &&
                    <button className="btn btn-success"
                      onClick={async () => {await this.upload();} }
                    >
                      Upload
                    </button>
                  }
                </div>
              </div>
              <div class="column">
                {this.state.hasPreview && <img src={ URL.createObjectURL(this.state.preview)} class="preview" />}
              </div>
            </div>
          </div>
        );
    }
}

export default App;
