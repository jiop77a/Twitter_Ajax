class FollowToggle {

  constructor(el) {
    this.el = $(el);
    this.userId = this.el.data("user-id");
    this.followState = this.el.data("initial-follow-state");
    this.render();
    this.handleClick();
  }

  render(){
    if (this.followState === "unfollowed") {
      this.el.text("Follow!");
    } else {
      this.el.text("Unfollow!");
    }
  }

  handleClick(){
    this.el.on('click', (event) => {
      event.preventDefault();
      let method = "";
      if (this.followState === "unfollowed") {
        method = "POST";
      } else {
        method = "DELETE";
      }
      this.changeButton(method);
    });
  }

  changeButton(verb) {
    $.ajax({
      url: `${this.userId}/follow`,
      method: verb,
      dataType: "JSON",
      data: { user_id: this.userId },
      success: () => {
        this.updateFollowState();
        this.render();
      },
      error:  () => console.log("There was a problem")
    });
  }

  updateFollowState() {
    if (this.followState === "unfollowed") {
      this.followState = "followed";
    } else {
      this.followState = "unfollowed";
    }
  }
}



module.exports = FollowToggle;
