import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Note } from '../model/note.model';
import { NotesService } from '../services/notes.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  noteSub: Subscription;
  public notes: Note[];

  constructor(
    public notesService: NotesService,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.notesService.load();

    this.noteSub = this.notesService.notes.subscribe((notes) => {
      this.notes = notes;
    });
  }

  addNote() {
    this.alertCtrl
      .create({
        header: 'New Note',
        message: 'What should the title of this note be?',
        inputs: [
          {
            type: 'text',
            name: 'title',
          },
        ],
        buttons: [
          {
            text: 'Cancel',
          },
          {
            text: 'Save',
            handler: (data) => {
              this.notesService.createNote(data.title);
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }
}
