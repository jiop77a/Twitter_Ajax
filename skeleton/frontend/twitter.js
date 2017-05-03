const FollowToggle = require("./follow_toggle");

$(() => {
  $("button.follow-toggle").each((index, el) => {
    new FollowToggle(el);
  });
});
