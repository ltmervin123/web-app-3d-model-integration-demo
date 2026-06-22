export interface Species {
  commonName: string
  scientificName: string
  family: string
  order: string
  habitat: string
  conservationStatus: 'Least Concern' | 'Near Threatened' | 'Vulnerable' | 'Endangered' | 'Critically Endangered'
}
