  import React,{Component} from 'react';
  import './App.css';
  import Particles from 'react-particles-js';
  import tachyons from 'tachyons';
  import Select from 'react-select';
  import axios from 'axios';
  import {InputText} from 'primereact/inputtext';

  const def_state = {'select2': {'value':'','label':'','link':''}}

  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
      (val) => val.length > 0 && (valid = false)
    );

    return valid;
  }


  class App extends Component {



  constructor(props)
  {
    super(props);
    this.state={
      prodname:'',
      zip:'',
      phno:'',
      filename:'',
      error:''
    }

  }

 
    handleUpload = (event) => {
    event.preventDefault();
    const data = new FormData();
    if(this.state.filename!='')
    data.append( 'profileImage', this.state.filename, this.state.filename.name );
    console.log("UPLOADING IMAGE");
    axios.post( `http://192.168.99.100:8000/img`, data, {
      headers: {
       'accept': 'application/json',
       'Accept-Language': 'en-US,en;q=0.8',
       'Content-Type': 'multipart/form-data; boundary=${data._boundary}',
      }
     })
      .then( ( response ) => {
        if(response.status === 200) {
        // If file size is larger than expected.
          if( response.data.error ) {
           if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
             alert( 'Max size: 2MB');
             } else {
              console.log( response.data );
              // If not the given file type
              alert( response.data.error );
             }
            } 
            else {
             // Success
             let fileName = response.data;
             if(fileName==='Error: No File Selected')
             alert("SELECT A FILE!!!!");

             if(fileName!='Error: No File Selected')
             {
              alert( '<<File Uploaded>>!!!!' );
             }
            }
           }
    else {
     // if file not selected throw error
        console.log( 'Please upload file');
    }
    

      }).catch( ( error ) => {
      // If another error
       console.log( error+ 'red' );
     });
    } 
    



  handleSubmit = (event) => {

if(this.state.phno.length===10 && this.state.zip.length===5 && this.state.filename.name!='' && this.state.filename.prodname!='')
  {
      event.preventDefault();
      fetch(`http://192.168.99.100:8000/`,{
      method:'post',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        prodname:this.state.prodname,
        zip:this.state.zip,
        phno:this.state.phno
      })
      }).then(res=> res.json())
      .then(data=>{this.setState({response:JSON.parse(data)})})
      .then(x=>{
      if(JSON.stringify(this.state.response.error)==='null')
      { 
      alert('Record insertion done. S3 File upload started');
      this.handleUpload(event);
      }
      else
      alert("Error inserting. Please follow all restrictions:"+JSON.stringify(this.state.response.error));
      })
  }
  else
  {
    alert('Fill all the details correctly!!');
  }
  }


  upload=(e)=>{
    console.log(e.target.files[0]);
    this.setState({filename:e.target.files[0]});
  }



  handleChange = (event) => {
      event.preventDefault();
      const {name,value} = event.target;
      this.setState({[name]:value});
   
  if((this.state.phno.length > 10 || (this.state.phno.length>=1 && this.state.phno.length<10))||(this.state.zip.length > 5 || (this.state.zip.length>=1 && this.state.zip.length<5)))
      this.setState({error:'yes'})
    else if((this.state.phno.length==10)&&(this.state.zip.length==5))
      this.setState({error:'no'})
  }
 
  printstate=(e)=>
  {

    console.log(this.state);    
  }


  render(){
    
   

      

      
    return (
      <div className="App">
   <div>
       <Particles className="particles"
      params={{
        "particles": {
            "number": {
                "value": 160,
                "density": {
                    "enable": false
                }
            },
            "size": {
                "value": 10,
                "random": true
            },
            "move": {
                "direction": "bottom",
                "out_mode": "out"
            },
            "line_linked": {
                "enable": false
            }
        },
        "interactivity": {
            "events": {
                "onclick": {
                    "enable": true,
                    "mode": "remove"
                }
            },
            "modes": {
                "remove": {
                    "particles_nb": 10
                       }
                     }
                  }
            }} />
        </div>
        
        <div className="tc card border-success mb-3 bg-gold" >
            <div className="card-header">&lt;&lt; CSE337 &gt;&gt;
            </div>
            <div className="card-body text-success">
                <h5 className="Heads pa3 ba b--dashed bg-purple">Shipping Info</h5>
            </div>
        </div>


        <div className='formwarp'>
                <form>
                    <div className='wrap'>
                        
                        <div className="form-group col-md-10">
                          <label htmlFor="prodname">Product Name</label>
                          <span className='error' style={{marginTop:'20px'}}>*</span> <br/>
                          <input type='text' autoComplete="off" className="prodname" id="prodname" placeholder="Your Answer" onChange={this.handleChange} name="prodname" required/>
                        </div>
                        
                        <div className="form-group col-md-10">
                          <label htmlFor="zip">Shipping City ZipCode</label>
                          <span className='error' style={{marginTop:'20px'}}>*</span> <br/>
                          <span className='zrror' style={{marginTop:'-10px'}}>Zip Code of a city in USA</span> <br/>
                          <InputText autoComplete="off" keyfilter="num" className="zip" placeholder="Your Answer" id="zip" onChange={this.handleChange} name="zip" required/><br/>
                       {(this.state.zip.length > 5 || (this.state.zip.length>=1 && this.state.zip.length<5)) &&
                            <span className='error' id='error1'>Enter a valid zip code</span>}
                            
                        </div>

                        <div className="form-group col-md-10 p-col-12 p-md-4">
                          <label htmlFor="phno">Phone Number</label>
                          <span className='error' style={{marginTop:'20px'}}>*</span> <br/>
                            <InputText autoComplete="off" keyfilter="num" placeholder="Your Answer" className="phno" id="phno" onChange={this.handleChange} name="phno" required/><br/>
                        {(this.state.phno.length > 10 || (this.state.phno.length>=1 && this.state.phno.length<10)) &&
                            <span className='error' id='error2'>Enter a valid phone no</span>}
                        </div>

                        <div className="form-group col-md-10">
                          <label htmlFor="phno">Product Image</label>
                          <span className='error' style={{marginTop:'20px'}}>*</span> <br/>
                        <input style={{marginLeft:'20px'}} type='file' onChange={this.upload}/>
                        </div>

                        
                        <input style={{marginLeft:'150px'}} type='submit' onClick={this.handleSubmit} className="btn btn-primary"/>
                       <div className="form-group col-md-10">
                          <label style={{marginLeft:'125px',marginTop:'20px'}} htmlFor="State" onClick={this.printstate}>Check State Variables</label>
                        </div>
                     
                    </div>

                </form>
        </div>
      </div>
    ); // end of return
  } //end of render()
} 

export default App;
