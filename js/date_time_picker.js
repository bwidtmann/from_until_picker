(function($) {
    $.widget('12auto.date_time_picker', {
        _create: function() {
            this.date_picker = $('<input>').appendTo(this.element).datepicker({ dateFormat: 'D, dd.mm.yy', showAnim: '', numberOfMonths: 2, minDate: 0 });
            this.time_picker = $('<select>').appendTo(this.element);
            this._initTime();

            this.element.addClass( "date_time_picker" );

            this.date_picker.on('change', $.proxy(this._onchange, this));
            this.time_picker.on('change', $.proxy(this._onchange, this));
        },
        _onchange: function(event) {
            console.log('onchange date_time_picker');
            //we want to trigger the change event manually only if validation was successful
            event.stopPropagation();
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
                //check if manual input is valid date format
                $.datepicker.parseDate('D, dd.mm.yy', this.date_picker.val());
                //check if date is not in the past
                if (this.getDateTime().isAfter(Date.today())) {
                    //check if date is today -> should disable hours in the past
                    if (this.getDate().equals(Date.today())) {
                        this.disableHours((new Date()).getHours());
                    }
                    this._trigger('_change', event, {target: this});
                } else {
                    throw 'date is in the past!';
                }
            }
            catch(e) {
                //TODO: display error
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
        },
        //remember old date time in order to restore later in case of failed validations (see reset())
        setPreviousDateTime: function() {
            this.previous_date_time = this.getDateTime();
        },
        //new input is not valid -> restore previous date time (see setPreviousDateTime())
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
            this.enableHours();
            $.each(this.time_picker.find('option'), function(index, option) {
                if(parseInt($(option).text().split(':')[0]) <= hour) {
                    $(option).attr('disabled', true);
                    $(option).attr('selected', false);
                }
            });
        },
        disableDays: function(min_date) {
            this.date_picker.datepicker('option', 'minDate', min_date);
        }
    });
})(jQuery);