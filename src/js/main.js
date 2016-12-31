"use strict";

var js = require('./services/parser/js');
require('./services/touchIndicator');

(function(){
    $(function() {
        js.parse();
    });
})();
