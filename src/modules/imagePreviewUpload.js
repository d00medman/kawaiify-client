import React from 'react';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import Select from 'react-select';
import CSS from '../css.js'

// Indentation is a bit screwy in this file, and I didn't want to waste the time harmonizing it
 
class ImagePreviewUploadComponent extends React.Component {
    allEffects = [
      {'value': 'dnn_sparkle', 'label': 'Accurate Sparkles'},
      {'value': 'dnn_googly', 'label': 'Accurate Googly Eyes'},
      {'value': 'haar_sparkle', 'label': 'Less Accurate Sparkles'},
      {'value': 'haar_googly', 'label': 'Less Accurate Googly Eyes'},
      {'value': 'circle', 'label': 'Circlify'}
    ]

    // Component lifecycle functions
    constructor(props) {
      super(props);
      this.state = { 
        pictures: [],
        hasPreview: false,
        preview: new Blob(),
        imageId: 0,
        chosenEffects: [],
        imageName: ''
      };
      this.onDrop = this.onDrop.bind(this);
      this.uploadImage = this.uploadImage.bind(this)
      this.chooseEffects = this.chooseEffects.bind(this)
      this.changeImageName = this.changeImageName.bind(this)
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
        imageName: ''
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

  getAPIURLBase() {
    const { apiUrl } = this.props
    return apiUrl ? apiUrl : 'http://127.0.0.1:5000'
  }


  // API communication methods
  async uploadImage() {
        const { user, getAccessTokenSilently  } = this.props.auth0;
        const { chosenEffects, pictures, imageName} = this.state

        var bodyFormData = new FormData();
        bodyFormData.append('image', pictures[0]);
        bodyFormData.append('email', user.email);
        bodyFormData.append('effects', chosenEffects.map(a => a.value).join(','))
        bodyFormData.append('file_name', imageName)

        const token = await getAccessTokenSilently()

        try {
          const response = await axios.post(
              `${this.getAPIURLBase()}/upload-image`,
              bodyFormData,
              { 
                headers: { 
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token}`,
                },
                responseType: 'blob'
              }
          )
          this.setState({
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

    async deleteMyImage(id) {
        console.log(`id in getNextUserImageData: ${id}`)
        const { isAuthenticated, getAccessTokenSilently  } = this.props.auth0;
        if (!isAuthenticated) {
            console.log(`only authenticated users should be able to delete files`)
            return false
        }

        const token = await getAccessTokenSilently()

        try {
            const response = await axios.get(
                `${this.getAPIURLBase()}/delete-my-image-data/${id}`,
                { 
                    headers: { 
                      Authorization: `Bearer ${token}`,
                      // Pragma: 'no-cache'
                    } 
                }
            )
            console.log('response in deleteMyImage')
            console.log(response)

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

    changeImageName(event) {
      this.setState({
        imageName: event.target.value
      },  () => {
        console.log('state in changeImageName')
        console.log(this.state);
      });
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
                      <label>
                        Image Name:
                        <input type="text" value={this.state.imageName} onChange={this.changeImageName} />
                      </label>
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