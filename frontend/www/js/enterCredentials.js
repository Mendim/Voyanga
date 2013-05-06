var ids = [], fids = [];
$(function () {
    var avia, hotels, tour;
    window.app = new Application();
    window.enterCredentials = true;
    avia = new AviaModule();
    hotels = new HotelsModule();
    tour = new ToursModule();
    window.app.register('tours', tour, true);
    window.app.register('hotels', hotels);
    window.app.register('avia', avia);
    window.toursOverviewActive = true;

    $('.registerForm').hide();

    $('.genderField').each(function () {
        var $this = $(this),
            value = $this.val(),
            element = $this.siblings('.gender-' + value);
        $this.siblings('.gender').each(function () {
            $(this).removeClass('active');
        });
        element.addClass('active');
    });
    $(document).on('click', '.gender', function () {
        var $this = $(this),
            value = $this.data('value'),
            field = $this.siblings('.genderField');
        $this.siblings('.gender').each(function () {
            $(this).removeClass('active');
        });
        $this.addClass('active');
        field.val(value);
    });
    $(".chzn-select").chosen({
        no_results_text: "Нет соответствий"
    });
    $('input.next').keyup(function () {
        var $this = $(this),
            value = $this.val(),
            len = value.length,
            next = $this.next();
        if ($this.attr('maxlength') <= len) {
            next.select();
            next.focus();
        }
    });
    $('.tdDocumentNumber input').on('change keyup', function () {
        var checkbox = $(this).closest('tr').next().find('.tdDuration').find('input[type=checkbox]'),
            uiLabel = $(this).closest('tr').next().find('.tdDuration').find('.ui-label');
        if (countLength($(this).val()) >= 10) {
            uiLabel.attr('data-is-checked', checkbox.attr('checked') !== undefined);
            if (checkbox.attr('checked') === undefined) {
                uiLabel.click();
            }
        }
        else {
            if (uiLabel.attr('data-is-checked') !== undefined) {
                if (uiLabel.attr('data-is-checked') === "true") {
                    if (checkbox.attr('checked') === undefined)
                        uiLabel.click();
                }
                else {
                    if (checkbox.attr('checked') !== undefined)
                        uiLabel.click();
                }
            }
        }
    });
    $(function () {
        $('.agreeConditions').on('click', function () {
            var checked = ($('#agreeCheck').is(':checked'));
            if (!checked)
                $('#submit-passport').removeClass('inactive');
            else
                $('#submit-passport').addClass('inactive');
        });
        $('#submit-passport').click(function () {
            if ($(this).hasClass('inactive'))
                return;
            var formData = $('#passport_form').serialize();
            var statuses = [];
            disableAllFieldsAndHideButton();
            $('#loadPayFly').find('.armoring').show();
            loadPayFly();
            $('#loadPayFly').find('.loadJet').show();
            $.ajax({
                type: 'POST',
                url: '/buy/makeBooking/secretKey/' + window.secretKey,
                data: formData,
                dataType: 'json'
            })
                .success(function (response) {
                    if (!analyzeValidationResult(response)) {
                        enableAllFieldsAndShowButton();
                        $('#loadPayFly').find('.armoring').hide();
                        $('#loadPayFly').find('.loadJet').hide();
                        return false;
                    }
                    window.app.itemsToBuy.trackBuyClick();
                    _.each(window.tripRaw.items, function (item, i) {
                        statuses[i] = 0;
                    });
                    _.each(window.tripRaw.items, function (item, i) {
                        $.ajax({
                            type: 'POST',
                            url: '/buy/makeBookingForItem/secretKey/' + window.secretKey + '?index=' + i,
                            data: formData,
                            dataType: 'json'
                        })
                            .success(function (response) {
                                statuses[i] = 1;
                                ids[i] = response.bookerId;
                                if (item.isFlight)
                                {
                                    fids[i] = response.bookerId;
                                }
                                checkStatuses(statuses, ids);
                            })
                            .error(function (xhr, ajaxOptions, thrownError) {
                                statuses[i] = xhr.responseText;
                                checkStatuses(statuses, ids);
                            });
                    });
                })
                .error(function (xhr, ajaxOptions, thrownError) {
                    _rollbar.push({level: 'error', msg: "passport500", data: formData});
                    new ErrorPopup('passport500', false, function () {
                        window.location.href = '/#' + window.redirectHash
                    }); //ошибка, когда мы не смогли сохранить паспортные данные
                });
        });
    });
});

