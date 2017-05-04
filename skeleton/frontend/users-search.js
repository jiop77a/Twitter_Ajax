const APIUtil = require ("./api_util");
const FollowToggle = require ("./follow_toggle");

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
