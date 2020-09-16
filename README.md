### Kawaiify Client

As a whole, my expertise is more server side than client side. That said, given the nature of the role I am interviewing to fill, I felt it made more sense than not to create a presentable baseline client. I initially attempted to do this in Angular, as I have been working with Angular for most of this year. I pretty quickly switched my approach to use React, as I have more experience with it and overall find it to be a far more elegant manner of creating javascript clients.

I will not pretend that this approach conforms to best practices. Notably, it features the coexistence of functional components (profile.js, which was essentially lifted straight from the auth0 quick start tutorials, and is realistically something of a misnomer, as it is more a header than a profile) and class components (everything else). The main body of the application has two core features. These components are displayed in the center of the screen, and the user can switch between them via the large, bordered buttons at the top of the screen. These buttons could later be expanded into a multi-tab design to accomodate more features in the central display.

First, the image uploader, contained entirely `imagePreviewUpload.js`. this component allows the user to select the photo they wish to upload, what they wish to name it, and the effects they wish to apply to it. A user must be authenticated to access this component. When the user hits upload, a loading icon appears until the upload process has completed (the length of this process is directly related to the file size). Once the image has been uploaded successfully, the altered, uploaded image is loaded from the cloud storage bucket via a public facing url. Underneath it, there is a delete button which allows the user to delete the image. This component notably uses multiple prepackaged components. The upside of this was that I did not need to reinvent the wheel. The downside was that wrangling the CSS to behave as anticiapted was something of a nightmare. A second issue is that, if the server returns an error, no indication of this problem is raised to the user. I found that fixing the latter was mutually exclusive with the tenuous balance I had found with the CSS, so I opted to leave it in place. Difficulty with CSS was a recurring theme throughout this project. I spent a considerable amount of time getting the application into the state it is in. I think my instinct on the design is generally in the right place, but the use of pre-built components considerably complicated the execution.

Second, the display component. This component has two discrete lists (both of which are handled by `imageList.js`), one which displays all images altered by all users (this is also both the default landing page and the only page accesible for unauthenticated users) The user can switch between this list view and a list view which exclusively contains images they have added effects to. Which view is active is denoted by both the headline and the presence of a border around the buttons at the top of the list used for switching. My intent was to display a paginated 5x5 grid, but I was again thwarted by CSS behaving oddly. The all user list seems to suffer from a performance deterioration as more images come into the system, and would likely need to be paginated before long. When you click on one of the discrete cells, it opens a view of the image itself (`imageDisplay.js`). As with the list, there are variants in display text for both your image and someone elses. The core difference Between the two is the removal button. For your images, you can outright delete the image. When you move to do this, a red loading icon flashes until the image is successfully removed from the storage bucket. This uses the same endpoint as the delete functionality present in the image display. For the images of others, you can only report their image. Doing this will set a flag in the database on this image, rendering it inacessible. I put this feature in place because I planned on showing this to my friends, and was worried they would abuse it and post obscene content which I would need to hide. More broadly, I also could see the need for ajudication of whether something is obscene or not so it can be restored, making this feature more a baseline for future development.

As a whole, I am a stronger server side developer than client side. However, I am no slouch in client side development, given sufficient motivation. Given the support of a designer (preferably one with a clear understanding of CSS), I have the utmost confidence in my ability to develop a high quality user facing GUI to serve your product to end users. 