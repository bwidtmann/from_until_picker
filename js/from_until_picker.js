(function($) {
    $.widget( "12auto.from_until_picker", {
        options: {
            default_date_time: {
                from: Date.today().add(+7).days().set({hour: 12}),
                until: Date.today().add(+14).days().set({hour: 9})
            }
        },
        _create: function() {
            this.from_picker = $('<div>').appendTo(this.element).date_time_picker().data('12auto-date_time_picker');
            this.until_picker = $('<div>').appendTo(this.element).date_time_picker().data('12auto-date_time_picker');

            this.message = $('<div>').appendTo(this.element);
            this.element.addClass( "from_until_picker" );
            this.from_picker.element.on('date_time_picker_change', $.proxy(this._onchange, this));
            this.until_picker.element.on('date_time_picker_change', $.proxy(this._onchange, this));
        },
        _onchange: function(event, options) {
            console.log('onchange from_until_picker');
            if (this._validateDateTime(options.target)) {
                this.element.trigger('change');
            }
        },
        _validateDateTime: function(target) {
            if(this.until_picker.getDateTime().isBefore(this.from_picker.getDateTime())){
                this.message.html('Invalid date!');
                target.reset();
                return false;
            } else {
                target.setPreviousDateTime();
                this.until_picker.disableDays(this.from_picker.getDateTime());
                if (this.from_picker.getDate().equals(this.until_picker.getDate())) {
                    this.until_picker.disableHours(this.from_picker.getDateTime().getHours());
                }
                this.displayDays();
                return true;
            }
        },
        setDefaults: function() {
            this.from_picker.setDateTime(this.options.default_date_time.from);
            this.until_picker.setDateTime(this.options.default_date_time.until);
            this._validateDateTime(this.from_picker);
            this._validateDateTime(this.until_picker);
        },
        getDays: function() {
            var days = 0;
            var from_date_time = this.from_picker.getDateTime();
            var until_date_time = this.until_picker.getDateTime();
            if(from_date_time && until_date_time) {
                days = new TimeSpan(until_date_time - from_date_time).days;
            }
            return days;
        },
        displayDays: function() {
            this.message.html(this.getDays() + 1 + ' Tage');
        }
    });
})(jQuery);