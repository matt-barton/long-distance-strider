$('document').ready(function () {
  var ignoreButton = $('div#race_details button#ignore');
  var processButton = $('div#race_details button#process');

  ignoreButton.click(function () {
    $.blockUI({ message: '<img src="/images/loading.gif" />' });
    $.post({
      url: '/race/ignore',
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
      url: '/race/process',
      data: {
        id: $('#race_id').val()
      },
      success: function (result) {
        var updatedMsg = result.updatedRunners > 0 ? (result.updatedRunners + ' runner' + (result.updatedRunners > 0 ? 's' : '') + ' updated.') : '',
          newMsg = result.newRunners > 0 ? (result.newRunners + ' runner' + (result.newRunners === 1 ? '' : 's') + ' created.'): '',
          message = 'Race processed. ' + updatedMsg + ' ' + newMsg;
        alertify.alert('Process Race', message, function () {
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