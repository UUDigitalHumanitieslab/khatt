import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Restangular } from 'ngx-restangular';
import { Router } from '@angular/router';

@Component({
    selector: 'kht-manuscript-form',
    templateUrl: './manuscript-form.component.html',
    styleUrls: ['./manuscript-form.component.scss']
})
export class ManuscriptFormComponent implements OnInit {
    available: any[];
    results: string[];
    manuscriptForm: FormGroup;
    manuscripts: Restangular;

    constructor(private fb: FormBuilder,
        private restangular: Restangular,
        private router: Router
    ) { }

    ngOnInit() {
        // trailing slash is needed to make sure the route is understood by django
        const books = this.restangular.all('books');
        books.getList().subscribe(bookList => {
            this.available = bookList.map(book => book.title);
        });
        this.manuscripts = this.restangular.all('manuscripts');

        this.manuscriptForm = this.fb.group({
            book: ['', Validators.required],
            title: ['', Validators.required],
            date: ['', Validators.required],
            editor: [''],
            text_direction: ['ltr'],
            page_direction: ['ltr'],
            filepath: ['', Validators.required]
        });
    }

    search(event: { query: string }) {
        const search = event.query.toLowerCase();
        this.results = this.available.filter(t => t.toLowerCase().includes(search));
    }

    uploadManuscript() {
        // form data object will parse data, including the file
        const myFormData = new FormData();
        for ( const key of Object.keys(this.manuscriptForm.value)) {
            myFormData.append(key, this.manuscriptForm.value[key]);
        }
        this.manuscripts.post(myFormData);
        this.router.navigate(['/books']);
    }
}
