var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var router_1 = require('angular2/router');
var common_1 = require('angular2/common');
require('../style/app.scss');
var api_1 = require('./services/api/api');
var home_1 = require('./components/home/home');
var about_1 = require("./components/about/about");
var App = (function () {
    function App(api) {
        this.api = api;
        this.url = 'https://github.com/ocombe/ng2-webpack';
        console.log('Hello 23' + api);
    }
    App = __decorate([
        core_1.Component({
            selector: 'app',
            providers: common_1.FORM_PROVIDERS.concat([api_1.Api]),
            directives: router_1.ROUTER_DIRECTIVES.slice(),
            styles: [require('./app.scss')],
            template: require('./app.html')
        }),
        router_1.RouteConfig([
            { path: '/', component: home_1.Home, name: 'Home' },
            { path: '/About', component: about_1.About, name: 'About' }
        ]), 
        __metadata('design:paramtypes', [api_1.Api])
    ], App);
    return App;
})();
exports.App = App;
//# sourceMappingURL=app.js.map