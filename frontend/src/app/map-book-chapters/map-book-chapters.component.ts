import { Component, OnInit } from '@angular/core';
import * as uuidv4 from 'uuid/v4';

@Component({
    selector: 'kht-map-book-chapters',
    templateUrl: './map-book-chapters.component.html',
    styleUrls: ['./map-book-chapters.component.scss']
})
export class MapBookChaptersComponent implements OnInit {
    currentBeforeChapterId: string;
    dragChapterId: string;
    dragManuscriptChapter: string;
    dragManuscriptIndex = -1;
    dragManuscriptId: string;

    private currentHoverCell: ManuscriptCell;

    chapters: ChapterRow[] = [
        {
            name: 'Chapter 1',
            id: '1',
            manuscripts: [
                { dragHover: false, dragHoverChapter: -1, id: '1', chapters: ['Chapter 3'] },
                { dragHover: false, dragHoverChapter: -1, id: '2', chapters: ['Chapter 1'] },
                { dragHover: false, dragHoverChapter: -1, id: '3', chapters: ['Chapter 4'] }
            ]
        },
        {
            name: 'Chapter 2',
            id: '2',
            manuscripts: [
                { dragHover: false, dragHoverChapter: -1, id: '1', chapters: ['Chapter 2'] },
                { dragHover: false, dragHoverChapter: -1, id: '2', chapters: [] },
                { dragHover: false, dragHoverChapter: -1, id: '3', chapters: ['Chapter 2', 'Chapter 3'] }
            ]
        },
        {
            name: 'Chapter 3',
            id: '3',
            manuscripts: [
                { dragHover: false, dragHoverChapter: -1, id: '1', chapters: [] },
                { dragHover: false, dragHoverChapter: -1, id: '2', chapters: ['Chapter 3'] },
                { dragHover: false, dragHoverChapter: -1, id: '3', chapters: ['Chapter 1'] }
            ]
        }
    ];
    manuscripts: ManuscriptColumn[] = [
        { id: '1', name: 'Manuscript 1' },
        { id: '2', name: 'Manuscript 2' },
        { id: '3', name: 'Manuscript 3' }
    ];

    constructor() { }

    ngOnInit() {
    }

    dragStart(chapterId: string, chapter: string, manuscriptIndex: number) {
        this.dragChapterId = chapterId;
        this.dragManuscriptChapter = chapter;
        this.dragManuscriptIndex = manuscriptIndex;
        this.dragManuscriptId = this.manuscripts[manuscriptIndex].id;
    }

    dragEnd() {
        this.dragManuscriptIndex = -1;
        this.currentBeforeChapterId = undefined;
    }

    dragEnter(
        cell: HTMLDivElement,
        event: DragEvent,
        manuscript: ManuscriptCell,
        manuscriptIndex: number,
        manuscriptChapterIndex: number = -1) {
        if (this.dragManuscriptIndex !== manuscriptIndex) { return; }
        if (cell.contains(event.target as Node) && manuscript !== this.currentHoverCell) {
            if (this.currentHoverCell) {
                this.currentHoverCell.dragHover = false;
            }
            manuscript.dragHover = this.dragManuscriptIndex === manuscriptIndex;
            this.currentHoverCell = manuscript;
        }

        if (this.currentHoverCell && manuscriptChapterIndex >= 0) {
            this.currentHoverCell.dragHoverChapter = manuscriptChapterIndex;
        }
    }

    dragLeave(
        cell: HTMLDivElement,
        event: DragEvent,
        manuscript: ManuscriptCell,
        manuscriptChapterIndex: number = -1) {
        if (!cell.contains(event.relatedTarget as Node)) {
            manuscript.dragHover = false;
            manuscript.dragHoverChapter = -1;
            this.currentHoverCell = undefined;
        }

        if (this.currentHoverCell &&
            this.currentHoverCell.dragHoverChapter === manuscriptChapterIndex) {
            this.currentHoverCell.dragHoverChapter = -1;
        }
    }

    drop(
        event: DragEvent,
        manuscriptIndex: number,
        targetChapterId: string,
        manuscriptChapterIndex: number = -1) {
        event.preventDefault();
        const sourceChapter = this.chapters.find(chapter => chapter.id === this.dragChapterId);
        const targetChapter = this.chapters.find(chapter => chapter.id === targetChapterId);

        const manuscript = targetChapter.manuscripts[manuscriptIndex];

        if (manuscript.dragHover) {
            // the event will fire for both the manuscript chapter
            // and the manuscript cell
            // delete from source
            const sourceIndex = sourceChapter.manuscripts[manuscriptIndex].chapters.indexOf(this.dragManuscriptChapter);
            sourceChapter.manuscripts[manuscriptIndex].chapters.splice(sourceIndex, 1);

            // add to target
            if (manuscriptChapterIndex >= 0) {
                if (sourceChapter === targetChapter && manuscriptChapterIndex >= sourceIndex) {
                    // correct for the element already being removed
                    manuscriptChapterIndex--;
                }
                manuscript.chapters.splice(manuscriptChapterIndex, 0, this.dragManuscriptChapter);
            } else {
                manuscript.chapters.push(this.dragManuscriptChapter);
            }
            manuscript.dragHover = false;
            manuscript.dragHoverChapter = -1;

            if (manuscript === this.currentHoverCell) {
                this.currentHoverCell = undefined;
            }

            // check if source became empty: delete empty chapters
            if (!sourceChapter.manuscripts.find(m => m.chapters.length > 0)) {
                this.chapters.splice(this.chapters.indexOf(sourceChapter), 1);
            }
        }
    }

    dropNewChapter(event: DragEvent, chapter?: ChapterRow) {
        const newChapter: ChapterRow = {
            id: uuidv4(),
            manuscripts: this.manuscripts.map((manuscript, index) => ({
                id: manuscript.id,
                // we are hovering the new chapter's manuscript being created
                dragHover: index === this.dragManuscriptIndex,
                dragHoverChapter: -1,
                chapters: []
            })),
            name: this.dragManuscriptChapter
        };
        if (chapter) {
            this.chapters.splice(this.chapters.indexOf(chapter), 0, newChapter);
        } else {
            this.chapters.push(newChapter);
        }

        this.drop(event, this.dragManuscriptIndex, newChapter.id);
        this.currentBeforeChapterId = undefined;
    }
}

interface ChapterRow {
    id: string;
    name: string;
    manuscripts: ManuscriptCell[];
}

interface ManuscriptCell {
    // manuscript id - same for all cells for this manuscript
    id: string;
    dragHover: boolean;
    dragHoverChapter: number;
    chapters: string[];
}

interface ManuscriptColumn {
    id: string;
    name: string;
}
