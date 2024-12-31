import { NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SvgIconComponent } from "../../../../shared/components/svg-icon/svg-icon.component";

export interface Advantage {
  icon: any;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing-advantages',
  templateUrl: './landing-advantages.component.html',
  styleUrls: ['./landing-advantages.component.scss'],
  imports: [NgFor, SvgIconComponent]
})
export class LandingAdvantagesComponent {
  advantages: Advantage[] = [
    {
      icon: 'award',
      title: 'Гарантія',
      description: 'Ми працюємо тільки з офіційними постачальниками Deye, саме тому у нас 10 років гарантії',
    },
    {
      icon: 'delivery',
      title: 'Доставка',
      description: 'Оперативна доставка прямо до вашого дому чи бізнесу – будь-де в Україні',
    },
    {
      icon: 'phone-call',
      title: 'Підтримка',
      description: 'Ми завжди на зв’язку, щоб допомогти вам з будь-яким питанням',
    },
    {
      icon: 'check-circle-1',
      title: 'Якість',
      description: 'Усі товари відповідають міжнародним стандартам якості та безпеки',
    },
    {
      icon: 'wallet',
      title: 'Економія',
      description: 'Наші рішення допоможуть зменшити ваші витрати на електроенергію та стати незалежними від тарифів',
    },
    {
      icon: 'tree',
      title: 'Екологічність',
      description: 'Використовуйте чисту енергію сонця, зберігаючи природу для наступних поколінь',
    },
  ];
}
