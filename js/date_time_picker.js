(function($) {
    $.widget('12auto.date_time_picker', {
        _create: function() {
            var date_picker = $('<input>').appendTo(this.element);
            var time_picker = $('<select>').appendTo(this.element);
            this.date_picker = date_picker.datepicker({ dateFormat: 'D, dd.mm.yy', showAnim: '', numberOfMonths: 2, minDate: 0 });
            this.time_picker = time_picker;
            this._initTime();

            this.element.addClass( "date_time_picker" );

            this.date_picker.on('change', $.proxy(this._onchange, this));
            this.time_picker.on('change', $.proxy(this._onchange, this));
        },
        _onchange: function(event) {
            console.log('onchange date_time_picker');
            //event.stopPropagation();
            this.enableHours();
            this._validateDateTime();
        },
        _initTime: function() {
            for(var i = Date.today(); i.isBefore(Date.today().add(+1).days()); i.add(+30).minutes()){
                this.time_picker.append(
                    $('<option></option>').val(i.toString("HH:mm")).html(i.toString("HH:mm"))
                );
            }
        },
        _validateDateTime: function() {
            try {
                $.datepicker.parseDate('D, dd.mm.yy', this.date_picker.val());
                if (this.getDateTime().isAfter(new Date())) {
                    console.log('DateTime is now: ' + this.getDateTime());
                    if (this.getDate().equals(Date.today())) {
                        this.disableHours((new Date()).getHours());
                    }
                    this._trigger('_change', event, {target: this});
                } else {
                    throw '';
                }
            }
            catch(e) {
                console.log('UPS!!!!!!!!!!!!!!!!!!!');
                //this.message.html('Invalid date!');
                this.reset();
            }
        },
        getDate: function() {
            return this.date_picker.datepicker('getDate');
        },
        getTime: function() {
            return this.time_picker.find('option:selected').val();
        },
        getDateTime: function() {
            var time = this.getTime().split(':');
            var date = this.getDate();
            var date_time = null;
            if(date) {
                date_time = new Date(date.set({hour: parseInt(time[0]), minute: parseInt(time[1])}));
            }
            return date_time;
        },
        setDateTime: function(date_time) {
            this.date_picker.datepicker('setDate', date_time);
            this.time_picker.find('option:selected').attr('selected', false);
            this.time_picker.find('option[value="' + date_time.toString("HH:mm") + '"]').attr('selected', true);
            this.setPreviousDateTime(date_time);
            //this._onchange();
        },
        setPreviousDateTime: function() {
            this.previous_date_time = this.getDateTime();
        },
        reset: function() {
            console.log('reset');
            this.setDateTime(this.previous_date_time);
            this.date_picker.blur();
        },
        enableHours: function() {
            $.each(this.time_picker.find('option'), function(index, option) {
                $(option).attr('disabled', false);
            });
        },
        disableHours: function(hour) {
            console.log('disableHours: ' + hour);
            $.each(this.time_picker.find('option'), function(index, option) {
                if(parseInt($(option).text().split(':')[0]) <= hour) {
                    $(option).attr('disabled', true);
                    $(option).attr('selected', false);
                }
            });
        },
        disableDays: function(min_date) {
            console.log('disableDays: ' + min_date);
            this.date_picker.datepicker('option', 'minDate', min_date);
        }
    });
})(jQuery);