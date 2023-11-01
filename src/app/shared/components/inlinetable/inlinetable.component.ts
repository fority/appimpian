import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-inlinetable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inlinetable.component.html',
  styleUrls: ['./inlinetable.component.less'],
})
export class InlinetableComponent {
  // onRowEditInit(data: NotificationUserDto) {
  //   this.ClonedLineData[data.Id] = { ...data };
  // }
  // Delete(event: any, User: NotificationUserDto) {
  //   this.confirmationService.confirm({
  //     target: event.target as EventTarget,
  //     message: 'Are you sure to delete?',
  //     icon: 'pi pi-exclamation-triangle',
  //     dismissableMask: true,
  //     accept: () => {
  //       this.loadingService.start();
  //       this.notificationUserService.Delete(User.Id).subscribe(() => {
  //         this.PagingSignal.update((res) => ({
  //           ...res,
  //           Content: res.Content.filter((c) => c.Id !== User.Id),
  //         }));
  //         this.loadingService.stop();
  //       });
  //     },
  //     reject: () => {},
  //   });
  // }
  // onRowEditSave(index: number, user: NotificationUserDto) {
  //   this.loadingService.start();
  //   this.notificationUserService
  //     .Update({ Id: user.Id, Name: user.Name, Email: user.Email })
  //     .subscribe({
  //       next: () => {
  //         delete this.ClonedLineData[user.Id];
  //         this.loadingService.stop();
  //       },
  //       error: () => {
  //         this.PagingSignal.mutate((res) => {
  //           res.Content[index] = this.ClonedLineData[user.Id];
  //         });
  //         delete this.ClonedLineData[user.Id];
  //       },
  //     });
  // }
  // onRowEditCancel(user: NotificationUserDto, index: number) {
  //   this.PagingSignal.mutate(
  //     (res) => (res.Content[index] = this.ClonedLineData[user.Id])
  //   );
  //   delete this.ClonedLineData[user.Id];
  // }
}
