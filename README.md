#CAP STORAGE AWS 

CAP STORAGE AWS is a module for Angular, with this module you could upload images to **AWS S3** and use a list of the images that you have in your bucket.
This module prover a service that for upload and get the images of AWS.

**Installation of CAP STORAGE AWS**

write the following command:
```
    npm install cap-storage-aws
```

**Implementation into a module**
For use this module go to app module and into the sections of import put the AWS module.
This is a general configuration to use our module.
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

**Configuration AWS S3**
We recommend create a specific folder into your bucket for save your images. In your bucket 
go the section of **permissions**, after that, go to **CORS configuration** and write the following code:

```   
    <?xml version="1.0" encoding="UTF-8"?>
    <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>HEAD</AllowedMethod>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedMethod>DELETE</AllowedMethod>
        <ExposeHeader>ETag</ExposeHeader>
        <ExposeHeader>x-amz-meta-custom-header</ExposeHeader>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
    </CORSConfiguration>
```

**HTML elements**
If you want upload image, you should use the <photo-upload><photo-upload> tag. This tag provide an html that include a button to select your image, a preview section of the image that you want to upload, a progress bar and a button to upload the image.

But if you want you see your image like a list you could use the tag <image-list></image-list>


**Example of implementation**
```
    <photo-upload></photo-upload>
    <h1>Lists of images</h1>
    <image-list></image-list>
```



