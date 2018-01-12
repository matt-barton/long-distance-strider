$('document').ready(function () {
  var ignoreButton = $('div#race_details button#ignore');

  ignoreButton.click(function () {
    $.blockUI({ message: '<img src="/images/loading.gif" />' });
    $.post({
      url: '/ignore_race',
      data: {
        id: $('#race_id').val()
      },
      success: function () {
        $.unblockUI();
        alertify.alert('Ignore Race', 'Race marked as ignored', function () {
          window.location.replace('/');
        });
      },
      error: function (e) {
        $.unblockUI();
        alertify.alert('Error!', e.message);
      }
    });
  });
})