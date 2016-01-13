require("bootstrap-webpack");
var browser_1 = require('angular2/platform/browser');
var router_1 = require('angular2/router');
var common_dom_1 = require('angular2/platform/common_dom');
var ng2_translate_1 = require("ng2-translate/ng2-translate");
var app_1 = require('./app/app');
function main() {
    return browser_1.bootstrap(app_1.App, [
        router_1.ROUTER_PROVIDERS,
        ng2_translate_1.TranslateService,
        common_dom_1.ELEMENT_PROBE_PROVIDERS
    ])
        .catch(function (err) { return console.error(err); });
}
document.addEventListener('DOMContentLoaded', main);
//# sourceMappingURL=bootstrap.js.map