const express= require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );
const url = require('url');
var zipcodes = require('zipcodes');


const mysql = require('mysql');
const app = express();
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const s3 = new aws.S3({
 accessKeyId: 'ASIAX62GXFY3SMLZP357',
 secretAccessKey: 'X+JNwlkr86gMwBJWKJNbvN85Vv0EDTWMKIqnDukl',
 sessionToken:'FQoGZXIvYXdzEOT//////////wEaDATBA/vDhUc2gqlDrCKWAkLxgS+b2XMopNPHrbrLiSNSK2puR5Tm6Z8e4Qhlqjhia4N4N6+7QCSoFgCfJLGfXNtDVDQu8gPAMrC71TqXjPLtbZYhd0vLR3C7NWL74O1OONSpgMrw6AYgVYgWy50RwdrNPtap7A82hn3X1VahTWY99yAPl8630sghs2DgMJlsVkAas8yPTEITyMIghQyOJNXOnybnENQFACoH9HbzZVRwEQKipLgnWFfOLk5Uz5fyfpaobn/XVdw7fHX/qbqC+nAFvbuMTJBlzSVhDcd0VlsAN1Xztd4J9OFsse/vo1b535jqoMkP9KOTvf+mGk2Up5fB8YpRAu+3lCoDWmqfDl8IYp+bRllp0KqclOuT3aSu6gUCBdxVKJvZi+wF',
 Bucket: 'cloud337'
});

function checkFileType( file, cb ){
 // Allowed ext
 const filetypes = /jpeg|jpg|png|gif/;
 // Check ext
 const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
 // Check mime
 const mimetype = filetypes.test( file.mimetype );
if( mimetype && extname ){
  return cb( null, true );
 } else {
  cb( 'Error: Images Only!' );
 }
}


const profileImgUpload = multer({
 storage: multerS3({
  s3: s3,
  bucket: 'cloud337',
  // acl: 'public-read',
  key: function (req, file, cb) {
   cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
  }
 }),
 limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
 fileFilter: function( req, file, cb ){
  checkFileType( file, cb );
 }
}).single('profileImage');




app.get('*',(req,res)=>{
  res.json('OK');
})


app.post('/img',(req,res)=>{

profileImgUpload( req, res, ( error ) => {
  // console.log( 'requestOkokok', req.file );
  // console.log( 'error', error );
  if( error ){
   console.log( 'errors', error );
   res.json( { error: error } );
  } else {
   // If File not found
   if( req.file === undefined ){
    console.log( 'Error: No File Selected!' );
    res.json( 'Error: No File Selected' );
   } else {
    // If Success
    const imageName = req.file.key;
    const imageLocation = req.file.location;
// Save the file name into database into profile model
    res.json( 
    {
     image: imageName,
     location: imageLocation
    }   

    );
   }
  }
 });


});

app.post('/',(req,res)=>{



var con = mysql.createConnection({
  host: "master.c02gbtm2eqhm.us-east-1.rds.amazonaws.com", // ip address of server running mysql
  user:"admin", // user name to your mysql database
  password:"password", // corresponding password
  database: "cse337" // use the specified database
});
 
// make to connection to the database.
con.connect(function(err) {
  if (err) throw err;
  // if connection is successful
  con.query("Select * from db", function (err, result, fields) {
    // if any error while executing above query, throw error
    if (err) 
      {
        console.log('error');
        throw err;

      }
      console.log('ITS OK');
    // if there is no error, you have the fields object
    // iterate for all the rows in fields object
    Object.keys(result).forEach(function(key) {
      var res = result[key];
 //     console.log(res)
    });
  });
});

 var xtra="";
 var hills = zipcodes.lookup(req.body.zip);
 var {city}=hills
 console.log(hills);
 var records = [[req.body.prodname,req.body.zip,city,req.body.phno]];
 console.log(records)

if(records[0][0]!=null)
{
  con.query("INSERT INTO db (prodname,zip,city,phno) VALUES ?", [records], function (err, result, fields) {
    if (err) console.log(err.sqlMessage);
   
   const abc={
    res:result,
    error:err
   }
   res.json(JSON.stringify(abc));

  });

}
//Comment
});

app.listen(8000,()=>{
  console.log(`Port 8000`);
})


