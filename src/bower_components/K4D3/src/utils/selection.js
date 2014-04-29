define(function(require) {
    'use strict';

    var d3 = require('lib/d3/d3'),
        zeroInjection = require('src/utils/zeroInjection');

    // adds an array to another array
    function addTo(to, array) {
        [].push.apply(to, array);
    }

    /*
        Accepts a DOM element(s) and data.
        Returns an array of DOM elements on which charts
        will be rendered.
     */
    function placeChart(elem, data) {
        var $el = elem instanceof Array ? elem : d3.select(elem).datum(data),
            charts = [];

        if (data.rows) { addTo(charts, split(elem, 'height', 'width', data.rows, 'rows')); }
        else if (data.columns) { addTo(charts, split(elem, 'width', 'height', data.columns, 'columns')); }
        else {
            console.log($el);
            addTo(charts, $el.append('div')
                .attr('class', 'chart')
                .style('width', '100%')
                .style('height', '100%')[0]);
        }

        return charts;
    }

    /*
        Accepts a DOM element(s), 'width' and 'height', data and class name.
        Returns a DOM element array that has been split by class name,
        i.e. rows or columns.
     */
    function split(elem, by, inherit, data, name) {
        var charts = [],
            $el = elem instanceof Array ? elem : d3.select(elem),
            node = elem instanceof Array ? $(elem[0]) : $(elem),
            // need to refactor
            size = ($(node).parent()[by]() / data.length) / $(node).parent()[by]() * 100,
            inheritedSize = node[inherit]() / node[inherit]() * 100;

        if (!size || !inheritedSize ||  size === 0 || inheritedSize === 0) {
            if (!size || size === 0) {
                throw new Error('Chart cannot be rendered because ' + by + ' is ' + size + '.');
            } else {
                throw new Error('Chart cannot be rendered because ' + inherit + ' is ' + inheritedSize + '.');
            }
        }

        $el.selectAll('div')
            .data(data)
            .enter().append('div')
            .attr('class', name)
            .style('width', function() { return by === 'width' ? size + "%": inheritedSize + "%"; })
            .style('height', function() { return by === 'height' ? size + "%" : inheritedSize + "%"; })
            .style('display', function() { return name === 'rows' ? 'block' : 'inline-block'; })
            .each(function(d) {
                var selection = d3.select(this);
                addTo(charts, placeChart(selection, d));
            });

        return charts;
    }

    return function(elem, data) {
        console.log(data);
        return zeroInjection(placeChart(elem, data));
    };
});
