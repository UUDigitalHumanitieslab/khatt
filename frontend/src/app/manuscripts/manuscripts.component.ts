import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListType } from '../lib';
import { iif } from 'rxjs';

@Component({
    selector: 'kht-manuscripts',
    templateUrl: './manuscripts.component.html',
    styleUrls: ['./manuscripts.component.scss']
})
export class ManuscriptsComponent implements OnInit {
    @Input() manuscripts: any[] = [];
    annotatedLines: string;

    constructor(private router: Router) { }

    ngOnInit() {
        this.manuscripts.forEach( (manuscript, index) => {
            if (manuscript.annotations.length > 0 ) {
                this.manuscripts[index].annotated_lines = 0;
                // this.manuscripts[index].annotated_lines = manuscript.annotated_lines.filter( line => line.complete ).length.toString() + "/" + manuscript.annotated_lines.length.toString()
            } else {
                this.manuscripts[index].annotated_lines = 0;
            }
        });
    }


    markManuscript(manuscript: ListType<ManuscriptsComponent['manuscripts']>) {
        console.log(manuscript.id);
        this.router.navigate(['/mark-manuscript', manuscript.id]);
    }

}
