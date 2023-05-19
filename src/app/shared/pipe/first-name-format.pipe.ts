import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstNameFormat'
})
export class FirstNameFormatPipe implements PipeTransform {

  // Cette fonction prend une chaîne de caractères "value" en entrée et retourne une chaîne de caractères formatée
transform(value: string): string {
  // On sépare la chaîne en un tableau de mots en utilisant l'espace comme délimiteur
  const words = value.split(' ');

  // On applique une fonction à chaque mot du tableau "words"
  // Cette fonction prend le premier caractère du mot, le met en majuscule, puis ajoute le reste du mot en minuscule
  const formattedWords = words.map(word => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return `${firstLetter}${restOfWord}`;
  });
  
  // On retourne la chaîne formatée en joignant les mots formatés avec un espace
  return formattedWords.join(' ');
}
}
