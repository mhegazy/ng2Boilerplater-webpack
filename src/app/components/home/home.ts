import {Component, OnInit} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {HTTP_PROVIDERS} from 'angular2/http';

@Component({
    selector: 'home',
    directives: [...FORM_DIRECTIVES, HTTP_PROVIDERS],
    pipes: [],
    styles: [require('./home.scss')],
    template: require('./home.html')
})
export class Home implements OnInit {

    constructor() {
        console.log('started...');
        //var jQuery = require('jQuery');
        //jQuery('body').fadeOut();
    }

    ngOnInit() {
        console.log('Hello Home');
    }

}
