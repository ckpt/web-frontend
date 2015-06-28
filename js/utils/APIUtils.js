"use strict";

var ServerActionCreators = require("../actions/ServerActionCreators.react.js");
//var request = require("superagent");

var _dummytasks = [];
var _dummyuser = {
  username: "mortenk",
  admin: false,
  apitoken: "8a3452fd412ee483cd449"
};

module.exports = {

  loadTasks: function() {
    // var uuid = sessionStorage.getItem("uuid");
    var json = JSON.stringify(_dummytasks);
    ServerActionCreators.receiveTasks(json, null);
  },

  login: function(username, password) {
    if (username === "mortenk" && password === "testing123") {
      ServerActionCreators.receiveLogin(JSON.stringify(_dummyuser), null);
    } else {
      ServerActionCreators.receiveLogin(null, ["Invalid username and/or password"]);
    }
    // request.post("http://localhost:3002/v1/login")
    //   .send({ username: email, password: password, grantType: "password" })
    //   .set("Accept", "application/json")
    //   .end(function(error, res){
    //     if (res) {
    //       if (res.error) {
    //         return;
    //         //var errorMsgs = _getErrors(res);
    //         //ServerActionCreators.receiveLogin(null, errorMsgs);
    //       } else {
    //         var json = JSON.parse(res.text);
    //         ServerActionCreators.receiveLogin(json, null);
    //       }
    //     }
    //   });
  }
};
