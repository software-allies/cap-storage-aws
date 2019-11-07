# CAP STORAGE AWS 

**CAP STORAGE AWS** is a module for **Angular**, with this module you can upload images to **AWS S3**.

## **Previous requirements**
**CAP STORAGE AWS** use bootstrap's classes. To be able to display the component in the right way, bootstrap should have been installed in the project. In case you don't have bootstrap installed, you can run the following command:
```
npm install bootstrap
```
One's that you installed bootstrap you have to configure the `angular.json` and write into `styles`
```
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "styles.scss"
]
```

## **`Important!`**
Before to install the dependency you should have the following script into the polyfills.ts file:

```
(window as any).global = window;
```

After that you may encounter compilation issues when using the typings provided by the SDK in an Angular project created using the Angular CLI.

To resolve these issues, either add "types": ["node"] to the project's tsconfig.app.json file, or remove the "types" field entirely.

## **Installation**

write the following command:
```
npm install cap-storage-aws
```

## **Implementation into a module**
To use this module go-to the app module and into the sections' import and put the AWS module.
```
import { CapStorageAWS } from 'cap-storage-aws';
```
After that, add into modules' array with your credentials.
**Example:**
```
CapStorageAWS.forRoot({
    bucket: 'your-bocket',
    accessKeyId: 'your-accessKeyID',
    secretAccessKey: 'your-secretAccessKey',
    region: 'your-region',
    folder: 'your-folder'
})
```

## **Configuration AWS S3**
We recommend creating a specific folder into your bucket for save your images. In your bucket 
go the section of **permissions**, after that, go to **CORS configuration** and write the following code:

```   
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <ExposeHeader>ETag</ExposeHeader>
    <ExposeHeader>x-amz-meta-custom-header</ExposeHeader>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

## **HTML elements**
If you want to upload images, you should use the `<photo-upload>` tag. This tag provides an HTML that include a button to select your image, a preview section of the image that you want to upload, a progress bar, and a button to upload the image.


**Example of implementation**
```
<cap-upload></cap-upload>

```

![Alt text](assets/images/cap-aws.gif?raw=true "example")


## **Services**
This module contains a storage service, this services expose a method to upload images and get the images of the bucket.
**Method getFiles**
**Example to get images**
```
constructor( private _fileUpload: StorageService ) {
        this.showFiles()
    }
    ngOnInit() {}

    getFiles(){
        this.images = this._fileUpload.getFiles();
    }
```
**Method upload**
The upload method receives 2 parameters:
A file(image) to upload and a callback, this callback it's for the event On for know when the image upload it's complete.
```
upload(file:any, fn:any){

}
```




