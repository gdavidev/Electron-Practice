import SimpleKeyboard from 'simple-keyboard';

export default class Keyboard {
  static alphanumeric(mountNodeId, onChange) {
    return new SimpleKeyboard(mountNodeId,{
      onChange: onChange,
      mergeDisplay: true,
      layoutName: "default",
      layout: {
        default: [
          "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
          "q w e r t y u i o p [ ] \\",
          "a s d f g h j k l ; ' {enter}",
          "z x c v b n m , . /",
          ".com @ {space}"
        ],
      },
      display: {
        "{bksp}": "⌫",
      },
    });
  }
  
  static numeric(mountNodeId, onChange) {
    return new SimpleKeyboard(mountNodeId,{
      onChange: onChange,
      mergeDisplay: true,
      layout: {
        default: ["1 2 3", "4 5 6", "7 8 9", "+ 0 {bksp}"],
      },
      display: {
        "{bksp}": "⌫",
      },
      theme: "hg-theme-default hg-layout-numeric numeric-theme",
    });
  }
}