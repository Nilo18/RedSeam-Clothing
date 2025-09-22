import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {

  constructor() { }

    private colorHexMap = {
      'White': '#f5f5f5ff',
      'Black': '#000000',
      'Purple': '#800080',
      'Blue': '#0000FF',
      'Navy Blue': '#000080',
      'Maroon': '#800000',
      'Pink': '#FFC0CB',
      'Green': '#008000',
      'Grey': '#808080',
      'Beige': '#F5F5DC',
      'Khaki': '#F0E68C',
      'Brown': '#A52A2A',
      'Multi': '#CFC9A4',
      'Red': '#FF0000',
      'Peach': '#FFE5B4',
      'Olive': '#808000',
      'Orange': '#ff8c42ff'
  };

  getColorHexMap() { return this.colorHexMap }
}
