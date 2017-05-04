const APIUtil = require('./api_util');

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