function enableBindingForUnloadWindow() {
    if (window.app.itemsToBuy.flightCounter()==0)
        return;

    $(window).off("beforeunload");
    $(window).bind('beforeunload', function () {
        if ($('html').hasClass('gecko')) {
            var popup = new GenericPopup('#on-close-firefox');
        }
        return ("Внимание! При закрытии или обновлении страницы, забронированные билеты будут аннулированы. Вы действительно хотите покинуть эту страницу?");
    });
    $(window).bind('unload', function () {
        disableBookings();
    });
    $('form').submit(function () {
        $(window).off("beforeunload");
    });
}

function disableBookings() {
    $.ajax({
        type: 'POST',
        url: '/buy/cancelBooking',
        data: { ids: fids.join(',') },
        dataType: 'json',
        async: false
    });
}

function disableWarning() {
    $(window).off("beforeunload");
}

function checkFlight() {
    if (window.fromPartner == 1) {
        window.VisualLoaderInstance.show();
        window.VisualLoaderInstance.start('Идёт проверка доступности выбранного авиабилета', 10);
        $.ajax({
            url: '/buy/checkFlight',
            type: 'get',
            dataType: 'json'
        })
            .done(function (response) {
                window.VisualLoaderInstance.renew(100);
                if (!response.result) {
                    message = 'Данный билет более недоступен. Переходим к поиску альтернативных вариантов.';
                    window.VisualLoaderInstance.hide(message, 2000);
                    _.delay(function () {
                        window.location.href = '/#' + window.redirectHash;
                    }, 1000);
                }
                else {
                    _.delay(function () {
                        message = 'Всё в порядке. Билет готов.';
                        window.VisualLoaderInstance.hide(message, 2000);
                    }, 100);
                }
            })
            .error(function () {
                message = 'Данный билет более недоступен. Переходим к поиску альтернативных вариантов.';
                window.VisualLoaderInstance.hide(message, 1000);
            })
    }
}

function analyzeValidationResult(response) {
    if (response.status == 'success')
        return true;
    /* analyze booking field */
    if (typeof response.message.booking.contactPhone != 'undefined')
        $('.divInputTelefon').addClass('error tooltip').attr('rel', response.message.booking.contactPhone);
    if (typeof response.message.booking.contactEmail != 'undefined')
        $('.tdEmail input').addClass('error tooltip').attr('rel', response.message.booking.contactEmail);
    if (response.message.passports != 'undefined')
        _.each(response.message.passports, function (el, i) {
            _.each(el, function (fName, key) {
                var name = 'FlightAdultPassportForm[' + i + '][' + key + ']',
                    inputEl = $('input[name="' + name + '"]').addClass('error tooltip').attr('rel', fName);

                if (key == 'genderId')
                    inputEl.closest('label').addClass('error tooltip').attr('rel', fName);

                name = 'FlightChildPassportForm[' + i + '][' + key + ']';
                inputEl = $('input[name="' + name + '"]').addClass('error tooltip').attr('rel', fName);

                if (key == 'genderId')
                    inputEl.closest('label').addClass('error tooltip').attr('rel', fName);

                name = 'FlightInfantPassportForm[' + i + '][' + key + ']';
                inputEl = $('input[name="' + name + '"]').addClass('error tooltip').attr('rel', fName);

                if (key == 'genderId')
                    inputEl.closest('label').addClass('error tooltip').attr('rel', fName);

                if (key == 'birthday') {
                    var namePrefix = 'FlightAdultPassportForm[' + i + '][',
                        inputNames = [
                            namePrefix + 'birthdayDay]',
                            namePrefix + 'birthdayMonth]',
                            namePrefix + 'birthdayYear]'
                        ];
                    _.each(inputNames, function (name, i) {
                        $('input[name="' + name + '"]').addClass('error tooltip').attr('rel', fName);
                    });

                    namePrefix = 'FlightChildPassportForm[' + i + '][';
                    inputNames = [
                        namePrefix + 'birthdayDay]',
                        namePrefix + 'birthdayMonth]',
                        namePrefix + 'birthdayYear]'
                    ];
                    _.each(inputNames, function (name, i) {
                        $('input[name="' + name + '"]').addClass('error tooltip').attr('rel', fName);
                    });

                    namePrefix = 'FlightInfantPassportForm[' + i + '][';
                    inputNames = [
                        namePrefix + 'birthdayDay]',
                        namePrefix + 'birthdayMonth]',
                        namePrefix + 'birthdayYear]'
                    ];
                    _.each(inputNames, function (name, i) {
                        $('input[name="' + name + '"]').addClass('error tooltip').attr('rel', fName);
                    });
                }
                if (key == 'expirationDate') {
                    var namePrefix = 'FlightAdultPassportForm[' + i + '][',
                        inputNames = [
                            namePrefix + 'expirationDay]',
                            namePrefix + 'expirationMonth]',
                            namePrefix + 'expirationYear]'
                        ];
                    _.each(inputNames, function (name, i) {
                        $('input[name="' + name + '"]').addClass('error tooltip').attr('rel', fName);
                    });

                    namePrefix = 'FlightChildPassportForm[' + i + '][';
                    inputNames = [
                        namePrefix + 'expirationDay]',
                        namePrefix + 'expirationMonth]',
                        namePrefix + 'expirationYear]'
                    ];
                    _.each(inputNames, function (name, i) {
                        $('input[name="' + name + '"]').addClass('error tooltip').attr('rel', fName);
                    });

                    namePrefix = 'FlightInfantPassportForm[' + i + '][';
                    inputNames = [
                        namePrefix + 'expirationDay]',
                        namePrefix + 'expirationMonth]',
                        namePrefix + 'expirationYear]'
                    ];
                    _.each(inputNames, function (name, i) {
                        $('input[name="' + name + '"]').addClass('error tooltip').attr('rel', fName);
                    });
                }
            })
        });
}

