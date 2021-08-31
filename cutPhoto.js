class CutSquarePhoto {
  constructor(id) {
    this.node = document.getElementById(id);
    this.callback = [];
    this.components = [];
    this.patterns = [];
    this.init(renderCanvas.bind(this,drawBorder,drawShadow), renderButtons.bind(this,uploadButton,rotateButton,overturnButton,confirmButton));
    this.renderComponents();
  }

  init(...components) {
    let width = this.node.clientWidth || 300;
    let height = this.node.clientHeight || 300;
    this.size = width < height ? width : height;
    this.node.style.display = "flex";
    this.node.style.justifyContent = "center";
    this.node.style.alignItems = "center";
    components.forEach(component => this.addComponent(component))
  }

  addComponent(component) {
    this.components.push(component);
  }

  renderComponents() {
    this.components.forEach(component => this.node.appendChild(component.call(this)));
  }

  addPatterns(pattern) {
    this.patterns.push(pattern);
  }

  drawPatterns() {
    this.patterns.forEach(pattern => pattern.call(this));
  }

  convertPX(original) {
    return +original * this.size / 300
  }

  getPhoto(fn) {
    this.callback.push(fn);
  }
}

// 绘制画板
function renderCanvas(...patterns) {
  const convertPX = this.convertPX.bind(this);
  let canvas = document.createElement("canvas");
  canvas.id = "cutCanvas";
  canvas.height = this.size;
  canvas.width = this.size;
  let isDraw = false;;
  let spaceX;
  let spaceY;
  canvas.onmousedown = (e) => {
    if(!this.photo) {
      let upload = document.getElementById("uploadImage");
      upload.click();
    }else {
      isDraw = true;
      spaceX=e.offsetX;
      spaceY=e.offsetY;
    }
  }
  canvas.onmousemove  = (e) => {
    if(isDraw && this.photo) {
      let moveX = spaceX - e.offsetX;
      let moveY = spaceY - e.offsetY;
      movePhoto.call(this,moveX,moveY);
      spaceY=e.offsetY;
      spaceX=e.offsetX;
    }
  }
  canvas.onmouseup = () => {
    isDraw = false;
  }
  canvas.onmouseover = () => {
    isDraw = false;
  }
  this.ctx = canvas.getContext('2d');
  this.ctx.clearRect(0, 0, convertPX(300), convertPX(300))
  this.ctx.save();
  this.ctx.translate(convertPX(150), convertPX(130));
  patterns.forEach(pattern => this.addPatterns(pattern))
  this.drawPatterns();
  return canvas;
}

//移动图片
function movePhoto(moveX,moveY) {
  const convertPX = this.convertPX.bind(this);
  let x = this.photo.x - moveX;
  let y = this.photo.y - moveY;
  if(this.photo.width === convertPX(150) && y <= convertPX(-75) && y + this.photo.height >= convertPX(75)) {
    this.photo.y = y;
  }

  if(this.photo.height === convertPX(150) && x <= convertPX(-75) && x + this.photo.width >= convertPX(75)) {
    this.photo.x = x;
  }

  drawImage.call(this);

}

//绘制边框
function drawBorder() {
  const convertPX = this.convertPX.bind(this);
  const ctx = this.ctx;
  ctx.lineWidth = 3;
  ctx.save();

  ctx.strokeStyle = "black";
  ctx.beginPath();

  //左上
  ctx.moveTo(convertPX(-75), convertPX(-60));
  ctx.lineTo(convertPX(-75), convertPX(-75));
  ctx.lineTo(convertPX(-60), convertPX(-75));
  //右上
  ctx.moveTo(convertPX(75), convertPX(-60));
  ctx.lineTo(convertPX(75), convertPX(-75));
  ctx.lineTo(convertPX(60), convertPX(-75));
  //右下
  ctx.moveTo(convertPX(75), convertPX(60));
  ctx.lineTo(convertPX(75), convertPX(75));
  ctx.lineTo(convertPX(60), convertPX(75));
  //左下
  ctx.moveTo(convertPX(-75), convertPX(60));
  ctx.lineTo(convertPX(-75), convertPX(75));
  ctx.lineTo(convertPX(-60), convertPX(75));
  ctx.stroke();

  ctx.restore();

}

//绘制阴影
function drawShadow() {
  const convertPX = this.convertPX.bind(this);
  const ctx = this.ctx;
  ctx.save();

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.moveTo(convertPX(-75),convertPX(-75));
  ctx.lineTo(convertPX(-75),convertPX(75));
  ctx.lineTo(convertPX(75),convertPX(75));
  ctx.lineTo(convertPX(75),convertPX(-75));
  ctx.closePath();
  ctx.moveTo(convertPX(-200),convertPX(-200));
  ctx.lineTo(convertPX(200),convertPX(-200));
  ctx.lineTo(convertPX(200),convertPX(200));
  ctx.lineTo(convertPX(-200),convertPX(200));

  ctx.closePath();
  ctx.fill();

  ctx.restore();

}

