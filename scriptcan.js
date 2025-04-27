// Объединил объявления переменных и перенес константы вверх
const canvasBody = document.getElementById("canvas");
const drawArea = canvasBody.getContext("2d");
const opts = { 
  particleColor: "rgb(200,200,200)",
  lineColor: "rgb(200,200,200)",
  particleAmount: 220,
  defaultSpeed: 1,
  variantSpeed: 1,
  defaultRadius: 2,
  variantRadius: 3,
  linkRadius: 230,
};
const rgb = opts.lineColor.match(/\d+/g);
const delay = 200;

let w, h, tid, particles;

// Оптимизированная функция resizeReset
function resizeReset() {
  w = canvasBody.width = window.innerWidth;
  h = canvasBody.height = window.innerHeight;
}

// Более эффективный дебаунсер
function deBouncer() {
  clearTimeout(tid);
  tid = setTimeout(resizeReset, delay);
}

// Оптимизированная проверка расстояния (убрал Math.pow)
function checkDistance(x1, y1, x2, y2) { 
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// Оптимизированная функция связи точек
function linkPoints(point1, hubs) {
  // Кэшируем свойства point1
  const x1 = point1.x;
  const y1 = point1.y;
  
  // Используем for loop вместо forEach для производительности
  for (let i = 0, len = hubs.length; i < len; i++) {
    const hub = hubs[i];
    const distance = checkDistance(x1, y1, hub.x, hub.y);
    const opacity = 1 - distance / opts.linkRadius;
    
    if (opacity > 0) { 
      drawArea.lineWidth = 0.5;
      drawArea.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
      drawArea.beginPath();
      drawArea.moveTo(x1, y1);
      drawArea.lineTo(hub.x, hub.y);
      drawArea.stroke(); // closePath не нужен для stroke
    }
  }
}

// Оптимизированный конструктор частиц
function Particle() { 
  this.x = Math.random() * w; 
  this.y = Math.random() * h;
  this.speed = opts.defaultSpeed + Math.random() * opts.variantSpeed; 
  this.directionAngle = Math.floor(Math.random() * 360); 
  this.radius = opts.defaultRadius + Math.random() * opts.variantRadius;
  
  // Предварительно вычисляем вектор
  const rad = this.directionAngle * Math.PI / 180;
  this.vector = {
    x: Math.cos(rad) * this.speed,
    y: Math.sin(rad) * this.speed
  };
  
  this.update = function() { 
    this.border(); 
    this.x += this.vector.x; 
    this.y += this.vector.y; 
  };
  
  this.border = function() { 
    // Оптимизированная проверка границ
    if (this.x >= w || this.x <= 0) this.vector.x *= -1;
    if (this.y >= h || this.y <= 0) this.vector.y *= -1;
    
    // Исправление выхода за границы
    this.x = Math.max(0, Math.min(w, this.x));
    this.y = Math.max(0, Math.min(h, this.y));
  };
  
  this.draw = function() { 
    drawArea.beginPath();
    drawArea.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    drawArea.fillStyle = opts.particleColor;
    drawArea.fill();
  };
}

function setup() { 
  particles = [];
  resizeReset();
  
  // Предварительно выделяем массив нужного размера
  particles = new Array(opts.particleAmount);
  for (let i = 0; i < opts.particleAmount; i++) {
    particles[i] = new Particle();
  }
  
  window.requestAnimationFrame(loop);
}

function loop() { 
  window.requestAnimationFrame(loop);
  drawArea.clearRect(0, 0, w, h);
  
  // Объединил отрисовку и обновление в один цикл
  for (let i = 0, len = particles.length; i < len; i++) {
    const particle = particles[i];
    particle.update();
    particle.draw();
    linkPoints(particle, particles);
  }
}

// Оптимизированные слушатели событий
window.addEventListener("resize", deBouncer);

// Инициализация
resizeReset();
setup();