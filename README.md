# CAP STORAGE AWS 

CAP STORAGE AWS is a module for Angular, with this module you could upload images to **AWS S3** and use a list of the images that you have in your bucket.

## **Installation of CAP STORAGE AWS**

write the following command:
```
npm install cap-storage-aws
```

## **Implementation into a module**
For use this module go to app module and into the sections of import put the AWS module.
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
We recommend create a specific folder into your bucket for save your images. In your bucket 
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
If you want upload image, you should use the <photo-upload> tag. This tag provide an html that include a button to select your image, a preview section of the image that you want to upload, a progress bar, and a button to upload the image.

But if you want you see your image like a list you could use the tag <image-list>

**Example of implementation**
```
<cap-upload></cap-upload>
<h1>List of images</h1>
<cap-img-list></cap-img-list>
```
## **Services**
This module contains a storage service, this services expone a method to upload images and get the images of the bucket.
**Method getFiles**
**Example to get images**
```
constructor( private _fileUpload: StorageService ) {
        this.showFiles()
    }
    ngOnInit() {}

    showFiles(){
        this.images = this._fileUpload.getFiles();
    }
```
**Method upload**
The upload method receive 2 parameters:
A file(image) to upload and a callback, this callback it's for the event On for know when the image upload it's complete.
```
upload(file:any, fn:any){

}
```
**Note**
When you're working with 
```
<script>
    if (global === undefined) {
      var global = window;
    }
</script>
```



