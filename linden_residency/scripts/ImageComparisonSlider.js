/** This code is very much based on that of https://github.com/scrobbleme
	It has been slightly simplified to only offer the fade in animation type*/

window.FadeOnly = {
    widthToScaleUp: 200,
    method: ['fade-in']
};

FadeOnly.ImageComparisonSlider = function (element, jQuery) {
    var slide, slider, value;

    if (jQuery == undefined) {
        jQuery = window.jQuery;
    }

    this.domNode = jQuery(element);
    this.domNode.originalWidth = this.domNode[0].style.width;

    slide = this.slide_fade_in;
    this.slide = slide;

    value = this.domNode.data('ic-value');
    if (value == undefined || typeof(value) != 'number' || value < 0 || value > 100) {
        value = 50;
    }
    slider = this.domNode.find('.slider')[0];
    noUiSlider.create(slider, {
        start: value,
        animate: false,
        range: {
            'min': 0,
            'max': 100
        }
    });
    slider.noUiSlider.on('slide', function (value) {
        this.domNode.attr('data-ic-slider-value', value[0]);
        this.slide(null, {value: value[0]});
    }.bind(this));

    slider.noUiSlider.set(value);
    this.resize_callback({data: {'slider': slider, 'element': this}});
    jQuery(window).resize({'slider': slider, 'element': this}, this.resize_callback);
    this.domNode.find('.images').click({'slider': slider, 'slide': slide}, this.clickable_callback.bind(this));

    /** Extras */
    if (this.domNode.hasClass('hover') && this.supports_hover()) {
        this.domNode.find('.images').mousemove({
            'slider': slider,
            'slide': slide
        }, this.throttle(this.clickable_callback.bind(this), 15));
    }
};

FadeOnly.ImageComparisonSlider.prototype = {
    slide_fade_in: function (event, ui) {
        this.domNode.find('.images .right').css('opacity', (ui.value) / 100);
        this.domNode.find('.images .left').css('opacity', 100 / (ui.value));
    },

    clickable_callback: function (event) {
        var newValue = (event.pageX - event.currentTarget.getBoundingClientRect().left) / event.currentTarget.clientWidth * 100;
        this.slide(null, {value: newValue});
        event.data.slider.noUiSlider.set(newValue);
    },

    resize_callback: function (options) {
        var data = options.data;
        var domNode = data.element.domNode;
        if (domNode.width() <= FadeOnly.widthToScaleUp && !domNode.modeChanged) {
            domNode.modeChanged = true;
            domNode[0].style.width = '100%';
            domNode.upperSizeBound = domNode.width();
        } else if (domNode.modeChanged && domNode.width() > domNode.upperSizeBound) {
            domNode[0].style.width = domNode.originalWidth;
            domNode.modeChanged = false;
        }

        var currentValue = data.slider.noUiSlider.get();
        data.element.slide(null, {value: currentValue});
    },

    /**
     * Returns true, if the device supports "hover" in the plugins sense.
     */
    supports_hover: function () {
        return !navigator.userAgent.match(/(iPod|iPhone|iPad|Android|Windows\sPhone|BlackBerry)/i);
    },

    // Thanks: http://sampsonblog.com/749/simple-throttle-function
    throttle: function (callback, threshhold) {
        var wait = false;
        return function (event) {
            if (!wait) {
                callback(event);
                wait = true;
                setTimeout(function () {
                    wait = false;
                }, threshhold);
            }
        }
    }
};

jQuery(function (jQuery) {
    jQuery('.image-comparator').each(function (index, element) {
        element.imageComparisonSlider = new FadeOnly.ImageComparisonSlider(element, jQuery);
    });

    // Improve Visual Composer integration
    jQuery(document).on("click.vc.tabs.data-api", function () {
        jQuery(window).trigger('resize')
    });
});