export function shuffle(array) {
  let subjectArray = array.slice();
  let currentIndex = array.length;
  
  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    
    [subjectArray[currentIndex], subjectArray[randomIndex]] = [subjectArray[randomIndex], subjectArray[currentIndex]];
  }
  
  return subjectArray;
}