import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Student, statusName, getStudent } from '../../services/student.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {  
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();

  private _snackBarVertialPosition: MatSnackBarVerticalPosition = "top";
  private _itemPerPageLabel: string = "Items per page";
  
  private static DELAY_LOADING: number = 300;
  private static DELAY_MODAL: number = 1000;

  public filter: string = "";
  public isLoading: boolean = true;
  public students: Student[] = [];
  public columnNames: string[] = [];
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

  constructor(private _cdr: ChangeDetectorRef, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    for (let object of this.columns.text) {this.columnNames.push(object.id)}
    for (let object of this.columns.button) {this.columnNames.push(object.id)}
  }

  public searchFilter(text: string): void {
    this.filter = text;
    if(!this.isLoading) {
      this.dataSource.filter = this.filter;
    }
  }

  private _updateDataSource(students: Student[]) {
    this.students = students;
    if (students != undefined) {
      this.dataSource = new MatTableDataSource(students);
      this._cdr.detectChanges();
      this.dataSource.sortingDataAccessor = (item, property) => getStudent(item, property);
      this.dataSource.filter = this.filter;
    } else {
      this.dataSource = new MatTableDataSource();
      this._cdr.detectChanges();
      this.paginator.initialized;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = this._itemPerPageLabel;
    this.dataSource.sort = this.sort;
    this.isLoading = false;
  }

  public updateStudent(students: Student[]) {
    this.skeletonLoad();
    this.delay(students);
  }
  
  public skeletonLoad() {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource();
    this._cdr.detectChanges();
    for(let i=0; i<this.pageSizeOptions[0]; i++) {
      this.dataSource.data.push(<Student>{});
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public delay(students: Student[]) {
    setTimeout(() => this._updateDataSource(students), StudentComponent.DELAY_LOADING);
  }

  public checkIn(ref: number, statusID: number) {
    for(let student of this.students) {
      if(student.Ref === ref) {
        student.StatusID = statusID
        student.StatusName = statusName.get(statusID)!
        let toast = `${student.FirstName} ${student.LastName} ${student.StatusName}`;
        this._snackBar.open(toast, undefined, {
          duration: StudentComponent.DELAY_MODAL,
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