function disableAllFieldsAndHideButton() {
    /* disable all fields */
    $('.oneBlock input').each(function () {
        $(this).attr({'disabled': 'disabled'}).removeClass('error tooltip').attr('rel', '');
    });
    $('.expiration').each(function () {
        $(this).closest('.checkOn').attr('data-is-active', $(this).closest('.checkOn').hasClass('active'));
    });
    $(".tdNationality select option:selected").each(function () {
        var template = '<input type="text" class="tmp" disabled="disabled" value="' + $(this).text() + '">';
        $(this).closest('select').siblings('.chzn-container').hide().parent().append(template);
    });
    $('.tdDuration input').each(function () {
        $(this).parent().addClass('active');
    });
    $('.tdBirthday input').each(function () {
        $(this).parent().addClass('active');
    });
    $('.tdSex input').each(function () {
        $(this).parent().addClass('inactive');
    });
    $('.tdTelefon input').each(function () {
        $(this).parent().addClass('inactive').removeClass('tooltip error').attr('rel', '');
    });
    /* hide button */
    $('#submit-passport').hide();
    $('.agreeConditions').hide();
    $('.someText').hide();
}

function enableAllFieldsAndShowButton() {
    $('.oneBlock input').not('.expiration').each(function () {
        $(this).removeAttr('disabled');
    });
    $(".tdNationality select option:selected").each(function () {
        $('.tmp').remove();
        $(this).closest('select').siblings('.chzn-container').show();
    });
    $('.expiration').each(function () {
        var that = this,
            isActive = $(this).closest('.checkOn').attr('data-is-active') == 'true';
        if (isActive) {
            $(this).closest('.checkOn').addClass('active');
        }
        else {
            $(this).closest('.checkOn').removeClass('active');
            $(that).removeAttr('disabled');
        }
    });
    $('.tdBirthday input').each(function () {
        $(this).parent().removeClass('active');
    });
    $('.tdSex input').each(function () {
        $(this).parent().removeClass('inactive');
    });
    $('.tdTelefon input').each(function () {
        $(this).parent().removeClass('inactive');
    });
    /* hide button */
    $('#submit-passport').show();
    $('.agreeConditions').show();
    $('.someText').show();
}

var _rollbar = _rollbar || [];

