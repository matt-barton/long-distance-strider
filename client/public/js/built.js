
/* Source: client/src/js/race_details.js */
$('document').ready(function () {
  var ignoreButton = $('div#race_details button#ignore');

  ignoreButton.click(function () {
    $.post({
      url: '/ignore_race',
      data: {
        id: $('#race_id').val()
      },
      success: function () {
        window.location.replace('/');
      },
      error: function (e) {
        alert(e.message);
      }
    });
  });
})