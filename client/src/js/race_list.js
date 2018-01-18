$('document').ready(function () {

  var newRacesButton = $('button#get-new-races');

  newRacesButton.click(function () {
    $.blockUI({ message: '<img src="/images/loading.gif" />' });
    $.post({
      url: '/race/get-new',
      success: function (res) {
        $.unblockUI();
        var msg = (res.length > 0 ? res.length : 'No') +
          ' new race' +
          (res.length === 1 ? '' : 's') +
          ' downloaded';
        alertify.alert('New Races', msg, function () {
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