$('document').ready(function () {
  var ignoreButton = $('div#race_details button#ignore');
  var processButton = $('div#race_details button#process');

    console.log(processButton);

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

  processButton.click(function () {
    console.log('asdfasdf');
    $.blockUI({ message: '<img src="/images/loading.gif" />' });
    $.post({
      url: '/process_race',
      data: {
        id: $('#race_id').val()
      },
      success: function () {
        $.unblockUI();
        alertify.alert('Process Race', 'Race processed, runners updated', function () {
          window.location.replace('/');
        });
      },
      error: function (e) {
        $.unblockUI();
        alertify.alert('Error!', e.message);
      }
    });
  });
    
});