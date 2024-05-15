import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-general-header',
  templateUrl: './public-details.component.html',
  styleUrls: ['./public-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicDetailsComponent {
}
