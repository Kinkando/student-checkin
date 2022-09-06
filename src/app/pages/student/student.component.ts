import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { StudentService, Opt, Student, statusName, getStudent } from '../../services/student.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  public displayedColumns: string[] = [];
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  public dataSource: MatTableDataSource<Student> = new MatTableDataSource();
  public columns = {
    text: [
      {id: 'No', name: 'เลขที่', style: 'flex: 0 0 80px;', ratio: 8},
      {id: 'Code', name: 'รหัส', style: 'flex: 0 0 80px;', ratio: 8},
      {id: 'Name', name: 'ชื่อ-สกุล', style: 'flex: 0 0 calc(100% - (4 * 85px + 3 * 80px));', ratio: 44},
      {id: 'StatusName', name: 'สถานะ', style: 'flex: 0 0 80px;', ratio: 8},
    ],
    button: [
      {id: 'Present', name: 'มา', statusID: 1, color: 'success', style: 'flex: 0 0 85px;', ratio: 8},
      {id: 'Absent', name: 'ขาด', statusID: 2, color: 'warn', style: 'flex: 0 0 85px;', ratio: 8},
      {id: 'Business', name: 'ลากิจ', statusID: 3, color: 'accent', style: 'flex: 0 0 85px;', ratio: 8},
      {id: 'Illness', name: 'ลาป่วย', statusID: 4, color: 'disabled', style: 'flex: 0 0 85px;', ratio: 8},
    ]  
  }
  private _itemPerPageLabel: string = "Items per page";
  private _snackBarVertialPosition: MatSnackBarVerticalPosition = "top";
  
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();

  public isLoading: boolean = true;
  private _filter: string = "";

  public grades: Opt[] = [];
  public grade: number = 1;
  public rooms: Opt[] = [];
  public room: number = 1;
  public students: Student[] = [];
  public student: Student = <Student>{};

  private _grade = new Subject();
  private _room = new Subject();

  constructor(private _studentService: StudentService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    for (let object of this.columns.text) {this.displayedColumns.push(object.id)}
    for (let object of this.columns.button) {this.displayedColumns.push(object.id)}

    this._grade.pipe().subscribe(res => {
      this._studentService.getRoomByGrade(this.grade).subscribe(res => {
        this.rooms = res;
        this.room = res[0].Value;
        this._room.next('');
      })
    })

    this._room.pipe().subscribe(res => {
      this._studentService.getStudent(this.room).subscribe(res => {
        this.students = res;
        this.isLoading = false;
        this._updateDataSource(res);
      })
    })

    this.skeletonLoad();
    this._studentService.getGrade().subscribe(res => {
      this.grades = res;
      this._grade.next("");
    })
  }

  public applyFilter(event: any) {
    this._filter = event.target!.value.trim().toLowerCase();
    if(!this.isLoading) {
      this.dataSource.filter = this._filter;
    }
  }

  private _updateDataSource(students: Student[]) {
    if (students != undefined) {
      this.dataSource = new MatTableDataSource(students);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl.itemsPerPageLabel = this._itemPerPageLabel;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => getStudent(item, property);
      this.dataSource.filter = this._filter;
    } else {
      this.dataSource = new MatTableDataSource();
      this.paginator.initialized;
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl.itemsPerPageLabel = this._itemPerPageLabel;
      this.dataSource.sort = this.sort;
    }
  }
  
  public selectGrade() {
    this.skeletonLoad();
    // this._grade.next("");
    this.delay(this._grade);
  }

  public selectRoom() {
    this.skeletonLoad();
    // this._room.next("");
    this.delay(this._room);
  }

  public skeletonLoad() {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource();
    for(let i=0; i<this.pageSizeOptions[0]; i++) {
      this.dataSource.data.push(<Student>{});
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public delay(subject: any) {
    setTimeout(function(subject: any) {
      subject.next("");
    }, 300, subject)
  }

  public checkIn(ref: number, statusID: number) {
    for(let student of this.students) {
      if(student.Ref === ref) {
        student.StatusID = statusID
        student.StatusName = statusName.get(statusID)!
        this._snackBar.open(`${student.FirstName} ${student.LastName} ${student.StatusName}`, undefined, {
          duration: 1000,
          verticalPosition: this._snackBarVertialPosition,
          panelClass: [this.setLabelColor(student.StatusID)],
        });
      }
    }
  }

 public getStudent(student: Student, key: string) {
    return getStudent(student, key);
  }

  public setLabelColor(statusID: number): string {
    switch(statusID) {
      case 1: return "check-present";
      case 2: return "check-absent";
      case 3: return "check-business";
      case 4: return "check-illness";
      default: return "uncheck";
    }
  }
}