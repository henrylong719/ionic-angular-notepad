import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Note } from '../model/note.model';

import { NotesService } from '../services/notes.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  public note: Note;
  paramsSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private noteService: NotesService,
    private navCtrl: NavController
  ) {
    this.note = {
      id: '',
      title: '',
      content: '',
    };
  }

  ngOnInit() {
    let noteId;
    this.paramsSub = this.route.params.subscribe((params: Params) => {
      noteId = params.id;
    });

    if (this.noteService.loaded) {
      this.noteService.getNote(noteId).subscribe((note) => {
        this.note = note;
      });
    } else {
      this.noteService.load().then(() => {
        this.noteService.getNote(noteId).subscribe((note) => {
          this.note = note;
        });
      });
    }
  }

  noteChanged() {
    // this.noteService.save(this.note);

    console.log(this.note.content);

    this.noteService.saveNoteContent(this.note);
  }

  deleteNote() {
    this.noteService.deleteNote(this.note);
    this.navCtrl.navigateBack('/notes');
  }
}
