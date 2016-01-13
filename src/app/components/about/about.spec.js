var testing_1 = require('angular2/testing');
var about_1 = require('./about');
testing_1.describe('About Component', function () {
    testing_1.beforeEachProviders(function () { return []; });
    testing_1.it('should ...', testing_1.injectAsync([testing_1.TestComponentBuilder], function (tcb) {
        return tcb.createAsync(about_1.About).then(function (fixture) {
            fixture.detectChanges();
        });
    }));
});
//# sourceMappingURL=about.spec.js.map