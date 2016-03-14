// CHAT ROOM USER
var loginUser = location.href.split("?")[1];
// SET FIREBASE COLLECTION LOCATION
var locate = "https://bbape2.firebaseio.com/user/"+loginUser;
var messagesRef = new Firebase('https://bbape2.firebaseio.com/messages');
// FIREBASE SORTING INDEX SETTING
var get_time =0;

//DEFAULT PAGE IS PUBLIC ROOM
var app = document.querySelector('#app');
app.page = 0;

function initialize(){
  messagesRef.once("value", function(snap) {
      
      get_time = snap.numChildren();
      lastpoint = get_time-21;
  });
}
$(document).ready(function(){
  initialize();    
  setTimeout(function(){document.getElementById("ker").setAttribute("login-user", loginUser)},500);
});

//ONLINE SITUATION
var userListRef = new Firebase('https://bbape2.firebaseio.com/onlineusers');
var myUserRef = userListRef.push();
var connectedRef = new Firebase("https://bbape2.firebaseio-demo.com//.info/connected");
var counter = 0;
userListRef.once("value",function(snap){

  userListRef.on("child_added",function(snap){
      if(snap.val().name==loginUser){
          
          counter++;
      }
  });
  if(counter==0){
      
      setUserStatus("online");
  }
});
userListRef.on("child_removed",function(snap){
  if(snap.val().name==loginUser){
      
      counter--;
  }
  if(counter==0){
      
      setUserStatus("online");
  }
});
userListRef.on("value",function(snap){
  app.occupancy = snap.numChildren();
});

connectedRef.on("value", function(isOnline) {
  if (isOnline.val()) {
   
    myUserRef.onDisconnect().remove();
  }
});

function setUserStatus(status) {

  myUserRef.set({ name: loginUser, status: status });
}
//END OF ONLINE INFORMATION

// LISTEN FOR KEYPRESS AND TAP EVENT
app.handleKeyup = function(e){
if (e.keyCode == 13) {
  if(app.inputMeg){
      var message = app.inputMeg;
      messagesRef.push({name:loginUser, text:message, time:get_time});
      get_time++;
  }  
  app.inputMeg='';
}
}
app.handleTap = function(){
if(app.inputMeg){
  var message = app.inputMeg;
  messagesRef.push({name:loginUser, text:message, time:get_time});
  get_time++;
}
app.inputMeg='';
}

//CLICK ON DRAW PANEL
app.handleClickPublic = function(){
  
  messagesRef = messagesRef.root().child('messages');
  document.querySelector('#header').innerHTML = 'Public Room';
  var draw = document.querySelector('paper-drawer-panel');
  draw.togglePanel();

}

app.handleClickPrivate = function(){

  messagesRef = messagesRef.root().child('user').child(loginUser);
  document.querySelector('#header').innerHTML = 'Private Space';
  var draw = document.querySelector('paper-drawer-panel');
  draw.togglePanel();
  $('private-list').attr('location',locate);
  $('private-list').attr('login-user',loginUser);
}

// READ MORE
app.handleScroll = function(){
  
  var chatDiv = document.querySelector('iron-pages');
  frontHeight = chatDiv.scrollHeight;
  frontTop = chatDiv.scrollTop;
  if(chatDiv.scrollTop<=300){
      if(app.page==0 && lastpoint>=0){//Public Room
          
          $('message-list').prepend('<more-messagelist login-user="'+loginUser+'" endat="'+lastpoint+'" front-height="'+frontHeight+'" front-top="'+frontTop+'"></more-messagelist>');
          lastpoint = lastpoint-15;
      }else if(app.page==1 && lastpoint>=0){//Private Space

          $('private-list').prepend('<more-privatelist login-user="'+loginUser+'" endat="'+lastpoint+'" location="'+locate+'"></more-privatelist>');
          lastpoint = lastpoint-15;
      }
  }
}//END OF READ MORE
