$('document').ready(function () {
  var genderSelect = $('div.runner-details select#gender-select'),
    addRaceButton = $('div.runner-details button#add-race');

  genderSelect.change(function (evt) {
    $.post({
      url: '/runner/gender/' + $('#runner_id').val(),
      data: {
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

  addRaceButton.click(function () {
    var formHtml = $('#add-race-form').clone(),
      submitAddRaceButton = $('button.submit-add-race', formHtml),
      addRaceSelect = $('select.race-select', formHtml),
      distanceTextbox = $('input.add-race-distance', formHtml);

    submitAddRaceButton.click(function () {
      alertify.addRaceDialog().destroy();
      $.blockUI({ message: '<img src="/images/loading.gif" />' });
      $.post({
        url: '/runner/' + $('#runner_id').val() + '/add-race',
        data: {
          race: addRaceSelect.val(),
          distance: distanceTextbox.val()
        } 
      }).done(function (result) {
        window.location.replace('/runner/' + $('#runner_id').val());
        $.unblockUI();
      }).fail(function (e) {
        $.unblockUI();
        alertify.alert('Error!', e.statusText);
      });
    });

    addRaceSelect.change(function () {
      var distance = $(addRaceSelect[0].options[addRaceSelect[0].selectedIndex]).attr('data-distance');
      distanceTextbox.val(distance > 0 ? distance : '');
    });

    alertify.addRaceDialog (formHtml[0]).set('selector', 'select');
  });


  alertify.addRaceDialog || alertify.dialog('addRaceDialog', function () {
    return {
      main: function (content) {
        this.setContent(content);
      },
      setup: function () {
        return {
          focus: {
            element: function () {
              return this.elements.body.querySelector(this.get('selector'));
            },
            select:true
          },
          options: {
            basic:true,
            maximizable:false,
            resizable:false,
            padding:false
          }
        };
      },
      settings: {
        selector:undefined
      }
    };
  });

});