function startPayment() {
    $.get('/buy/startPayment/secretKey/' + window.secretKey, function (data) {
        if (data.error) {
            _rollbar.push({level: 'error', msg: "startPayment Error", response: data});
            new ErrorPopup('e500withText', 'Ошибка платёжной системы'); //ошибка бронирования
        } else {
            //if everything is ok then go to payment
            $('iframe').load(function () {
                $('#loadPayFly').removeClass('paybuyEnd').find('.armoring').hide();
                $('#loadPayFly').find('.loadJet').hide();
                $('.payCardPal').show();
                $('.paybuyEnd').show();
                ResizeAvia();
                Utils.scrollTo('#paybuyContent', true);
                $('iframe').unbind('load');
            });
            window.app.breakdown(data.breakdown);
            if (data.payonline.Amount && window.app.itemsToBuy.totalCost) {
                if ((data.payonline.Amount / window.app.itemsToBuy.totalCost) >= 1.05) {
                    $('#priceUpdatedAfterBooking').show();
                    $('#priceUpdatedAfterBooking .price').html(Utils.formatPrice(data.payonline.Amount));
                }
            }
            Utils.submitPayment(data.payonline);
        }
    });
}

function checkStatuses(statuses, ids) {
    var errors = '',
        errorText = '',
        completed = true;
    _.each(statuses, function (el, i) {
        if (el == 0)
            completed = false;
        if (_.isString(el))
            errors += 'Ошибка бронирования сегмента номер ' + (i + 1) + '.<br>';
    });
    if (!completed)
        return;
    $.get('/buy/done', {ids: ids.join(',')})
        .done(function () {
            if (errors.length > 0)
                return;
            enableBindingForUnloadWindow();
            startPayment();
        })
        .error(function () {
            _rollbar.push({level: 'error', msg: "ERROR WHILE /buy/done", bookingIds: ids});
        });
    if (errors.length > 0) {
        errorText = errors;
        _rollbar.push({level: 'error', msg: "Booking failed", bookingIds: ids, errorText: errors});
        new ErrorPopup('passportBookingError', [errorText], function () {
            window.location.href = '/#' + window.redirectHash
        });
        return;
    }
}

initCredentialsPage = function () {
    var currentModule;
    switch (window.currentModule) {
        case 'Tours':
            currentModule = 'tours';
            break;
        case 'Avia':
            currentModule = 'avia';
            break;
        case 'Hotels':
            currentModule = 'hotels';
            break;
    }
    checkFlight();
    window.app.bindItemsToBuy();
    ko.applyBindings(window.app);
    ko.processAllDeferredBindingUpdates();
    window.app.runWithModule(currentModule);
};
function InputCheckOn() {
    $('.tdDuration input[type="checkbox"]').each(function (index) {
        if ($(this).attr('checked') == 'checked') {
            $(this)
                .closest('tr')
                .prev()
                .find('.checkOn')
                .addClass('active')
                .find('input')
                .attr('disabled', 'disabled');
        }
        else {
            $(this)
                .closest('tr')
                .prev()
                .find('.checkOn')
                .removeClass('active')
                .find('input')
                .removeAttr('disabled');
        }
    });
}
function InputBonusCardCheckOn() {
    $('.tdLastname input[type="checkbox"]').each(function (index) {
        voyanga_debug('check ' + index, $(this).attr('checked'));
        if ($(this).attr('checked') == 'checked') {
            var rowTr = $(this).closest('tr').next();
            rowTr.show();
            /*$(this)
             .closest('tr')
             .prev()
             .find('.checkOn')
             .addClass('active')
             .find('input')
             .attr('disabled', 'disabled');*/
        }
        else {
            var rowTr = $(this).closest('tr').next();
            rowTr.hide();
            /*$(this)
             .closest('tr')
             .prev()
             .find('.checkOn')
             .removeClass('active')
             .find('input')
             .removeAttr('disabled');*/
        }
    });
}
function InputActiveFinishDate() {
    InputCheckOn();
    InputBonusCardCheckOn();

    $('.tdDuration label.ui-hover').click(function () {
        InputCheckOn();
    });
    $('.tdLastname label.ui-hover').click(function () {
        InputBonusCardCheckOn();
    });
}

function countLength(val) {
    return val.replace(/\D/g, '').length;
}

$(window).load(InputActiveFinishDate);

$(function () {
    $('.btn-close').on('click', function () {
        $.cookie('credentials-cross', 'hide', {expires: 30});
        $('.lineUp').slideUp();
        return false;
    });
})
