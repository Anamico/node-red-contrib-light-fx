'use strict';

//const async = require('async');

module.exports = function(RED) {

    function AnamicoLightFxChristmas(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        const colours = [
            'FF0012',   // Vivid Red    https://www.schemecolor.com/christmas-red-and-green.php
            '00FF3E',   // Malachite
            '00B32C',   // Dark Pastel Green
            'FFD429',   // Sunglow
            '3FA9F5'    // Picton Blue
        ];
        var offset = 0;

        node.lightNames = null;
        if (config.lightNames && config.lightNames.split) {
            node.lightNames = config.lightNames.split('\n').reduce(function(memo, name) {
                const trimmed = name.trim();
                if (trimmed.length > 0) {
                    memo.push(trimmed);
                }
                return memo;
            }, []);
        }

        /**
         * listen for panel state changes
         *
         * todo: make this more efficient
         */
        node.timer = setInterval(function() {
            offset = (offset + 1) % colours.length;
            var index = offset;
            node.lightNames.forEach(function (lightName) {
                node.send({
                    payload: {
                        lights: [ lightName ],
                        on: true,
                        hex: colours[index],
                        bri: 100
                    }
                });
                index = (index + 1) % colours.length;
            });

        }, 1000);

        /**
         * clean up on node removal
         */
        node.on('close', function() {
            clearInterval(node.timer);
            node.timer = null;
        });
    }
    RED.nodes.registerType("AnamicoLightFxChristmas", AnamicoLightFxChristmas);
};
