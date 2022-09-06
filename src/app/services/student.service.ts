import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private url: string = "http://su-angular.ddns.net/api/su-angular";

  constructor(private _http: HttpClient) { }

  getGrade(): Observable<Opt[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('topic', 'grade').set('func', 'get_all')
    const options = { headers, "observe?": "body", params}
    return this._http.get<Opt[]>(this.url, options);
  }

  getRoomByGrade(grade: number): Observable<Opt[]> {  
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('topic', 'room').set('func', 'get_by_grade').set('grade_ref', String(grade))
    const options = { headers, "observe?": "body", params}
    return this._http.get<Opt[]>(this.url, options);
  }
  
  getStudent(room: number): Observable<Student[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('topic', 'student').set('func', 'get_by_room').set('room_ref', String(room))
    const options = { headers, "observe?": "body", params}
    return this._http.get<Student[]>(this.url, options);
  }
}

export interface Opt {
  Value: number
  Name: string
}

export interface Student {
  Ref: number
  GradeRef: number
  GradeName: string
  RoomRef: number
  RoomName: number
  No: number
  Code: string
  FirstName: string
  LastName: string
  Title: number
  IdCard: string
  StatusID: number
  StatusName: string
}

export const statusName: Map<number, string> = new Map<number, string>()
.set(0,"ยังไม่ได้เช็ค")
.set(1,"มา")
.set(2,"ขาด")
.set(3,"ลากิจ")
.set(4,"ลาป่วย")

export const getStudent = (student: Student, key: string): any => {
  switch(key) {
    case "Ref": return student.Ref;
    case "GradeRef": return student.GradeRef;
    case "GradeName": return student.GradeName;
    case "RoomRef": return student.RoomRef;
    case "RoomName": return student.RoomName;
    case "No": return student.No;
    case "Code": return Number(student.Code);
    case "FirstName": return student.FirstName;
    case "LastName": return student.LastName;
    case "Title": return student.Title;
    case "IdCard": return student.IdCard;
    case "StatusID": return student.StatusID;
    case "StatusName": return student.StatusName;
    case "Name": return student.FirstName + " " + student.LastName;
    default: return undefined
  }
}