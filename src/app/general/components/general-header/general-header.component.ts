import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-general-header',
  templateUrl: './general-header.component.html',
  styleUrls: ['./general-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralHeaderComponent {
}
