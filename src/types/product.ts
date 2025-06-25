import { Forma } from './form';
import { Event } from './event';
import { Color } from './color';
import { Scent } from './scent';

export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  dimensions: string;
  burnTime: string;
  imageUrl: string;
  form_id: number;
  event_id: number;
  status: boolean;
  featured: boolean;
  ingredients: string[];
  instructions: string[];
  colors: Color[];
  scents: Scent[];
  form: Forma;
  event_type: Event;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  price: string;
  description: string;
  dimensions: string;
  burnTime: string;
  form_id: number;
  event_id: number;
  ingredients: string[];
  instructions: string[];
  colors: number[];
  scents: number[];
  image?: File;
}
