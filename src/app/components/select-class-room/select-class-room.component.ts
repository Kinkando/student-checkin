import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Opt, Student, StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-select-class-room',
  templateUrl: './select-class-room.component.html',
  styleUrls: ['./select-class-room.component.css']
})
export class SelectClassRoomComponent implements OnInit {
  @Output() studentList = new EventEmitter<Student[]>();

  public grades: Opt[] = [];
  public rooms: Opt[] = [];
  public $grade = new BehaviorSubject<number>(1);
  public $room = new BehaviorSubject<number>(1);

  constructor(private _studentService: StudentService) { }

  ngOnInit(): void {
    this._studentService.getGrade().subscribe(grade => {
      this.grades = grade;
      this.$grade.next(grade[0].Value);
    })

    this.$grade.pipe().subscribe(grade => {
      this._studentService.getRoomByGrade(grade).subscribe(rooms => {
        let room: number;
        if (this.rooms.length > 0) {
          let roomName = this.rooms.find(room => room.Value === this.room)!.Name;
          let roomFind = rooms.find(room => room.Name === roomName)
          room = roomFind ? roomFind.Value : rooms[0].Value;
        } else {
          room = rooms[0].Value;
        }
        this.rooms = rooms;
        this.$room.next(room);
      })
    })
    this.$room.pipe().subscribe(room => {
      this._studentService.getStudent(room).subscribe(students => this.studentList.emit(students))
    })
  }

  public get grade(): number {
    return this.$grade.getValue()
  }

  public set grade(grade: number) {
    this.$grade.next(grade);
  }

  public get room(): number {
    return this.$room.getValue()
  }

  public set room(room: number) {
    this.$room.next(room);
  }
}
