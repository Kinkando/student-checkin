import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './pages/room/room.component'
import { StudentComponent } from './pages/student/student.component';

const routes: Routes = [
  {
    path: 'student', component: StudentComponent,
  },
  {
    path: 'room', component: RoomComponent,
  },
  {
    path: '', redirectTo: 'student', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
