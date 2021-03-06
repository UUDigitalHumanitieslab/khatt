import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DragDropModule } from 'primeng/dragdrop';

import { RestangularModule } from 'ngx-restangular';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AnnotateComponent } from './annotate/annotate.component';
import { AnnotateGroupedComponent } from './annotate-grouped/annotate-grouped.component';
import { AnnotateLineComponent } from './annotate-line/annotate-line.component';
import { BookComponent } from './book/book.component';
import { BooksComponent } from './books/books.component';
import { ManuscriptsComponent } from './manuscripts/manuscripts.component';
import { MarkManuscriptComponent } from './mark-manuscript/mark-manuscript.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { UploadComponent } from './upload/upload.component';
import { EditManuscriptComponent } from './edit-manuscript/edit-manuscript.component';
import { PageMarkerComponent } from './page-marker/page-marker.component';
import { HypoEditorComponent } from './hypo-editor/hypo-editor.component';
import { ManuscriptFormComponent } from './manuscript-form/manuscript-form.component';
import { EditLabelComponent } from './edit-label/edit-label.component';
import { LineLabelsComponent } from './line-labels/line-labels.component';
import { MapChaptersComponent } from './map-chapters/map-chapters.component';
import { MapBookChaptersComponent } from './map-book-chapters/map-book-chapters.component';
import { DownloadComponent } from './download/download.component';

export function RestangularConfigFactory(RestangularProvider) {
    RestangularProvider.setBaseUrl('/api');
    RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
        const token = decodeURIComponent(document.cookie);
        if (token) {
            const csrf = token.split(';').filter(item => item.trim().startsWith('csrft'))[0].split('=')[1];
            return {
              headers: Object.assign(headers, {'X-CSRFToken': csrf}),
            };
        }
    });
    RestangularProvider.setRequestSuffix('/');
    }


@NgModule({
    declarations: [
        AppComponent,
        AnnotateComponent,
        AnnotateGroupedComponent,
        AnnotateLineComponent,
        BookComponent,
        BooksComponent,
        MarkManuscriptComponent,
        ManuscriptsComponent,
        FooterComponent,
        MenuComponent,
        UploadComponent,
        EditManuscriptComponent,
        PageMarkerComponent,
        HypoEditorComponent,
        ManuscriptFormComponent,
        EditLabelComponent,
        LineLabelsComponent,
        MapChaptersComponent,
        MapBookChaptersComponent,
        DownloadComponent
    ],
    imports: [
        AppRoutingModule,
        AutoCompleteModule,
        DragDropModule,
        BrowserModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        FontAwesomeModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken'
        }),
        RestangularModule.forRoot(RestangularConfigFactory),
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
