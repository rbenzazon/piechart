class Pie extends HTMLDivElement {
  constructor() {
    super();
    console.log("toto1");
    // Create a shadow root
    var shadow = this.attachShadow({mode: 'open'});
    var leftFigureColor = this.getAttribute('leftFigureColor') || '#0000ff';
    var rightFigureColor = this.getAttribute('rightFigureColor') || '#ff0000';
    var leftFigure = document.createElement('div');
    leftFigure.setAttribute('class','leftFigure');
    var rightFigure = document.createElement('div');
    rightFigure.setAttribute('class','rightFigure');

    var style = document.createElement('style');
    style.textContent = 
      '.leftFigure {' +
        'color: '+leftFigureColor+';'+
        'right: '+leftFigureColor+';'+
      '}'+
      '.rightFigure {' +
        'color: '+rightFigureColor+';'+
      '}';

    shadow.appendChild(style);
    shadow.appendChild(leftFigure);
    shadow.appendChild(rightFigure);
  }
}

export default Pie