const socket = io();
const videoGrid = document.getElementById('video-grid');
const answerButton = document.getElementById("answer");
const callButton = document.getElementById("call");
const hangupButton = document.getElementById("hang-up");
const myPeer = new Peer();
var constraints = {
  audio:true,
  video:true
}

// send id as soon as you connect
myPeer.on('open', id => {
  socket.emit("connected",id);
});

function call(){
  callButton.disabled=true;
  hangupButton.disabled=false;
  navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    var myVideo = document.createElement("video");
    myVideo.srcObject=stream;
    myVideo.muted=true;
    myVideo.play();
    videoGrid.appendChild(myVideo);
    var call = myPeer.call(id,stream);
      var video = document.createElement('video');
      call.on('stream', userVideoStream => {
        video.srcObject = userVideoStream;
          video.play();
        videoGrid.appendChild(video);
      });

      socket.on("hangup",()=>{
        call.close();
        myVideo.remove();
        video.remove();
      });
  });
}

  myPeer.on('call', call => {
    hangupButton.disabled=false;
    answerButton.disabled=false;
    callButton.disabled=true;

    answerButton.addEventListener("click",function(){
      answerButton.disabled=true;
      navigator.mediaDevices.getUserMedia({constraints}).then(stream => {
        var myVideo = document.createElement("video");
        myVideo.srcObject=stream;
        myVideo.muted=true;
        myVideo.play();
      call.answer(stream);
      var video = document.createElement('video');
        call.on('stream', userVideoStream => {
        video.srcObject = userVideoStream;
          video.play();
      });

      videoGrid.appendChild(video);
      videoGrid.appendChild(myVideo);


      socket.on("hangup",()=>{
        myVideo.remove();
        video.remove();
        call.close();
      });
  
    });
  });

});

//someone hangs up the call
function hangup(){
  socket.emit("hangup");
}

socket.on("hangup",() => {
  answerButton.disabled=true;
  callButton.disabled=false;
  hangupButton.disabled=true;
    while (videoGrid.firstChild) {
        videoGrid.removeChild(videoGrid.firstChild);
    }
});


//someone is available to take the call
socket.on("connected",othersId=>{
  id = othersId;
});