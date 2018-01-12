$('document').ready(function () {
  var ignoreButton = $('div#race_details button#ignore');

  ignoreButton.click(function () {
    $.post({
      url: '/ignore_race',
      data: {
        id: $('#race_id').val()
      },
      success: function () {
        console.log('success');
        window.location.replace('/');
      },
      error: function (e) {
        console.log(e);
        alert(e.message);
      }
    });
  });
})