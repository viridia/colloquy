/** Given a name, returns just the first letter of each word, up to a maximum of three letters.

    Example: "Eddie Van Halen" => 'EvH'
 */
export function initials(name: string) {
  return name.match(/(?:\b(.))+/g).join('').slice(0, 3);
}
