import { http, HttpResponse, delay } from 'msw'
import data from './data/products.json'
import type { Product, ListResponse } from '../types' 

let products: Product[] = JSON.parse(JSON.stringify(data))

function paginate<T>(items: T[], page:number, limit:number){
  const start = (page-1)*limit
  return items.slice(start, start+limit)
}

export const handlers = [

]
