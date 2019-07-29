$(function() {
  $('a').click(function(e) {
    if ((/http/).test($(e.target).attr('href'))) {
      alert('Usted está siendo redirigido a una página externa. Al terminar, puede volver a esta página para continuar con el proceso de adquisición del Pin.');
    }
  });
});

function initAdquiriElPin() {
  var self = this;

  self.currentStep = 1;
  self.payment = 'Efectivo';
  self.apiUrl = 'https://5l3csp0z6j.execute-api.us-east-1.amazonaws.com/prod/';

  $('.form-control').focus(function(e) {
    var control = $(e.target);
    control.attr('data-placeholder', control.attr('placeholder'));
    control.attr('placeholder', '');
  });

  $('.form-control').blur(function(e) {
    var control = $(e.target);
    control.attr('placeholder', control.attr('data-placeholder'));
  });

  $('.pick-file').click(function(e) {
    e.preventDefault();
    $(e.target).parent().parent().find('[type=file]').trigger('click'); 
  });

  $('#name,#phone,#email,#club').change(function() {
    if (validateAdquiriPinInfoForm()) {
      $('.step').eq(self.currentStep - 1).find('.next').removeClass('disabled');
    } else {
      $('.step').eq(self.currentStep - 1).find('.next').addClass('disabled');
    }
  });

  $('#name,#phone,#email,#club').blur(function(e) {
    if (e.target.value === '') {
      $(e.target).addClass('is-invalid');
    }
  });

  function changeAdquiriPinStep(goBack) {
    var maxSteps = $('.step').length;

    if (self.currentStep === (maxSteps - 1)) {
      sendInfo();
    }

    if (goBack === true) {
      self.currentStep -= (self.currentStep > 0)? 1 : 0;
    } else {
      self.currentStep += (self.currentStep < maxSteps)? 1 : 0;
    }

    if (self.currentStep === (maxSteps - 1)) {
      fillSummary();
    }

    $('.current-step').html(self.currentStep);
    $('.progress-bar').attr('style', 'width: ' + ((self.currentStep < maxSteps)? self.currentStep * (100 / maxSteps) : 100) + '%');
    $('.step').addClass('fade');
    setTimeout(function() {
      $('.step').addClass('d-none');
      $('.step').eq(self.currentStep - 1).removeClass('d-none');
      $('.step').eq(self.currentStep - 1).removeClass('fade');
      // console.log($('.step').eq(self.currentStep - 1));
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

  $('[type=file]').on('change', function(e){
    var file = e.target.files[0];
    
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      $(e.target).parent().parent().find('.image-name').html(file.name);

      var xhttp = new XMLHttpRequest();

      xhttp.responseType = 'json';

      xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          $('.upload-image-uploading').addClass('invisible');
          $(e.target).parent().parent().parent().find('.upload-image-complete').removeClass('invisible');
          setTimeout(changeAdquiriPinStep, 1000);

          self.payment = this.response.result[0];
        } else if (this.readyState === 4) {
          $('.deposit-image').addClass('d-none');
          self.payment = 'Error';
          $(e.target).parent().parent().parent().children().addClass('d-none');
          $(e.target).parent().parent().parent().find('.upload-image-error').removeClass('d-none');
        }
      };

      xhttp.open('POST', self.apiUrl, true);
      xhttp.setRequestHeader('Content-type', 'application/json')
      xhttp.send(JSON.stringify({
        key: '4df4dd2e94',
        'a0b09a': 'deposit-screenshot',
        'e8f13145aed52e712a7e287164b0efce9bed982443242fbc5e26d76d0173543a': '8DYC8ekZwxB4tNwBNKA6aaOpXK0PdZ3yBXlgtZIgEa6BXALyibY7LQRMW4Wn8n2R',
        '03df79d05db3': [
          reader.result
        ]
      }));

      $('.deposit-image').attr('src', reader.result);
    }, false);

    $(e.target).parent().parent().parent().find('.upload-image-uploading').removeClass('invisible');
    $('.content').animate(
      {
        scrollTop: $('.footer').offset().top
      },
      800
    );

    reader.readAsDataURL(file);
  });

  $('.back').click(function(e) {
    e.preventDefault();
    changeAdquiriPinStep(true);
  });
  $('.next').click(function(e) {
    e.preventDefault();

    if ($(e.target).hasClass('choice-box')) {
      $('.meeting-choice').removeClass('selected');
      $('.visit-choice').removeClass('selected');
      $(e.target).addClass('selected');
      setTimeout(changeAdquiriPinStep, 1000);
    } else {
      changeAdquiriPinStep();
    }
  });

  $('.deposit-choice').click(function(e) {
    e.preventDefault();

    $('.cash-choice').removeClass('selected');

    var choiceBox = $(e.target);

    choiceBox.addClass('selected');
    choiceBox.parent().parent().find('.upload-image-container').removeClass('invisible');
    $('.content').animate(
      {
        scrollTop: $('.footer').offset().top
      },
      800
    );
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

  function sendInfo() {
    var info = {
      'name': $('#name').val(),
      'phone': $('#phone').val(),
      'email': $('#email').val(),
      'club': $('#club').val(),
      'payment': self.payment,
      'delivery': ($('.meeting-choice.selected .choice-box-title').text() + $('.visit-choice.selected .choice-box-title').text()).replace(/^\s+/g, '').replace(/\s+$/g, '')
    };

    var xhttp = new XMLHttpRequest();

    xhttp.responseType = 'json';

    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        $('.saving').addClass('d-none');
        $('.last-step').children().removeClass('invisible');

      } else if (this.readyState === 4) {
        $('.saving').addClass('d-none');
        $('.saving-error').removeClass('d-none');
      }
    };

    xhttp.open('POST', self.apiUrl, true);
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(JSON.stringify({
      'key': '8caddc31f4',
      'a28d1a4325ea': 'orders',
      '90bcaa36': [info]
    }));
  }
}
