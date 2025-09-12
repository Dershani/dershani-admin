export const ClassOptions = [
  {
    id: 9,
    name: '9. Sınıf',
    name_normalized: '9-sinif',
  },
  {
    id: 10,
    name: '10. Sınıf',
    name_normalized: '10-sinif',
  },
  {
    id: 11,
    name: '11. Sınıf',
    name_normalized: '11-sinif',
  },
  {
    id: 12,
    name: '12. Sınıf',
    name_normalized: '12-sinif',
  },
];

export const ClassOptionsSelect = ClassOptions.map(e => ({
  label: e.name,
  value: e.id,
}));
export type ClassOption = (typeof ClassOptions)[number];
