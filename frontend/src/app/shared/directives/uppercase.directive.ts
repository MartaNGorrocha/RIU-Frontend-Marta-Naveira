import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone: true
})
export class UppercaseDirective {

  private readonly ngControl = inject(NgControl, { optional: true });

  @HostListener('input', ['$event.target'])
  onInput(target: EventTarget | null): void {
    if (!(target instanceof HTMLInputElement)) return;

    const upperValue = target.value.toUpperCase();

    target.value = upperValue;

    this.ngControl?.control?.setValue(upperValue, {
      emitEvent: false
    });
  }

}
