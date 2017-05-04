const FollowToggle = require("./follow_toggle");
const UsersSearch = require("./users-search");

$(() => {
  $("button.follow-toggle").each((index, el) => {
    new FollowToggle(el);
  });
  $("nav.users-search").each((index, el) => {
    new UsersSearch(el);
  });
});
