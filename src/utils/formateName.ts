export function getFirstNames(fullName: string | undefined, count: number): string {
  const nameParts = fullName?.split(' ');
  return nameParts ? nameParts.slice(0, count).join(' ') : '';
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
} 