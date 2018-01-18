$('document').ready(function () {
  var genderSelect = $('div.runner-details select#genderSelect');

  genderSelect.change(function (evt) {
    $.post({
      url: '/runner/gender',
      data: {
        id: $('#runner_id').val(),
        gender: genderSelect.val()
      },
      success: function (result) {
        alertify.success('Runner gender saved.');
      },
      error: function (e) {
        alertify.alert('Error!', e.message);
      }
    });
  });
});