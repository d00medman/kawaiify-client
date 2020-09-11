import React from 'react';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import Select from 'react-select';
import CSS from '../css.js'
// import URL from ''

// const Example = ({ data }) => <img src={URL.createObjectURL(data)} />
 
class ImagePreviewUploadComponent extends React.Component {
    allEffects = [
      {'value': 'dnn_sparkle', 'label': 'Accurate Sparkles'},
      {'value': 'dnn_googly', 'label': 'Accurate Googly Eyes'},
      {'value': 'haar_sparkle', 'label': 'Less Accurate Sparkles'},
      {'value': 'haar_googly', 'label': 'Less Accurate Googly Eyes'},
      {'value': 'circle', 'label': 'Circlify'}
    ]

    constructor(props) {
        super(props);
         this.state = { 
           pictures: [],
           hasPreview: false,
           preview: new Blob(),
           chosenEffects: []
         };
         this.onDrop = this.onDrop.bind(this);
         this.uploadPreview = this.uploadPreview.bind(this)
         this.chooseEffects = this.chooseEffects.bind(this)
         this.imageUploader = React.createRef()
    }
 
    onDrop(picture) {
        this.setState({
            pictures: picture 
        },  () => {
          console.log('state in onDrop')
          console.log(this.state.pictures);
        });
    }

    clearImage() {
      // this.imageUploader.current.clearPictures();
      this.setState({
        chosenEffects: [],
      },  () => {
        console.log('state in clearImage')
        console.log(this.state);
      });
    }

    chooseEffects(effects) {
      this.setState({
        chosenEffects: effects,
      },  () => {
        console.log('state in chooseEffect')
        console.log(this.state);
      });      
    }

    async uploadPreview() {
    
        const { user } = this.props.auth0;
        var bodyFormData = new FormData();
        // console.log(this.state.chosenEffects)
        const chosenEffects = this.state.chosenEffects.map(a => a.value).join(',')
        // .map(a => a.name);
        // console.log('chosen effects')
        console.log(chosenEffects)
        bodyFormData.append('image', this.state.pictures[0]);
        bodyFormData.append('email', user.email);
        bodyFormData.append('effects', chosenEffects)
        // console.log(bodyFormData)
        try {
            const response = await axios.post(
                'http://127.0.0.1:5000/preview-image',
                bodyFormData,
                { 
                  headers: { 'Content-Type': 'multipart/form-data' },
                  responseType: 'blob'
                }
            )

            this.setState({
              // pictures: [],
              preview: response.data,
              hasPreview: true
            },  () => {
              console.log('state in uploadPreview')
              console.log(this.state);
            });

        this.clearImage()
        } catch(error) {
            console.log('error in upload:')
            console.log(error)
        }
    }
 
    render() {
        const { isAuthenticated } = this.props.auth0;
        if (!isAuthenticated) {
            return <h3>Please log in to add effects to images</h3>
        }

        const { chosenEffects } = this.state;

        const listDisplayStyle = CSS.listDisplayStyle('10px')
        const imageUploaderLeftStyle = CSS.imageUploadComponentStyle('left') 
        const uploadButtonStyle = CSS.filledButtonStyle('#6be8c7') 
        const fileUploaderStyle = CSS.fileUploaderStyle()
        const imageDisplayStyle = CSS.imageDisplayStyle()
        const imageUploaderRightStyle = CSS.imageUploadComponentStyle('right')
        const mainHeadlineStyle = CSS.mainHeadlineStyle()

        const selectStyles = {
          option: (provided, state) => ({
            ...provided,
            borderBottom: '1px dotted pink',
            color: state.isSelected ? 'red' : 'blue',
            padding: 20,
          }),
          control: () => ({
            // none of react-select's styles are passed to <Control />
            width: 200,
          }),
          multiValue: (provided, state) => {
            const opacity = state.isDisabled ? 0.5 : 1;
            const transition = 'opacity 300ms';
        
            return { ...provided, opacity, transition };
          }
        }

        return (
          <div>
            <div style={listDisplayStyle}>
                <h3 style={mainHeadlineStyle}>Kawaiify an image</h3>
            </div>
            <div>
              <div>
                <div style={imageUploaderLeftStyle}>
                  <ImageUploader
                    withIcon={true}
                    withPreview={true}
                    singleImage={true}
                    buttonText='Choose image'
                    onChange={this.onDrop}
                    imgExtension={['.jpg', '.jpeg', '.png']}
                    maxFileSize={5242880}
                    ref={this.imageUploader}
                    style={fileUploaderStyle}
                  />
                  {this.state.pictures.length >= 1 && 
                    <div>
                      <Select
                        value={chosenEffects}
                        onChange={this.chooseEffects}
                        options={this.allEffects}
                        isMulti={true}
                        styles={selectStyles}
                      />
                      <button style={uploadButtonStyle} onClick={async () => {await this.uploadPreview()} }>
                        Upload
                      </button>
                    </div>}
                </div>
                <div style={imageUploaderRightStyle}>
                  {this.state.hasPreview && 
                    <img style={imageDisplayStyle} src={ URL.createObjectURL(this.state.preview)} class="preview" />}
                </div>
              </div>
              
            </div>
          </div>
        );
    }
}

export default withAuth0(ImagePreviewUploadComponent);