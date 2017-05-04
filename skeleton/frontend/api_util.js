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
