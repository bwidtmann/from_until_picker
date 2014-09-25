(function($) {
    $.widget( "12auto.from_until_picker", {
        options: {
            default_date_time: {
                from: Date.today().add(+7).days().set({hour: 12}),
                until: Date.today().add(+14).days().set({hour: 9})
            }
        },
        _create: function() {
            var from_picker = $('<div>').appendTo(this.element);
            var until_picker = $('<div>').appendTo(this.element);

            this.from_picker = from_picker.date_time_picker();
            this.until_picker = until_picker.date_time_picker();

            this.message = $('<div>').appendTo(this.element);
            this.element.addClass( "from_until_picker" );
            this.from_picker.on('date_time_picker_change', $.proxy(this._onchange, this));
            this.until_picker.on('date_time_picker_change', $.proxy(this._onchange, this));
        },
        _onchange: function(event, options) {
            console.log('onchange from_until_picker');

            if(this.until_picker.date_time_picker('getDateTime').isBefore(this.from_picker.date_time_picker('getDateTime'))){
                this.message.html('Invalid date!');
                options.target.reset();
            } else {
                this._trigger( "_change", event, { } );
                options.target.setPreviousDateTime();
                this.until_picker.date_time_picker('disableDays', this.from_picker.date_time_picker('getDateTime'));
                this.displayDays();
            }

        },
        setDefaults: function() {
            this.from_picker.date_time_picker('setDateTime', (this.options.default_date_time.from));
            this.until_picker.date_time_picker('setDateTime', (this.options.default_date_time.until));
        },
        getDays: function() {
            var days = 0;
            var from_date_time = this.from_picker.date_time_picker('getDateTime');
            var until_date_time = this.until_picker.date_time_picker('getDateTime');
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