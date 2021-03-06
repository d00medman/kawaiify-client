// This is not best practice, but it was the quickest answer to the question of how I was to handle CSS

class CSS {
    static mainDisplaySelectorStyle(float) {
        return {
            background: 'none',
            color: '#FFF',
            float: float,
            borderStyle: 'rounded',
            borderColor: '#FFF',
            fontFamily: 'Bookman, URW Bookman L, serif',
            minWidth: '12em',
            paddingTop: '20px',
            paddingBottom: '20px',
            paddingLeft: '40px',
            paddingRight: '40px',
            fontSize: '30px'

        }
    }

    static listSelectorStyle(isActive) {
        return {
            background: 'none',
            color: '#FFF',
            padding: '0 1.15em',
            margin: '0 0.65em',
            minWidth: '3em',
            lineHeight: '36.4px',
            border: isActive ? '1px solid #FFF' : 'none',
            borderRadius: '8px',
            fontFamily: 'Bookman, URW Bookman L, serif'
        }
    }

    static listItemContainerStyle() {
        return {
            padding: '20px',
            borderBottom: '1px solid #FFF',
            // borderTopStyle: 'solid'
        }
    }

    static imageListTextStyle() {
        return {
            float: 'right',
            padding: '4px'
        }
    }

    static imageListDisplayStyle() {
        return {
            width: '100px',
            padding: '6px'
        }
    }

    static imagePreviewDisplayStyle() {
        return {
            width: '450px',
            padding: '5px'
        }
    }

    static imageDisplayStyle() {
        return {
            width: '550px'
        }
    }

    static filledButtonStyle(color) {
        return {
            background: color,
            color: '#FFF',
            padding: '0 1.15em',
            margin: '0 0.65em',
            minWidth: '3em',
            lineHeight: '36.4px',
            border: 'none',
            borderRadius: '8px',
            fontFamily: 'Noto Sans, sans-serif'
        }
    }

    static navbarStyle(float) {
        return {
            float: float,
            height:'75%',
            padding: '10px',
        }
    }

    static imageUploadComponentStyle(float) {
        return {
            float: float,
            height:'75%',
            padding: '10px',
            width:'45%',
        }
    }

    static headerStyle() {
        return {
            margin: '0px',
            outline: '1px solid #CCC',
            background: '#212121',
            color: '#FFF',
            height:'auto',
            overflow:'auto',
        }
    }

    static footerStyle() {
        return {
            margin: '0px',
            outline: '1px solid #CCC',
            background: '#212121',
            color: '#FFF',
            height:'100%',
            width: '100%',
            overflow:'auto',
            position: 'absolute',
            textAlign: 'center'
        }
    }

    static listDisplayStyle(padding) {
        return {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: padding,
        }
    }

    static appStyle() {
        return {
            background: '#2c2c2c',
            color: '#FFF',
        }
    }

    static fileUploaderStyle() {
        return {
            color: '#000000'
        }
    }

    static mainHeadlineStyle() {
        return {
            fontFamily: "Blippo, fantasy"
        }
    }

    static paragraphStyle() {
        return {
            fontFamily: "FreeMono, monospace"
        }
    }

    static deleteImageStyle() {
        return {
            position: 'absolute',
	        top: '-9px',
	        right: '-9px',
	        color: '#fff',
	        background: '#ff4081',
	        borderRadius: '50%',
	        textAlign: 'center',
	        cursor: 'pointer',
	        fontSize: '26px',
	        fontWeight: 'bold',
	        lineHeight: '30px',
	        width: '30px',
	        height: '30px'
        }
    }

    static gridStyle() {
        return {
            display: 'grid',
            gridTemplateRows: '150px 1fr 2fr 150px',
            gridTemplateColumns: '150px 1fr 2fr 150px',
            gridGap: '30px'
        }
    }

    static gridItemStyle() {
        return {
            display: 'flex',
            padding: '20px'
        }
    }
}

export default CSS