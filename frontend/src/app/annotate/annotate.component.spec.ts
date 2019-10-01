import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AnnotateComponent } from './annotate.component';

describe('AnnotateComponent', () => {
    let component: AnnotateComponent;
    let fixture: ComponentFixture<AnnotateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AnnotateComponent],
            imports: [RouterTestingModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AnnotateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
