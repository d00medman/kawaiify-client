class CSS {
    static mainDisplaySelectorStyle(float) {
        return {
            background: 'none',
            color: '#FFF',
            float: float,
            border: 'none',
            fontFamily: 'Bookman, URW Bookman L, serif',
            minWidth: '12em',
            paddingTop: '20px',
            paddingBottom: '20px',
            paddingLeft: '40px',
            paddingRight: '40px',
            fontSize: '30px'

        }
    }

    static listSelectorStyle() {
        return {
            background: 'none',
            color: '#FFF',
            padding: '0 1.15em',
            margin: '0 0.65em',
            minWidth: '3em',
            lineHeight: '36.4px',
            border: 'none',
            borderRadius: '8px',
            fontFamily: 'Bookman, URW Bookman L, serif'
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
            width:'auto',
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
}

export default CSS