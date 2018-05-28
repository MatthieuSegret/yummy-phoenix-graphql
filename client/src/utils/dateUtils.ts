export default function formatDate(rawDate: string): string {
  const date: Date = new Date(rawDate);
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}
