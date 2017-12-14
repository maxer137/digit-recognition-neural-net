trainnum = 1;
heat = 0.25;

function preload() {
  training = loadStrings('https://raw.githubusercontent.com/shiffman/Neural-Network-p5/master/examples/mnist/data/mnist_train_10000.csv');
  testing = loadStrings('https://raw.githubusercontent.com/shiffman/Neural-Network-p5/master/examples/mnist/data/mnist_test_1000.csv');
}

function setup() {
  createCanvas(560, 560);
  for (var i = 0; i < training.length; i++) {
    training[i] = training[i].split(',');
  }
  net = new Net();
  for (var i = 0; i < training.length; i++) {
    for (var j = 0; j < training[i].length; j++) {
      training[i][j] = parseInt(training[i][j])
    }
  }
  // console.log(values)
  values = training[trainnum];
  for (var i = 0; i < net.inputam; i++) {
    net.input.push(values[i + 1] / 255)
  }
  net.update();
  console.log(net.hiddenam);
}

function draw() {
  background(51);
  net.input = [];
  for (var i = 0; i < net.inputam; i++) {
    net.input.push(values[i + 1] / 255)
  }
  values = training[trainnum];
  var count = 1;
  for (var i = 0; i < 28; i++) {
    for (var j = 0; j < 28; j++) {
      noStroke();
      fill(values[count]);
      rect(j * 20, i * 20, 20, 20);
      count++;
    }
  }
  for (var i = 0; i < 500; i++) {
    net.train();
  }
  fill(255);
  text("heat: " + heat,0, 10);
  text("real number: " + values[0], 0, 20)
  text("guessed number: " + net.prediction(), 0, 30);
  text("cost: " + net.cost(), 0, 40);
  text("%done: " + ((net.wagesnum / net.wages.length) * 100), 0, 50);
}

function Net() {
  this.inputam = 784;
  this.hiddenam = 20;
  this.outputam = 10;
  this.layersam = 2;
  this.wagesnum = 0;
  this.input = [];
  this.hidden = [];
  this.output = [];
  this.wages = [];
  this.new = 0;
  this.old = 0;

  //generates random wages
  for (var i = 0; i < this.inputam; i++) {
    for (var j = 0; j < this.hiddenam; j++) {
      this.wages.push(random(-1, 1));
    }
  }

  for (var i = 0; i < this.hiddenam; i++) {
    for (var j = 0; j < this.hiddenam; j++) {
      this.wages.push(random(-1, 1));
    }
  }

  for (var i = 0; i < this.hiddenam; i++) {
    for (var j = 0; j < this.outputam; j++) {
      this.wages.push(random(-1, 1));
    }
  }

  //updates the outputs
  this.update = function() {

    this.hidden = [[],[]];
    this.output = [];

    for (var i = 0; i < this.hiddenam; i++) {
      this.average = 0;
      for (var j = 0; j < this.inputam; j++) {
        this.average += this.input[j] * this.wages[j + i * this.inputam];
      }
      this.average = this.average / this.inputam;
      this.hidden[0].push(this.sigmoid(this.average));
    }
    //calculate the second hidden layer
    for (var i = 0; i < this.hiddenam; i++) {
      this.average = 0;
      for (var j = 0; j < this.hiddenam; j++) {
        this.average += this.hidden[0][j] * this.wages[j + i * this.hiddenam + 15679];
      }
      this.average = this.average / this.hiddenam;
      this.hidden[1].push(this.sigmoid(this.average));
    }
    //calculates the output layer
    this.output = [];
    for (var i = 0; i < this.outputam; i++) {
      this.average = 0;
      for (var j = 0; j < this.hiddenam; j++) {
        this.average += this.hidden[1][j] * this.wages[j + i * this.hiddenam + 16079];
      }
      this.average = this.average / this.hiddenam;
      this.output.push(net.sigmoid(this.average));
    }
  }

  this.train = function() {
    this.udwages = this.wages;
    this.old = this.cost();
    this.wages[i] += heat;
    this.update();
    this.new = this.cost();
    this.wages[i] -= heat;
    this.update();
    this.udwages[i] += (this.old - this.new);
    this.wagesnum++;
    if (this.wagesnum > this.wages.length) {
      trainnum = floor(random(0, 999));
      this.wages = this.udwages;
      this.wagesnum = 0;
      if (heat > 0.001) {
        heat -= 0.001;
      } else {
        heat = 0.001;
      }
    }
  }
  this.cost = function() {
    var temp = 0;
    for (var j = 0; j < this.outputam; j++) {
      if (values[0] === j) {
        //console.log(j + "1")
        temp += Math.pow(this.output[j] - 1, 2);
      } else {
        //console.log(j + "0")
        temp += Math.pow(this.output[j] - 0, 2);
      }
    }
    // noloop();
    return temp;
  }

  this.sigmoid = function(x) {
    return 1/(1+Math.pow(Math.E, -x));
  }

  this.prediction = function() {
    var best = -1;
    var bestnu = 0;
    for (var i = 0; i < this.output.length; i++) {
      if (best < this.output[i]) {
        best = this.output[i];
        bestnu = i;
      }
    }
    return bestnu;
  }
}
