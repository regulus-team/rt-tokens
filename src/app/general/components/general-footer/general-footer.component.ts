import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-general-footer',
  templateUrl: './general-footer.component.html',
  styleUrls: ['./general-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralFooterComponent {
}
