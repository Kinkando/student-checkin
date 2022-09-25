import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Opt, Student, StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-select-class-room',
  templateUrl: './select-class-room.component.html',
  styleUrls: ['./select-class-room.component.css']
})
export class SelectClassRoomComponent implements OnInit {
  @Output() studentList = new EventEmitter<Student[]>();

  public grades: Opt[] = [];
  public grade: number = 1;
  public rooms: Opt[] = [];
  public room: number = 1;
  
  private _grade = new Subject<number>();
  private _room = new Subject<number>();
  
  constructor(private _studentService: StudentService) { }

  ngOnInit(): void {
    this._grade.pipe().subscribe(grade => {
      this._studentService.getRoomByGrade(grade).subscribe(rooms => {
        if (this.rooms.length > 0) {
          let roomName = this.rooms.find(room => room.Value === this.room)!.Name;
          let room = rooms.find(room => room.Name === roomName)
          this.room = room ? room.Value : rooms[0].Value;
        } else {
          this.room = rooms[0].Value;
        }
        this.rooms = rooms;
        this._room.next(this.room);
      })
    })

    this._room.pipe().subscribe(room => {
      this._studentService.getStudent(room).subscribe(students => this._updateStudent(students))
    })

    this._studentService.getGrade().subscribe(grade => {
      this.grades = grade;
      this.grade = grade[0].Value;
      this._grade.next(this.grade);
    })
  }

  public selectGrade() {
    this._grade.next(this.grade);
  }

  public selectRoom() {
    this._room.next(this.room);
  }

  private _updateStudent(students: Student[]) {
    this.studentList.emit(students);
  }
}
