/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { Injectable, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

interface Note {
  id: string;
  title: string;
  content: string;
}
@Injectable({
  providedIn: 'root',
})
export class NotesService {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  public loaded: boolean = false;

  private _notes = new BehaviorSubject<Note[]>([]);

  get notes() {
    return this._notes.asObservable();
  }

  constructor(private storage: Storage) {
    this.storage.create();
  }

  load(): Promise<boolean> {
    // Return a promise so that we know when this operation has completed
    return new Promise((resolve) => {
      // Get the notes that were saved into storage
      this.storage.get('notes').then((notes) => {
        // Only set this.notes to the returned value if there were values stored

        if (notes != null) {
          this._notes.next(notes);
        }

        // This allows us to check if the data has been loaded in or not
        this.loaded = true;
        resolve(true);
      });
    });
  }

  save(notes) {
    // Save the current array of notes to storage
    this.storage.set('notes', notes);
  }

  getNote(id) {
    // Return the note that has an id matching the id passed in
    // return this.notes.find((note) => note.id === id);

    return this._notes.pipe(
      take(1),
      map((notes) => notes.find((note) => note.id === id))
    );
  }

  createNote(title) {
    let id: number;
    let newNote;

    this.notes
      .pipe(
        take(1),
        tap((notes) => {
          id = Math.max(...notes.map((note) => parseInt(note.id)), 0) + 1;
          newNote = {
            id: id.toString(),
            title,
            content: '',
          };

          this.save(notes.concat(newNote));

          this._notes.next(notes.concat(newNote));
        })
      )
      .subscribe();
  }

  deleteNote(note): void {
    // // Get the index in the array of the note that was passed in
    // const index = this.notes.indexOf(note);
    // // Delete that element of the array and resave the data
    // if (index > -1) {
    //   this.notes.splice(index, 1);
    //   this.save();
    // }

    this.notes
      .pipe(
        take(1),
        tap((notes) => {
          const index = notes.indexOf(note);

          if (index > -1) {
            notes = notes.filter((n) => n.id !== note.id);
            this._notes.next(notes);
            this.save(notes);
          }
        })
      )
      .subscribe();
  }
}
