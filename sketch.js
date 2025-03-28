let video; 

// superformula variables
let gridSize = 50; 
let superForms = [];



function setup() {
  createCanvas(windowWidth, windowHeight,P2D);
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

}


function draw() {

  background(0);
  video.loadPixels();
  superForms = [];
  


  

  pop();

noStroke();
  // for loop grid to get pixel data and gen superforms
  for (let x = 0; x < video.width; x += gridSize) {
    for (let y = 0; y < video.height; y += gridSize) {


      let index = (x + y * video.width) * 4;
      if (index < video.pixels.length) {
        let r = video.pixels[index];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];
        let a = video.pixels[index + 3];
        let avg = (r + g + b + a) / 4;

        superForms.push(new SuperForm(x, y, gridSize, avg));
      }
    }
  
  // Display all the SuperForms
  for (let sf of superForms) {
    sf.display();
  }
}
}

class SuperForm {
  constructor(x, y, w, brightness) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.brightness = brightness;
    this.rotation = map(noise(frameCount * 0.008), 0, 1, 0, 20);
  }

  display() {
    let alpha = map(this.brightness, 0, 255, 20, 255);
    push();
    translate(this.x + this.w / 2, this.y + this.w / 2);
    rotate(this.rotation);

    let colorShift = sin(frameCount * 0.1 + this.brightness * 0.005) * 200;
    fill(this.brightness + colorShift, this.brightness - colorShift, this.brightness, alpha);
    // stroke(this.brightness, this.brightness, this.brightness, alpha);
    noStroke();

    beginShape();
    let numPoints = 200;
    for (let theta = 0; theta <= TWO_PI; theta += TWO_PI / numPoints) {
      let radius = this.r(theta * 2, 0.4 + 0.2 * sin(this.rotation), 0.4 + 0.2 * cos(this.rotation), 12, 1, 2, 1);
      let adjustedRadius = radius * this.w;
      vertex(adjustedRadius * cos(theta * 2), adjustedRadius * sin(theta * 2));
    }
    endShape();
    pop();
  }

  r(theta, a, b, m, n1, n2, n3) {
    let cosPart = pow(abs(cos((m * theta) / 4.0) / a), n2);
    let sinPart = pow(abs(sin((m * theta) / 4.0) / b), n3);
    return pow(cosPart + sinPart, -1.0 / n1);
  }
}

