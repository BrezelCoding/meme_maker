'use strict';

const saveBtn = document.querySelector('#save');
const textInput = document.querySelector('#text');
const fileInput = document.querySelector('#file');
const modeBtn = document.querySelector('#mode-btn');
const destroyBtn = document.querySelector('#destroy-btn');
const eraserBtn = document.querySelector('#eraser-btn');
const colorOptions = Array.from(document.querySelectorAll('.color-option'));
const color = document.querySelector('#color');
const lineWidth = document.querySelector('#line-width');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d'); // Paint Brush (2D) : context

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = 'round'; // ctx에서 initialize할 수 있는 메소드함수.
let isPainting = false;
let isFilling = false;

function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting() {
  isPainting = true;
}

function cancelPainting() {
  isPainting = false;
  ctx.beginPath();
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}

function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = 'Fill';
  } else {
    isFilling = true;
    modeBtn.innerText = 'Draw';
  }
}

function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function onDestroyClick() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick() {
  ctx.strokeStyle = '#FFFFFF';
  isFilling = false;
  modeBtn.innerText = 'Fill';
}

function onFileChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file); // URL을 통해 해당 파일에 접근해보는 것
  const image = new Image(); // HTML의 <img src='' />와 동일
  image.src = url;

  //onload, drawImage 내장함수 사용
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  };
}

function onDoubleClick(event) {
  // save내장함수는 ctx의 현재 상태, 색상, 스타일 등 모든 것을 저장한다.
  // 변경되는 코드가 실행되기 전 현재 상태와 선택들을 저장함.
  const text = textInput.value;
  if (text !== '') {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = '68px serif';
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore(); // 이전 상태로 복구하는 메소드
    // 수정을 완료하면 restore 내장함수를 쓰면 됨
    // save와 restore 사이에는 어떤 수정을 하던 저장되지 않음
    // restore가 실행되면 이전에 저장된 상태로 돌아감
  }
}

function onSaveClick() {
  const url = canvas.toDataURL();
  const a = document.createElement('a');
  a.href = url;
  a.download = 'myDrawing.jpg';
  a.click();
  // URL을 base62이라는 문자열로 인코딩해서 저장해주는 고마운 메소드함수.
  // <a href='' download></a>을 이용해서 다운가능하게 하자.
  // a 태크에 download 속성을 넣으면 다운받을 수 있다.
}

// Drawing Event
canvas.addEventListener('mousemove', onMove);
canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mouseup', cancelPainting);
canvas.addEventListener('mouseleave', cancelPainting);

// Brush, Color Control
lineWidth.addEventListener('change', onLineWidthChange);
color.addEventListener('change', onColorChange);
colorOptions.forEach((color) => color.addEventListener('click', onColorClick));

// Fill, Drawing, Clear, Eraser mode
modeBtn.addEventListener('click', onModeClick);
canvas.addEventListener('click', onCanvasClick);
destroyBtn.addEventListener('click', onDestroyClick);
eraserBtn.addEventListener('click', onEraserClick);

// file Input
fileInput.addEventListener('change', onFileChange);

// Add the texts
canvas.addEventListener('dblclick', onDoubleClick);

// Save the image
saveBtn.addEventListener('click', onSaveClick);
