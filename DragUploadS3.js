
const dropZone = document.getElementById('drop-zone');
const content = document.getElementById('content');
const dropArea = document.querySelector(".drag-area"),
var org = document.getElementById('organization');
var email = document.getElementById('email');
dragText = dropArea.querySelector("header"),
button = dropArea.querySelector("button"),
input = dropArea.querySelector("input");
flag = 0;
let file;
let files;
const reader = new FileReader();

button.onclick = ()=>{
  input.click(); 
}

input.addEventListener("change", function(){
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = this.files[0];
  files = this.files;
  dropArea.classList.add("active");
  content.innerHTML = file.name;
  dragText.textContent = "Ready to Upload File";
  flag = 1;
});

if (window.FileList && window.File) {
  dropZone.addEventListener('dragover', event => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  });
  
  dropZone.addEventListener('drop', event => {
    content.innerHTML = '';
    event.stopPropagation();
    event.preventDefault();
    files = event.dataTransfer.files;
    console.log(files);
    
    reader.readAsDataURL(files[0]);
    file = files[0];
    content.innerHTML = file.name;
    dragText.textContent = "Ready to Upload File";
    flag = 1;
  }); 
  
  function s3upload() {
    if (flag === 0) {
      return alert("Please choose a file to upload first.");
    }
    else if (org.value === '') {
      return alert("Please enter your organization.");
    } 
    else if (email.value === '') {
      return alert("Please enter your email address.");
    }    
    else {
      var fileName = file.name;
      var fileUploadName = document.getElementById('organization').value + '_' + document.getElementById('email').value + '_' + fileName;
      // Use S3 ManagedUpload class as it supports multipart uploads
      var upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: bucketName,
          Key: fileUploadName,
          Body: file,
        }
      });
      var promise = upload.promise();
      promise.then(
        function(data) {
          alert("Successfully uploaded your file.");
           content.innerHTML = "Your File";
           dragText.textContent = "Drag & Drop";
           org.value = '';
           email.value = '';
        },
        function(err) {
          return alert("There was an error uploading your file: ", err.message);
        }
      );
    }
  }
}