//绘制所有按钮
function renderButtons(...buttons) {
  const convertPX = this.convertPX.bind(this);

  const div = document.createElement("div");
  div.style.position ="absolute";
  div.style.width = convertPX(300) + 'px';
  div.style.height = convertPX(40) + 'px';
  div.style.marginTop = convertPX(240) + 'px';
  div.style.display = "flex";
  div.style.justifyContent = 'space-around';
  div.style.alignItems = "center";
  div.style.fontSize = convertPX(15) + 'px';
  div.style.fontWeight = 'bolder'
  buttons.forEach(button => {
    button = button.call(this);
    button.style.width = convertPX(70) + 'px';
    button.style.height = convertPX(30) + 'px';
    button.style.textAlign = "center";
    button.style.cursor= "pointer";
    button.style.backgroundColor = 'rgba(204,204,204,1)';
    button.style.borderRadius = '5px';
    button.style.lineHeight= convertPX(30) + 'px';;
    div.appendChild(button);
  });

  return div;

}

//上传按钮
function uploadButton() {
  const that = this;
  const button = document.createElement("label")
  button.innerText = '上传';
  const upload = document.createElement("input");
  upload.setAttribute("type","file");
  upload.setAttribute("accept","image/*");
  upload.setAttribute("name","imageFile");
  upload.setAttribute("hidden","true");
  upload.setAttribute("id","uploadImage");
  upload.addEventListener("change",uploadImage.bind(that));
  button.appendChild(upload);
  return button;
}

//上传图片
function uploadImage() {
  const convertPX = this.convertPX.bind(this);
  const that = this;
  let file = document.querySelector('#uploadImage').files[0]
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function(e) {
    let result = e.target.result;
    let image = new Image();
    image.src = result;
    image.onload = function(){
      let width;
      let height;
      let x;
      let y;
      if(image.width > image.height) {
        height = convertPX(150);
        width = convertPX(150 /image.height * image.width);
        x = -width/2;
        y = -height/2;
      }else {
        width = convertPX(150);
        height = convertPX(150 /image.width * image.height);
        x = -width/2;
        y = -height/2;
      }
      that.photo = {image, width, height, x, y,};
      drawImage.call(that);
    }
  }
}

//绘制图片
function drawImage() {
  const convertPX = this.convertPX.bind(this);
  const ctx= this.ctx;
  const photo = this.photo;
  ctx.clearRect(convertPX(-150), convertPX(-150), convertPX(300), convertPX(350));
  ctx.drawImage(photo.image, photo.x, photo.y, photo.width, photo.height);
  this.drawPatterns();
}

//旋转按钮
function rotateButton() {
  const that = this
  const button = document.createElement("div")
  button.innerText = '旋转';
  button.onclick = () => {
    const photo = this.photo;
    if(!photo) return;
    const canvas = document.createElement("canvas");
    canvas.width = photo.height;
    canvas.height = photo.width;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, photo.height, photo.width);
    ctx.translate(photo.height, 0);
    ctx.rotate(Math.PI/2);
    ctx.drawImage(photo.image, 0, 0, photo.width, photo.height);
    let dataUrl = canvas.toDataURL('image/png');
    let image = new Image();
    image.src = dataUrl ;
    image.onload = function(){
      photo.image = image;
      [photo.x, photo.y,photo.width,photo.height] = [photo.y,photo.x,photo.height,photo.width];
      drawImage.call(that);
    };
  }
  return button;
}

//翻转按钮
function overturnButton() {
  const that = this;
  const button = document.createElement("div")
  button.innerText = '翻转';
  button.onclick = () => {
    const photo = this.photo;
    if(!photo) return;
    const canvas = document.createElement("canvas");
    canvas.width = photo.width;
    canvas.height = photo.height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, photo.width, photo.height);
    ctx.translate(photo.width + 0, 0);
    ctx.scale(-1, 1); //左右镜像翻转
    ctx.drawImage(photo.image, 0, 0, photo.width, photo.height);
    let dataUrl = canvas.toDataURL('image/png');
    let image = new Image();
    image.src = dataUrl ;
    image.onload = function(){
      photo.image = image;
      drawImage.call(that);
    };
  }
  return button;
}

//确定按钮
function confirmButton() {
  const button = document.createElement("div")
  let dataUrl;
  button.innerText = '确定';
  button.onclick = () => {
    if(!this.photo) return;
    dataUrl = screenshot.call(this);
    this.callback.forEach(item => {
      item.call(this, dataUrl);
    })
  }
  return button;
}

//截图
function screenshot() {
  const convertPX = this.convertPX.bind(this);
  const photo = this.photo;
  const canvas = document.createElement("canvas");
  const widthAndHeight = convertPX(150);
  canvas.width = widthAndHeight;
  canvas.height = widthAndHeight;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, widthAndHeight, widthAndHeight);
  ctx.translate(widthAndHeight / 2, widthAndHeight/ 2);
  ctx.drawImage(photo.image, photo.x, photo.y, photo.width, photo.height);
  let dataUrl = canvas.toDataURL('image/png', 0.92);
  return dataUrl;
}
