function initAdquiriElPin() {
  var self = this;

  self.currentStep = 1;

  $('.pick-file').click(function(e) {
    e.preventDefault();
    $(e.target).parent().parent().find('[type=file]').trigger('click'); 
  });

  $("#name,#phone,#email,#club").change(function() {
    if (validateAdquiriPinInfoForm()) {
      $('.step').eq(self.currentStep - 1).find('.next').removeClass('disabled');
    } else {
      $('.step').eq(self.currentStep - 1).find('.next').addClass('disabled');
    }
  });

  $("#name,#phone,#email,#club").blur(function(e) {
    if (e.target.value === '') {
      $(e.target).addClass('is-invalid');
    }
  });

  function changeAdquiriPinStep(goBack) {
    if (goBack === true) {
      self.currentStep -= (self.currentStep > 0)? 1 : 0;
    } else {
      self.currentStep += (self.currentStep < 6)? 1 : 0;
    }

    if (self.currentStep === 5) {
      fillSummary();
    }

    $('.current-step').html(self.currentStep);
    $('.progress-bar').attr('style', 'width: ' + (self.currentStep * 16) + '%');
    $('.step').addClass('fade');
    setTimeout(function() {
      $('.step').addClass('d-none');
      $('.step').eq(self.currentStep - 1).removeClass('d-none');
      $('.step').eq(self.currentStep - 1).removeClass('fade');
      console.log($('.step').eq(self.currentStep - 1));
    }, 555);
  }

  function validateAdquiriPinInfoForm() {
    var name = $('#name').val();
    var phone = $('#phone').val();
    var email = $('#email').val();
    var club = $('#club').val();
  
    var nameValid = (/^[^\s\d]{2,}\s[^\s\d]{2,}/).test(name);
    var phoneValid = (/^\d{4}-{0,1}\d{4}$/).test(phone);
    var emailValid = (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email);
    var clubValid = club != '';

    $('#name').toggleClass('is-invalid', !nameValid && name !== '');
    $('#phone').toggleClass('is-invalid', !phoneValid && phone !== '');
    $('#email').toggleClass('is-invalid', !emailValid && email !== '');
    $('#club').toggleClass('is-invalid', !clubValid && club !== '');
  
    return nameValid && phoneValid && emailValid && clubValid;
  }

  $('[type=file]').on("change", function(e){
    $(e.target).parent().parent().find('.image-name').html(e.target.files[0].name);
    $(e.target).parent().parent().parent().find('.upload-image-complete').removeClass('invisible');
    setTimeout(changeAdquiriPinStep, 1000);
  });

  $('.back').click(function(e) {
    e.preventDefault();
    changeAdquiriPinStep(true);
  });
  $('.next').click(function(e) {
    e.preventDefault();

    if ($(e.target).hasClass('choice-box')) {
      $(e.target).addClass('selected');
      setTimeout(changeAdquiriPinStep, 1000);
    } else {
      changeAdquiriPinStep();
    }
  });

  $('.deposit-choice').click(function(e) {
    e.preventDefault();

    var choiceBox = $(e.target);

    choiceBox.addClass('selected');
    choiceBox.parent().parent().find('.upload-image-container').removeClass('invisible');
  });

  function fillSummary() {
    var summaryInfo = [];

    summaryInfo.push($('#name').val());
    summaryInfo.push($('#phone').val());
    summaryInfo.push($('#email').val());
    summaryInfo.push($('#club').val());
    summaryInfo.push('Entrega en: ' + $('.meeting-choice.selected .choice-box-title').text() + $('.visit-choice.selected .choice-box-title').text());

    $('.summary-list').html('');

    summaryInfo.forEach(function(i) {
      $('.summary-list').append('<li>' + i + '</li>');
    });
  }
}
