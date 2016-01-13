///<reference path="../../typings/app.d.ts"/>
System.register(['angular2/core', 'angular2/router', 'angular2/common', '../style/app.scss', './services/api/api', './components/home/home', "./components/about/about"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, common_1, api_1, home_1, about_1;
    var App;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (_1) {},
            function (api_1_1) {
                api_1 = api_1_1;
            },
            function (home_1_1) {
                home_1 = home_1_1;
            },
            function (about_1_1) {
                about_1 = about_1_1;
            }],
        execute: function() {
            /*
             * App Component
             * Top Level Component
             */
            App = (function () {
                function App(api) {
                    this.api = api;
                    this.url = 'https://github.com/ocombe/ng2-webpack';
                    console.log('Hello 23' + api);
                    //var userLang = navigator.language.split('-')[0]; // use navigator lang if available
                    //userLang = /(fr|en)/gi.test(userLang) ? userLang : 'en';
                    //
                    //// this will load translate json files from src/public/i18n
                    //translate.useStaticFilesLoader();
                    //
                    //// the lang to use, if the lang isn't available, it will use the current loader to get them
                    //translate.use(userLang);
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
            exports_1("App", App);
        }
    }
});
//# sourceMappingURL=app.js.map