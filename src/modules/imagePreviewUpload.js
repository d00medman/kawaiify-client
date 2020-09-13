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
           imageId: 0,
           chosenEffects: []
         };
         this.onDrop = this.onDrop.bind(this);
         this.uploadImage = this.uploadImage.bind(this)
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
      this.imageUploader.current.clearPictures();
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

    async uploadImage() {
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
                'http://127.0.0.1:5000/upload-image',
                bodyFormData,
                { 
                  headers: { 'Content-Type': 'multipart/form-data' },
                  responseType: 'blob'
                }
            )

            this.setState({
              // pictures: [],
              preview: response.data,
              hasPreview: true,
              imageId: response.headers['image_id']
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

  // TODO: identical to the method with the same name in image display file
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

          // this.props.setDisplayList(true)

          this.setState({
            preview: new Blob(),
            imageId: 0,
            hasPreview: false,
          },  () => {
            console.log('state in getMyImageData')
            console.log(this.state);
          });
      } catch(error) {
          console.log('error in deleteMyImage')
          console.log(error)
      }
  }
 
    render() {
        const { isAuthenticated } = this.props.auth0;
        if (!isAuthenticated) {
            return <h3>Please log in to add effects to images</h3>
        }

        const { chosenEffects, pictures, preview, hasPreview, imageId } = this.state;

        const listDisplayStyle = CSS.listDisplayStyle('10px')
        const imageUploaderLeftStyle = CSS.imageUploadComponentStyle('left') 
        const uploadButtonStyle = CSS.filledButtonStyle('#6be8c7') 
        const fileUploaderStyle = CSS.fileUploaderStyle()
        const imageDisplayStyle = CSS.imageDisplayStyle()
        const imageUploaderRightStyle = CSS.imageUploadComponentStyle('right')
        const mainHeadlineStyle = CSS.mainHeadlineStyle()
        const deleteImageStyle = CSS.filledButtonStyle('#eb726a')

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
                  {pictures.length >= 1 && 
                    <div>
                      <Select
                        value={chosenEffects}
                        onChange={this.chooseEffects}
                        options={this.allEffects}
                        isMulti={true}
                        styles={selectStyles}
                      />
                      <button style={uploadButtonStyle} onClick={async () => {await this.uploadImage()} }>
                        Upload
                      </button>
                    </div>}
                </div>
                {hasPreview && 
                  <div style={imageUploaderRightStyle}>
                      <img style={imageDisplayStyle} src={ URL.createObjectURL(preview)} />
                      <button style={deleteImageStyle} onClick={async () => {this.deleteMyImage(imageId)}}>
                            Delete
                    </button>
                  </div>}
              </div>
              
            </div>
          </div>
        );
    }
}

export default withAuth0(ImagePreviewUploadComponent);