var testing_1 = require('angular2/testing');
var home_1 = require('./home');
testing_1.describe('Home', function () {
    testing_1.beforeEachProviders(function () { return [
        home_1.Home
    ]; });
    testing_1.it('should log ngOnInit', testing_1.inject([home_1.Home], function (home) {
        spyOn(console, 'log');
        expect(console.log).not.toHaveBeenCalled();
        home.ngOnInit();
        expect(console.log).toHaveBeenCalledWith('Hello Home');
    }));
});
//# sourceMappingURL=home.spec.js.map