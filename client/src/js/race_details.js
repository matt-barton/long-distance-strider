$('document').ready(function () {
  var ignoreButton = $('div#race_details button#ignore');
  var processButton = $('div#race_details button#process');

  ignoreButton.click(function () {
    $.blockUI({ message: '<img src="/images/loading.gif" />' });
    $.post({
      url: '/ignore_race',
      data: {
        id: $('#race_id').val()
      },
      success: function () {
        alertify.alert('Ignore Race', 'Race marked as ignored', function () {
          window.location.replace('/');
          $.unblockUI();
        });
      },
      error: function (e) {
        $.unblockUI();
        alertify.alert('Error!', e.message);
      }
    });
  });

  processButton.click(function () {
    $.blockUI({ message: '<img src="/images/loading.gif" />' });
    $.post({
      url: '/process_race',
      data: {
        id: $('#race_id').val()
      },
      success: function () {
        alertify.alert('Process Race', 'Race processed, runners updated', function () {
          window.location.replace('/');
          $.unblockUI();
        });
      },
      error: function (e) {
        $.unblockUI();
        alertify.alert('Error!', e.message);
      }
    });
  });
    
});