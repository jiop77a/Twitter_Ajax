/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const FollowToggle = __webpack_require__(1);
const UsersSearch = __webpack_require__(3);

$(() => {
  $("button.follow-toggle").each((index, el) => {
    new FollowToggle(el);
  });
  $("nav.users-search").each((index, el) => {
    new UsersSearch(el);
  });
});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(2);

class FollowToggle {

  constructor(el, options) {
    this.el = $(el);
    this.userId = this.el.data("user-id") || options.userId;
    this.followState = this.el.data("initial-follow-state") || options.followState;
    this.render();
    this.handleClick();
  }

  render(){

    if (this.el.prop('disabled')) {
      this.el.prop('disabled', false);
    } else {
      this.el.prop('disabled', true);
    }


    switch(this.followState){
      case "unfollowed":
        this.el.text("Follow!");
        break;
      case "followed":
        this.el.text("Unfollow!");
        break;
      case "unfollowing":
        this.el.text("unfollowing...");
        break;
      default:
        this.el.text("following...");
    }
  }

  handleClick(){
    let that = this;
    this.el.on('click', (event) => {
      event.preventDefault();
      this.updateFollowState();
      if (this.followState === "following") {
        APIUtil.followUser(this.userId)
          .then(() => this.updateFollowState(), (err) => console.log(err))
          .then(() => this.render());
      } else {
        APIUtil.unfollowUser(this.userId)
        .then(() => this.updateFollowState(), (err) => console.log(err))
        .then(() => this.render());
      }
      this.render();
    });
  }

  updateFollowState() {

    switch(this.followState){
      case "unfollowed":
        this.followState = "following";
        break;
      case "followed":
        this.followState = "unfollowing";
        break;
      case "unfollowing":
        this.followState = "unfollowed";
        break;
      default:
        this.followState = "followed";
    }

  }
}



module.exports = FollowToggle;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

const APIUtil = {
  followUser: id => {
    return $.ajax({
      url: `${id}/follow`,
      method: 'POST',
      dataType: "JSON",
      data: { user_id: id }
    });
  },

  unfollowUser: id => {
    return $.ajax({
      url: `${id}/follow`,
      method: 'DELETE',
      dataType: "JSON",
      data: { user_id: id }
    });
  },

  searchUsers: (queryVal) => {
    return $.ajax({
      url: `search`,
      dataType: "JSON",
      data: {query: queryVal},
    });
  }
};

module.exports = APIUtil;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__ (2);
const FollowToggle = __webpack_require__ (1);

class UsersSearch {
  constructor(el) {
    this.$el = $(el);
    this.$input = $(".users-search input");
    // console.log(this.$input);
    this.$ul = $("ul");
    this.handleInput();
  }

  handleInput() {
    this.$el.on('keyup', (event) => {

      APIUtil.searchUsers(this.$input.val())
      .then( (res) => this.renderResults(res));
      // console.log(this.$input.val());
    });
  }

  renderResults(res) {

    this.$ul.empty();
    res.forEach((el) => {
      let $li = $('<li></li>');
      let name = el.username;
      let $a = $(`<a href="${el.id}">${el.username}</a>`);
      $li.prepend($a);

      let $followState = undefined;
      if (el.followed === 'true'){
         $followState = 'followed';
      } else {
         $followState = 'unfollowed';
      }

      let $button = $('<button type="button" class="follow-toggle" name="toggle-button" disabled></button>');
      let $toggle = new FollowToggle($button, {userId: el.id, followState: $followState});

      $li.append($button);
      this.$ul.append($li);
    });
  }
}

module.exports = UsersSearch;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map