"use strict"


//show fileinfo
var fileInfo1,fileInfo2;

var fileinput;
var myBlob;
var myUrl;
var down_file_name="";

var files,filestring="",file_name="";//文件列表,files[0]是第一个文件 filestring是第一个文件转化的字符串
var up_key="";
let down_key=document.getElementById("down_key");
window.onload = function (){
    fileinput=document.querySelector("#fileinput");
    //show fileinfo
    fileInfo1=document.querySelector("#fileInfo1");
    fileInfo2=document.querySelector("#fileInfo2");
    
    fileinput.addEventListener('change',()=>{
        files=fileinput.files
        console.log(files[0])
        if(files[0]!=null){
            var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
            file_name=files[0].name;
            fileInfo1.innerHTML = `文件名：${files[0].name}<br>文件大小：${files[0].size}<br>文件类型：${files[0].type}`;
            reader.readAsDataURL(files[0]);//读取文件的内容
            reader.onload = function(){
                filestring=this.result;
                console.log(this.result);//当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
            }
        }
    })
}
function show()
{
    console.log("clicked");
    var fileinput=document.querySelector("#fileinput");
    fileinput.click();
}




document.addEventListener("DOMContentLoaded", () => {

  // Grab DOM items
  //let global_str = document.getElementById("global_str");
  //TODO Add controls for call later

  function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}



function downloadFile(url,name='文件默认名'){
  var a = document.createElement("a")
  a.setAttribute("href",url)
  a.setAttribute("download",name)
  a.setAttribute("target","_blank")
  let clickEvent = document.createEvent("MouseEvents");
  clickEvent.initEvent("click", true, true);  
  a.dispatchEvent(clickEvent);
}

function downloadFileByBase64(base64,name){
      myBlob = dataURLtoBlob(base64)
      myUrl = URL.createObjectURL(myBlob)
      down_file_name=name;
      fileInfo2.innerHTML = `文件名：${name}<br>文件大小：${myBlob.size}<br>文件类型：${myBlob.type}`;
}


  // Event Listeners
  document.getElementById("receive").addEventListener("click", getInfo);
  document.getElementById("key").addEventListener("click", setkey);
  document.getElementById("send").addEventListener("click", setInfo);
  document.getElementById("download").addEventListener("click", downfile);
  
  //TODO Add click listener to make call later
  function downfile(){
  	downloadFile(myUrl,down_file_name);
  }
  
  function setkey(){
  	document.getElementById("up_key").value=md5(filestring);
  	up_key=document.getElementById("up_key").value;
  }
  
  function getInfo(){
    let body = {};
    // Actually send it
    makePost('/getInfo', body)
    .then(res => {
      console.log(res);
      var password=JSON.parse(res.slice(1,-1)).pwd
      var yourBase64 = JSON.parse(res.slice(1,-1)).file
      var youFileName = JSON.parse(res.slice(1,-1)).filename
     
      if(password==document.getElementById("down_key").value){
      	downloadFileByBase64(yourBase64, youFileName);
      	
      }
      	
      else
      	alert("密钥输入有误！");
    });
	
  };

  function setInfo(){
    up_key=document.getElementById("up_key").value;
    var flag=true;
    
    if(up_key=="")
    {
    	var r=confirm("确认不设置密钥？");
    	if(r==false)
    	  flag=false;
    }
    
    if(flag)	{
    	let body = {
	      // name: global_str.value,
	      file: filestring,
	      pwd:up_key,
	      filename:file_name
    	}

      makePost('/setInfo', body)
           .then(res => {
            console.log(res);
      });
    
    }
    

    //global_str.value = "";
  };

  //TODO Add event handler to make a call later

  /**
   * Abstract the boring part of making a post request
   * @param route The request destination as a string. ex: '/call'
   * @param body An object of the data to be passed
   * @return A promise for a response object
   */
  function makePost(route, body){
    let request = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(body)
    };

    return fetch(route, request)
    .then(res =>  res.text());
  };
});
